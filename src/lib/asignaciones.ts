/**
 * Asignación de un curso a trabajadores de una empresa: crea el lote, la
 * asignación, la matrícula (o la enlaza si ya existía) y la notificación.
 * La usan la pantalla "Asignar cursos" y el alta de trabajadores (que puede
 * asignar cursos en el mismo paso).
 *
 * Quien llama ya validó que el curso está publicado y que los trabajadores son
 * miembros activos de la empresa.
 */
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export async function asignarCurso(datos: {
  companyId: string;
  course: { id: string; code: string; title: string; slug: string };
  userIds: string[];
  actorId: string;
  dueDate: Date | null;
  isMandatory?: boolean;
  batchName?: string | null;
}) {
  const { companyId, course, userIds, dueDate } = datos;
  const batch = await prisma.assignmentBatch.create({
    data: {
      companyId,
      courseId: course.id,
      createdById: datos.actorId,
      name: datos.batchName ?? `Asignación ${course.code}`,
      dueDate,
      totalTargets: userIds.length,
    },
  });

  let creadas = 0;
  let omitidas = 0;
  for (const userId of userIds) {
    const existe = await prisma.courseAssignment.findUnique({
      where: { companyId_courseId_userId: { companyId, courseId: course.id, userId } },
    });
    if (existe) {
      omitidas++;
      continue;
    }

    const assignment = await prisma.courseAssignment.create({
      data: {
        companyId,
        courseId: course.id,
        userId,
        batchId: batch.id,
        assignedById: datos.actorId,
        isMandatory: datos.isMandatory ?? true,
        dueDate,
        notifiedAt: new Date(),
        status: "asignado",
      },
    });

    const yaMatriculado = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId: course.id } },
    });
    if (yaMatriculado) {
      await prisma.enrollment.update({
        where: { id: yaMatriculado.id },
        data: { assignmentId: assignment.id, expiresAt: dueDate },
      });
    } else {
      await prisma.enrollment.create({
        data: { userId, courseId: course.id, origin: "asignacion_empresa", assignmentId: assignment.id, expiresAt: dueDate },
      });
    }

    await prisma.notification.create({
      data: {
        userId,
        title: "Nuevo curso asignado",
        message: `Su empresa le asignó el curso "${course.title}".${dueDate ? ` Fecha límite: ${formatDate(dueDate)}.` : ""}`,
        linkUrl: `/aula/curso/${course.slug}`,
        type: "info",
      },
    });
    creadas++;
  }

  return { creadas, omitidas, batchId: batch.id };
}
