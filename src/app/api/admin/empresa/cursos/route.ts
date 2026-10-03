import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { audit } from "@/lib/auth";
import { ROLES_KG, exigirRol, leerCuerpo, respuestaError, respuestaOk } from "@/lib/admin-api";

/**
 * Cursos que ve una empresa (Administración → Empresas → Cursos visibles).
 *
 *   PUT { companyId, catalogo: "todos", courseIds }      todos los cursos generales publicados,
 *                                                        más los exclusivos de courseIds
 *   PUT { companyId, catalogo: "seleccion", courseIds }  solo esos cursos
 *
 * Ocultar un curso no le quita nada a quien ya lo tiene asignado o empezado:
 * solo deja de aparecer para asignarlo o empezarlo de nuevo.
 */
const schema = z.object({
  companyId: z.string().min(1),
  catalogo: z.enum(["todos", "seleccion"]),
  courseIds: z.array(z.string()).max(500).default([]),
});

export async function PUT(req: Request) {
  const auth = await exigirRol(ROLES_KG);
  if (auth.error) return auth.error;

  const cuerpo = await leerCuerpo(req, schema);
  if (cuerpo.error) return cuerpo.error;
  const { companyId, catalogo } = cuerpo.data;

  const empresa = await prisma.company.findUnique({
    where: { id: companyId },
    select: { id: true, legalName: true, tradeName: true, catalogo: true, cursosHabilitados: { select: { courseId: true } } },
  });
  if (!empresa) return respuestaError("Empresa no encontrada", 404);

  const pedidos = [...new Set(cuerpo.data.courseIds)];
  const cursos = pedidos.length
    ? await prisma.course.findMany({ where: { id: { in: pedidos } }, select: { id: true, visibilidad: true } })
    : [];
  if (cursos.length !== pedidos.length) return respuestaError("Alguno de los cursos no existe");
  // Con todo el catálogo, los generales ya están incluidos: solo se guardan los exclusivos.
  const ids = catalogo === "todos" ? cursos.filter((c) => c.visibilidad === "exclusivo").map((c) => c.id) : pedidos;

  try {
    await prisma.$transaction([
      prisma.company.update({ where: { id: companyId }, data: { catalogo } }),
      prisma.companyCourse.deleteMany({ where: { companyId } }),
      ...(ids.length ? [prisma.companyCourse.createMany({ data: ids.map((courseId) => ({ companyId, courseId })) })] : []),
    ]);
  } catch (e) {
    // Dos personas guardando la misma empresa al mismo tiempo.
    if ((e as { code?: string }).code === "P2002") return respuestaError("Alguien más acaba de cambiar esta empresa. Recargue e intente de nuevo.", 409);
    throw e;
  }

  await audit({
    userId: auth.user.id,
    actorEmail: auth.user.email,
    action: "editar",
    entity: "companies",
    entityId: companyId,
    summary:
      catalogo === "todos"
        ? `Catálogo de ${empresa.tradeName ?? empresa.legalName}: todos los cursos generales${ids.length ? ` y ${ids.length} exclusivo(s)` : ""}`
        : `Catálogo de ${empresa.tradeName ?? empresa.legalName}: ${ids.length} curso(s) habilitado(s)`,
    before: { catalogo: empresa.catalogo, cursos: empresa.cursosHabilitados.map((c) => c.courseId) },
    after: { catalogo, cursos: ids },
  });

  return respuestaOk();
}
