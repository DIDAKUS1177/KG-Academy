import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { audit } from "@/lib/auth";
import { COURSE_STATUS } from "@/lib/constants";
import { ROLES_KG, ROLES_CURSOS, exigirRol, leerCuerpo, limpiar, respuestaError, respuestaOk } from "@/lib/admin-api";

/**
 * Un curso en concreto.
 *
 *   POST cambia el estado de publicación (lo que ya hacía el constructor).
 *   PUT  edita la ficha y las reglas de negocio: nota mínima, intentos,
 *        evaluación final obligatoria, vigencia del certificado, etc.
 *
 * Publicar sigue reservado a la administración de KG; la ficha y las reglas
 * también las puede tocar un instructor.
 */

const estadoSchema = z.object({
  courseId: z.string().min(1),
  status: z.enum(COURSE_STATUS),
});

const NIVELES = ["basico", "intermedio", "avanzado"] as const;
const MODALIDADES = ["virtual", "mixto", "presencial"] as const;
const REGLAS = ["obligatorios", "peso_lecciones", "peso_modulos"] as const;

const fichaSchema = z.object({
  courseId: z.string().min(1),
  title: z.string().trim().min(5, "Ingrese el título del curso").optional(),
  subtitle: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  objective: z.string().nullable().optional(),
  targetAudience: z.string().nullable().optional(),
  requirements: z.string().nullable().optional(),
  methodology: z.string().nullable().optional(),
  level: z.enum(NIVELES).optional(),
  modality: z.enum(MODALIDADES).optional(),
  durationHours: z.coerce.number().min(0, "Las horas no pueden ser negativas").optional(),
  categoryId: z.string().optional(),
  instructorId: z.string().nullable().optional(),
  // ---- reglas ----
  progressRule: z.enum(REGLAS).optional(),
  minPassingScore: z.coerce.number().int().min(1).max(100, "La nota mínima va de 1 a 100").optional(),
  maxAttempts: z.coerce.number().int().min(1, "Debe permitir al menos un intento").max(20).optional(),
  requiresFinalExam: z.boolean().optional(),
  requiresAllLessons: z.boolean().optional(),
  certificateEnabled: z.boolean().optional(),
  certificateValidityMonths: z.coerce.number().int().min(1).nullable().optional(),
  allowRetake: z.boolean().optional(),
});

export async function POST(req: Request) {
  const auth = await exigirRol(ROLES_KG);
  if (auth.error) {
    return respuestaError("Solo la administración de KG puede publicar cursos", 403);
  }
  const user = auth.user;

  const cuerpo = await leerCuerpo(req, estadoSchema);
  if (cuerpo.error) return cuerpo.error;

  const before = await prisma.course.findUnique({ where: { id: cuerpo.data.courseId } });
  if (!before) return respuestaError("Curso no encontrado", 404);

  const course = await prisma.course.update({
    where: { id: cuerpo.data.courseId },
    data: {
      status: cuerpo.data.status,
      publishedAt:
        cuerpo.data.status === "publicado" ? before.publishedAt ?? new Date() : before.publishedAt,
    },
  });

  // Al publicar el curso se publican sus módulos y las lecciones ya cargadas
  if (cuerpo.data.status === "publicado") {
    await prisma.module.updateMany({ where: { courseId: course.id }, data: { isPublished: true } });
    await prisma.lesson.updateMany({
      where: { module: { courseId: course.id }, contentType: { not: "pendiente" } },
      data: { isPublished: true },
    });
  }

  await audit({
    userId: user.id,
    actorEmail: user.email,
    action: "publicar",
    entity: "courses",
    entityId: course.id,
    summary: `Estado de "${course.title}": ${before.status} -> ${course.status}`,
    before: { status: before.status },
    after: { status: course.status },
  });

  return respuestaOk({ status: course.status });
}

export async function PUT(req: Request) {
  const auth = await exigirRol(ROLES_CURSOS);
  if (auth.error) return auth.error;

  const cuerpo = await leerCuerpo(req, fichaSchema);
  if (cuerpo.error) return cuerpo.error;
  const d = cuerpo.data;

  const before = await prisma.course.findUnique({ where: { id: d.courseId } });
  if (!before) return respuestaError("Curso no encontrado", 404);

  if (d.categoryId && !(await prisma.category.findUnique({ where: { id: d.categoryId } }))) {
    return respuestaError("La categoría indicada no existe", 404);
  }
  const instructorId = d.instructorId === undefined ? undefined : limpiar(d.instructorId);
  if (instructorId && !(await prisma.user.findUnique({ where: { id: instructorId } }))) {
    return respuestaError("El instructor indicado no existe", 404);
  }

  const after = await prisma.course.update({
    where: { id: before.id },
    data: {
      ...(d.title ? { title: d.title } : {}),
      ...(d.subtitle !== undefined ? { subtitle: limpiar(d.subtitle) } : {}),
      ...(d.description !== undefined ? { description: limpiar(d.description) } : {}),
      ...(d.objective !== undefined ? { objective: limpiar(d.objective) } : {}),
      ...(d.targetAudience !== undefined ? { targetAudience: limpiar(d.targetAudience) } : {}),
      ...(d.requirements !== undefined ? { requirements: limpiar(d.requirements) } : {}),
      ...(d.methodology !== undefined ? { methodology: limpiar(d.methodology) } : {}),
      ...(d.level ? { level: d.level } : {}),
      ...(d.modality ? { modality: d.modality } : {}),
      ...(d.durationHours !== undefined ? { durationHours: d.durationHours } : {}),
      ...(d.categoryId ? { categoryId: d.categoryId } : {}),
      ...(instructorId !== undefined ? { instructorId } : {}),
      ...(d.progressRule ? { progressRule: d.progressRule } : {}),
      ...(d.minPassingScore !== undefined ? { minPassingScore: d.minPassingScore } : {}),
      ...(d.maxAttempts !== undefined ? { maxAttempts: d.maxAttempts } : {}),
      ...(d.requiresFinalExam !== undefined ? { requiresFinalExam: d.requiresFinalExam } : {}),
      ...(d.requiresAllLessons !== undefined ? { requiresAllLessons: d.requiresAllLessons } : {}),
      ...(d.certificateEnabled !== undefined ? { certificateEnabled: d.certificateEnabled } : {}),
      ...(d.certificateValidityMonths !== undefined
        ? { certificateValidityMonths: d.certificateValidityMonths }
        : {}),
      ...(d.allowRetake !== undefined ? { allowRetake: d.allowRetake } : {}),
    },
  });

  // La nota mínima del curso manda sobre la de su evaluación final, para que
  // no queden en desacuerdo.
  if (d.minPassingScore !== undefined) {
    await prisma.assessment.updateMany({
      where: { courseId: after.id, type: "final" },
      data: { minScore: d.minPassingScore },
    });
  }

  await audit({
    userId: auth.user.id,
    actorEmail: auth.user.email,
    action: "editar",
    entity: "courses",
    entityId: after.id,
    summary: `Ficha y reglas de "${after.title}" editadas`,
    before: {
      durationHours: before.durationHours,
      minPassingScore: before.minPassingScore,
      maxAttempts: before.maxAttempts,
      certificateValidityMonths: before.certificateValidityMonths,
    },
    after: {
      durationHours: after.durationHours,
      minPassingScore: after.minPassingScore,
      maxAttempts: after.maxAttempts,
      certificateValidityMonths: after.certificateValidityMonths,
    },
  });

  return respuestaOk();
}
