/**
 * Reglas compartidas del banco de preguntas (panel de administración).
 *
 * La calificación del aula solo entiende preguntas de respuesta única
 * (incluido verdadero/falso): cada pregunta debe tener entre 2 y 6 opciones y
 * exactamente una correcta.
 */
import { z } from "zod";
import { prisma } from "@/lib/prisma";

export const TIPOS_PREGUNTA = ["unica", "verdadero_falso"] as const;

export const preguntaSchema = z
  .object({
    statement: z.string().trim().min(5, "El enunciado es muy corto"),
    explanation: z.string().trim().optional().nullable(),
    type: z.enum(TIPOS_PREGUNTA).default("unica"),
    options: z
      .array(z.object({ text: z.string().trim().min(1, "Hay una opción vacía"), isCorrect: z.boolean() }))
      .min(2, "Cada pregunta necesita al menos 2 opciones")
      .max(6, "Máximo 6 opciones por pregunta"),
  })
  .superRefine((p, ctx) => {
    const correctas = p.options.filter((o) => o.isCorrect).length;
    if (correctas !== 1) {
      ctx.addIssue({
        code: "custom",
        path: ["options"],
        message: `"${p.statement.slice(0, 60)}" debe tener exactamente una opción correcta`,
      });
    }
  });

export type PreguntaEntrada = z.infer<typeof preguntaSchema>;

/** Banco del curso: se reutiliza el primero que exista o se crea uno. */
export async function bancoDelCurso(courseId: string, titulo: string) {
  const existente = await prisma.questionBank.findFirst({ where: { courseId }, orderBy: { createdAt: "asc" } });
  if (existente) return existente;
  return prisma.questionBank.create({ data: { name: `Banco de preguntas - ${titulo}`, courseId } });
}
