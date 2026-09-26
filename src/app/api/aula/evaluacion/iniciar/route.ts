import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { segundosRestantes, validarPresentacion } from "@/lib/intentos";

/**
 * Empieza (o retoma) un intento: el reloj del tiempo límite corre desde aquí,
 * en el servidor. Si había una sesión anterior cuyo tiempo ya se agotó sin
 * entregar, se descarta sin gastar intento.
 */
const schema = z.object({ assessmentId: z.string().min(1) });

export async function POST(req: Request) {
  const user = await requireUser();
  const parsed = schema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });

  const v = await validarPresentacion(user, parsed.data.assessmentId);
  if ("error" in v) return NextResponse.json({ error: v.error }, { status: v.status });
  const { assessment, enrollment, finalizados } = v;

  let enCurso = await prisma.assessmentAttempt.findFirst({
    where: { assessmentId: assessment.id, enrollmentId: enrollment.id, status: "en_curso" },
    orderBy: { startedAt: "desc" },
  });
  const restante = enCurso ? segundosRestantes(enCurso.startedAt, assessment.timeLimitMin) : null;
  if (enCurso && restante !== null && restante <= 0) {
    await prisma.assessmentAttempt.deleteMany({ where: { id: enCurso.id, status: "en_curso" } });
    enCurso = null;
  }
  if (!enCurso) {
    enCurso = await prisma.assessmentAttempt.create({
      data: {
        assessmentId: assessment.id,
        enrollmentId: enrollment.id,
        userId: user.id,
        attemptNo: finalizados + 1,
        status: "en_curso",
        totalCount: assessment.questions.length,
      },
    });
  }

  return NextResponse.json({
    ok: true,
    attemptId: enCurso.id,
    segundosRestantes: segundosRestantes(enCurso.startedAt, assessment.timeLimitMin),
  });
}
