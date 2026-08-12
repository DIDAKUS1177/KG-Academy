import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser, audit } from "@/lib/auth";
import { ROLES, COURSE_STATUS } from "@/lib/constants";

const schema = z.object({
  courseId: z.string(),
  status: z.enum(COURSE_STATUS),
});

const PERMITIDOS: string[] = [ROLES.SUPERADMIN, ROLES.ADMIN_KG];

export async function POST(req: Request) {
  const user = await requireUser();
  if (!PERMITIDOS.includes(user.role.code)) {
    return NextResponse.json({ error: "Solo la administracion de KG puede publicar cursos" }, { status: 403 });
  }

  const parsed = schema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: "Estado invalido" }, { status: 400 });

  const before = await prisma.course.findUnique({ where: { id: parsed.data.courseId } });
  if (!before) return NextResponse.json({ error: "Curso no encontrado" }, { status: 404 });

  const course = await prisma.course.update({
    where: { id: parsed.data.courseId },
    data: {
      status: parsed.data.status,
      publishedAt:
        parsed.data.status === "publicado" ? before.publishedAt ?? new Date() : before.publishedAt,
    },
  });

  // Al publicar el curso se publican sus modulos y las lecciones ya cargadas
  if (parsed.data.status === "publicado") {
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

  return NextResponse.json({ ok: true, status: course.status });
}
