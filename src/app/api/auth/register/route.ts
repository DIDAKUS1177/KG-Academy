import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { audit, createSession, hashPassword } from "@/lib/auth";
import { ROLES } from "@/lib/constants";

const schema = z.object({
  firstName: z.string().min(2, "Ingrese su nombre"),
  lastName: z.string().min(2, "Ingrese sus apellidos"),
  email: z.string().email("Correo invalido"),
  documentType: z.string().optional(),
  documentNumber: z.string().optional(),
  phone: z.string().optional(),
  companyNit: z.string().optional(),
  password: z.string().min(8, "La contrasena debe tener minimo 8 caracteres"),
  acceptedTerms: z.boolean().refine((v) => v, "Debe aceptar el tratamiento de datos"),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }
  const d = parsed.data;
  const email = d.email.trim().toLowerCase();

  if (await prisma.user.findUnique({ where: { email } })) {
    return NextResponse.json({ error: "Ya existe una cuenta con ese correo" }, { status: 409 });
  }
  if (d.documentNumber && (await prisma.user.findUnique({ where: { documentNumber: d.documentNumber } }))) {
    return NextResponse.json({ error: "Ya existe una cuenta con ese documento" }, { status: 409 });
  }

  const role = await prisma.role.findUnique({ where: { code: ROLES.ESTUDIANTE } });
  if (!role) return NextResponse.json({ error: "Roles no inicializados. Ejecute npm run db:seed" }, { status: 500 });

  // Si informa un NIT existente, se vincula automaticamente a esa empresa.
  const company = d.companyNit
    ? await prisma.company.findUnique({ where: { nit: d.companyNit.trim() } })
    : null;

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash: await hashPassword(d.password),
      firstName: d.firstName.trim(),
      lastName: d.lastName.trim(),
      documentType: d.documentType || null,
      documentNumber: d.documentNumber?.trim() || null,
      phone: d.phone?.trim() || null,
      roleId: role.id,
      companyId: company?.id ?? null,
      status: "activo",
      acceptedTerms: true,
      acceptedDataAt: new Date(),
    },
  });

  if (company) {
    await prisma.companyMember.create({ data: { companyId: company.id, userId: user.id } });
  }

  await prisma.notification.create({
    data: {
      userId: user.id,
      title: "Bienvenido a KG Academy",
      message:
        "Su cuenta fue creada correctamente. Explore el catalogo y comience su primer curso.",
      linkUrl: "/catalogo",
      type: "exito",
    },
  });

  await audit({
    userId: user.id,
    actorEmail: email,
    action: "crear",
    entity: "users",
    entityId: user.id,
    summary: "Registro de nuevo usuario B2C",
  });

  await createSession({
    sub: user.id,
    email: user.email,
    role: ROLES.ESTUDIANTE,
    companyId: user.companyId,
    name: `${user.firstName} ${user.lastName}`,
  });

  return NextResponse.json({ ok: true, redirect: "/aula" });
}
