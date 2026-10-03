import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser, audit } from "@/lib/auth";
import { ensureEnrollment } from "@/lib/progress";
import { puedeEmpezarCurso } from "@/lib/acceso-cursos";

export async function POST(req: Request) {
  const user = await requireUser();
  const form = await req.formData();
  const courseId = String(form.get("courseId") ?? "");

  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) return NextResponse.json({ error: "Curso no encontrado" }, { status: 404 });
  // Desde la ficha del curso llega un formulario: se vuelve a ella, que explica por qué no se puede.
  if (!(await puedeEmpezarCurso(user, course))) return NextResponse.redirect(new URL(`/curso/${course.slug}`, req.url), { status: 303 });

  await ensureEnrollment(user.id, course.id, course.accessType === "gratuito" ? "gratuito" : "compra");
  await audit({
    userId: user.id,
    actorEmail: user.email,
    action: "crear",
    entity: "enrollments",
    entityId: course.id,
    summary: `Matrícula en ${course.title}`,
  });

  return NextResponse.redirect(new URL(`/aula/curso/${course.slug}`, req.url), { status: 303 });
}
