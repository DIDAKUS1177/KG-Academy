import { prisma } from "./prisma";
import { ROLES } from "./constants";

/** Empresa que el equipo de KG eligió ver en el panel empresarial (la fija /empresa/ver). */
export const COOKIE_EMPRESA = "kg_empresa";

/**
 * Resuelve la empresa sobre la que trabaja el panel empresarial.
 * Un usuario de empresa solo ve SU empresa (separación de información,
 * punto 17 del esqueleto). El equipo de KG ve la que eligió con "Abrir panel"
 * (se recuerda al navegar por el panel) o la que llegue en ?empresa=<id>.
 */
export async function resolveCompany(user: {
  companyId: string | null;
  role: { code: string };
}, override?: string) {
  const esStaff = ([ROLES.SUPERADMIN, ROLES.ADMIN_KG] as string[]).includes(user.role.code);
  if (!esStaff) return user.companyId ? prisma.company.findUnique({ where: { id: user.companyId } }) : null;
  // Import diferido: este módulo también lo usan scripts que corren fuera de Next.
  const elegida =
    override ?? (await import("next/headers").then(async (h) => (await h.cookies()).get(COOKIE_EMPRESA)?.value));
  const id = elegida ?? user.companyId;
  const empresa = id ? await prisma.company.findUnique({ where: { id } }) : null;
  return empresa ?? prisma.company.findFirst({ orderBy: { createdAt: "asc" } });
}

/**
 * Asignaciones vigentes de una empresa: las de personas que siguen vinculadas
 * (no retiradas). Es el mismo universo para el panel, el informe y los
 * indicadores, para que el cumplimiento no salga con dos cifras distintas.
 */
export const asignacionesVigentes = (companyId: string) => ({
  companyId,
  user: { memberships: { some: { companyId, status: { not: "retirado" } } } },
});

/**
 * Alcance de los reportes de una empresa: solo los pares (trabajador, curso)
 * que ella asignó. Una persona que también está en otra empresa, o que compró
 * un curso por su cuenta, no expone esos resultados a esta empresa.
 */
export async function alcanceEmpresa(companyId: string) {
  const asignaciones = await prisma.courseAssignment.findMany({
    where: { companyId },
    select: { userId: true, courseId: true },
  });
  const pares = new Set(asignaciones.map((a) => `${a.userId}|${a.courseId}`));
  return {
    userIds: [...new Set(asignaciones.map((a) => a.userId))],
    courseIds: [...new Set(asignaciones.map((a) => a.courseId))],
    incluye: (userId: string, courseId: string) => pares.has(`${userId}|${courseId}`),
  };
}

/**
 * Avance de cada persona solo en los cursos que la empresa le asignó: lo que
 * estudió por su cuenta o para otra empresa no entra en las cifras de esta.
 * Lo usan la lista de trabajadores, su ficha, el panel y los reportes por
 * área, sede y cargo.
 */
export async function avanceEnLaEmpresa(companyId: string) {
  const asignaciones = await prisma.courseAssignment.findMany({
    where: { companyId },
    select: { userId: true, status: true, enrollment: { select: { progress: true } } },
  });
  const porPersona = new Map<string, { asignados: number; completados: number; suma: number }>();
  for (const a of asignaciones) {
    const p = porPersona.get(a.userId) ?? { asignados: 0, completados: 0, suma: 0 };
    p.asignados++;
    if (a.status === "completado") p.completados++;
    p.suma += a.enrollment?.progress ?? 0;
    porPersona.set(a.userId, p);
  }
  return (userId: string) => {
    const p = porPersona.get(userId);
    return {
      asignados: p?.asignados ?? 0,
      completados: p?.completados ?? 0,
      /** Promedio de avance en lo asignado; null si no tiene cursos asignados. */
      avance: p ? p.suma / p.asignados : null,
    };
  };
}

/** Indicadores de cumplimiento de una empresa. */
export async function companyKpis(companyId: string) {
  const assignments = await prisma.courseAssignment.findMany({
    where: asignacionesVigentes(companyId),
    include: { enrollment: true },
  });

  const total = assignments.length;
  const completados = assignments.filter((a) => a.status === "completado").length;
  const enProgreso = assignments.filter((a) => a.status === "en_progreso").length;
  const noIniciados = assignments.filter((a) => a.status === "asignado").length;
  const hoy = new Date();
  const vencidos = assignments.filter(
    (a) => a.dueDate && new Date(a.dueDate) < hoy && a.status !== "completado"
  ).length;

  const avance =
    total > 0
      ? assignments.reduce((s, a) => s + (a.enrollment?.progress ?? 0), 0) / total
      : 0;

  const cumplimiento = total > 0 ? (completados / total) * 100 : 0;

  return { total, completados, enProgreso, noIniciados, vencidos, avance, cumplimiento };
}
