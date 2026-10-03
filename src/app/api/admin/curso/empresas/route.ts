import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { audit } from "@/lib/auth";
import { ROLES_KG, exigirRol, leerCuerpo, respuestaError, respuestaOk } from "@/lib/admin-api";

/**
 * Para quién es un curso (Administración → Cursos → Constructor → Disponibilidad).
 *
 *   PUT { courseId, visibilidad: "general" | "exclusivo", companyIds }
 *
 * "general": lo ven todas las empresas con catálogo completo y el público;
 * companyIds son las empresas de catálogo restringido que además lo tienen.
 * "exclusivo": solo lo ven las empresas de companyIds (y el equipo de KG).
 */
const schema = z.object({
  courseId: z.string().min(1),
  visibilidad: z.enum(["general", "exclusivo"]),
  companyIds: z.array(z.string()).max(1000).default([]),
});

export async function PUT(req: Request) {
  const auth = await exigirRol(ROLES_KG);
  if (auth.error) return auth.error;

  const cuerpo = await leerCuerpo(req, schema);
  if (cuerpo.error) return cuerpo.error;
  const { courseId, visibilidad } = cuerpo.data;
  const ids = [...new Set(cuerpo.data.companyIds)];

  const curso = await prisma.course.findUnique({
    where: { id: courseId },
    select: { id: true, title: true, visibilidad: true, empresasHabilitadas: { select: { companyId: true } } },
  });
  if (!curso) return respuestaError("Curso no encontrado", 404);
  if (ids.length && (await prisma.company.count({ where: { id: { in: ids } } })) !== ids.length) {
    return respuestaError("Alguna de las empresas no existe");
  }

  try {
    await prisma.$transaction([
      prisma.course.update({ where: { id: courseId }, data: { visibilidad } }),
      prisma.companyCourse.deleteMany({ where: { courseId } }),
      ...(ids.length ? [prisma.companyCourse.createMany({ data: ids.map((companyId) => ({ companyId, courseId })) })] : []),
    ]);
  } catch (e) {
    if ((e as { code?: string }).code === "P2002") return respuestaError("Alguien más acaba de cambiar este curso. Recargue e intente de nuevo.", 409);
    throw e;
  }

  await audit({
    userId: auth.user.id,
    actorEmail: auth.user.email,
    action: "editar",
    entity: "courses",
    entityId: courseId,
    summary:
      visibilidad === "exclusivo"
        ? `"${curso.title}" exclusivo para ${ids.length} empresa(s)`
        : `"${curso.title}" general${ids.length ? `, habilitado además en ${ids.length} empresa(s) de catálogo restringido` : ""}`,
    before: { visibilidad: curso.visibilidad, empresas: curso.empresasHabilitadas.map((e) => e.companyId) },
    after: { visibilidad, empresas: ids },
  });

  return respuestaOk();
}
