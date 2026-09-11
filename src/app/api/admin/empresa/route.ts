import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { audit, hashPassword } from "@/lib/auth";
import { ROLES } from "@/lib/constants";
import {
  ROLES_KG,
  claveTemporal,
  exigirRol,
  leerCuerpo,
  limpiar,
  respuestaError,
  respuestaOk,
} from "@/lib/admin-api";

/**
 * Empresas cliente (B2B).
 *
 *   POST  crea la empresa, le asigna un plan y, si se pide, crea de una vez la
 *         cuenta del administrador de esa empresa.
 *   PATCH edita los datos, cambia el estado o cambia el plan vigente.
 *
 * Una empresa no se borra: sus asignaciones y certificados son historial. Se
 * pasa a "inactiva" y desaparece de la operación diaria.
 */

const ESTADOS_EMPRESA = ["activa", "suspendida", "inactiva"] as const;
const NIVELES_RIESGO = ["I", "II", "III", "IV", "V"] as const;

const base = {
  legalName: z.string().trim().min(3, "Ingrese la razón social"),
  tradeName: z.string().optional(),
  economicSector: z.string().optional(),
  arl: z.string().optional(),
  riskLevel: z.enum(NIVELES_RIESGO).optional().or(z.literal("")),
  contactName: z.string().optional(),
  contactEmail: z.string().trim().email("El correo de contacto no es válido").optional().or(z.literal("")),
  contactPhone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
};

const crearSchema = z.object({
  nit: z.string().trim().min(5, "Ingrese el NIT"),
  ...base,
  planCode: z.string().optional(),
  seats: z.coerce.number().int().min(0).optional(),
  /** Cuenta del administrador de la empresa, opcional. */
  admin: z
    .object({
      firstName: z.string().trim().min(2, "Ingrese el nombre del administrador"),
      lastName: z.string().trim().min(2, "Ingrese los apellidos del administrador"),
      email: z.string().trim().email("El correo del administrador no es válido"),
    })
    .optional(),
});

const editarSchema = z.object({
  companyId: z.string().min(1),
  nit: z.string().trim().min(5, "Ingrese el NIT").optional(),
  legalName: base.legalName.optional(),
  tradeName: base.tradeName,
  economicSector: base.economicSector,
  arl: base.arl,
  riskLevel: base.riskLevel,
  contactName: base.contactName,
  contactEmail: base.contactEmail,
  contactPhone: base.contactPhone,
  address: base.address,
  city: base.city,
  status: z.enum(ESTADOS_EMPRESA).optional(),
  planCode: z.string().optional(),
  seats: z.coerce.number().int().min(0).optional(),
});

/** Cierra la suscripción vigente y abre una nueva con el plan indicado. */
async function cambiarPlan(companyId: string, planCode: string, seats?: number) {
  const plan = await prisma.plan.findUnique({ where: { code: planCode } });
  if (!plan) return "El plan indicado no existe";

  const vigente = await prisma.companySubscription.findFirst({
    where: { companyId, status: "activa" },
    orderBy: { startsAt: "desc" },
  });
  if (vigente?.planId === plan.id && (seats === undefined || vigente.seats === seats)) return null;

  if (vigente) {
    await prisma.companySubscription.update({
      where: { id: vigente.id },
      data: { status: "cancelada", endsAt: new Date() },
    });
  }
  await prisma.companySubscription.create({
    data: {
      companyId,
      planId: plan.id,
      seats: seats ?? plan.maxUsers ?? 0,
      status: "activa",
    },
  });
  return null;
}

