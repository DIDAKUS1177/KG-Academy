import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { audit, hashPassword } from "@/lib/auth";
import { ROLES } from "@/lib/constants";
import { claveTemporal, exigirRol, leerCuerpo, respuestaError, respuestaOk } from "@/lib/admin-api";

/**
 * El administrador de la empresa restablece la contraseña de uno de sus
 * trabajadores: se genera una temporal que se muestra una sola vez, y el
 * trabajador debe cambiarla al entrar. Es la vía de recuperación mientras la
 * plataforma no envía correos.
 *
 * Solo sobre trabajadores y supervisores de SU empresa: nunca sobre otro
 * administrador ni sobre personal de KG.
 */
const schema = z.object({ userId: z.string().min(1) });
const PERMITIDOS: string[] = [ROLES.ADMIN_EMPRESA, ROLES.SUPERADMIN, ROLES.ADMIN_KG];
const RESTABLECIBLES: string[] = [ROLES.ESTUDIANTE, ROLES.SUPERVISOR];

export async function POST(req: Request) {
  const auth = await exigirRol(PERMITIDOS);
  if (auth.error) return auth.error;
  const actor = auth.user;

  const cuerpo = await leerCuerpo(req, schema);
  if (cuerpo.error) return cuerpo.error;

  const objetivo = await prisma.user.findUnique({ where: { id: cuerpo.data.userId }, include: { role: true } });
  if (!objetivo) return respuestaError("Trabajador no encontrado", 404);
  if (!RESTABLECIBLES.includes(objetivo.role.code)) {
    return respuestaError("Solo se puede restablecer la contraseña de trabajadores y supervisores");
  }
  if (actor.role.code === ROLES.ADMIN_EMPRESA) {
    const vinculo = await prisma.companyMember.findFirst({
      where: { companyId: actor.companyId ?? "", userId: objetivo.id },
    });
    if (!vinculo) return respuestaError("Ese trabajador no pertenece a su empresa", 403);
  }
  if (objetivo.status === "bloqueado" || objetivo.status === "inactivo") {
    return respuestaError("La cuenta está bloqueada o inactiva; KG debe reactivarla primero");
  }

  const temporal = claveTemporal();
  await prisma.user.update({
    where: { id: objetivo.id },
    data: { passwordHash: await hashPassword(temporal), status: "pendiente_activacion" },
  });
  await prisma.passwordResetToken.deleteMany({ where: { userId: objetivo.id } });
  await prisma.notification.create({
    data: {
      userId: objetivo.id,
      title: "Contraseña restablecida",
      message: "Su empresa restableció su contraseña. Ingrese con la temporal que le entregaron y defina una nueva.",
      linkUrl: "/aula/perfil",
      type: "alerta",
    },
  });
  await audit({
    userId: actor.id,
    actorEmail: actor.email,
    action: "editar",
    entity: "users",
    entityId: objetivo.id,
    summary: `Contraseña restablecida por la empresa para ${objetivo.email}`,
  });

  return respuestaOk({ claveTemporal: temporal, email: objetivo.email });
}
