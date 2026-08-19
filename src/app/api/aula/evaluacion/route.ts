import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser, audit } from "@/lib/auth";
import { recalcEnrollment, addPoints } from "@/lib/progress";

const schema = z.object({
  assessmentId: z.string(),
  answers: z.array(z.object({ questionId: z.string(), optionId: z.string().nullable() })),
});

/**
 * Calificación automática de evaluaciones.
 * Registra el intento, cada respuesta, la nota y recalcula el progreso del curso
 * (lo que puede disparar la emisión automática del certificado).
 */
export async function POST(req: Request) {
  const user = await requireUser();
  const parsed = schema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: "Datos invalidos" }, { status: 400 });

  const assessment = await prisma.assessment.findUnique({
    where: { id: parsed.data.assessmentId },
    include: {
      course: true,
      questions: { include: { question: { include: { options: true } } } },
    },
  });
  if (!assessment) return NextResponse.json({ error: "Evaluación no encontrada" }, { status: 404 });

  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId: user.id, courseId: assessment.courseId } },
  });
  if (!enrollment) return NextResponse.json({ error: "No está matriculado en el curso" }, { status: 403 });

  const previos = await prisma.assessmentAttempt.count({
    where: { assessmentId: assessment.id, enrollmentId: enrollment.id },
  });
  const aprobadoAntes = await prisma.assessmentAttempt.count({
    where: { assessmentId: assessment.id, enrollmentId: enrollment.id, passed: true },
  });
  if (previos >= assessment.maxAttempts && aprobadoAntes === 0) {
    return NextResponse.json({ error: "Agoto los intentos permitidos" }, { status: 403 });
  }

  // ---- Calificación ----
  const respuestas = new Map(parsed.data.answers.map((a) => [a.questionId, a.optionId]));
  let correctas = 0;
  let puntos = 0;
  let puntosPosibles = 0;

  const detalle: {
    questionId: string;
    optionId: string | null;
    isCorrect: boolean;
    points: number;
  }[] = [];

  for (const aq of assessment.questions) {
    puntosPosibles += aq.points;
    const elegida = respuestas.get(aq.questionId) ?? null;
    const correcta = aq.question.options.find((o) => o.isCorrect);
    const ok = !!elegida && !!correcta && elegida === correcta.id;
    if (ok) {
      correctas++;
      puntos += aq.points;
    }
    detalle.push({ questionId: aq.questionId, optionId: elegida, isCorrect: ok, points: ok ? aq.points : 0 });
  }

  const score = puntosPosibles > 0 ? Math.round((puntos / puntosPosibles) * 1000) / 10 : 0;
  const passed = assessment.type === "diagnostica" ? true : score >= assessment.minScore;

  const attempt = await prisma.assessmentAttempt.create({
    data: {
      assessmentId: assessment.id,
      enrollmentId: enrollment.id,
      userId: user.id,
      attemptNo: previos + 1,
      score,
      correctCount: correctas,
      totalCount: assessment.questions.length,
      passed,
      status: "finalizado",
      submittedAt: new Date(),
      answers: { create: detalle },
    },
  });

  if (passed && assessment.type !== "diagnostica") {
    await addPoints(user.id, 50, "evaluacion_aprobada", "evaluacion", assessment.id);
  }

  await audit({
    userId: user.id,
    actorEmail: user.email,
    action: "crear",
    entity: "assessment_attempts",
    entityId: attempt.id,
    summary: `Intento ${previos + 1} de "${assessment.title}" - nota ${score}`,
  });

  // Puede disparar la emisión del certificado
  await recalcEnrollment(enrollment.id);

  return NextResponse.json({ ok: true, attemptId: attempt.id, score, passed });
}
