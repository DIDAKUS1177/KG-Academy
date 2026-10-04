import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { ROLES } from "@/lib/constants";
import { huellaContenido, leccionInteractivaSchema, leerLeccionInteractiva } from "@/lib/leccion-interactiva";
import { leccionNueva } from "@/lib/plantillas-leccion";
import { formatDateTime } from "@/lib/utils";
import { Breadcrumb } from "@/components/ui";
import { EditorLeccion, type VersionGuardada } from "./EditorLeccion";

export const metadata: Metadata = { title: "Editor de lección" };
export const dynamic = "force-dynamic";

const NOMBRE_TIPO_CONTENIDO: Record<string, string> = {
  pendiente: "pendiente (sin contenido)",
  video: "video",
  genially: "Genially",
  pdf: "PDF",
  texto: "texto",
  enlace: "enlace externo",
  scorm: "SCORM",
};

/** Editor visual de una lección interactiva (Cursos → Constructor → Editar contenido). */
export default async function EditorLeccionPage(props: { params: Promise<{ id: string; leccionId: string }> }) {
  const { id, leccionId } = await props.params;
  await requireRole(ROLES.SUPERADMIN, ROLES.ADMIN_KG, ROLES.INSTRUCTOR);

  const lesson = await prisma.lesson.findUnique({
    where: { id: leccionId },
    include: { module: { include: { course: { select: { id: true, title: true, slug: true } } } } },
  });
  if (!lesson || lesson.module.course.id !== id) notFound();

  const leida = lesson.contentType === "interactivo" ? leerLeccionInteractiva(lesson.contentBody) : null;
  // Si es la última lección del curso que no es interactiva, el curso pasa a verse como videojuego.
  const otrasNoInteractivas =
    lesson.contentType === "interactivo"
      ? 0
      : await prisma.lesson.count({ where: { module: { courseId: id }, id: { not: lesson.id }, contentType: { not: "interactivo" } } });
  const aviso =
    lesson.contentType !== "interactivo"
      ? `Hoy esta lección es de tipo ${NOMBRE_TIPO_CONTENIDO[lesson.contentType] ?? lesson.contentType}. Al guardar pasará a ser una lección interactiva y dejará de mostrarse lo que tiene ahora (su enlace queda registrado en la auditoría por si hay que volver a él).${
          otrasNoInteractivas === 0
            ? " Además, es la última lección no interactiva del curso: al guardarla, el curso pasará a mostrarse como videojuego (mapa de niveles que se desbloquean en orden)."
            : ""
        }`
      : !leida
        ? "El contenido guardado no se pudo leer; se abrió una plantilla nueva. Al guardar, reemplaza al anterior."
        : null;

  // Historial: cada guardado del editor deja la versión completa en la auditoría.
  const registros = await prisma.auditLog.findMany({
    where: { entity: "lessons", entityId: lesson.id, summary: { startsWith: "Contenido interactivo" } },
    orderBy: { createdAt: "desc" },
    take: 15,
  });
  const historial: VersionGuardada[] = registros.flatMap((r) => {
    try {
      const v = leccionInteractivaSchema.safeParse((JSON.parse(r.afterJson ?? "null") as { contenido?: unknown } | null)?.contenido);
      return v.success
        ? [{ id: r.id, fecha: formatDateTime(r.createdAt), autor: r.actorEmail ?? "—", pantallas: v.data.bloques.length, contenido: v.data }]
        : [];
    } catch {
      return [];
    }
  });
  // La versión original (la de antes del primer guardado en el editor) queda en el
  // "antes" de ese primer registro: las lecciones cargadas por script no tienen otra.
  const primero = await prisma.auditLog.findFirst({
    where: { entity: "lessons", entityId: lesson.id, summary: { startsWith: "Contenido interactivo" } },
    orderBy: { createdAt: "asc" },
  });
  if (primero) {
    try {
      const antes = JSON.parse(primero.beforeJson ?? "null") as { contentType?: string; contentBody?: string | null } | null;
      const original = antes?.contentType === "interactivo" ? leerLeccionInteractiva(antes.contentBody) : null;
      if (original) {
        historial.push({
          id: `original-${primero.id}`,
          fecha: `${formatDateTime(primero.createdAt)} (versión original, antes del primer cambio)`,
          autor: "carga inicial",
          pantallas: original.bloques.length,
          contenido: original,
        });
      }
    } catch {
      /* Sin versión original legible. */
    }
  }

  return (
    <div>
      <Breadcrumb
        items={[
          { label: "Administración", href: "/admin" },
          { label: "Cursos", href: "/admin/cursos" },
          { label: lesson.module.course.title, href: `/admin/cursos/${id}` },
          { label: "Editor de lección" },
        ]}
      />
      <EditorLeccion
        leccion={{
          id: lesson.id,
          titulo: lesson.title,
          huellaBase: huellaContenido(lesson.contentBody),
          cursoId: id,
          cursoSlug: lesson.module.course.slug,
          modulo: lesson.module.title,
        }}
        inicial={leida ?? leccionNueva(lesson.title)}
        historial={historial}
        aviso={aviso}
      />
    </div>
  );
}
