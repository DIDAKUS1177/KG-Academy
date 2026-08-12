import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { audit, createSession, verifyPassword } from "@/lib/auth";
import { ROLE_HOME } from "@/lib/constants";

const schema = z.object({
  email: z.string().email("Correo invalido"),
  password: z.string().min(1, "Ingrese su contrasena"),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const email = parsed.data.email.trim().toLowerCase();
  const user = await prisma.user.findUnique({ where: { email }, include: { role: true } });

  if (!user || !(await verifyPassword(parsed.data.password, user.passwordHash))) {
    return NextResponse.json({ error: "Correo o contrasena incorrectos" }, { status: 401 });
  }
  if (user.status === "bloqueado") {
    return NextResponse.json({ error: "Su cuenta esta bloqueada. Contacte al administrador." }, { status: 403 });
  }
  if (user.status === "inactivo") {
    return NextResponse.json({ error: "Su cuenta esta inactiva." }, { status: 403 });
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
    summary: "Inicio de sesion",
  });

  return NextResponse.json({ ok: true, redirect: ROLE_HOME[user.role.code] ?? "/aula" });
}
