import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser, audit, hashPassword } from "@/lib/auth";
import { ROLES } from "@/lib/constants";
import { claveTemporal } from "@/lib/admin-api";

// Cada contraseña se cifra por separado; una nómina grande tarda. 60 s es el
// máximo del plan gratuito de Vercel y alcanza para el tope de filas de abajo.
export const maxDuration = 60;

/** Filas por carga masiva. Con más, se divide la nómina en varias cargas. */
const MAX_FILAS = 200;

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

  // Antes todos los trabajadores nacían con la misma clave fija, que además
  // estaba publicada en la pantalla de ingreso: cualquiera podía entrar como
  // cualquier trabajador sabiendo su correo. Ahora cada uno recibe la suya.
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

    // Área, cargo y sede tienen que ser de esta misma empresa.
    const [area, cargo, sede] = await Promise.all([
      t.areaId ? prisma.area.findFirst({ where: { id: t.areaId, companyId } }) : null,
      t.positionId ? prisma.position.findFirst({ where: { id: t.positionId, companyId } }) : null,
      t.locationId ? prisma.companyLocation.findFirst({ where: { id: t.locationId, companyId } }) : null,
    ]);
    if ((t.areaId && !area) || (t.positionId && !cargo) || (t.locationId && !sede)) {
      return { creado: false, conflicto: "El área, el cargo o la sede no pertenecen a la empresa" };
    }

    const yaExiste = await prisma.user.findFirst({
      where: { OR: [{ email }, ...(t.documentNumber ? [{ documentNumber: t.documentNumber }] : [])] },
      include: { role: true },
    });
    if (yaExiste) {
      const vinculo = await prisma.companyMember.findUnique({
        where: { companyId_userId: { companyId, userId: yaExiste.id } },
      });
      if (vinculo) return { creado: false };
      // Solo se vincula a un estudiante independiente. Una cuenta de otra
      // empresa o del equipo de KG no se puede "traer": se la quitaría a quien
      // corresponde.
      if (yaExiste.role.code !== ROLES.ESTUDIANTE || yaExiste.companyId) {
        return { creado: false, conflicto: "Ese correo o documento ya pertenece a otra cuenta. Si es el mismo trabajador, pídale a KG que lo traslade." };
      }
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

    const clave = claveTemporal();
    const nuevo = await prisma.user.create({
      data: {
        email,
        passwordHash: await hashPassword(clave),
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
        message: "Su empresa creó su cuenta. Ingrese con la contraseña temporal que le entregaron; el sistema le pedirá cambiarla.",
        linkUrl: "/aula",
        type: "info",
      },
    });
    return { creado: true, email, clave };
  }

  if (modo === "individual") {
    const t = parsed.data.trabajador;
    if (!t?.firstName || !t?.lastName || !t?.email) {
      return NextResponse.json({ error: "Faltan datos obligatorios" }, { status: 400 });
    }
    const r = await crear(t as never);
    if ("conflicto" in r && r.conflicto) {
      return NextResponse.json({ error: r.conflicto }, { status: 409 });
    }
    if (!r.creado && !r.vinculado) {
      return NextResponse.json({ error: "Ese trabajador ya está registrado en la empresa" }, { status: 409 });
    }
    const credenciales = r.creado ? [{ email: r.email!, clave: r.clave! }] : [];
    await audit({
      userId: user.id,
      actorEmail: user.email,
      action: "crear",
      entity: "company_members",
      entityId: companyId,
      summary: `Alta de trabajador ${t.email}`,
    });
    return NextResponse.json({
      ok: true,
      creados: r.creado ? 1 : 0,
      vinculado: !!r.vinculado,
      credenciales,
    });
  }

  // ---- Carga masiva ----
  const lineas = (parsed.data.csv ?? "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  if (lineas.length > MAX_FILAS) {
    return NextResponse.json(
      { error: `Máximo ${MAX_FILAS} trabajadores por carga. Divida el listado en varias partes.` },
      { status: 400 }
    );
  }

  let creados = 0;
  let omitidos = 0;
  const credenciales: { email: string; clave: string }[] = [];
  for (const linea of lineas) {
    const [firstName, lastName, documentNumber, email, employeeCode] = linea
      .split(/[;,\t]/)
      .map((s) => s?.trim() ?? "");
    if (!firstName || !lastName || !email) {
      omitidos++;
      continue;
    }
    const r = await crear({ firstName, lastName, documentNumber, email, employeeCode });
    if (r.creado) {
      creados++;
      credenciales.push({ email: r.email!, clave: r.clave! });
    } else omitidos++;
  }

  await audit({
    userId: user.id,
    actorEmail: user.email,
    action: "crear",
    entity: "company_members",
    entityId: companyId,
    summary: `Carga masiva: ${creados} creados, ${omitidos} omitidos`,
  });

  return NextResponse.json({ ok: true, creados, omitidos, credenciales });
}
