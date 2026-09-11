import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { audit } from "@/lib/auth";
import { ROLES_CURSOS, exigirRol, leerCuerpo, limpiar, respuestaError, respuestaOk } from "@/lib/admin-api";

/**
 * Módulos de un curso.
 *
 *   POST   agrega un módulo al final del curso.
 *   PATCH  edita título, descripción u orden.
 *   DELETE elimina un módulo, solo si ninguna de sus lecciones tiene avance
 *          registrado: si alguien ya lo cursó, es historial y no se borra.
 */

const crearSchema = z.object({
  courseId: z.string().min(1),
  title: z.string().trim().min(3, "Ingrese el título del módulo"),
  description: z.string().optional(),
});

const editarSchema = z.object({
  moduleId: z.string().min(1),
  title: z.string().trim().min(3, "Ingrese el título del módulo").optional(),
  description: z.string().nullable().optional(),
  /** "arriba" | "abajo": intercambia el orden con el vecino. */
  mover: z.enum(["arriba", "abajo"]).optional(),
  isRequired: z.boolean().optional(),
});

const borrarSchema = z.object({ moduleId: z.string().min(1) });

export async function POST(req: Request) {
  const auth = await exigirRol(ROLES_CURSOS);
  if (auth.error) return auth.error;

  const cuerpo = await leerCuerpo(req, crearSchema);
  if (cuerpo.error) return cuerpo.error;
  const d = cuerpo.data;

  const course = await prisma.course.findUnique({ where: { id: d.courseId } });
  if (!course) return respuestaError("Curso no encontrado", 404);

  const ultimo = await prisma.module.findFirst({
    where: { courseId: course.id },
    orderBy: { order: "desc" },
  });

  const modulo = await prisma.module.create({
    data: {
      courseId: course.id,
      title: d.title,
      description: limpiar(d.description),
      order: (ultimo?.order ?? 0) + 1,
      // Un módulo nuevo en un curso ya publicado aparece de una vez en el
      // índice; sus lecciones no, hasta que tengan contenido.
      isPublished: course.status === "publicado",
    },
  });

  await audit({
    userId: auth.user.id,
    actorEmail: auth.user.email,
    action: "crear",
    entity: "modules",
    entityId: modulo.id,
    summary: `Módulo "${modulo.title}" agregado a ${course.code}`,
  });

  return respuestaOk({ moduleId: modulo.id });
}

export async function PATCH(req: Request) {
  const auth = await exigirRol(ROLES_CURSOS);
  if (auth.error) return auth.error;

  const cuerpo = await leerCuerpo(req, editarSchema);
  if (cuerpo.error) return cuerpo.error;
  const d = cuerpo.data;

  const before = await prisma.module.findUnique({ where: { id: d.moduleId } });
  if (!before) return respuestaError("Módulo no encontrado", 404);

  if (d.mover) {
    const vecino = await prisma.module.findFirst({
      where: {
        courseId: before.courseId,
        order: d.mover === "arriba" ? { lt: before.order } : { gt: before.order },
      },
      orderBy: { order: d.mover === "arriba" ? "desc" : "asc" },
    });
    if (vecino) {
      await prisma.$transaction([
        prisma.module.update({ where: { id: before.id }, data: { order: vecino.order } }),
        prisma.module.update({ where: { id: vecino.id }, data: { order: before.order } }),
      ]);
    }
  }

  const after = await prisma.module.update({
    where: { id: before.id },
    data: {
      ...(d.title ? { title: d.title } : {}),
      ...(d.description !== undefined ? { description: limpiar(d.description) } : {}),
      ...(d.isRequired !== undefined ? { isRequired: d.isRequired } : {}),
    },
  });

  await audit({
    userId: auth.user.id,
    actorEmail: auth.user.email,
    action: "editar",
    entity: "modules",
    entityId: after.id,
    summary: `Módulo "${after.title}" editado`,
    before: { title: before.title, order: before.order },
    after: { title: after.title, order: after.order, mover: d.mover },
  });

  return respuestaOk();
}

export async function DELETE(req: Request) {
  const auth = await exigirRol(ROLES_CURSOS);
  if (auth.error) return auth.error;

  const cuerpo = await leerCuerpo(req, borrarSchema);
  if (cuerpo.error) return cuerpo.error;

  const modulo = await prisma.module.findUnique({
    where: { id: cuerpo.data.moduleId },
    include: { lessons: { select: { id: true } }, course: { select: { code: true } } },
  });
  if (!modulo) return respuestaError("Módulo no encontrado", 404);

  const conAvance = await prisma.lessonProgress.count({
    where: { lessonId: { in: modulo.lessons.map((l) => l.id) } },
  });
  if (conAvance > 0) {
    return respuestaError(
      "Este módulo ya tiene avance de estudiantes y no se puede eliminar. Puede dejarlo sin contenido o despublicarlo."
    );
  }

  await prisma.module.delete({ where: { id: modulo.id } });

  await audit({
    userId: auth.user.id,
    actorEmail: auth.user.email,
    action: "eliminar",
    entity: "modules",
    entityId: modulo.id,
    summary: `Módulo "${modulo.title}" eliminado de ${modulo.course.code}`,
    before: { title: modulo.title, lecciones: modulo.lessons.length },
  });

  return respuestaOk();
}
