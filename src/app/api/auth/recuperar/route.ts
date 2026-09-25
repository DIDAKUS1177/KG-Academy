import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { audit } from "@/lib/auth";
import { leerCuerpo, respuestaError, respuestaOk } from "@/lib/admin-api";
import { correoConfigurado, enviarCorreo, plantillaCorreo } from "@/lib/correo";
import { emitirCodigo, MINUTOS_VIGENCIA } from "@/lib/recuperacion";

/**
 * Paso 1 de la recuperación: envía un código al correo registrado.
 *
 * La respuesta es la misma exista o no la cuenta, para no revelar quién está
 * registrado. Una cuenta bloqueada o inactiva no recibe código.
 */
const schema = z.object({ email: z.string().trim().toLowerCase().email("Escriba un correo válido") });

export async function POST(req: Request) {
  if (!correoConfigurado()) {
    return respuestaError("La recuperación por correo no está disponible todavía", 503);
  }
  const cuerpo = await leerCuerpo(req, schema);
  if (cuerpo.error) return cuerpo.error;
  const { email } = cuerpo.data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (user && user.status !== "bloqueado" && user.status !== "inactivo") {
    const emitido = await emitirCodigo(user.id);
    if (emitido) {
      try {
        await enviarCorreo({
          para: user.email,
          asunto: `${emitido.codigo} es su código de KG Academy`,
          texto: `Hola, ${user.firstName}. Su código para restablecer la contraseña de KG Academy es ${emitido.codigo}. Vence en ${MINUTOS_VIGENCIA} minutos. Si usted no lo pidió, ignore este correo: su contraseña no cambia.`,
          html: plantillaCorreo({
            titulo: "Restablezca su contraseña",
            parrafos: [`Hola, ${user.firstName}.`, `Este es su código para restablecer la contraseña de KG Academy. Vence en ${MINUTOS_VIGENCIA} minutos.`],
            destacado: emitido.codigo,
            pie: "Si usted no pidió este código, ignore este correo: su contraseña sigue igual. Nunca comparta este código con nadie, ni siquiera con KG.",
          }),
        });
        await audit({
          userId: user.id,
          actorEmail: user.email,
          action: "recuperar_solicitado",
          entity: "password_reset_tokens",
          entityId: emitido.tokenId,
          summary: "Código de recuperación enviado al correo",
        });
      } catch (e) {
        console.error("No se pudo enviar el código de recuperación:", e);
        return respuestaError("No pudimos enviar el correo en este momento. Intente de nuevo en unos minutos.", 502);
      }
    }
  }

  return respuestaOk({ mensaje: "Si el correo está registrado, le llegará un código en unos segundos." });
}
