import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { audit, hashPassword, revocarSesiones } from "@/lib/auth";
import { ROLES, USER_STATUS } from "@/lib/constants";
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
 * Gestión de cuentas desde el panel de KG.
 *
 *   POST  crea un usuario con cualquier rol y, si aplica, lo vincula a una empresa.
 *   PATCH edita datos, rol, empresa o estado; o restablece la contraseña.
 *
 * No hay DELETE a propósito: un usuario con matrículas, intentos o certificados
 * es evidencia ante la ARL y no se borra, se inactiva o se bloquea.
 */

const CODIGOS_ROL = Object.values(ROLES) as [string, ...string[]];
const ROLES_DE_EMPRESA: string[] = [ROLES.ADMIN_EMPRESA, ROLES.SUPERVISOR, ROLES.ESTUDIANTE];

const crearSchema = z.object({
  firstName: z.string().trim().min(2, "Ingrese el nombre"),
  lastName: z.string().trim().min(2, "Ingrese los apellidos"),
  email: z.string().trim().email("El correo no es válido"),
  roleCode: z.enum(CODIGOS_ROL, { errorMap: () => ({ message: "Elija un rol válido" }) }),
  companyId: z.string().optional(),
  documentType: z.string().optional(),
  documentNumber: z.string().optional(),
  phone: z.string().optional(),
  jobTitle: z.string().optional(),
  city: z.string().optional(),
  /** Si no viene, se genera una temporal y la cuenta queda pendiente de activación. */
  password: z.string().min(8, "La contraseña debe tener mínimo 8 caracteres").optional(),
});

const editarSchema = z.object({
  userId: z.string().min(1),
  accion: z.enum(["editar", "restablecer_clave"]).default("editar"),
  firstName: z.string().trim().min(2, "Ingrese el nombre").optional(),
  lastName: z.string().trim().min(2, "Ingrese los apellidos").optional(),
  email: z.string().trim().email("El correo no es válido").optional(),
  roleCode: z.enum(CODIGOS_ROL).optional(),
  companyId: z.string().nullable().optional(),
  documentType: z.string().nullable().optional(),
  documentNumber: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  jobTitle: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  status: z.enum(USER_STATUS).optional(),
});

/** Solo un superadministrador puede crear o tocar a otro superadministrador. */
function puedeTocarSuperadmin(actorRole: string) {
  return actorRole === ROLES.SUPERADMIN;
}

export async function POST(req: Request) {
  const auth = await exigirRol(ROLES_KG);
  if (auth.error) return auth.error;
  const actor = auth.user;

  const cuerpo = await leerCuerpo(req, crearSchema);
  if (cuerpo.error) return cuerpo.error;
  const d = cuerpo.data;

  if (d.roleCode === ROLES.SUPERADMIN && !puedeTocarSuperadmin(actor.role.code)) {
    return respuestaError("Solo un superadministrador puede crear otro superadministrador", 403);
  }

  const email = d.email.toLowerCase();
  if (await prisma.user.findUnique({ where: { email } })) {
    return respuestaError("Ya existe una cuenta con ese correo", 409);
  }
  const documento = limpiar(d.documentNumber);
  if (documento && (await prisma.user.findUnique({ where: { documentNumber: documento } }))) {
    return respuestaError("Ya existe una cuenta con ese documento", 409);
  }

  const role = await prisma.role.findUnique({ where: { code: d.roleCode } });
  if (!role) return respuestaError("El rol no existe en la base de datos", 500);

  const companyId = limpiar(d.companyId);
  if (companyId && !(await prisma.company.findUnique({ where: { id: companyId } }))) {
    return respuestaError("La empresa indicada no existe", 404);
  }
  if (ROLES_DE_EMPRESA.includes(d.roleCode) && !companyId && d.roleCode !== ROLES.ESTUDIANTE) {
    return respuestaError("Un administrador o supervisor de empresa necesita una empresa asignada");
  }

  const temporal = d.password ? null : claveTemporal();
  const passwordHash = await hashPassword(d.password ?? temporal!);

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      firstName: d.firstName,
      lastName: d.lastName,
      documentType: limpiar(d.documentType) ?? (documento ? "CC" : null),
      documentNumber: documento,
      phone: limpiar(d.phone),
      jobTitle: limpiar(d.jobTitle),
      city: limpiar(d.city),
      roleId: role.id,
      companyId,
      // Con contraseña definida por el administrador la cuenta entra activa;
      // con temporal, queda pendiente hasta que el usuario la cambie.
      status: temporal ? "pendiente_activacion" : "activo",
      emailVerified: false,
      acceptedTerms: false,
    },
  });

  if (companyId) {
    await prisma.companyMember.create({
      data: { companyId, userId: user.id, isSupervisor: d.roleCode === ROLES.SUPERVISOR },
    });
  }

  await prisma.notification.create({
    data: {
      userId: user.id,
      title: "Bienvenido a KG Academy",
      message: temporal
        ? "KG creó su cuenta. Cambie su contraseña temporal al ingresar."
        : "KG creó su cuenta. Ya puede ingresar con la contraseña asignada.",
      linkUrl: "/aula",
      type: "info",
    },
  });

  await audit({
    userId: actor.id,
    actorEmail: actor.email,
    action: "crear",
    entity: "users",
    entityId: user.id,
    summary: `Cuenta ${email} creada con rol ${d.roleCode}`,
    after: { email, roleCode: d.roleCode, companyId, status: user.status },
  });

  return respuestaOk({ userId: user.id, claveTemporal: temporal });
}

