import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser, audit } from "@/lib/auth";
import { recalcEnrollment, addPoints } from "@/lib/progress";
import { GRACIA_SEG, segundosRestantes, validarPresentacion } from "@/lib/intentos";

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

  const v = await validarPresentacion(user, parsed.data.assessmentId);
  if ("error" in v) return NextResponse.json({ error: v.error }, { status: v.status });
  const { assessment, enrollment, finalizados: previos } = v;

  // El intento que se abrió al empezar. Con tiempo límite es obligatorio y el
  // servidor comprueba que la entrega llegó a tiempo.
  const enCurso = await prisma.assessmentAttempt.findFirst({
    where: { assessmentId: assessment.id, enrollmentId: enrollment.id, status: "en_curso" },
    orderBy: { startedAt: "desc" },
  });
  if (assessment.timeLimitMin) {
    if (!enCurso) {
      return NextResponse.json({ error: "Este intento no está abierto. Vuelva a empezar la evaluación." }, { status: 409 });
    }
    const restante = segundosRestantes(enCurso.startedAt, assessment.timeLimitMin)!;
    if (restante < -GRACIA_SEG) {
      await prisma.assessmentAttempt.deleteMany({ where: { id: enCurso.id, status: "en_curso" } });
      return NextResponse.json(
        { error: "Se acabó el tiempo de este intento y no se calificó. Puede volver a empezar la evaluación." },
        { status: 409 }
      );
    }
  }

  // ---- Calificación ----
  const respuestas = new Map(parsed.data.answers.map((a) => [a.questionId, a.optionId]));
  // Una opción que no pertenece a la pregunta se toma como no respondida.
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
    const enviada = respuestas.get(aq.questionId) ?? null;
    const elegida = enviada && aq.question.options.some((o) => o.id === enviada) ? enviada : null;
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

  const resultado = {
    attemptNo: previos + 1,
    score,
    correctCount: correctas,
    totalCount: assessment.questions.length,
    passed,
    status: "finalizado",
    submittedAt: new Date(),
    answers: { create: detalle },
  };
  if (enCurso) {
    // Se toma el intento de forma atómica: un segundo envío simultáneo (doble
    // clic) ya no lo encuentra abierto y no duplica la calificación.
    const tomado = await prisma.assessmentAttempt.updateMany({
      where: { id: enCurso.id, status: "en_curso" },
      data: { status: "calificando" },
    });
    if (tomado.count === 0) {
      return NextResponse.json({ error: "Este intento ya se entregó." }, { status: 409 });
    }
  }
  const attempt = enCurso
    ? await prisma.assessmentAttempt.update({
        where: { id: enCurso.id },
        data: { ...resultado, durationSec: Math.round((Date.now() - enCurso.startedAt.getTime()) / 1000) },
      })
    : await prisma.assessmentAttempt.create({
        data: { assessmentId: assessment.id, enrollmentId: enrollment.id, userId: user.id, ...resultado },
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
