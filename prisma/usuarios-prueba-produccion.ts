/**
 * KG ACADEMY - Cuentas de prueba en producción
 *
 * Crea tres cuentas para recorrer la plataforma con cada rol:
 *   - Administrador KG      (panel de administración)
 *   - Administrador empresa (panel empresarial de "Empresa de Prueba KG")
 *   - Estudiante            (aula virtual, trabajador de esa empresa)
 *
 * Todas nacen con la contraseña temporal que se escribe al correr el script
 * (llega por SEED_PRUEBA_CLAVE, nunca queda en archivos) y en estado
 * "pendiente_activacion": al iniciar sesión la plataforma obliga a cambiarla
 * antes de dejar hacer cualquier otra cosa.
 *
 * No borra ni modifica nada: si un correo ya existe, esa cuenta se salta.
 *
 *   powershell -ExecutionPolicy Bypass -File scripts\usuarios-prueba-produccion.ps1
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const EMPRESA = {
  nit: "000000000-0",
  legalName: "Empresa de Prueba KG S.A.S.",
  tradeName: "Empresa de Prueba KG",
  city: "Bogotá",
  riskLevel: "III",
};

async function main() {
  const clave = process.env.SEED_PRUEBA_CLAVE ?? "";
  const dominio = (process.env.SEED_PRUEBA_DOMINIO ?? "kgacademy.test").trim().toLowerCase();
  if (clave.length < 10) throw new Error("La contraseña temporal debe tener al menos 10 caracteres.");
  if (!/^[a-z0-9.-]+\.[a-z]{2,}$/.test(dominio)) throw new Error(`Dominio inválido: ${dominio}`);

  const roles = await prisma.role.findMany();
  const rol = (code: string) => {
    const r = roles.find((x) => x.code === code);
    if (!r) throw new Error(`Falta el rol "${code}". Corra primero la carga inicial (sembrar-produccion.ps1).`);
    return r.id;
  };

  let empresa = await prisma.company.findUnique({ where: { nit: EMPRESA.nit } });
  if (!empresa) {
    empresa = await prisma.company.create({ data: { ...EMPRESA, status: "activa", contactEmail: `empresa.prueba@${dominio}` } });
    const plan = await prisma.plan.findUnique({ where: { code: "empresarial_basico" } });
    if (plan) {
      await prisma.companySubscription.create({
        data: { companyId: empresa.id, planId: plan.id, seats: plan.maxUsers ?? 25, status: "activa" },
      });
    }
  }

  const hash = await bcrypt.hash(clave, 10);
  const cuentas = [
    { rol: "admin_kg", nombre: "Administrador", apellido: "de Prueba", correo: `admin.prueba@${dominio}`, empresa: false, cargo: "Administración KG (prueba)" },
    { rol: "admin_empresa", nombre: "Empresa", apellido: "de Prueba", correo: `empresa.prueba@${dominio}`, empresa: true, cargo: "Talento humano (prueba)" },
    { rol: "estudiante", nombre: "Estudiante", apellido: "de Prueba", correo: `estudiante.prueba@${dominio}`, empresa: true, cargo: "Operario (prueba)" },
  ];

  const resultado: { rol: string; correo: string; estado: string }[] = [];
  for (const c of cuentas) {
    if (await prisma.user.findUnique({ where: { email: c.correo } })) {
      resultado.push({ rol: c.rol, correo: c.correo, estado: "ya existía, sin cambios" });
      continue;
    }
    const u = await prisma.user.create({
      data: {
        email: c.correo,
        passwordHash: hash,
        firstName: c.nombre,
        lastName: c.apellido,
        jobTitle: c.cargo,
        roleId: rol(c.rol),
        companyId: c.empresa ? empresa.id : null,
        status: "pendiente_activacion",
        acceptedTerms: true,
        acceptedDataAt: new Date(),
      },
    });
    if (c.empresa) await prisma.companyMember.create({ data: { companyId: empresa.id, userId: u.id } });
    await prisma.auditLog.create({
      data: {
        action: "crear",
        entity: "users",
        entityId: u.id,
        summary: `Cuenta de prueba ${c.correo} (${c.rol}) creada con contraseña temporal`,
      },
    });
    resultado.push({ rol: c.rol, correo: c.correo, estado: "creada: debe cambiar la contraseña al entrar" });
  }

  console.log("\n=========== KG ACADEMY - CUENTAS DE PRUEBA ===========");
  console.table(resultado);
  console.log("Contraseña inicial: la que escribió al correr el script.");
  console.log("Al iniciar sesión, cada cuenta debe definir una propia antes de continuar.");
  console.log("======================================================\n");
}

main()
  .catch((e) => {
    console.error(e instanceof Error ? e.message : e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
