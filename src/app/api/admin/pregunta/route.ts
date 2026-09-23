import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { audit } from "@/lib/auth";
import { bancoDelCurso, preguntaSchema } from "@/lib/admin-evaluaciones";
import { ROLES_CURSOS, exigirRol, leerCuerpo, limpiar, respuestaError, respuestaOk } from "@/lib/admin-api";

/**
 * Preguntas de una evaluación.
 *
 *   PUT    agrega una o varias preguntas (la carga masiva usa esta misma ruta):
 *          se guardan en el banco del curso y se vinculan a la evaluación.
 *   PATCH  edita una pregunta. Si ya fue respondida en algún intento, solo se
 *          pueden corregir el enunciado y la explicación: cambiar las opciones
 *          alteraría la nota de quien ya la presentó.
 *   DELETE la quita de la evaluación. Si nadie la ha respondido se borra; si
 *          ya tiene respuestas queda inactiva en el banco, para no perder el
 *          historial de los intentos.
 */

const MAX_POR_CARGA = 100;

const crearSchema = z.object({
  assessmentId: z.string().min(1),
  preguntas: z
    .array(preguntaSchema)
    .min(1, "No hay preguntas para cargar")
    .max(MAX_POR_CARGA, `Máximo ${MAX_POR_CARGA} preguntas por carga`),
});

const editarSchema = z.object({
  questionId: z.string().min(1),
  statement: z.string().trim().min(5, "El enunciado es muy corto").optional(),
  explanation: z.string().nullable().optional(),
  options: preguntaSchema.innerType().shape.options.optional(),
});

const quitarSchema = z.object({ assessmentId: z.string().min(1), questionId: z.string().min(1) });

export async function PUT(req: Request) {
  const auth = await exigirRol(ROLES_CURSOS);
  if (auth.error) return auth.error;

  const cuerpo = await leerCuerpo(req, crearSchema);
  if (cuerpo.error) return cuerpo.error;
  const d = cuerpo.data;

  const a = await prisma.assessment.findUnique({ where: { id: d.assessmentId }, include: { course: true } });
  if (!a) return respuestaError("Evaluación no encontrada", 404);

  const bank = await bancoDelCurso(a.courseId, a.course.title);
  const ultima = await prisma.assessmentQuestion.findFirst({
    where: { assessmentId: a.id },
    orderBy: { order: "desc" },
  });
  let orden = ultima?.order ?? 0;

  await prisma.$transaction(
    d.preguntas.map((p) =>
      prisma.question.create({
        data: {
          bankId: bank.id,
          type: p.type,
          statement: p.statement,
          explanation: limpiar(p.explanation),
          options: { create: p.options.map((o, i) => ({ text: o.text, isCorrect: o.isCorrect, order: i + 1 })) },
          inQuizzes: { create: { assessmentId: a.id, order: ++orden, points: 1 } },
        },
      })
    )
  );

  await audit({
    userId: auth.user.id,
    actorEmail: auth.user.email,
    action: "crear",
    entity: "questions",
    entityId: a.id,
    summary: `${d.preguntas.length} pregunta(s) agregadas a "${a.title}" de "${a.course.title}"`,
  });

  return respuestaOk({ creadas: d.preguntas.length });
}

export async function PATCH(req: Request) {
  const auth = await exigirRol(ROLES_CURSOS);
  if (auth.error) return auth.error;

  const cuerpo = await leerCuerpo(req, editarSchema);
  if (cuerpo.error) return cuerpo.error;
  const d = cuerpo.data;

  const before = await prisma.question.findUnique({
    where: { id: d.questionId },
    include: { options: { orderBy: { order: "asc" } }, _count: { select: { answers: true } } },
  });
  if (!before) return respuestaError("Pregunta no encontrada", 404);

  if (d.options) {
    if (before._count.answers > 0) {
      return respuestaError(
        "Esta pregunta ya fue respondida en evaluaciones presentadas: solo puede corregir el enunciado y la explicación. Para cambiar las opciones, quítela y cree una nueva."
      );
    }
    const correctas = d.options.filter((o) => o.isCorrect).length;
    if (correctas !== 1) return respuestaError("La pregunta debe tener exactamente una opción correcta");
  }

  await prisma.$transaction([
    prisma.question.update({
      where: { id: before.id },
      data: {
        ...(d.statement ? { statement: d.statement } : {}),
        ...(d.explanation !== undefined ? { explanation: limpiar(d.explanation) } : {}),
      },
    }),
    ...(d.options
      ? [
          prisma.questionOption.deleteMany({ where: { questionId: before.id } }),
          prisma.questionOption.createMany({
            data: d.options.map((o, i) => ({ questionId: before.id, text: o.text, isCorrect: o.isCorrect, order: i + 1 })),
          }),
        ]
      : []),
  ]);

  await audit({
    userId: auth.user.id,
    actorEmail: auth.user.email,
    action: "editar",
    entity: "questions",
    entityId: before.id,
    summary: `Pregunta editada: "${(d.statement ?? before.statement).slice(0, 80)}"`,
    before: { statement: before.statement, options: before.options.map((o) => ({ text: o.text, isCorrect: o.isCorrect })) },
    after: { statement: d.statement, options: d.options },
  });

  return respuestaOk();
}

export async function DELETE(req: Request) {
  const auth = await exigirRol(ROLES_CURSOS);
  if (auth.error) return auth.error;

  const cuerpo = await leerCuerpo(req, quitarSchema);
  if (cuerpo.error) return cuerpo.error;
  const d = cuerpo.data;

  const q = await prisma.question.findUnique({
    where: { id: d.questionId },
    include: { _count: { select: { answers: true, inQuizzes: true } } },
  });
  if (!q) return respuestaError("Pregunta no encontrada", 404);

  await prisma.assessmentQuestion.deleteMany({ where: { assessmentId: d.assessmentId, questionId: q.id } });

  // Solo se borra del banco si nadie la respondió y no está en otra evaluación.
  const enOtras = q._count.inQuizzes - 1;
  let destino: "borrada" | "inactiva" | "en_banco";
  if (q._count.answers === 0 && enOtras <= 0) {
    await prisma.question.delete({ where: { id: q.id } });
    destino = "borrada";
  } else if (enOtras <= 0) {
    await prisma.question.update({ where: { id: q.id }, data: { isActive: false } });
    destino = "inactiva";
  } else {
    destino = "en_banco";
  }

  await audit({
    userId: auth.user.id,
    actorEmail: auth.user.email,
    action: "eliminar",
    entity: "questions",
    entityId: q.id,
    summary: `Pregunta quitada de la evaluación (${destino}): "${q.statement.slice(0, 80)}"`,
  });

  return respuestaOk({ destino });
}
