import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser, audit, hashPassword } from "@/lib/auth";
import { ROLES } from "@/lib/constants";

const schema = z.object({
  companyId: z.string(),
  modo: z.enum(["individual", "masivo"]),
  trabajador: z.record(z.string()).optional(),
  csv: z.string().optional(),
});

const PERMITIDOS: string[] = [ROLES.ADMIN_EMPRESA, ROLES.SUPERADMIN, ROLES.ADMIN_KG];

export async function POST(req: Request) {
  const user = await requireUser();
  if (!PERMITIDOS.includes(user.role.code)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const parsed = schema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: "Datos invalidos" }, { status: 400 });
  const { companyId, modo } = parsed.data;

  // Un admin de empresa solo puede tocar SU empresa
  if (user.role.code === ROLES.ADMIN_EMPRESA && user.companyId !== companyId) {
    return NextResponse.json({ error: "No autorizado sobre esta empresa" }, { status: 403 });
  }

  const rolEstudiante = await prisma.role.findUnique({ where: { code: ROLES.ESTUDIANTE } });
  if (!rolEstudiante) return NextResponse.json({ error: "Roles no inicializados" }, { status: 500 });

  const passwordHash = await hashPassword("KgAcademy2026*");

  async function crear(t: {
    firstName: string;
    lastName: string;
    documentNumber: string;
    email: string;
    employeeCode?: string;
    areaId?: string;
    positionId?: string;
    locationId?: string;
  }) {
    const email = t.email.trim().toLowerCase();
    const yaExiste = await prisma.user.findFirst({
      where: { OR: [{ email }, ...(t.documentNumber ? [{ documentNumber: t.documentNumber }] : [])] },
    });
    if (yaExiste) {
      // Si existe pero no pertenece a la empresa, se vincula
      const vinculo = await prisma.companyMember.findUnique({
        where: { companyId_userId: { companyId, userId: yaExiste.id } },
      });
      if (vinculo) return { creado: false };
      await prisma.companyMember.create({
        data: {
          companyId,
          userId: yaExiste.id,
          areaId: t.areaId || null,
          positionId: t.positionId || null,
          locationId: t.locationId || null,
          employeeCode: t.employeeCode || null,
        },
      });
      await prisma.user.update({ where: { id: yaExiste.id }, data: { companyId } });
      return { creado: false, vinculado: true };
    }

    const nuevo = await prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName: t.firstName.trim(),
        lastName: t.lastName.trim(),
        documentType: "CC",
        documentNumber: t.documentNumber?.trim() || null,
        roleId: rolEstudiante!.id,
        companyId,
        status: "pendiente_activacion",
      },
    });
    await prisma.companyMember.create({
      data: {
        companyId,
        userId: nuevo.id,
        areaId: t.areaId || null,
        positionId: t.positionId || null,
        locationId: t.locationId || null,
        employeeCode: t.employeeCode || null,
      },
    });
    await prisma.notification.create({
      data: {
        userId: nuevo.id,
        title: "Bienvenido a KG Academy",
        message: "Su empresa creó su cuenta. Cambie su contraseña temporal al ingresar.",
        linkUrl: "/aula",
        type: "info",
      },
    });
    return { creado: true };
  }

  if (modo === "individual") {
    const t = parsed.data.trabajador;
    if (!t?.firstName || !t?.lastName || !t?.email) {
      return NextResponse.json({ error: "Faltan datos obligatorios" }, { status: 400 });
    }
    const r = await crear(t as never);
    if (!r.creado && !r.vinculado) {
      return NextResponse.json({ error: "Ese trabajador ya está registrado en la empresa" }, { status: 409 });
    }
    await audit({
      userId: user.id,
      actorEmail: user.email,
      action: "crear",
      entity: "company_members",
      entityId: companyId,
      summary: `Alta de trabajador ${t.email}`,
    });
    return NextResponse.json({ ok: true, creados: 1 });
  }

  // ---- Carga masiva ----
  const lineas = (parsed.data.csv ?? "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  let creados = 0;
  let omitidos = 0;
  for (const linea of lineas) {
    const [firstName, lastName, documentNumber, email, employeeCode] = linea
      .split(/[;,\t]/)
      .map((s) => s?.trim() ?? "");
    if (!firstName || !lastName || !email) {
      omitidos++;
      continue;
    }
    const r = await crear({ firstName, lastName, documentNumber, email, employeeCode });
    if (r.creado) creados++;
    else omitidos++;
  }

  await audit({
    userId: user.id,
    actorEmail: user.email,
    action: "crear",
    entity: "company_members",
    entityId: companyId,
    summary: `Carga masiva: ${creados} creados, ${omitidos} omitidos`,
  });

  return NextResponse.json({ ok: true, creados, omitidos });
}
