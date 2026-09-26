import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { audit, createSession, hashPassword, requireUser, revocarSesiones, verifyPassword } from "@/lib/auth";
import { leerCuerpo, respuestaError, respuestaOk } from "@/lib/admin-api";
import { ROLE_HOME } from "@/lib/constants";
import { problemaClaveNueva } from "@/lib/claves";

/**
 * Cambio de contraseña por el propio usuario, desde su perfil.
 *
 * Es la otra mitad de las contraseñas temporales: una cuenta creada por KG o
 * por la empresa nace en "pendiente_activacion" con una clave generada, y al
 * cambiarla aquí queda activa. Sin esta ruta, la temporal duraba para siempre.
 */

const schema = z.object({
  actual: z.string().min(1, "Escriba su contraseña actual"),
  nueva: z.string().min(1, "Escriba la contraseña nueva"),
});

export async function POST(req: Request) {
  // Es la única acción permitida a una cuenta con contraseña temporal.
  const user = await requireUser({ permitirPendiente: true });

  const cuerpo = await leerCuerpo(req, schema);
  if (cuerpo.error) return cuerpo.error;
  const { actual, nueva } = cuerpo.data;

  if (!(await verifyPassword(actual, user.passwordHash))) {
    return respuestaError("La contraseña actual no es correcta", 401);
  }

  const problema = await problemaClaveNueva(nueva, actual);
  if (problema) return respuestaError(problema);

  const activar = user.status === "pendiente_activacion";

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash: await hashPassword(nueva),
      ...(activar ? { status: "activo" } : {}),
    },
  });
  // Los enlaces de recuperación que quedaran pendientes ya no deben servir.
  await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } });
  // Cualquier otra sesión abierta con la contraseña anterior deja de servir;
  // este equipo sigue dentro con una sesión nueva.
  await revocarSesiones(user.id);
  await createSession({
    sub: user.id,
    email: user.email,
    role: user.role.code,
    companyId: user.companyId,
    name: `${user.firstName} ${user.lastName}`,
  });

  await audit({
    userId: user.id,
    actorEmail: user.email,
    action: "editar",
    entity: "users",
    entityId: user.id,
    summary: activar ? "Cambio de contraseña temporal; cuenta activada" : "Cambio de contraseña",
  });

  return respuestaOk({ activada: activar, destino: ROLE_HOME[user.role.code] ?? "/aula" });
}
