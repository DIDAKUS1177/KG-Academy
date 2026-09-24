import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { audit } from "@/lib/auth";
import { slugify } from "@/lib/utils";
import { ROLES_CURSOS, exigirRol, leerCuerpo, limpiar, respuestaError, respuestaOk } from "@/lib/admin-api";

/**
 * Alta de cursos.
 *
 * Crea el curso en borrador con su primer módulo vacío, para que el
 * constructor tenga algo que mostrar. La categoría puede elegirse entre las
 * existentes o crearse en el mismo paso, que es lo normal cuando KG abre una
 * línea nueva de formación.
 */

const NIVELES = ["basico", "intermedio", "avanzado"] as const;
const MODALIDADES = ["virtual", "mixto", "presencial"] as const;

const schema = z.object({
  code: z
    .string()
    .trim()
    .min(3, "Ingrese el código del curso")
    .regex(/^[A-Z0-9-]+$/, "El código va en mayúsculas, números y guiones (ej. KG-PA-004)"),
  title: z.string().trim().min(5, "Ingrese el título del curso"),
  subtitle: z.string().optional(),
  categoryId: z.string().optional(),
  nuevaCategoria: z.string().optional(),
  level: z.enum(NIVELES).default("basico"),
  modality: z.enum(MODALIDADES).default("virtual"),
  durationHours: z.coerce.number().min(0, "Las horas no pueden ser negativas").default(0),
  instructorId: z.string().optional(),
  primerModulo: z.string().optional(),
});

export async function POST(req: Request) {
  const auth = await exigirRol(ROLES_CURSOS);
  if (auth.error) return auth.error;
  const actor = auth.user;

  const cuerpo = await leerCuerpo(req, schema);
  if (cuerpo.error) return cuerpo.error;
  const d = cuerpo.data;

  if (await prisma.course.findUnique({ where: { code: d.code } })) {
    return respuestaError("Ya existe un curso con ese código", 409);
  }

  // Slug único: si el título se repite, se numera.
  let slug = slugify(d.title);
  for (let n = 2; await prisma.course.findUnique({ where: { slug } }); n++) {
    slug = `${slugify(d.title)}-${n}`;
  }

  let categoryId = limpiar(d.categoryId);
  const nombreNueva = limpiar(d.nuevaCategoria);
  if (nombreNueva) {
    const slugCat = slugify(nombreNueva);
    const existente = await prisma.category.findUnique({ where: { slug: slugCat } });
    if (existente) {
      categoryId = existente.id;
    } else {
      const ultima = await prisma.category.findFirst({ orderBy: { order: "desc" } });
      const nueva = await prisma.category.create({
        data: { slug: slugCat, name: nombreNueva, order: (ultima?.order ?? 0) + 1 },
      });
      categoryId = nueva.id;
    }
  }
  if (!categoryId) return respuestaError("Elija una categoría o escriba una nueva");
  if (!(await prisma.category.findUnique({ where: { id: categoryId } }))) {
    return respuestaError("La categoría indicada no existe", 404);
  }

  const instructorId = limpiar(d.instructorId);
  if (instructorId && !(await prisma.user.findUnique({ where: { id: instructorId } }))) {
    return respuestaError("El instructor indicado no existe", 404);
  }

  const course = await prisma.course.create({
    data: {
      code: d.code,
      slug,
      title: d.title,
      subtitle: limpiar(d.subtitle),
      categoryId,
      instructorId,
      level: d.level,
      modality: d.modality,
      durationHours: d.durationHours,
      status: "borrador",
      accessType: "plan_empresarial",
      price: 0,
      modules: {
        create: {
          title: limpiar(d.primerModulo) ?? "Módulo 1",
          order: 1,
          isPublished: false,
        },
      },
    },
  });

  await audit({
    userId: actor.id,
    actorEmail: actor.email,
    action: "crear",
    entity: "courses",
    entityId: course.id,
    summary: `Curso ${course.code} "${course.title}" creado en borrador`,
    after: { code: course.code, slug: course.slug, categoryId },
  });

  return respuestaOk({ courseId: course.id });
}
