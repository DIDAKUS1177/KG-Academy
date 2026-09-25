/**
 * ENVÍO DE CORREOS
 *
 * Funciona con cualquier proveedor que dé acceso SMTP (Gmail con contraseña de
 * aplicación, Brevo, Resend, Zoho, Outlook...). Se configura con variables de
 * entorno, nunca en el código:
 *
 *   SMTP_HOST, SMTP_PORT (465 o 587), SMTP_USER, SMTP_PASS
 *   CORREO_REMITENTE   p. ej. "KG Academy <notificaciones@kggestionintegral.com>"
 *
 * Sin configuración:
 *   - en desarrollo, cada correo se guarda como archivo en .correos-dev/ para
 *     poder probar la recuperación de contraseña sin enviar nada;
 *   - en producción, correoConfigurado() es false y la plataforma ofrece la
 *     recuperación manual (empresa o KG).
 */
import nodemailer from "nodemailer";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

export const CARPETA_CORREOS_DEV = ".correos-dev";

function datosSmtp() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null;
  const port = Number(SMTP_PORT) || 587;
  return { host: SMTP_HOST, port, secure: port === 465, auth: { user: SMTP_USER, pass: SMTP_PASS } };
}

/** Hay manera de entregar correos (proveedor real, o el buzón local en desarrollo). */
export function correoConfigurado() {
  return !!datosSmtp() || process.env.NODE_ENV !== "production";
}

export type Correo = { para: string; asunto: string; texto: string; html: string };

export async function enviarCorreo(c: Correo) {
  const smtp = datosSmtp();
  if (smtp) {
    const transporte = nodemailer.createTransport(smtp);
    await transporte.sendMail({
      from: process.env.CORREO_REMITENTE || smtp.auth.user,
      to: c.para,
      subject: c.asunto,
      text: c.texto,
      html: c.html,
    });
    return;
  }
  if (process.env.NODE_ENV === "production") throw new Error("No hay proveedor de correo configurado");

  // Buzón local de desarrollo: un archivo por correo, el más reciente al final.
  const carpeta = path.join(process.cwd(), CARPETA_CORREOS_DEV);
  await mkdir(carpeta, { recursive: true });
  const nombre = `${Date.now()}-${c.para.replace(/[^a-z0-9@._-]/gi, "_")}.json`;
  await writeFile(path.join(carpeta, nombre), JSON.stringify(c, null, 2), "utf8");
  console.log(`[correo de desarrollo] ${c.asunto} -> ${c.para} (guardado en ${CARPETA_CORREOS_DEV}/${nombre})`);
}

/** Plantilla sobria con la marca, compatible con los clientes de correo. */
export function plantillaCorreo({ titulo, parrafos, destacado, pie }: { titulo: string; parrafos: string[]; destacado?: string; pie?: string }) {
  const esc = (t: string) => t.replace(/[&<>"]/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[m]!);
  return `<!doctype html><html lang="es"><body style="margin:0;background:#f4f7fa;font-family:Arial,Helvetica,sans-serif;color:#0a2d4d">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:32px 12px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-radius:16px;overflow:hidden">
<tr><td style="background:#0a2d4d;padding:20px 28px;color:#ffffff;font-size:18px;font-weight:bold">KG <span style="color:#a5ce30">Academy</span></td></tr>
<tr><td style="padding:28px">
<h1 style="margin:0 0 16px;font-size:22px">${esc(titulo)}</h1>
${parrafos.map((p) => `<p style="margin:0 0 14px;font-size:15px;line-height:1.5;color:#35526b">${esc(p)}</p>`).join("")}
${destacado ? `<p style="margin:22px 0;text-align:center"><span style="display:inline-block;padding:14px 26px;border-radius:12px;background:#f1f7e1;font-size:32px;font-weight:bold;letter-spacing:8px;color:#0a2d4d">${esc(destacado)}</span></p>` : ""}
${pie ? `<p style="margin:18px 0 0;font-size:12px;line-height:1.5;color:#8a9bab">${esc(pie)}</p>` : ""}
</td></tr>
<tr><td style="padding:16px 28px;background:#f4f7fa;font-size:11px;color:#8a9bab">KG Gestión Integral S.A.S. · Este correo se envió automáticamente; no lo responda.</td></tr>
</table></td></tr></table></body></html>`;
}
