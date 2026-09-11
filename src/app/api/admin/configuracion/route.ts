import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { audit } from "@/lib/auth";
import { ROLES } from "@/lib/constants";
import { exigirRol, leerCuerpo, respuestaError, respuestaOk } from "@/lib/admin-api";

/**
 * Parámetros del sistema (tabla system_settings).
 *
 * Solo el superadministrador los edita: aquí viven el firmante de los
 * certificados, la longitud mínima de contraseña y los datos de contacto que
 * se muestran en toda la plataforma.
 */

const schema = z.object({
  key: z.string().min(1),
  value: z.string().trim().min(1, "El valor no puede quedar vacío"),
});

export async function PATCH(req: Request) {
  const auth = await exigirRol([ROLES.SUPERADMIN]);
  if (auth.error) return auth.error;

  const cuerpo = await leerCuerpo(req, schema);
  if (cuerpo.error) return cuerpo.error;
  const d = cuerpo.data;

  const before = await prisma.systemSetting.findUnique({ where: { key: d.key } });
  if (!before) return respuestaError("El parámetro no existe", 404);

  // El tipo declarado en la fila decide qué se acepta.
  if (before.type === "number" && !/^-?\d+(\.\d+)?$/.test(d.value)) {
    return respuestaError("Este parámetro solo admite números");
  }
  if (before.type === "boolean" && !["true", "false"].includes(d.value)) {
    return respuestaError("Este parámetro solo admite verdadero o falso");
  }
  if (before.type === "json") {
    try {
      JSON.parse(d.value);
    } catch {
      return respuestaError("El valor no es un JSON válido");
    }
  }

  const after = await prisma.systemSetting.update({
    where: { key: d.key },
    data: { value: d.value },
  });

  await audit({
    userId: auth.user.id,
    actorEmail: auth.user.email,
    action: "editar",
    entity: "system_settings",
    entityId: after.id,
    summary: `Parámetro ${after.key} actualizado`,
    before: { value: before.value },
    after: { value: after.value },
  });

  return respuestaOk();
}
