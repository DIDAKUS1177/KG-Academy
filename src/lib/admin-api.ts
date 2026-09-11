/**
 * Utilidades compartidas por las rutas API del panel de administración.
 *
 * Todas las rutas /api/admin/* siguen el mismo contrato:
 *   - exigen sesión y uno de los roles de KG,
 *   - validan el cuerpo con Zod y devuelven el primer mensaje legible,
 *   - registran la acción en audit_logs con el "antes" y el "después".
 *
 * Centralizar eso aquí evita que cada ruta repita el mismo bloque de veinte
 * líneas y que una olvide, por ejemplo, la auditoría.
 */
import { NextResponse } from "next/server";
import type { ZodSchema } from "zod";
import { requireUser } from "@/lib/auth";
import { ROLES } from "@/lib/constants";

/** Roles que administran la plataforma (no la empresa cliente). */
export const ROLES_KG: string[] = [ROLES.SUPERADMIN, ROLES.ADMIN_KG];

/** Roles que pueden editar la estructura y el contenido de los cursos. */
export const ROLES_CURSOS: string[] = [ROLES.SUPERADMIN, ROLES.ADMIN_KG, ROLES.INSTRUCTOR];

type Usuario = Awaited<ReturnType<typeof requireUser>>;

/**
 * Exige sesión con alguno de los roles indicados. Devuelve el usuario o la
 * respuesta 403 lista para retornar.
 */
export async function exigirRol(
  roles: string[]
): Promise<{ user: Usuario; error: null } | { user: null; error: NextResponse }> {
  const user = await requireUser();
  if (!roles.includes(user.role.code)) {
    return {
      user: null,
      error: NextResponse.json({ error: "No tiene permiso para esta acción" }, { status: 403 }),
    };
  }
  return { user, error: null };
}

/**
 * Lee y valida el cuerpo JSON. Si falla, devuelve el primer mensaje del
 * esquema, que en cada ruta está redactado para mostrarse tal cual al usuario.
 */
export async function leerCuerpo<T>(
  req: Request,
  schema: ZodSchema<T>
): Promise<{ data: T; error: null } | { data: null; error: NextResponse }> {
  const body = await req.json().catch(() => ({}));
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    const primero = parsed.error.issues[0];
    return {
      data: null,
      error: NextResponse.json(
        { error: primero?.message || "Datos inválidos" },
        { status: 400 }
      ),
    };
  }
  return { data: parsed.data, error: null };
}

export const respuestaError = (mensaje: string, status = 400) =>
  NextResponse.json({ error: mensaje }, { status });

export const respuestaOk = <T extends object>(extra?: T) =>
  NextResponse.json({ ok: true, ...(extra ?? {}) });

/** Deja `null` si el texto viene vacío; recorta espacios en lo demás. */
export const limpiar = (v?: string | null) => {
  const t = v?.trim();
  return t ? t : null;
};

/**
 * Contraseña temporal legible, para dictarla por teléfono o pegarla en un
 * mensaje: cuatro letras sin ambigüedad (sin O, I ni l) y cuatro cifras.
 * El usuario debe cambiarla al ingresar.
 */
export function claveTemporal() {
  const letras = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz";
  const bloque = (n: number) =>
    Array.from({ length: n }, () => letras[Math.floor(Math.random() * letras.length)]).join("");
  const numero = String(Math.floor(1000 + Math.random() * 9000));
  return `Kg-${bloque(4)}-${numero}`;
}
