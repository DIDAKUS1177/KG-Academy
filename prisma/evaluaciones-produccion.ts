/* eslint-disable no-console */
/**
 * KG ACADEMY - Evaluaciones finales en producción
 *
 * Carga las evaluaciones de prisma/evaluaciones.ts en los cursos que todavía
 * no tienen evaluación final. No toca una evaluación existente ni publica el
 * curso: eso se decide desde el panel (o con PUBLICAR=KG-PA-001,...).
 *
 *   powershell -ExecutionPolicy Bypass -File scripts\evaluaciones-produccion.ps1
 */
import { PrismaClient } from "@prisma/client";
import { EVALUACIONES_FINALES } from "./evaluaciones";
import { crearEvaluacionFinal } from "./crear-evaluacion";

const prisma = new PrismaClient();
const PUBLICAR = (process.env.PUBLICAR ?? "").split(",").map((s) => s.trim()).filter(Boolean);

async function main() {
  const resultado: { curso: string; evaluacion: string; curso_estado: string }[] = [];

  for (const [code, ev] of Object.entries(EVALUACIONES_FINALES)) {
    const curso = await prisma.course.findUnique({ where: { code } });
    if (!curso) {
      resultado.push({ curso: code, evaluacion: "el curso no existe", curso_estado: "-" });
      continue;
    }
    const existe = await prisma.assessment.findFirst({ where: { courseId: curso.id, type: "final" } });
    let evaluacion = "ya tenía evaluación final, sin cambios";
    if (!existe) {
      await prisma.$transaction((tx) => crearEvaluacionFinal(tx, curso, ev), { timeout: 120_000 });
      await prisma.auditLog.create({
        data: { action: "crear", entity: "assessments", entityId: curso.id, summary: `Evaluación final de "${curso.title}" cargada (${ev.preguntas.length} preguntas)` },
      });
      evaluacion = `creada y publicada (${ev.preguntas.length} preguntas)`;
    }

    let estado = curso.status;
    if (PUBLICAR.includes(code) && curso.status !== "publicado") {
      await prisma.course.update({ where: { id: curso.id }, data: { status: "publicado", publishedAt: curso.publishedAt ?? new Date() } });
      await prisma.module.updateMany({ where: { courseId: curso.id }, data: { isPublished: true } });
      await prisma.lesson.updateMany({ where: { module: { courseId: curso.id }, contentType: { not: "pendiente" } }, data: { isPublished: true } });
      await prisma.auditLog.create({
        data: { action: "publicar", entity: "courses", entityId: curso.id, summary: `Curso "${curso.title}" publicado (${curso.status} -> publicado)` },
      });
      estado = "publicado";
    }
    resultado.push({ curso: `${code} ${curso.title}`, evaluacion, curso_estado: estado });
  }

  console.log("\n=========== KG ACADEMY - EVALUACIONES FINALES ===========");
  console.table(resultado);
  console.log("=========================================================\n");
}

main()
  .catch((e) => {
    console.error(e instanceof Error ? e.message : e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
