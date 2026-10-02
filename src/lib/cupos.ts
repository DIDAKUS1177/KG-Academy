/**
 * Cupos de trabajadores de una empresa.
 *
 * El cupo lo contrata la empresa con su plan y lo fija KG en Administración →
 * Empresas (campo "Cupos" de la suscripción). Ocupa cupo cada trabajador (rol
 * estudiante) vinculado y no retirado. Supervisores y administradores de la
 * empresa no lo consumen. Sin una suscripción activa con cupos, la empresa no
 * puede dar de alta trabajadores: así nadie queda usando la plataforma fuera
 * de lo contratado.
 */
import { prisma } from "@/lib/prisma";
import { ROLES } from "@/lib/constants";

export type Cupos = { limite: number; usados: number; disponibles: number };

export async function cuposEmpresa(companyId: string): Promise<Cupos> {
  const ahora = new Date();
  const [suscripcion, usados] = await Promise.all([
    prisma.companySubscription.findFirst({
      where: { companyId, status: "activa", OR: [{ endsAt: null }, { endsAt: { gt: ahora } }] },
      orderBy: { startsAt: "desc" },
    }),
    prisma.companyMember.count({
      where: { companyId, status: { not: "retirado" }, user: { role: { code: ROLES.ESTUDIANTE } } },
    }),
  ]);
  const limite = suscripcion?.seats ?? 0;
  return { limite, usados, disponibles: Math.max(0, limite - usados) };
}

/** Mensaje para cuando la empresa no tiene cupo disponible. */
export function mensajeSinCupo(c: Cupos) {
  return c.limite === 0
    ? "Su empresa no tiene cupos activos. Comuníquese con KG para activar o renovar su plan."
    : `Su empresa ya usa sus ${c.limite} cupos de trabajadores. Para crear más, pídale a KG ampliar el plan o elimine cuentas que no se usen.`;
}
