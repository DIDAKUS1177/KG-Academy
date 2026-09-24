/**
 * Crea en la base un curso interactivo del catálogo (prisma/cursos-interactivos.ts)
 * con sus módulos, lecciones, banco de preguntas y evaluación final publicada.
 *
 * Lo usan la semilla de demostración (seed.ts, curso publicado) y la carga de
 * producción (cursos-interactivos-produccion.ts, curso en borrador).
 * Usa creaciones anidadas para hacer pocas consultas: en Neon cada ida y
 * vuelta cuesta milisegundos.
 */
import type { Prisma, PrismaClient } from "@prisma/client";
import type { CursoInteractivo } from "./cursos-interactivos";

type Db = PrismaClient | Prisma.TransactionClient;

export async function crearCursoInteractivo(
  db: Db,
  c: CursoInteractivo,
  opciones: { categoryId: string; instructorId: string | null; status: "publicado" | "borrador" }
) {
  const publicado = opciones.status === "publicado";
  const pesoModulo = 100 / c.modules.length;

  const course = await db.course.create({
    data: {
      code: c.code,
      slug: c.slug,
      title: c.title,
      subtitle: c.subtitle,
      description: `${c.objective}\n\nPrototipo interactivo: contenido pendiente de validación técnica por KG.`,
      objective: c.objective,
      targetAudience: c.targetAudience,
      requirements: c.requirements,
      methodology: c.methodology,
      level: c.level,
      modality: "virtual",
      durationHours: c.durationHours,
      categoryId: opciones.categoryId,
      instructorId: opciones.instructorId,
      status: opciones.status,
      accessType: "plan_empresarial",
      price: 0,
      progressRule: "obligatorios",
      minPassingScore: c.examen.minScore,
      maxAttempts: c.examen.maxAttempts,
      requiresFinalExam: true,
      requiresAllLessons: true,
      certificateEnabled: true,
      certificateValidityMonths: 24,
      publishedAt: publicado ? new Date() : null,
      modules: {
        create: c.modules.map((m, mi) => ({
          title: m.title,
          description: m.description,
          order: mi + 1,
          weight: pesoModulo,
          isRequired: true,
          isPublished: true,
          lessons: {
            create: m.lessons.map((l, li) => ({
              title: l.title,
              description: l.description,
              order: li + 1,
              contentType: "interactivo",
              contentBody: JSON.stringify(l.contenido),
              durationMin: l.durationMin,
              isRequired: true,
              isPreview: mi === 0 && li === 0,
              weight: pesoModulo / m.lessons.length,
              completionRule: "manual",
              isPublished: true,
            })),
          },
        })),
      },
    },
  });

  const bank = await db.questionBank.create({
    data: {
      name: `Banco de preguntas - ${c.title}`,
      description: "Banco del prototipo interactivo. Pendiente de validación técnica por KG.",
      courseId: course.id,
      topic: c.categoria,
    },
  });
  const finalEval = await db.assessment.create({
    data: {
      courseId: course.id,
      title: c.examen.title,
      description: c.examen.description,
      type: "final",
      minScore: c.examen.minScore,
      maxAttempts: c.examen.maxAttempts,
      timeLimitMin: c.examen.timeLimitMin,
      isRequired: true,
      isPublished: true,
      order: 99,
      showFeedback: true,
      showCorrectAnswers: true,
    },
  });
  for (const [i, q] of c.examen.preguntas.entries()) {
    await db.question.create({
      data: {
        bankId: bank.id,
        type: q.type ?? "unica",
        statement: q.statement,
        explanation: q.explanation,
        difficulty: "media",
        points: 1,
        options: { create: q.options.map((o, j) => ({ text: o.text, isCorrect: o.ok, order: j + 1 })) },
        inQuizzes: { create: { assessmentId: finalEval.id, order: i + 1, points: 1 } },
      },
    });
  }

  return course;
}
