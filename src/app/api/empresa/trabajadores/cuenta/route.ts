import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { audit } from "@/lib/auth";
import { ROLES } from "@/lib/constants";
import { motivoParaConservar } from "@/lib/cuentas";
import { exigirRol, leerCuerpo, respuestaError, respuestaOk } from "@/lib/admin-api";

/**
 * El administrador de la empresa elimina la cuenta de un trabajador que creó
 * por error o que nunca empezó a estudiar.
 *
 * Solo trabajadores (rol estudiante) cuya empresa principal es la suya y que no
 * estén vinculados a otra empresa. Nunca supervisores, administradores ni
 * personal de KG. Con historial no se borra: KG la inactiva.
 */
const schema = z.object({ userId: z.string().min(1) });
const PERMITIDOS: string[] = [ROLES.ADMIN_EMPRESA, ROLES.SUPERADMIN, ROLES.ADMIN_KG];

export async function DELETE(req: Request) {
  const auth = await exigirRol(PERMITIDOS);
  if (auth.error) return auth.error;
  const actor = auth.user;

  const cuerpo = await leerCuerpo(req, schema);
  if (cuerpo.error) return cuerpo.error;

  const objetivo = await prisma.user.findUnique({
    where: { id: cuerpo.data.userId },
    include: { role: true, memberships: { select: { companyId: true } } },
  });
  if (!objetivo) return respuestaError("Trabajador no encontrado", 404);
  if (objetivo.role.code !== ROLES.ESTUDIANTE) {
    return respuestaError("La empresa solo puede eliminar cuentas de trabajadores", 403);
  }
  if (actor.role.code === ROLES.ADMIN_EMPRESA) {
    if (!actor.companyId || objetivo.companyId !== actor.companyId) {
      return respuestaError("Ese trabajador no pertenece a su empresa", 403);
    }
  }
  if (objetivo.memberships.some((m) => m.companyId !== objetivo.companyId)) {
    return respuestaError("El trabajador también está vinculado a otra empresa; KG debe gestionar su cuenta", 409);
  }

  const motivo = await motivoParaConservar(objetivo.id);
  if (motivo) {
    return respuestaError(`${motivo} Pídale a KG que la inactive.`, 409);
  }

  await prisma.user.delete({ where: { id: objetivo.id } });

  await audit({
    userId: actor.id,
    actorEmail: actor.email,
    action: "eliminar",
    entity: "users",
    entityId: objetivo.id,
    summary: `La empresa eliminó la cuenta de ${objetivo.email}`,
    before: { email: objetivo.email, companyId: objetivo.companyId, status: objetivo.status },
  });

  return respuestaOk();
}
