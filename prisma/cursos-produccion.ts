/**
 * KG ACADEMY - Cursos en producción
 *
 * Crea en la base de producción los cursos del catálogo (prisma/catalogo-cursos.ts)
 * que todavía no existan, con sus módulos, lecciones y el material de Genially.
 *
 *   - NO borra ni modifica nada: si un curso con el mismo código ya existe, se
 *     salta. Se puede correr las veces que haga falta.
 *   - Todo nace en BORRADOR, sin instructor y sin evaluaciones: KG revisa el
 *     contenido, carga su banco de preguntas oficial desde el panel
 *     (Evaluaciones > Crear evaluación final) y publica cuando esté listo.
 *   - Necesita las categorías de la carga inicial (seed-produccion.ts).
 *
 *   powershell -ExecutionPolicy Bypass -File scripts\cursos-produccion.ps1
 */
import { PrismaClient } from "@prisma/client";
import { CURSOS, type LeccionSemilla } from "./catalogo-cursos";

const prisma = new PrismaClient();

async function main() {
  const categoria = await prisma.category.findUnique({ where: { slug: "primeros-auxilios" } });
  if (!categoria) {
    throw new Error('No existe la categoría "primeros-auxilios". Corra primero la carga inicial (sembrar-produccion.ps1).');
  }

  const resultado: { curso: string; estado: string }[] = [];

  for (const c of CURSOS) {
    const existe = await prisma.course.findUnique({ where: { code: c.code } });
    if (existe) {
      resultado.push({ curso: `${c.code} ${c.title}`, estado: "ya existía, sin cambios" });
      continue;
    }

    const lecciones = c.modules.reduce((n, m) => n + m.lessons.length, 0);
    await prisma.$transaction(async (tx) => {
      const course = await tx.course.create({
        data: {
          code: c.code,
          slug: c.slug,
          title: c.title,
          subtitle: c.subtitle,
          description: c.objective,
          objective: c.objective,
          targetAudience: c.targetAudience,
          requirements: c.requirements,
          methodology: c.methodology,
          level: c.level,
          modality: "virtual",
          durationHours: c.durationHours,
          categoryId: categoria.id,
          status: "borrador",
          accessType: "plan_empresarial",
          price: 0,
          progressRule: "obligatorios",
          minPassingScore: 80,
          maxAttempts: 3,
          requiresFinalExam: true,
          requiresAllLessons: true,
          certificateEnabled: true,
          certificateValidityMonths: 24,
        },
      });

      const pesoModulo = 100 / c.modules.length;
      for (const [mi, m] of c.modules.entries()) {
        const mod = await tx.module.create({
          data: {
            courseId: course.id,
            title: m.title,
            description: m.description,
            order: mi + 1,
            weight: pesoModulo,
            isRequired: true,
            isPublished: true,
          },
        });
        for (const [li, leccion] of m.lessons.entries()) {
          const l: LeccionSemilla = typeof leccion === "string" ? { title: leccion } : leccion;
          const tipo = l.contentType ?? "pendiente";
          await tx.lesson.create({
            data: {
              moduleId: mod.id,
              title: l.title,
              description: l.description ?? null,
              order: li + 1,
              contentType: tipo,
              contentUrl: l.contentUrl ?? null,
              durationMin: l.durationMin ?? 12,
              isRequired: true,
              isPreview: l.isPreview ?? (mi === 0 && li === 0),
              weight: pesoModulo / m.lessons.length,
              completionRule: "manual",
              isPublished: tipo !== "pendiente",
            },
          });
        }
      }

      await tx.auditLog.create({
        data: {
          action: "crear",
          entity: "courses",
          entityId: course.id,
          summary: `Curso "${course.title}" creado en borrador por la carga de cursos de producción`,
        },
      });
      // Neon responde a varios milisegundos por consulta: 5 s (el valor por
      // defecto) no alcanza para un curso con muchas lecciones.
    }, { timeout: 60_000 });

    resultado.push({ curso: `${c.code} ${c.title}`, estado: `creado en borrador (${c.modules.length} módulos, ${lecciones} lecciones)` });
  }

  console.log("\n=========== KG ACADEMY - CURSOS EN PRODUCCIÓN ===========");
  console.table(resultado);
  console.log("Siguiente paso: en el panel, Evaluaciones > Crear evaluación final, cargar las");
  console.log("preguntas oficiales, publicarla y luego publicar el curso.");
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
