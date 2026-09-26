import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { trackLesson } from "@/lib/progress";
import { puedeVerCurso } from "@/lib/acceso-cursos";

const schema = z.object({
  enrollmentId: z.string(),
  lessonId: z.string(),
  completed: z.boolean().optional(),
  percent: z.number().min(0).max(100).optional(),
  positionSec: z.number().min(0).max(24 * 3600).optional(),
  // Tiempo desde el último registro. Se acota para que el tiempo de estudio
  // que ven la empresa y los reportes no se pueda inflar a mano.
  addSeconds: z.number().min(0).transform((n) => Math.min(Math.round(n), 2 * 3600)).optional(),
});

export async function POST(req: Request) {
  const user = await requireUser();
  const parsed = schema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: "Datos invalidos" }, { status: 400 });

  // El usuario solo puede registrar avance sobre SU propia matrícula
  const enrollment = await prisma.enrollment.findUnique({
    where: { id: parsed.data.enrollmentId },
    include: { course: { select: { status: true } } },
  });
  if (!enrollment || enrollment.userId !== user.id || !puedeVerCurso(user.role.code, enrollment.course.status)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  // La lección tiene que ser de este curso y estar publicada.
  const leccion = await prisma.lesson.findUnique({
    where: { id: parsed.data.lessonId },
    select: { contentType: true, isPublished: true, module: { select: { courseId: true } } },
  });
  if (!leccion || leccion.module.courseId !== enrollment.courseId || !leccion.isPublished) {
    return NextResponse.json({ error: "Lección no disponible" }, { status: 404 });
  }

  // Una lección sin contenido no se puede dar por vista: si se pudiera, bastaría
  // con recorrer pantallas vacías para completar el curso y salir certificado.
  if (parsed.data.completed) {
    if (leccion.contentType === "pendiente") {
      return NextResponse.json(
        { error: "Esta lección aún no tiene contenido publicado." },
        { status: 409 }
      );
    }
  }

  const updated = await trackLesson({ ...parsed.data, userId: user.id });
  return NextResponse.json({ ok: true, progress: updated?.progress ?? 0, status: updated?.status });
}
