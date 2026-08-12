import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser, audit } from "@/lib/auth";
import { ROLES } from "@/lib/constants";
import { formatDate } from "@/lib/utils";

const schema = z.object({
  companyId: z.string(),
  courseId: z.string(),
  userIds: z.array(z.string()).min(1, "Seleccione al menos un trabajador"),
  dueDate: z.string().nullable().optional(),
  isMandatory: z.boolean().optional(),
  batchName: z.string().nullable().optional(),
});

const PERMITIDOS: string[] = [ROLES.ADMIN_EMPRESA, ROLES.SUPERADMIN, ROLES.ADMIN_KG];

/** Asignacion individual y masiva de cursos (punto 11 del esqueleto). */
export async function POST(req: Request) {
  const user = await requireUser();
  if (!PERMITIDOS.includes(user.role.code)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const parsed = schema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }
  const { companyId, courseId, userIds } = parsed.data;

  if (user.role.code === ROLES.ADMIN_EMPRESA && user.companyId !== companyId) {
    return NextResponse.json({ error: "No autorizado sobre esta empresa" }, { status: 403 });
  }

  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) return NextResponse.json({ error: "Curso no encontrado" }, { status: 404 });

  const dueDate = parsed.data.dueDate ? new Date(parsed.data.dueDate) : null;

  const batch = await prisma.assignmentBatch.create({
    data: {
      companyId,
      courseId,
      createdById: user.id,
      name: parsed.data.batchName ?? `Asignacion ${course.code}`,
      dueDate,
      totalTargets: userIds.length,
    },
  });

  let creadas = 0;
  let omitidas = 0;

  for (const userId of userIds) {
    const existe = await prisma.courseAssignment.findUnique({
      where: { companyId_courseId_userId: { companyId, courseId, userId } },
    });
    if (existe) {
      omitidas++;
      continue;
    }

    const assignment = await prisma.courseAssignment.create({
      data: {
        companyId,
        courseId,
        userId,
        batchId: batch.id,
        assignedById: user.id,
        isMandatory: parsed.data.isMandatory ?? true,
        dueDate,
        notifiedAt: new Date(),
        status: "asignado",
      },
    });

    const yaMatriculado = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });
    if (yaMatriculado) {
      await prisma.enrollment.update({
        where: { id: yaMatriculado.id },
        data: { assignmentId: assignment.id, expiresAt: dueDate },
      });
    } else {
      await prisma.enrollment.create({
        data: {
          userId,
          courseId,
          origin: "asignacion_empresa",
          assignmentId: assignment.id,
          expiresAt: dueDate,
        },
      });
    }

    await prisma.notification.create({
      data: {
        userId,
        title: "Nuevo curso asignado",
        message: `Su empresa le asigno el curso "${course.title}".${
          dueDate ? ` Fecha limite: ${formatDate(dueDate)}.` : ""
        }`,
        linkUrl: `/aula/curso/${course.slug}`,
        type: "info",
      },
    });

    creadas++;
  }

  await audit({
    userId: user.id,
    actorEmail: user.email,
    action: "asignar",
    entity: "course_assignments",
    entityId: batch.id,
    summary: `Asignacion de "${course.title}": ${creadas} creadas, ${omitidas} omitidas`,
  });

  return NextResponse.json({ ok: true, creadas, omitidas, batchId: batch.id });
}
