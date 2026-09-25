/**
 * Reglas para una contraseña nueva. Las comparten el cambio de contraseña
 * desde el perfil y la recuperación por código.
 */
import { prisma } from "@/lib/prisma";

/** Contraseña de la demostración: nunca se acepta como definitiva. */
const CLAVE_DEMO = "KgAcademy2026*";

/** Devuelve el motivo por el que no sirve, o null si es válida. */
export async function problemaClaveNueva(nueva: string, actual?: string): Promise<string | null> {
  // La longitud mínima la define el superadministrador en Configuración.
  const ajuste = await prisma.systemSetting.findUnique({ where: { key: "seguridad.min_password" } });
  const minimo = Math.max(8, Number(ajuste?.value) || 8);

  if (nueva.length < minimo) return `La contraseña nueva debe tener al menos ${minimo} caracteres`;
  if (nueva.length > 200) return "La contraseña es demasiado larga";
  if (actual !== undefined && nueva === actual) return "La contraseña nueva debe ser distinta de la actual";
  if (nueva === CLAVE_DEMO) return "Esa contraseña es pública en la demostración; elija otra";
  if (/^(\d)\1+$|^0?123456789|^12345678/.test(nueva)) return "Esa contraseña es demasiado fácil de adivinar; elija otra";
  return null;
}
