import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { audit, hashPassword, revocarSesiones } from "@/lib/auth";
import { ROLES } from "@/lib/constants";
import { claveTemporal, exigirRol, leerCuerpo, respuestaError, respuestaOk } from "@/lib/admin-api";
import { problemaClaveNueva } from "@/lib/claves";

/**
 * El administrador de la empresa cambia la contraseña de uno de sus
 * trabajadores, sin depender de KG:
 *
 *   - sin "clave": se genera una temporal que se muestra una sola vez;
 *   - con "clave": queda la que la empresa escribió (con las mismas reglas que
 *     cualquier contraseña).
 *
 * Con pedirCambio (por defecto sí) la persona debe definir la suya al entrar.
 * Las sesiones abiertas se cierran en cualquier caso.
 *
 * Solo sobre trabajadores y supervisores de SU empresa: nunca sobre otro
 * administrador ni sobre personal de KG.
 */
const schema = z.object({
  userId: z.string().min(1),
  clave: z.string().max(200).optional(),
  pedirCambio: z.boolean().optional(),
});
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
      where: { companyId: actor.companyId ?? "", userId: objetivo.id, status: { not: "retirado" } },
    });
    if (!vinculo) return respuestaError("Ese trabajador no pertenece a su empresa", 403);
  }
  if (objetivo.status === "bloqueado" || objetivo.status === "inactivo") {
    return respuestaError("La cuenta está bloqueada o inactiva; KG debe reactivarla primero");
  }

  const elegida = cuerpo.data.clave?.trim() ? cuerpo.data.clave : null;
  if (elegida) {
    const problema = await problemaClaveNueva(elegida);
    if (problema) return respuestaError(problema);
  }
  const pedirCambio = cuerpo.data.pedirCambio ?? true;
  const temporal = elegida ? null : claveTemporal();
  await prisma.user.update({
    where: { id: objetivo.id },
    data: {
      passwordHash: await hashPassword(elegida ?? temporal!),
      // Una temporal siempre se cambia al entrar; una elegida, si la empresa lo pide.
      status: temporal || pedirCambio ? "pendiente_activacion" : "activo",
    },
  });
  await prisma.passwordResetToken.deleteMany({ where: { userId: objetivo.id } });
  await revocarSesiones(objetivo.id);
  await prisma.notification.create({
    data: {
      userId: objetivo.id,
      title: "Contraseña cambiada",
      message: temporal || pedirCambio
        ? "Su empresa cambió su contraseña. Ingrese con la que le entregaron; el sistema le pedirá definir una propia."
        : "Su empresa cambió su contraseña. Ingrese con la que le entregaron.",
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
    summary: `Contraseña ${elegida ? "asignada" : "restablecida"} por la empresa para ${objetivo.email}${!temporal && !pedirCambio ? " (sin pedir cambio)" : ""}`,
  });

  return respuestaOk({ claveTemporal: temporal, email: objetivo.email });
}
