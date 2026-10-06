/**
 * KG ACADEMY - Publicar cursos por código
 *
 * Hace lo mismo que el botón "Publicado" del constructor (POST /api/admin/curso):
 * exige la evaluación final publicada y con preguntas si el curso la pide,
 * marca el curso como publicado y publica sus módulos y lecciones con
 * contenido. Deja la huella en la auditoría.
 *
 *   PUBLICAR_CODIGOS=KG-CA-001,KG-CA-002 npx tsx prisma/publicar-cursos.ts
 *
 * Contra producción: scripts/publicar-cursos-produccion.ps1 -Codigos KG-CA-001,KG-CA-002
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function publicar(code: string) {
  const curso = await prisma.course.findUnique({ where: { code } });
  if (!curso) return { curso: code, estado: "no existe" };
  if (curso.status === "publicado") return { curso: `${code} ${curso.title}`, estado: "ya estaba publicado" };
  if (curso.requiresFinalExam) {
    const final = await prisma.assessment.findFirst({
      where: { courseId: curso.id, type: "final", isPublished: true, questions: { some: {} } },
    });
    if (!final) return { curso: `${code} ${curso.title}`, estado: "sin evaluación final publicada: no se publica" };
  }
  await prisma.$transaction([
    prisma.course.update({ where: { id: curso.id }, data: { status: "publicado", publishedAt: curso.publishedAt ?? new Date() } }),
    prisma.module.updateMany({ where: { courseId: curso.id }, data: { isPublished: true } }),
    prisma.lesson.updateMany({ where: { module: { courseId: curso.id }, contentType: { not: "pendiente" } }, data: { isPublished: true } }),
    prisma.auditLog.create({
      data: {
        action: "publicar",
        entity: "courses",
        entityId: curso.id,
        summary: `Estado de "${curso.title}": ${curso.status} -> publicado (por script, a pedido de Diego)`,
        beforeJson: JSON.stringify({ status: curso.status }),
        afterJson: JSON.stringify({ status: "publicado" }),
      },
    }),
  ]);
  return { curso: `${code} ${curso.title}`, estado: "publicado" };
}

async function main() {
  const codigos = (process.env.PUBLICAR_CODIGOS ?? "").split(",").map((c) => c.trim()).filter(Boolean);
  if (!codigos.length) throw new Error("Indique los códigos en PUBLICAR_CODIGOS (separados por coma).");
  const resultado = [];
  for (const c of codigos) resultado.push(await publicar(c));
  console.table(resultado);
}

main()
  .catch((e) => {
    console.error(e instanceof Error ? e.message : e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
