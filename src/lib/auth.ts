import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { prisma } from "./prisma";
import { PERMISSION_MATRIX, ROLE_HOME } from "./constants";

const COOKIE = "kg_session";
const MAX_AGE_SEC = 60 * 60 * 8; // 8 horas
const secret = new TextEncoder().encode(
  process.env.AUTH_SECRET ?? "kg-academy-dev-secret-fallback"
);

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
    .setExpirationTime(expires)
    .sign(secret);

  const h = headers();
  await prisma.session.create({
    data: {
      userId: payload.sub,
      token: token.slice(-64),
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

export async function destroySession() {
  cookies().delete(COOKIE);
}

export async function getSession(): Promise<SessionPayload | null> {
  const raw = cookies().get(COOKIE)?.value;
  if (!raw) return null;
  try {
    const { payload } = await jwtVerify(raw, secret, { issuer: "kg-academy" });
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

/** Usuario completo de la sesión (con rol y empresa). */
export async function getCurrentUser() {
  const s = await getSession();
  if (!s) return null;
  return prisma.user.findUnique({
    where: { id: s.sub },
    include: { role: true, company: true },
  });
}

/** Exige sesión; si no hay, redirige a login. */
export async function requireUser() {
  const user = await getCurrentUser();
  if (!user || user.status === "bloqueado") redirect("/ingresar");
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
