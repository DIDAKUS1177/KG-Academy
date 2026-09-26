import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { audit, createSession, verifyPassword } from "@/lib/auth";
import { ROLE_HOME } from "@/lib/constants";

/**
 * Intentos fallidos permitidos por correo en la ventana; después se bloquea el
 * ingreso con ese correo hasta que la ventana pase. Frena la prueba de
 * contraseñas por fuerza bruta.
 */
const MAX_FALLOS = 8;
const VENTANA_MIN = 15;
/**
 * Hash de una contraseña aleatoria que no pertenece a nadie. Si el correo no
 * existe se compara contra él, para que la respuesta tarde lo mismo y no
 * delate qué correos están registrados.
 */
const HASH_FICTICIO = "$2a$10$eQifdQvX.Z/5cRLDkey/DOfAavxiuFNNsurFi5V0rXP5lz5eNBEqW";

const schema = z.object({
  email: z.string().email("Correo inválido"),
  password: z.string().min(1, "Ingrese su contraseña"),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const email = parsed.data.email.trim().toLowerCase();

  const fallos = await prisma.auditLog.count({
    where: { action: "login_fallido", actorEmail: email, createdAt: { gte: new Date(Date.now() - VENTANA_MIN * 60_000) } },
  });
  if (fallos >= MAX_FALLOS) {
    return NextResponse.json(
      { error: `Demasiados intentos fallidos. Espere ${VENTANA_MIN} minutos o recupere su contraseña.` },
      { status: 429 }
    );
  }

  const user = await prisma.user.findUnique({ where: { email }, include: { role: true } });
  const valida = await verifyPassword(parsed.data.password, user?.passwordHash ?? HASH_FICTICIO);

  if (!user || !valida) {
    await prisma.auditLog.create({
      data: { userId: user?.id ?? null, actorEmail: email, action: "login_fallido", entity: "users", entityId: user?.id ?? null, summary: "Intento de ingreso con contraseña incorrecta" },
    });
    return NextResponse.json({ error: "Correo o contraseña incorrectos" }, { status: 401 });
  }
  if (user.status === "bloqueado") {
    return NextResponse.json({ error: "Su cuenta está bloqueada. Contacte al administrador." }, { status: 403 });
  }
  if (user.status === "inactivo") {
    return NextResponse.json({ error: "Su cuenta está inactiva." }, { status: 403 });
  }

  await createSession({
    sub: user.id,
    email: user.email,
    role: user.role.code,
    companyId: user.companyId,
    name: `${user.firstName} ${user.lastName}`,
  });

  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date(), loginCount: { increment: 1 } },
  });

  await audit({
    userId: user.id,
    actorEmail: user.email,
    action: "login",
    entity: "users",
    entityId: user.id,
    summary: "Inicio de sesión",
  });

  // Con contraseña temporal, lo primero es cambiarla.
  const redirect =
    user.status === "pendiente_activacion"
      ? "/cambiar-clave"
      : ROLE_HOME[user.role.code] ?? "/aula";

  return NextResponse.json({ ok: true, redirect });
}
