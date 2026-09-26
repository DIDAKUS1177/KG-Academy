import { cache } from "react";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { prisma } from "./prisma";
import { PERMISSION_MATRIX, ROLE_HOME } from "./constants";

const COOKIE = "kg_session";
const MAX_AGE_SEC = 60 * 60 * 8; // 8 horas
/**
 * Clave con la que se firman las sesiones. En desarrollo hay una por defecto;
 * en producción es obligatoria: sin ella, cualquiera que lea este código
 * podría fabricar una sesión válida.
 */
function claveSesion() {
  const valor = process.env.AUTH_SECRET;
  if (!valor && process.env.NODE_ENV === "production") {
    throw new Error("Falta la variable AUTH_SECRET: no se pueden firmar sesiones en producción.");
  }
  return new TextEncoder().encode(valor ?? "kg-academy-dev-secret-fallback");
}

export type SessionPayload = {
  sub: string;
  email: string;
  role: string;
  companyId: string | null;
  name: string;
};

export async function hashPassword(plain: string) {
  return bcrypt.hash(plain, 10);
}

export async function verifyPassword(plain: string, hash: string) {
  return bcrypt.compare(plain, hash);
}

export async function createSession(payload: SessionPayload) {
  const expires = new Date(Date.now() + MAX_AGE_SEC * 1000);
  const token = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer("kg-academy")
    // Identificador único: dos ingresos en el mismo segundo daban el mismo
    // token y la base lo rechazaba (error 500 al iniciar sesión).
    .setJti(crypto.randomUUID())
    .setExpirationTime(expires)
    .sign(claveSesion());

  const h = headers();
  await prisma.session.create({
    data: {
      userId: payload.sub,
      token: huellaToken(token),
      expiresAt: expires,
      ipAddress: h.get("x-forwarded-for") ?? "local",
      userAgent: h.get("user-agent") ?? undefined,
    },
  });

  cookies().set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SEC,
  });
}

/** Huella con la que cada sesión queda registrada en la base. */
const huellaToken = (token: string) => token.slice(-64);

/** Cierra la sesión actual: se borra la cookie y también el registro en la base. */
export async function destroySession() {
  const raw = cookies().get(COOKIE)?.value;
  if (raw) await prisma.session.deleteMany({ where: { token: huellaToken(raw) } });
  cookies().delete(COOKIE);
}

/**
 * Anula todas las sesiones abiertas de una persona (por ejemplo, al cambiar o
 * restablecer su contraseña): en cualquier otro equipo tendrá que volver a
 * entrar.
 */
export async function revocarSesiones(userId: string) {
  await prisma.session.deleteMany({ where: { userId } });
}

/**
 * Sesión del pedido. Además de la firma, se exige que la sesión siga
 * registrada en la base: así cerrar sesión o cambiar la contraseña la anulan
 * de verdad, aunque alguien haya copiado la cookie. React `cache` evita
 * repetir la consulta dentro del mismo pedido.
 */
export const getSession = cache(async (): Promise<SessionPayload | null> => {
  const raw = cookies().get(COOKIE)?.value;
  if (!raw) return null;
  try {
    const { payload } = await jwtVerify(raw, claveSesion(), { issuer: "kg-academy" });
    const s = payload as unknown as SessionPayload;
    const registrada = await prisma.session.findUnique({ where: { token: huellaToken(raw) } });
    if (!registrada || registrada.userId !== s.sub || registrada.expiresAt < new Date()) return null;
    return s;
  } catch {
    return null;
  }
});

/** Usuario completo de la sesión (con rol y empresa). */
export const getCurrentUser = cache(async () => {
  const s = await getSession();
  if (!s) return null;
  return prisma.user.findUnique({
    where: { id: s.sub },
    include: { role: true, company: true },
  });
});

/**
 * Exige sesión; si no hay, redirige a login.
 *
 * Una cuenta con contraseña temporal ("pendiente_activacion") no puede usar
 * nada de la plataforma hasta cambiarla: toda página y toda acción la devuelve
 * a /cambiar-clave. Solo esa página y la ruta que guarda la nueva contraseña
 * la dejan pasar (permitirPendiente).
 */
export async function requireUser(opciones: { permitirPendiente?: boolean } = {}) {
  const user = await getCurrentUser();
  if (!user || user.status === "bloqueado" || user.status === "inactivo") redirect("/ingresar");
  if (user.status === "pendiente_activacion" && !opciones.permitirPendiente) redirect("/cambiar-clave");
  return user;
}

/** Exige que el usuario tenga alguno de los roles indicados. */
export async function requireRole(...roles: string[]) {
  const user = await requireUser();
  if (!roles.includes(user.role.code)) {
    redirect(ROLE_HOME[user.role.code] ?? "/aula");
  }
  return user;
}

export function can(roleCode: string, permission: string) {
  const perms = PERMISSION_MATRIX[roleCode] ?? [];
  return perms.includes("*") || perms.includes(permission);
}

/** Registro de auditoría (punto 17 del esqueleto). */
export async function audit(input: {
  userId?: string | null;
  actorEmail?: string | null;
  action: string;
  entity: string;
  entityId?: string | null;
  summary?: string;
  before?: unknown;
  after?: unknown;
}) {
  try {
    await prisma.auditLog.create({
      data: {
        userId: input.userId ?? undefined,
        actorEmail: input.actorEmail ?? undefined,
        action: input.action,
        entity: input.entity,
        entityId: input.entityId ?? undefined,
        summary: input.summary,
        beforeJson: input.before ? JSON.stringify(input.before) : undefined,
        afterJson: input.after ? JSON.stringify(input.after) : undefined,
      },
    });
  } catch {
    /* la auditoría nunca debe romper el flujo de negocio */
  }
}
