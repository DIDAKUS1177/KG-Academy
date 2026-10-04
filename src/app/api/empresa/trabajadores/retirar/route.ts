import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { audit, revocarSesiones } from "@/lib/auth";
import { ROLES } from "@/lib/constants";
import { exigirRol, leerCuerpo, respuestaError, respuestaOk } from "@/lib/admin-api";

/**
 * Retirar a una persona de la empresa (renunció o terminó su contrato), sin
 * depender de KG:
 *
 *   - deja de ocupar cupo;
 *   - si no está activa en otra empresa, su cuenta queda inactiva y se cierran
 *     sus sesiones (no sigue usando los cursos del plan);
 *   - su avance, evaluaciones y certificados se conservan como evidencia, y
 *     los certificados se siguen verificando por su código.
 *
 * Si vuelve, la empresa la crea otra vez con su documento o correo y la cuenta
 * se reactiva con su historial.
 *
 * Solo trabajadores y supervisores de SU empresa.
 */
const schema = z.object({ userId: z.string().min(1), companyId: z.string().min(1) });
const PERMITIDOS: string[] = [ROLES.ADMIN_EMPRESA, ROLES.SUPERADMIN, ROLES.ADMIN_KG];
const RETIRABLES: string[] = [ROLES.ESTUDIANTE, ROLES.SUPERVISOR];

export async function POST(req: Request) {
  const auth = await exigirRol(PERMITIDOS);
  if (auth.error) return auth.error;
  const actor = auth.user;

  const cuerpo = await leerCuerpo(req, schema);
  if (cuerpo.error) return cuerpo.error;
  const { userId, companyId } = cuerpo.data;

  if (actor.role.code === ROLES.ADMIN_EMPRESA && actor.companyId !== companyId) {
    return respuestaError("No autorizado sobre esta empresa", 403);
  }

  const miembro = await prisma.companyMember.findUnique({
    where: { companyId_userId: { companyId, userId } },
    include: { user: { include: { role: true, memberships: true } } },
  });
  if (!miembro || miembro.status === "retirado") return respuestaError("Esa persona no está vinculada a la empresa", 404);
  if (!RETIRABLES.includes(miembro.user.role.code)) {
    return respuestaError("Solo se puede retirar a trabajadores y supervisores", 403);
  }

  const otra = miembro.user.memberships.find((m) => m.companyId !== companyId && m.status !== "retirado");
  await prisma.$transaction([
    prisma.companyMember.update({ where: { id: miembro.id }, data: { status: "retirado" } }),
    prisma.user.update({
      where: { id: userId },
      data: {
        // La empresa principal pasa a la otra donde sigue activa, o a ninguna.
        ...(miembro.user.companyId === companyId ? { companyId: otra?.companyId ?? null } : {}),
        // Una cuenta bloqueada por KG sigue bloqueada.
        ...(!otra && miembro.user.status !== "bloqueado" ? { status: "inactivo" } : {}),
      },
    }),
  ]);
  if (!otra) await revocarSesiones(userId);

  await audit({
    userId: actor.id,
    actorEmail: actor.email,
    action: "editar",
    entity: "company_members",
    entityId: miembro.id,
    summary: `${miembro.user.firstName} ${miembro.user.lastName} (${miembro.user.email}) retirado de la empresa${otra ? "" : "; cuenta inactiva"}`,
    before: { status: miembro.status, userStatus: miembro.user.status, companyId: miembro.user.companyId },
  });

  return respuestaOk();
}
