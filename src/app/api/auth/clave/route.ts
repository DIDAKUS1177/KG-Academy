import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { audit, hashPassword, requireUser, verifyPassword } from "@/lib/auth";
import { leerCuerpo, respuestaError, respuestaOk } from "@/lib/admin-api";

/**
 * Cambio de contraseña por el propio usuario, desde su perfil.
 *
 * Es la otra mitad de las contraseñas temporales: una cuenta creada por KG o
 * por la empresa nace en "pendiente_activacion" con una clave generada, y al
 * cambiarla aquí queda activa. Sin esta ruta, la temporal duraba para siempre.
 */

/** Contraseña de la demostración: nunca se acepta como definitiva. */
const CLAVE_DEMO = "KgAcademy2026*";

const schema = z.object({
  actual: z.string().min(1, "Escriba su contraseña actual"),
  nueva: z.string().min(1, "Escriba la contraseña nueva"),
});

export async function POST(req: Request) {
  const user = await requireUser();

  const cuerpo = await leerCuerpo(req, schema);
  if (cuerpo.error) return cuerpo.error;
  const { actual, nueva } = cuerpo.data;

  if (!(await verifyPassword(actual, user.passwordHash))) {
    return respuestaError("La contraseña actual no es correcta", 401);
  }

  // La longitud mínima la define el superadministrador en Configuración.
  const ajuste = await prisma.systemSetting.findUnique({ where: { key: "seguridad.min_password" } });
  const minimo = Math.max(8, Number(ajuste?.value) || 8);

  if (nueva.length < minimo) {
    return respuestaError(`La contraseña nueva debe tener al menos ${minimo} caracteres`);
  }
  if (nueva === actual) {
    return respuestaError("La contraseña nueva debe ser distinta de la actual");
  }
  if (nueva === CLAVE_DEMO) {
    return respuestaError("Esa contraseña es pública en la demostración; elija otra");
  }
  if (/^(\d)\1+$|^0?123456789|^12345678/.test(nueva)) {
    return respuestaError("Esa contraseña es demasiado fácil de adivinar; elija otra");
  }

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

  await audit({
    userId: user.id,
    actorEmail: user.email,
    action: "editar",
    entity: "users",
    entityId: user.id,
    summary: activar ? "Cambio de contraseña temporal; cuenta activada" : "Cambio de contraseña",
  });

  return respuestaOk({ activada: activar });
}
