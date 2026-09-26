/**
 * KG ACADEMY - Cursos interactivos (modo juego) en producción
 *
 * Carga en producción los dos prototipos de prisma/cursos-interactivos.ts para
 * que KG los revise:
 *   - EN BORRADOR: solo los abren superadministradores, administradores e
 *     instructores de KG (ver src/lib/acceso-cursos.ts). Ningún trabajador
 *     puede tomarlos ni certificarse hasta que KG valide el contenido y los
 *     publique desde el panel.
 *   - NO borra ni modifica nada: si un curso con el mismo código ya existe, se
 *     salta. Se puede correr las veces que haga falta.
 *   - Crea la categoría "Emergencias" si no existe.
 *
 *   powershell -ExecutionPolicy Bypass -File scripts\cursos-interactivos-produccion.ps1
 */
import { PrismaClient } from "@prisma/client";
import { CURSOS_INTERACTIVOS } from "./cursos-interactivos";
import { crearCursoInteractivo } from "./crear-curso-interactivo";

const prisma = new PrismaClient();

const CATEGORIAS: Record<string, { name: string; description: string; icon: string; color: string; order: number }> = {
  emergencias: {
    name: "Emergencias",
    description: "Prevención y control de incendios, evacuación y brigadas.",
    icon: "flame",
    color: "#E4572E",
    order: 5,
  },
};

async function categoria(slug: string) {
  const existe = await prisma.category.findUnique({ where: { slug } });
  if (existe) return existe.id;
  const datos = CATEGORIAS[slug];
  if (!datos) throw new Error(`No existe la categoría "${slug}". Corra primero la carga inicial (sembrar-produccion.ps1).`);
  return (await prisma.category.create({ data: { slug, ...datos } })).id;
}

async function main() {
  const resultado: { curso: string; estado: string }[] = [];

  for (const c of CURSOS_INTERACTIVOS) {
    const existe = await prisma.course.findFirst({ where: { OR: [{ code: c.code }, { slug: c.slug }] } });
    if (existe) {
      resultado.push({ curso: `${c.code} ${c.title}`, estado: `ya existía (${existe.status}), sin cambios` });
      continue;
    }
    const categoryId = await categoria(c.categoria);
    const course = await prisma.$transaction(
      (tx) => crearCursoInteractivo(tx, c, { categoryId, instructorId: null, status: "borrador" }),
      // Neon responde a varios milisegundos por consulta.
      { timeout: 120_000 }
    );
    await prisma.auditLog.create({
      data: {
        action: "crear",
        entity: "courses",
        entityId: course.id,
        summary: `Curso interactivo "${course.title}" cargado en borrador para revisión de KG`,
      },
    });
    const lecciones = c.modules.reduce((n, m) => n + m.lessons.length, 0);
    resultado.push({
      curso: `${c.code} ${c.title}`,
      estado: `creado en borrador (${c.modules.length} mundos, ${lecciones} niveles, ${c.examen.preguntas.length} preguntas)`,
    });
  }

  console.log("\n=========== KG ACADEMY - CURSOS INTERACTIVOS EN PRODUCCIÓN ===========");
  console.table(resultado);
  for (const c of CURSOS_INTERACTIVOS) console.log(`  /aula/curso/${c.slug}`);
  console.log("Solo los roles de KG pueden abrirlos mientras estén en borrador.");
  console.log("======================================================================\n");
}

main()
  .catch((e) => {
    console.error(e instanceof Error ? e.message : e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
