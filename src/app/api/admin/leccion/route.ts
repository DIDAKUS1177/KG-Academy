import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { audit } from "@/lib/auth";
import { CONTENT_TYPES } from "@/lib/constants";
import { ROLES_CURSOS, exigirRol, leerCuerpo, limpiar, respuestaError, respuestaOk } from "@/lib/admin-api";

/**
 * Lecciones.
 *
 *   POST   carga o cambia el contenido (es la ruta que ya usaba el constructor).
 *   PUT    crea una lección nueva al final de un módulo.
 *   PATCH  edita título, descripción, duración, obligatoriedad, vista previa u orden.
 *   DELETE elimina una lección sin avance registrado.
 */

const contenidoSchema = z.object({
  lessonId: z.string().min(1),
  contentType: z.enum(CONTENT_TYPES, { errorMap: () => ({ message: "Tipo de contenido inválido" }) }),
  contentUrl: z.string().optional(),
  contentBody: z.string().optional(),
});

const crearSchema = z.object({
  moduleId: z.string().min(1),
  title: z.string().trim().min(3, "Ingrese el título de la lección"),
  description: z.string().optional(),
  durationMin: z.coerce.number().int().min(0).default(0),
  isRequired: z.boolean().default(true),
});

const editarSchema = z.object({
  lessonId: z.string().min(1),
  title: z.string().trim().min(3, "Ingrese el título de la lección").optional(),
  description: z.string().nullable().optional(),
  durationMin: z.coerce.number().int().min(0).optional(),
  isRequired: z.boolean().optional(),
  isPreview: z.boolean().optional(),
  mover: z.enum(["arriba", "abajo"]).optional(),
});

const borrarSchema = z.object({ lessonId: z.string().min(1) });

/** Carga de contenido de una lección desde el constructor de cursos. */
export async function POST(req: Request) {
  const auth = await exigirRol(ROLES_CURSOS);
  if (auth.error) return auth.error;

  const cuerpo = await leerCuerpo(req, contenidoSchema);
  if (cuerpo.error) return cuerpo.error;
  const d = cuerpo.data;

  const before = await prisma.lesson.findUnique({ where: { id: d.lessonId } });
  if (!before) return respuestaError("Lección no encontrada", 404);

  const url = limpiar(d.contentUrl);
  if (d.contentType !== "pendiente" && d.contentType !== "texto" && !url) {
    return respuestaError("Indique la URL del recurso");
  }
  if (url && !/^https?:\/\//i.test(url)) {
    return respuestaError("La URL debe empezar por http:// o https://");
  }

  const after = await prisma.lesson.update({
    where: { id: d.lessonId },
    data: {
      contentType: d.contentType,
      contentUrl: d.contentType === "pendiente" ? null : url,
      contentBody: d.contentBody ?? before.contentBody,
      isPublished: d.contentType !== "pendiente",
    },
  });

  await audit({
    userId: auth.user.id,
    actorEmail: auth.user.email,
    action: "editar",
    entity: "lessons",
    entityId: after.id,
    summary: `Contenido de "${after.title}" -> ${after.contentType}`,
    before: { contentType: before.contentType, contentUrl: before.contentUrl },
    after: { contentType: after.contentType, contentUrl: after.contentUrl },
  });

  return respuestaOk();
}

export async function PUT(req: Request) {
  const auth = await exigirRol(ROLES_CURSOS);
  if (auth.error) return auth.error;

  const cuerpo = await leerCuerpo(req, crearSchema);
  if (cuerpo.error) return cuerpo.error;
  const d = cuerpo.data;

  const modulo = await prisma.module.findUnique({ where: { id: d.moduleId } });
  if (!modulo) return respuestaError("Módulo no encontrado", 404);

  const ultima = await prisma.lesson.findFirst({
    where: { moduleId: modulo.id },
    orderBy: { order: "desc" },
  });

  const lesson = await prisma.lesson.create({
    data: {
      moduleId: modulo.id,
      title: d.title,
      description: limpiar(d.description),
      durationMin: d.durationMin,
      isRequired: d.isRequired,
      order: (ultima?.order ?? 0) + 1,
      contentType: "pendiente",
      isPublished: false,
    },
  });

  await audit({
    userId: auth.user.id,
    actorEmail: auth.user.email,
    action: "crear",
    entity: "lessons",
    entityId: lesson.id,
    summary: `Lección "${lesson.title}" agregada al módulo "${modulo.title}"`,
  });

  return respuestaOk({ lessonId: lesson.id });
}

export async function PATCH(req: Request) {
  const auth = await exigirRol(ROLES_CURSOS);
  if (auth.error) return auth.error;

  const cuerpo = await leerCuerpo(req, editarSchema);
  if (cuerpo.error) return cuerpo.error;
  const d = cuerpo.data;

  const before = await prisma.lesson.findUnique({ where: { id: d.lessonId } });
  if (!before) return respuestaError("Lección no encontrada", 404);

  if (d.mover) {
    const vecina = await prisma.lesson.findFirst({
      where: {
        moduleId: before.moduleId,
        order: d.mover === "arriba" ? { lt: before.order } : { gt: before.order },
      },
      orderBy: { order: d.mover === "arriba" ? "desc" : "asc" },
    });
    if (vecina) {
      await prisma.$transaction([
        prisma.lesson.update({ where: { id: before.id }, data: { order: vecina.order } }),
        prisma.lesson.update({ where: { id: vecina.id }, data: { order: before.order } }),
      ]);
    }
  }

  const after = await prisma.lesson.update({
    where: { id: before.id },
    data: {
      ...(d.title ? { title: d.title } : {}),
      ...(d.description !== undefined ? { description: limpiar(d.description) } : {}),
      ...(d.durationMin !== undefined ? { durationMin: d.durationMin } : {}),
      ...(d.isRequired !== undefined ? { isRequired: d.isRequired } : {}),
      ...(d.isPreview !== undefined ? { isPreview: d.isPreview } : {}),
    },
  });

  await audit({
    userId: auth.user.id,
    actorEmail: auth.user.email,
    action: "editar",
    entity: "lessons",
    entityId: after.id,
    summary: `Lección "${after.title}" editada`,
    before: { title: before.title, durationMin: before.durationMin, isRequired: before.isRequired },
    after: { title: after.title, durationMin: after.durationMin, isRequired: after.isRequired, mover: d.mover },
  });

  return respuestaOk();
}

export async function DELETE(req: Request) {
  const auth = await exigirRol(ROLES_CURSOS);
  if (auth.error) return auth.error;

  const cuerpo = await leerCuerpo(req, borrarSchema);
  if (cuerpo.error) return cuerpo.error;

  const lesson = await prisma.lesson.findUnique({ where: { id: cuerpo.data.lessonId } });
  if (!lesson) return respuestaError("Lección no encontrada", 404);

  const conAvance = await prisma.lessonProgress.count({ where: { lessonId: lesson.id } });
  if (conAvance > 0) {
    return respuestaError(
      "Esta lección ya tiene avance de estudiantes y no se puede eliminar. Puede marcarla como no obligatoria."
    );
  }

  await prisma.lesson.delete({ where: { id: lesson.id } });

  await audit({
    userId: auth.user.id,
    actorEmail: auth.user.email,
    action: "eliminar",
    entity: "lessons",
    entityId: lesson.id,
    summary: `Lección "${lesson.title}" eliminada`,
    before: { title: lesson.title, contentType: lesson.contentType },
  });

  return respuestaOk();
}
