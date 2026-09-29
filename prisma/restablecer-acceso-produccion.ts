/**
 * KG ACADEMY - Restablecer el acceso a cuentas de producción
 *
 * Para cuando nadie recuerda la contraseña de una cuenta (incluida la del
 * superadministrador) y la plataforma aún no envía correos. Cada cuenta indicada
 * queda con la contraseña temporal que se escribió al correr el script (llega
 * por RESTABLECER_CLAVE, nunca queda en archivos), en "pendiente_activacion"
 * para que la cambie al entrar, y con sus sesiones abiertas cerradas.
 *
 * No crea cuentas: si un correo no existe, lo informa y sigue.
 *
 *   powershell -ExecutionPolicy Bypass -File scripts\restablecer-acceso-produccion.ps1
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const clave = process.env.RESTABLECER_CLAVE ?? "";
  const correos = (process.env.RESTABLECER_CORREOS ?? "")
    .split(",")
    .map((c) => c.trim().toLowerCase())
    .filter(Boolean);
  if (clave.length < 10) throw new Error("La contraseña temporal debe tener al menos 10 caracteres.");
  if (correos.length === 0) throw new Error("No se indicó ningún correo.");

  const hash = await bcrypt.hash(clave, 10);
  const resultado: { correo: string; rol: string; estado: string }[] = [];

  for (const correo of correos) {
    const u = await prisma.user.findUnique({ where: { email: correo }, include: { role: true } });
    if (!u) {
      resultado.push({ correo, rol: "-", estado: "no existe, sin cambios" });
      continue;
    }
    await prisma.user.update({
      where: { id: u.id },
      data: { passwordHash: hash, status: "pendiente_activacion" },
    });
    await prisma.session.deleteMany({ where: { userId: u.id } });
    await prisma.passwordResetToken.deleteMany({ where: { userId: u.id } });
    await prisma.auditLog.create({
      data: {
        action: "editar",
        entity: "users",
        entityId: u.id,
        summary: `Acceso de ${correo} restablecido desde la terminal con contraseña temporal`,
      },
    });
    resultado.push({ correo, rol: u.role.code, estado: "restablecida: debe cambiarla al entrar" });
  }

  console.log("\n========= KG ACADEMY - ACCESO RESTABLECIDO =========");
  console.table(resultado);
  console.log("Contraseña: la que escribió al correr el script.");
  console.log("Al iniciar sesión, cada cuenta debe definir una propia antes de continuar.");
  console.log("====================================================\n");
}

main()
  .catch((e) => {
    console.error(e instanceof Error ? e.message : e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
