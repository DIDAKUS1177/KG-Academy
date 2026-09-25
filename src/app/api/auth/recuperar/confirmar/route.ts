import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { audit, hashPassword } from "@/lib/auth";
import { leerCuerpo, respuestaError, respuestaOk } from "@/lib/admin-api";
import { problemaClaveNueva } from "@/lib/claves";
import { comprobarCodigo } from "@/lib/recuperacion";

/** Paso 2 de la recuperación: con el código, define la contraseña nueva. */
const schema = z.object({
  email: z.string().trim().toLowerCase().email("Escriba un correo válido"),
  codigo: z.string().trim().regex(/^\d{6}$/, "El código tiene 6 dígitos"),
  nueva: z.string().min(1, "Escriba la contraseña nueva"),
});

const GENERICO = "Código incorrecto o vencido. Revise el correo o pida uno nuevo.";

export async function POST(req: Request) {
  const cuerpo = await leerCuerpo(req, schema);
  if (cuerpo.error) return cuerpo.error;
  const { email, codigo, nueva } = cuerpo.data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || user.status === "bloqueado" || user.status === "inactivo") return respuestaError(GENERICO);

  const r = await comprobarCodigo(user.id, codigo);
  if (!r.ok) {
    if (r.motivo === "bloqueado") return respuestaError("Demasiados intentos con ese código. Pida uno nuevo.");
    if (r.motivo === "incorrecto") return respuestaError(`Código incorrecto. Le quedan ${r.quedan} intentos.`);
    return respuestaError(GENERICO);
  }

  const problema = await problemaClaveNueva(nueva);
  if (problema) return respuestaError(problema);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: await hashPassword(nueva),
        // Definió una contraseña propia: una temporal pendiente ya no aplica.
        ...(user.status === "pendiente_activacion" ? { status: "activo" } : {}),
      },
    }),
    prisma.passwordResetToken.updateMany({ where: { userId: user.id, usedAt: null }, data: { usedAt: new Date() } }),
    prisma.notification.create({
      data: {
        userId: user.id,
        title: "Contraseña restablecida",
        message: "Su contraseña se cambió con un código enviado a su correo. Si no fue usted, avise a KG de inmediato.",
        linkUrl: "/aula/perfil",
        type: "alerta",
      },
    }),
  ]);
  await audit({
    userId: user.id,
    actorEmail: user.email,
    action: "editar",
    entity: "users",
    entityId: user.id,
    summary: "Contraseña restablecida con código enviado al correo",
  });

  return respuestaOk({ redirect: "/ingresar?clave=restablecida" });
}