export async function PATCH(req: Request) {
  const auth = await exigirRol(ROLES_KG);
  if (auth.error) return auth.error;
  const actor = auth.user;

  const cuerpo = await leerCuerpo(req, editarSchema);
  if (cuerpo.error) return cuerpo.error;
  const d = cuerpo.data;

  const before = await prisma.user.findUnique({
    where: { id: d.userId },
    include: { role: true },
  });
  if (!before) return respuestaError("Usuario no encontrado", 404);

  if (before.role.code === ROLES.SUPERADMIN && !puedeTocarSuperadmin(actor.role.code)) {
    return respuestaError("Solo un superadministrador puede modificar a otro superadministrador", 403);
  }

  /* ---------------- Restablecer contraseña ---------------- */
  if (d.accion === "restablecer_clave") {
    const temporal = claveTemporal();
    await prisma.user.update({
      where: { id: before.id },
      // Una contraseña temporal obliga a definir una propia al siguiente ingreso.
      data: {
        passwordHash: await hashPassword(temporal),
        ...(before.status === "activo" ? { status: "pendiente_activacion" } : {}),
      },
    });
    // Se invalidan los enlaces de recuperación pendientes: ya no hacen falta.
    await prisma.passwordResetToken.deleteMany({ where: { userId: before.id } });
    await revocarSesiones(before.id);
    await prisma.notification.create({
      data: {
        userId: before.id,
        title: "Contraseña restablecida",
        message: "KG restableció su contraseña. Ingrese con la temporal que le entregaron y cámbiela.",
        linkUrl: "/aula/perfil",
        type: "alerta",
      },
    });
    await audit({
      userId: actor.id,
      actorEmail: actor.email,
      action: "editar",
      entity: "users",
      entityId: before.id,
      summary: `Contraseña restablecida para ${before.email}`,
    });
    return respuestaOk({ claveTemporal: temporal });
  }

  /* ---------------- Edición de datos ---------------- */

  // Nadie se cambia su propio rol ni se desactiva a sí mismo: es la forma más
  // fácil de dejar la plataforma sin administrador.
  if (before.id === actor.id) {
    if (d.roleCode && d.roleCode !== before.role.code) {
      return respuestaError("No puede cambiar su propio rol");
    }
    if (d.status && d.status !== "activo") {
      return respuestaError("No puede desactivar ni bloquear su propia cuenta");
    }
  }
  if (d.roleCode === ROLES.SUPERADMIN && !puedeTocarSuperadmin(actor.role.code)) {
    return respuestaError("Solo un superadministrador puede otorgar ese rol", 403);
  }

  const email = d.email?.toLowerCase();
  if (email && email !== before.email) {
    if (await prisma.user.findUnique({ where: { email } })) {
      return respuestaError("Ya existe otra cuenta con ese correo", 409);
    }
  }
  const documento = d.documentNumber === undefined ? undefined : limpiar(d.documentNumber);
  if (documento && documento !== before.documentNumber) {
    if (await prisma.user.findUnique({ where: { documentNumber: documento } })) {
      return respuestaError("Ya existe otra cuenta con ese documento", 409);
    }
  }

  let roleId: string | undefined;
  if (d.roleCode && d.roleCode !== before.role.code) {
    const role = await prisma.role.findUnique({ where: { code: d.roleCode } });
    if (!role) return respuestaError("El rol no existe", 500);
    roleId = role.id;
  }

  const companyId = d.companyId === undefined ? undefined : limpiar(d.companyId);
  if (companyId && !(await prisma.company.findUnique({ where: { id: companyId } }))) {
    return respuestaError("La empresa indicada no existe", 404);
  }

  const after = await prisma.user.update({
    where: { id: before.id },
    data: {
      ...(d.firstName !== undefined ? { firstName: d.firstName } : {}),
      ...(d.lastName !== undefined ? { lastName: d.lastName } : {}),
      ...(email ? { email } : {}),
      ...(roleId ? { roleId } : {}),
      ...(companyId !== undefined ? { companyId } : {}),
      ...(d.documentType !== undefined ? { documentType: limpiar(d.documentType) } : {}),
      ...(documento !== undefined ? { documentNumber: documento } : {}),
      ...(d.phone !== undefined ? { phone: limpiar(d.phone) } : {}),
      ...(d.jobTitle !== undefined ? { jobTitle: limpiar(d.jobTitle) } : {}),
      ...(d.city !== undefined ? { city: limpiar(d.city) } : {}),
      ...(d.status ? { status: d.status } : {}),
    },
    include: { role: true },
  });

  // Bloquear o desactivar una cuenta la saca de inmediato de cualquier equipo.
  if (d.status === "bloqueado" || d.status === "inactivo") await revocarSesiones(before.id);

  // Si cambió de empresa, la membresía sigue a la empresa principal.
  if (companyId !== undefined && companyId !== before.companyId) {
    if (companyId) {
      await prisma.companyMember.upsert({
        where: { companyId_userId: { companyId, userId: before.id } },
        update: { status: "activo" },
        create: { companyId, userId: before.id, isSupervisor: after.role.code === ROLES.SUPERVISOR },
      });
    }
    if (before.companyId) {
      await prisma.companyMember.updateMany({
        where: { companyId: before.companyId, userId: before.id },
        data: { status: "retirado" },
      });
    }
  }

  await audit({
    userId: actor.id,
    actorEmail: actor.email,
    action: "editar",
    entity: "users",
    entityId: after.id,
    summary: `Cuenta ${after.email} editada`,
    before: {
      email: before.email,
      roleCode: before.role.code,
      companyId: before.companyId,
      status: before.status,
    },
    after: {
      email: after.email,
      roleCode: after.role.code,
      companyId: after.companyId,
      status: after.status,
    },
  });

  return respuestaOk();
}
