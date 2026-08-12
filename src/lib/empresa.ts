import { prisma } from "./prisma";
import { ROLES } from "./constants";

/**
 * Resuelve la empresa sobre la que trabaja el panel B2B.
 * Un usuario de empresa solo ve SU empresa (separacion de informacion,
 * punto 17 del esqueleto). El staff KG puede pasar ?empresa=<id>.
 */
export async function resolveCompany(user: {
  companyId: string | null;
  role: { code: string };
}, override?: string) {
  const staff: string[] = [ROLES.SUPERADMIN, ROLES.ADMIN_KG];
  const id = staff.includes(user.role.code) ? override ?? user.companyId : user.companyId;
  if (!id) {
    const first = staff.includes(user.role.code)
      ? await prisma.company.findFirst({ orderBy: { createdAt: "asc" } })
      : null;
    return first;
  }
  return prisma.company.findUnique({ where: { id } });
}

/** Indicadores de cumplimiento de una empresa. */
export async function companyKpis(companyId: string) {
  const assignments = await prisma.courseAssignment.findMany({
    where: { companyId },
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
