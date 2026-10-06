/**
 * KG ACADEMY - Completar los cursos del catálogo
 *
 * Corre prisma/completar-cursos.ts contra la base indicada en DATABASE_URL (la
 * local por defecto; la de producción con scripts/completar-cursos-produccion.ps1).
 * Con COMPLETAR_PUBLICAR=1, los cursos que se crean o completan quedan publicados.
 *
 *   powershell -ExecutionPolicy Bypass -File scripts\completar-cursos-produccion.ps1 [-Publicar]
 */
import { PrismaClient } from "@prisma/client";
import { completarCursos } from "./completar-cursos";

const prisma = new PrismaClient();

async function main() {
  const publicar = process.env.COMPLETAR_PUBLICAR === "1";
  const resultado = await completarCursos(prisma, { publicar });
  await prisma.auditLog.create({
    data: {
      action: "editar",
      entity: "courses",
      summary: `Cursos del catálogo completados${publicar ? " y publicados" : ""}: ${resultado.map((r) => r.curso.split(" ")[0]).join(", ")}`,
    },
  });

  console.log("\n=========== KG ACADEMY - CURSOS COMPLETADOS ===========");
  console.table(resultado);
  console.log("El contenido nuevo queda pendiente de validación técnica por KG.");
  console.log("=======================================================\n");
}

main()
  .catch((e) => {
    console.error(e instanceof Error ? e.message : e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
