import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { trackLesson } from "@/lib/progress";

const schema = z.object({
  enrollmentId: z.string(),
  lessonId: z.string(),
  completed: z.boolean().optional(),
  percent: z.number().optional(),
  positionSec: z.number().optional(),
  addSeconds: z.number().optional(),
});

export async function POST(req: Request) {
  const user = await requireUser();
  const parsed = schema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: "Datos invalidos" }, { status: 400 });

  // El usuario solo puede registrar avance sobre SU propia matrícula
  const enrollment = await prisma.enrollment.findUnique({ where: { id: parsed.data.enrollmentId } });
  if (!enrollment || enrollment.userId !== user.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const updated = await trackLesson({ ...parsed.data, userId: user.id });
  return NextResponse.json({ ok: true, progress: updated?.progress ?? 0, status: updated?.status });
}