export async function POST(req: Request) {
  const auth = await exigirRol(ROLES_KG);
  if (auth.error) return auth.error;
  const actor = auth.user;

  const cuerpo = await leerCuerpo(req, crearSchema);
  if (cuerpo.error) return cuerpo.error;
  const d = cuerpo.data;

  if (await prisma.company.findUnique({ where: { nit: d.nit } })) {
    return respuestaError("Ya existe una empresa con ese NIT", 409);
  }
  if (d.admin) {
    const email = d.admin.email.toLowerCase();
    if (await prisma.user.findUnique({ where: { email } })) {
      return respuestaError("Ya existe una cuenta con el correo del administrador", 409);
    }
  }

  const company = await prisma.company.create({
    data: {
      nit: d.nit,
      legalName: d.legalName,
      tradeName: limpiar(d.tradeName) ?? d.legalName,
      economicSector: limpiar(d.economicSector),
      arl: limpiar(d.arl),
      riskLevel: limpiar(d.riskLevel),
      contactName: limpiar(d.contactName),
      contactEmail: limpiar(d.contactEmail)?.toLowerCase() ?? null,
      contactPhone: limpiar(d.contactPhone),
      address: limpiar(d.address),
      city: limpiar(d.city),
      status: "activa",
    },
  });

  if (d.planCode) {
    const error = await cambiarPlan(company.id, d.planCode, d.seats);
    if (error) return respuestaError(error, 404);
  }

  let claveAdmin: string | null = null;
  if (d.admin) {
    const rol = await prisma.role.findUnique({ where: { code: ROLES.ADMIN_EMPRESA } });
    if (!rol) return respuestaError("Roles no inicializados", 500);
    claveAdmin = claveTemporal();
    const admin = await prisma.user.create({
      data: {
        email: d.admin.email.toLowerCase(),
        passwordHash: await hashPassword(claveAdmin),
        firstName: d.admin.firstName,
        lastName: d.admin.lastName,
        roleId: rol.id,
        companyId: company.id,
        status: "pendiente_activacion",
      },
    });
    await prisma.companyMember.create({ data: { companyId: company.id, userId: admin.id } });
    await prisma.notification.create({
      data: {
        userId: admin.id,
        title: "Bienvenido a KG Academy",
        message: `KG creó su cuenta como administrador de ${company.tradeName}. Cambie su contraseña temporal al ingresar.`,
        linkUrl: "/empresa",
        type: "info",
      },
    });
  }

  await audit({
    userId: actor.id,
    actorEmail: actor.email,
    action: "crear",
    entity: "companies",
    entityId: company.id,
    summary: `Empresa ${company.tradeName} (NIT ${company.nit}) creada`,
    after: { nit: company.nit, legalName: company.legalName, planCode: d.planCode ?? null },
  });

  return respuestaOk({ companyId: company.id, claveAdmin });
}

export async function PATCH(req: Request) {
  const auth = await exigirRol(ROLES_KG);
  if (auth.error) return auth.error;
  const actor = auth.user;

  const cuerpo = await leerCuerpo(req, editarSchema);
  if (cuerpo.error) return cuerpo.error;
  const d = cuerpo.data;

  const before = await prisma.company.findUnique({ where: { id: d.companyId } });
  if (!before) return respuestaError("Empresa no encontrada", 404);

  if (d.nit && d.nit !== before.nit) {
    if (await prisma.company.findUnique({ where: { nit: d.nit } })) {
      return respuestaError("Ya existe otra empresa con ese NIT", 409);
    }
  }

  const after = await prisma.company.update({
    where: { id: before.id },
    data: {
      ...(d.nit ? { nit: d.nit } : {}),
      ...(d.legalName ? { legalName: d.legalName } : {}),
      ...(d.tradeName !== undefined ? { tradeName: limpiar(d.tradeName) ?? before.legalName } : {}),
      ...(d.economicSector !== undefined ? { economicSector: limpiar(d.economicSector) } : {}),
      ...(d.arl !== undefined ? { arl: limpiar(d.arl) } : {}),
      ...(d.riskLevel !== undefined ? { riskLevel: limpiar(d.riskLevel) } : {}),
      ...(d.contactName !== undefined ? { contactName: limpiar(d.contactName) } : {}),
      ...(d.contactEmail !== undefined
        ? { contactEmail: limpiar(d.contactEmail)?.toLowerCase() ?? null }
        : {}),
      ...(d.contactPhone !== undefined ? { contactPhone: limpiar(d.contactPhone) } : {}),
      ...(d.address !== undefined ? { address: limpiar(d.address) } : {}),
      ...(d.city !== undefined ? { city: limpiar(d.city) } : {}),
      ...(d.status ? { status: d.status } : {}),
    },
  });

  if (d.planCode) {
    const error = await cambiarPlan(after.id, d.planCode, d.seats);
    if (error) return respuestaError(error, 404);
  }

  // Al suspender o inactivar la empresa, sus cuentas dejan de poder entrar;
  // al reactivarla, vuelven. Los estudiantes conservan su historial intacto.
  if (d.status && d.status !== before.status) {
    await prisma.user.updateMany({
      where: { companyId: after.id, role: { code: { not: ROLES.SUPERADMIN } } },
      data: { status: d.status === "activa" ? "activo" : "inactivo" },
    });
  }

  await audit({
    userId: actor.id,
    actorEmail: actor.email,
    action: "editar",
    entity: "companies",
    entityId: after.id,
    summary: `Empresa ${after.tradeName} editada`,
    before: { nit: before.nit, status: before.status },
    after: { nit: after.nit, status: after.status, planCode: d.planCode ?? undefined },
  });

  return respuestaOk();
}
