/**
 * RECUPERACIÓN DE CONTRASEÑA POR CÓDIGO
 *
 *  - Código de 6 dígitos, válido 15 minutos y de un solo uso.
 *  - Se guarda cifrado (HMAC con AUTH_SECRET): quien lea la base no lo ve.
 *  - Máximo 5 intentos por código y 3 códigos cada 15 minutos por cuenta.
 *  - Las respuestas no revelan si el correo existe.
 */
import { createHmac, randomInt, timingSafeEqual } from "node:crypto";
import { prisma } from "@/lib/prisma";

export const MINUTOS_VIGENCIA = 15;
export const MAX_INTENTOS = 5;
export const MAX_CODIGOS_VENTANA = 3;

function clave() {
  const s = process.env.AUTH_SECRET;
  if (!s && process.env.NODE_ENV === "production") throw new Error("Falta AUTH_SECRET");
  return s ?? "kg-academy-dev-secret-fallback";
}

export function huella(userId: string, codigo: string) {
  return createHmac("sha256", clave()).update(`recuperar:${userId}:${codigo}`).digest("hex");
}

export function nuevoCodigo() {
  return String(randomInt(0, 1_000_000)).padStart(6, "0");
}

/** Crea un código para la cuenta, o null si pidió demasiados seguidos. */
export async function emitirCodigo(userId: string) {
  const desde = new Date(Date.now() - MINUTOS_VIGENCIA * 60_000);
  const recientes = await prisma.passwordResetToken.count({ where: { userId, createdAt: { gte: desde } } });
  if (recientes >= MAX_CODIGOS_VENTANA) return null;

  // Un código nuevo anula los anteriores sin usar.
  await prisma.passwordResetToken.updateMany({
    where: { userId, usedAt: null },
    data: { usedAt: new Date(), expiresAt: new Date() },
  });
  const codigo = nuevoCodigo();
  const token = await prisma.passwordResetToken.create({
    data: { userId, token: huella(userId, codigo), expiresAt: new Date(Date.now() + MINUTOS_VIGENCIA * 60_000) },
  });
  return { codigo, tokenId: token.id };
}

/**
 * Comprueba el código contra el vigente de la cuenta. Cada fallo cuenta como
 * intento (queda en auditoría); al quinto, el código deja de servir.
 */
export async function comprobarCodigo(userId: string, codigo: string) {
  const vigente = await prisma.passwordResetToken.findFirst({
    where: { userId, usedAt: null, expiresAt: { gt: new Date() } },
    orderBy: { createdAt: "desc" },
  });
  if (!vigente) return { ok: false as const, motivo: "vencido" as const };

  const esperado = Buffer.from(vigente.token, "hex");
  const recibido = Buffer.from(huella(userId, codigo.trim()), "hex");
  const coincide = esperado.length === recibido.length && timingSafeEqual(esperado, recibido);
  if (coincide) return { ok: true as const, tokenId: vigente.id };

  await prisma.auditLog.create({
    data: { userId, action: "recuperar_fallido", entity: "password_reset_tokens", entityId: vigente.id, summary: "Código de recuperación incorrecto" },
  });
  const fallos = await prisma.auditLog.count({ where: { action: "recuperar_fallido", entityId: vigente.id } });
  if (fallos >= MAX_INTENTOS) {
    await prisma.passwordResetToken.update({ where: { id: vigente.id }, data: { usedAt: new Date() } });
    return { ok: false as const, motivo: "bloqueado" as const };
  }
  return { ok: false as const, motivo: "incorrecto" as const, quedan: MAX_INTENTOS - fallos };
}
