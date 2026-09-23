import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { audit } from "@/lib/auth";
import { bancoDelCurso } from "@/lib/admin-evaluaciones";
import { ROLES_CURSOS, exigirRol, leerCuerpo, limpiar, respuestaError, respuestaOk } from "@/lib/admin-api";

/**
 * Evaluaciones de un curso.
 *
 *   PUT    crea la evaluación final de un curso que todavía no la tiene (y su
 *          banco de preguntas). Nace sin publicar: se publica cuando ya tiene
 *          preguntas.
 *   PATCH  edita la configuración: título, nota mínima, intentos, tiempo,
 *          retroalimentación y publicación.
 */

const crearSchema = z.object({ courseId: z.string().min(1) });

const editarSchema = z.object({
  assessmentId: z.string().min(1),
  title: z.string().trim().min(3, "Ingrese el título de la evaluación").optional(),
  description: z.string().nullable().optional(),
  minScore: z.coerce.number().int().min(1, "La nota mínima va de 1 a 100").max(100, "La nota mínima va de 1 a 100").optional(),
  maxAttempts: z.coerce.number().int().min(1, "Debe permitir al menos un intento").max(10, "Máximo 10 intentos").optional(),
  // 0 o vacío = sin límite de tiempo.
  timeLimitMin: z.coerce.number().int().min(0).max(240, "Máximo 240 minutos").nullable().optional(),
  shuffleQuestions: z.boolean().optional(),
  shuffleOptions: z.boolean().optional(),
  showFeedback: z.boolean().optional(),
  showCorrectAnswers: z.boolean().optional(),
  isPublished: z.boolean().optional(),
});

export async function PUT(req: Request) {
  const auth = await exigirRol(ROLES_CURSOS);
  if (auth.error) return auth.error;

  const cuerpo = await leerCuerpo(req, crearSchema);
  if (cuerpo.error) return cuerpo.error;

  const course = await prisma.course.findUnique({ where: { id: cuerpo.data.courseId } });
  if (!course) return respuestaError("Curso no encontrado", 404);

  const yaTiene = await prisma.assessment.findFirst({ where: { courseId: course.id, type: "final" } });
  if (yaTiene) return respuestaError("Este curso ya tiene evaluación final");

  await bancoDelCurso(course.id, course.title);
  const a = await prisma.assessment.create({
    data: {
      courseId: course.id,
      title: "Evaluación final",
      description: `Evaluación de cierre. Nota mínima aprobatoria ${course.minPassingScore}/100.`,
      type: "final",
      minScore: course.minPassingScore,
      maxAttempts: course.maxAttempts,
      timeLimitMin: 30,
      isRequired: true,
      isPublished: false,
      order: 99,
      showFeedback: true,
      showCorrectAnswers: true,
    },
  });

  await audit({
    userId: auth.user.id,
    actorEmail: auth.user.email,
    action: "crear",
    entity: "assessments",
    entityId: a.id,
    summary: `Evaluación final creada para "${course.title}"`,
  });

  return respuestaOk({ assessmentId: a.id });
}

export async function PATCH(req: Request) {
  const auth = await exigirRol(ROLES_CURSOS);
  if (auth.error) return auth.error;

  const cuerpo = await leerCuerpo(req, editarSchema);
  if (cuerpo.error) return cuerpo.error;
  const d = cuerpo.data;

  const before = await prisma.assessment.findUnique({
    where: { id: d.assessmentId },
    include: { _count: { select: { questions: true } } },
  });
  if (!before) return respuestaError("Evaluación no encontrada", 404);

  if (d.isPublished && before._count.questions === 0) {
    return respuestaError("Cargue al menos una pregunta antes de publicar la evaluación");
  }

  const after = await prisma.assessment.update({
    where: { id: before.id },
    data: {
      ...(d.title ? { title: d.title } : {}),
      ...(d.description !== undefined ? { description: limpiar(d.description) } : {}),
      ...(d.minScore !== undefined ? { minScore: d.minScore } : {}),
      ...(d.maxAttempts !== undefined ? { maxAttempts: d.maxAttempts } : {}),
      ...(d.timeLimitMin !== undefined ? { timeLimitMin: d.timeLimitMin || null } : {}),
      ...(d.shuffleQuestions !== undefined ? { shuffleQuestions: d.shuffleQuestions } : {}),
      ...(d.shuffleOptions !== undefined ? { shuffleOptions: d.shuffleOptions } : {}),
      ...(d.showFeedback !== undefined ? { showFeedback: d.showFeedback } : {}),
      ...(d.showCorrectAnswers !== undefined ? { showCorrectAnswers: d.showCorrectAnswers } : {}),
      ...(d.isPublished !== undefined ? { isPublished: d.isPublished } : {}),
    },
  });

  await audit({
    userId: auth.user.id,
    actorEmail: auth.user.email,
    action: "editar",
    entity: "assessments",
    entityId: after.id,
    summary: `Evaluación "${after.title}" editada`,
    before: { minScore: before.minScore, maxAttempts: before.maxAttempts, timeLimitMin: before.timeLimitMin, isPublished: before.isPublished },
    after: { minScore: after.minScore, maxAttempts: after.maxAttempts, timeLimitMin: after.timeLimitMin, isPublished: after.isPublished },
  });

  return respuestaOk();
}
