import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { audit } from "@/lib/auth";
import { ROLES_KG, exigirRol, leerCuerpo, limpiar, respuestaError, respuestaOk } from "@/lib/admin-api";

/**
 * Planes comerciales B2B.
 *
 *   POST  crea un plan.
 *   PATCH edita precio, cupos o lo activa/desactiva.
 *
 * Un plan con suscripciones no se borra: se desactiva y deja de ofrecerse.
 */

const campos = {
  name: z.string().trim().min(3, "Ingrese el nombre del plan"),
  description: z.string().optional(),
  maxUsers: z.coerce.number().int().min(1).nullable().optional(),
  maxCourses: z.coerce.number().int().min(1).nullable().optional(),
  pricePerMonth: z.coerce.number().int().min(0, "El valor no puede ser negativo").optional(),
  pricePerUser: z.coerce.number().int().min(0).optional(),
  /** Lista de beneficios, una por línea. */
  features: z.string().optional(),
};

const crearSchema = z.object({
  code: z
    .string()
    .trim()
    .min(3, "Ingrese el código del plan")
    .regex(/^[a-z0-9_]+$/, "El código solo admite minúsculas, números y guion bajo"),
  ...campos,
});

const editarSchema = z.object({
  planId: z.string().min(1),
  name: campos.name.optional(),
  description: campos.description,
  maxUsers: campos.maxUsers,
  maxCourses: campos.maxCourses,
  pricePerMonth: campos.pricePerMonth,
  pricePerUser: campos.pricePerUser,
  features: campos.features,
  isActive: z.boolean().optional(),
});

const aListaJson = (texto?: string) => {
  const items = (texto ?? "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  return items.length ? JSON.stringify(items) : null;
};

export async function POST(req: Request) {
  const auth = await exigirRol(ROLES_KG);
  if (auth.error) return auth.error;

  const cuerpo = await leerCuerpo(req, crearSchema);
  if (cuerpo.error) return cuerpo.error;
  const d = cuerpo.data;

  if (await prisma.plan.findUnique({ where: { code: d.code } })) {
    return respuestaError("Ya existe un plan con ese código", 409);
  }

  const plan = await prisma.plan.create({
    data: {
      code: d.code,
      name: d.name,
      description: limpiar(d.description),
      maxUsers: d.maxUsers ?? null,
      maxCourses: d.maxCourses ?? null,
      pricePerMonth: d.pricePerMonth ?? 0,
      pricePerUser: d.pricePerUser ?? 0,
      features: aListaJson(d.features),
    },
  });

  await audit({
    userId: auth.user.id,
    actorEmail: auth.user.email,
    action: "crear",
    entity: "plans",
    entityId: plan.id,
    summary: `Plan ${plan.name} creado`,
    after: { code: plan.code, pricePerMonth: plan.pricePerMonth, maxUsers: plan.maxUsers },
  });

  return respuestaOk({ planId: plan.id });
}

export async function PATCH(req: Request) {
  const auth = await exigirRol(ROLES_KG);
  if (auth.error) return auth.error;

  const cuerpo = await leerCuerpo(req, editarSchema);
  if (cuerpo.error) return cuerpo.error;
  const d = cuerpo.data;

  const before = await prisma.plan.findUnique({ where: { id: d.planId } });
  if (!before) return respuestaError("Plan no encontrado", 404);

  const after = await prisma.plan.update({
    where: { id: before.id },
    data: {
      ...(d.name ? { name: d.name } : {}),
      ...(d.description !== undefined ? { description: limpiar(d.description) } : {}),
      ...(d.maxUsers !== undefined ? { maxUsers: d.maxUsers } : {}),
      ...(d.maxCourses !== undefined ? { maxCourses: d.maxCourses } : {}),
      ...(d.pricePerMonth !== undefined ? { pricePerMonth: d.pricePerMonth } : {}),
      ...(d.pricePerUser !== undefined ? { pricePerUser: d.pricePerUser } : {}),
      ...(d.features !== undefined ? { features: aListaJson(d.features) } : {}),
      ...(d.isActive !== undefined ? { isActive: d.isActive } : {}),
    },
  });

  await audit({
    userId: auth.user.id,
    actorEmail: auth.user.email,
    action: "editar",
    entity: "plans",
    entityId: after.id,
    summary: `Plan ${after.name} editado`,
    before: { pricePerMonth: before.pricePerMonth, maxUsers: before.maxUsers, isActive: before.isActive },
    after: { pricePerMonth: after.pricePerMonth, maxUsers: after.maxUsers, isActive: after.isActive },
  });

  return respuestaOk();
}
