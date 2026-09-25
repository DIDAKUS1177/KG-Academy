/**
 * Crea la evaluación final (publicada) de un curso con su banco de preguntas.
 * La usan la semilla de demostración y la carga de producción.
 */
import type { Prisma, PrismaClient } from "@prisma/client";
import type { EvaluacionFinal } from "./evaluaciones";

type Db = PrismaClient | Prisma.TransactionClient;

export async function crearEvaluacionFinal(db: Db, curso: { id: string; title: string }, ev: EvaluacionFinal) {
  const bank = await db.questionBank.create({
    data: {
      name: `Banco de preguntas - ${curso.title}`,
      description: "Evaluación final del curso. KG la puede ajustar desde Administración → Evaluaciones.",
      courseId: curso.id,
    },
  });
  const assessment = await db.assessment.create({
    data: {
      courseId: curso.id,
      title: ev.title,
      description: ev.description,
      type: "final",
      minScore: ev.minScore,
      maxAttempts: ev.maxAttempts,
      timeLimitMin: ev.timeLimitMin,
      isRequired: true,
      isPublished: true,
      order: 99,
      showFeedback: true,
      showCorrectAnswers: true,
    },
  });
  for (const [i, q] of ev.preguntas.entries()) {
    await db.question.create({
      data: {
        bankId: bank.id,
        type: q.type ?? "unica",
        statement: q.statement,
        explanation: q.explanation,
        difficulty: "media",
        points: 1,
        options: { create: q.options.map((o, j) => ({ text: o.text, isCorrect: o.ok, order: j + 1 })) },
        inQuizzes: { create: { assessmentId: assessment.id, order: i + 1, points: 1 } },
      },
    });
  }
  return assessment;
}
