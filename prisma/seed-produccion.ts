/* eslint-disable no-console */
/**
 * KG ACADEMY - Semilla de PRODUCCIÓN
 *
 * Diferencias con prisma/seed.ts (la semilla de demostración):
 *
 *   - NO borra nada. Se puede ejecutar las veces que haga falta sobre una base
 *     con datos reales: crea lo que falta y deja intacto lo que ya existe.
 *   - Carga solo catálogos: roles, permisos, parámetros del sistema, plantilla
 *     de certificado, plantillas de notificación, insignias, categorías y
 *     planes. Ni empresas de ejemplo, ni trabajadores, ni avances, ni
 *     certificados.
 *   - Crea UN superadministrador, y solo si no existe ninguno, con las
 *     credenciales que vienen por variables de entorno. Nunca la contraseña de
 *     demostración.
 *
 * Uso:
 *   SEED_ADMIN_EMAIL=... SEED_ADMIN_PASSWORD=... npm run db:seed:prod
 *
 * Los cursos NO se siembran aquí: en producción se crean desde el panel
 * (/admin/cursos) para que queden con la estructura y el contenido que KG
 * decida, no con la demo.
 *
 * Autor del desarrollo: Diego Alejandro Hernández Blanco
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

/* ------------------------------------------------------------------ */
/*  Catálogos: la misma definición que la semilla de demostración      */
/* ------------------------------------------------------------------ */

const MODULOS_PERMISOS = [
  "usuarios", "empresas", "cursos", "evaluaciones",
  "certificados", "reportes", "pagos", "configuracion", "auditoria",
];
const ACCIONES = ["ver", "crear", "editar", "eliminar", "publicar", "exportar", "revocar", "asignar"];

const ROLES = [
  { code: "superadmin", name: "SuperAdmin KG", scope: "plataforma", description: "Acceso total a la plataforma." },
  { code: "admin_kg", name: "Administrador KG", scope: "plataforma", description: "Gestión operativa según permisos asignados." },
  { code: "instructor", name: "Instructor", scope: "plataforma", description: "Crea y edita sus cursos y contenidos." },
  { code: "admin_empresa", name: "Administrador de empresa", scope: "empresa", description: "Gestiona trabajadores, asigna cursos y consulta cumplimiento." },
  { code: "supervisor", name: "Supervisor", scope: "empresa", description: "Consulta trabajadores y áreas autorizadas." },
  { code: "estudiante", name: "Estudiante / Trabajador", scope: "empresa", description: "Realiza cursos, evaluaciones y descarga certificados." },
];

const PARAMETROS = [
  { key: "marca.nombre", value: "KG Academy", group: "marca", label: "Nombre de la plataforma" },
  { key: "marca.empresa", value: "KG GESTIÓN INTEGRAL S.A.S.", group: "marca", label: "Razón social" },
  { key: "marca.color_primario", value: "#0A2D4D", group: "marca", label: "Color primario" },
  { key: "marca.color_secundario", value: "#8FBF16", group: "marca", label: "Color secundario" },
  { key: "certificados.prefijo", value: "KG", group: "certificados", label: "Prefijo del código" },
  { key: "certificados.firmante", value: "Katerine Guañarita", group: "certificados", label: "Firma autorizada" },
  { key: "certificados.cargo_firmante", value: "Directora - KG Gestión Integral S.A.S.", group: "certificados", label: "Cargo del firmante" },
  { key: "seguridad.min_password", value: "8", type: "number", group: "seguridad", label: "Longitud mínima de contraseña" },
  { key: "seguridad.sesion_horas", value: "8", type: "number", group: "seguridad", label: "Duración de la sesión (horas)" },
  { key: "general.desarrollador", value: "Diego Alejandro Hernández Blanco", group: "general", label: "Desarrollado por" },
  { key: "general.desarrollador_url", value: "https://www.linkedin.com/in/diego-alejandro-hernandez-blanco-08b64120b/", group: "general", label: "Perfil del desarrollador" },
  { key: "contacto.telefono", value: "+57 320 7605561", group: "contacto", label: "Teléfono / WhatsApp" },
  { key: "contacto.email", value: "katerineguanarita@gmail.com", group: "contacto", label: "Correo de contacto" },
];

const PLANTILLAS_NOTIFICACION = [
  { code: "bienvenida", name: "Bienvenida", channel: "email", subject: "Bienvenido a KG Academy", body: "Hola {{nombre}}, su cuenta fue creada." },
  { code: "curso_asignado", name: "Curso asignado", channel: "email", subject: "Le asignaron un curso", body: "Su empresa le asignó el curso {{curso}}. Fecha límite: {{fecha}}." },
  { code: "recordatorio", name: "Recordatorio de curso pendiente", channel: "email", subject: "Tiene un curso pendiente", body: "Recuerde completar {{curso}}." },
  { code: "por_vencer", name: "Curso próximo a vencer", channel: "email", subject: "Su curso está por vencer", body: "Le quedan {{días}} días para completar {{curso}}." },
  { code: "curso_completado", name: "Curso completado", channel: "interna", subject: "Curso completado", body: "Felicitaciones, completó {{curso}}." },
  { code: "certificado_listo", name: "Certificado disponible", channel: "email", subject: "Su certificado está listo", body: "Descargue su certificado {{código}}." },
  { code: "reset_password", name: "Recuperación de contraseña", channel: "email", subject: "Restablecer contraseña", body: "Use este enlace: {{enlace}}" },
];

const INSIGNIAS = [
  { code: "primer_paso", name: "Primer paso", description: "Completó su primera lección", criteria: "1 lección completada", points: 10 },
  { code: "constante", name: "Constante", description: "Racha de 3 días seguidos", criteria: "Racha >= 3 días", points: 30 },
  { code: "certificado_1", name: "Certificado obtenido", description: "Obtuvo su primer certificado", criteria: "1 certificado emitido", points: 100 },
  { code: "brigadista", name: "Brigadista KG", description: "Completó los tres cursos de primeros auxilios", criteria: "3 cursos completados", points: 300 },
  { code: "evaluador", name: "Nota perfecta", description: "Obtuvo 100 en una evaluación final", criteria: "score = 100", points: 50 },
];

const CATEGORIAS = [
  { slug: "primeros-auxilios", name: "Primeros Auxilios", description: "Atención inicial de emergencias en el entorno laboral, familiar y comunitario.", icon: "heart", color: "#8FBF16", order: 1 },
  { slug: "sst", name: "Seguridad y Salud en el Trabajo", description: "SG-SST, riesgos, COPASST y normatividad.", icon: "shield", color: "#0A2D4D", order: 2 },
  { slug: "riesgo-psicosocial", name: "Riesgo Psicosocial", description: "Bienestar mental y clima laboral.", icon: "spark", color: "#1B4A73", order: 3 },
  { slug: "analitica", name: "Business Analytics", description: "Indicadores y analítica aplicada a la gestión.", icon: "chart", color: "#759F11", order: 4 },
];

const PLANES = [
  { code: "empresarial_basico", name: "Empresarial Básico", description: "Hasta 25 trabajadores.", maxUsers: 25, pricePerMonth: 320000, pricePerUser: 0, features: null as string | null },
  { code: "empresarial_pro", name: "Empresarial Pro", description: "Hasta 100 trabajadores, catálogo completo y reportes exportables.", maxUsers: 100, pricePerMonth: 890000, pricePerUser: 0, features: JSON.stringify(["Catálogo completo", "Asignación masiva", "Reportes Excel/CSV", "Certificados ilimitados"]) },
  { code: "personalizado", name: "Plan personalizado", description: "Cotización a la medida según número de sedes y cursos.", maxUsers: null as number | null, pricePerMonth: 0, pricePerUser: 0, features: null as string | null },
];

/** Contraseña de la demo: jamás puede terminar en producción. */
const CLAVE_DEMO = "KgAcademy2026*";

/* ------------------------------------------------------------------ */

async function main() {
  console.log("=========== KG ACADEMY - SEMILLA DE PRODUCCIÓN ===========");
  console.log("No borra nada: crea lo que falte y respeta lo existente.\n");

  // Primero se valida todo lo que pueda fallar. Así una ejecución mal
  // configurada no deja la base a medias.
  const yaHaySuperadmin = await prisma.user.findFirst({
    where: { role: { code: "superadmin" } },
    select: { email: true },
  });

  let nuevoAdmin: { email: string; clave: string; nombre: string } | null = null;
  if (!yaHaySuperadmin) {
    const email = process.env.SEED_ADMIN_EMAIL?.trim().toLowerCase();
    const clave = process.env.SEED_ADMIN_PASSWORD ?? "";
    const nombre = process.env.SEED_ADMIN_NOMBRE?.trim() || "Katerine Guañarita";

    if (!email || !clave) {
      throw new Error(
        "No hay superadministrador y faltan SEED_ADMIN_EMAIL o SEED_ADMIN_PASSWORD. " +
          "Defínalos y vuelva a ejecutar. No se modificó nada."
      );
    }
    if (clave.length < 12) {
      throw new Error("SEED_ADMIN_PASSWORD debe tener al menos 12 caracteres. No se modificó nada.");
    }
    if (clave === CLAVE_DEMO) {
      throw new Error("SEED_ADMIN_PASSWORD no puede ser la contraseña de la demostración. No se modificó nada.");
    }
    nuevoAdmin = { email, clave, nombre };
  }

  const resumen: Record<string, { creados: number; existentes: number }> = {};
  const contar = (grupo: string, creado: boolean) => {
    resumen[grupo] ??= { creados: 0, existentes: 0 };
    if (creado) resumen[grupo].creados++;
    else resumen[grupo].existentes++;
  };

  /* ---------- Roles ---------- */
  const rolId: Record<string, string> = {};
  for (const r of ROLES) {
    const existente = await prisma.role.findUnique({ where: { code: r.code } });
    const rol = existente ?? (await prisma.role.create({ data: r }));
    rolId[r.code] = rol.id;
    contar("roles", !existente);
  }

  /* ---------- Permisos ---------- */
  const permisoIds: string[] = [];
  for (const m of MODULOS_PERMISOS) {
    for (const a of ACCIONES) {
      const code = `${m}.${a}`;
      const existente = await prisma.permission.findUnique({ where: { code } });
      const p =
        existente ??
        (await prisma.permission.create({
          data: { code, module: m, action: a, description: `${a} en ${m}` },
        }));
      permisoIds.push(p.id);
      contar("permisos", !existente);
    }
  }

  // El superadministrador tiene todos los permisos en la tabla, además del
  // comodín "*" que aplica la matriz en código.
  for (const permissionId of permisoIds) {
    const existente = await prisma.rolePermission.findUnique({
      where: { roleId_permissionId: { roleId: rolId.superadmin, permissionId } },
    });
    if (!existente) {
      await prisma.rolePermission.create({ data: { roleId: rolId.superadmin, permissionId } });
    }
    contar("permisos_superadmin", !existente);
  }

  /* ---------- Parámetros ---------- */
  // Solo se crean los que faltan. Si KG ya cambió un valor desde el panel,
  // aquí no se pisa.
  for (const s of PARAMETROS) {
    const existente = await prisma.systemSetting.findUnique({ where: { key: s.key } });
    if (!existente) await prisma.systemSetting.create({ data: s });
    contar("parametros", !existente);
  }

  /* ---------- Plantilla de certificado ---------- */
  const plantilla = await prisma.certificateTemplate.findFirst({ where: { isDefault: true } });
  if (!plantilla) {
    await prisma.certificateTemplate.create({
      data: {
        name: "Plantilla oficial KG",
        description: "Diseño horizontal con identidad KG Gestión Integral S.A.S.",
        orientation: "horizontal",
        signerName: "Katerine Guañarita",
        signerTitle: "Directora - KG Gestión Integral S.A.S.",
        bodyTemplate:
          "Certifica que {{estudiante}} identificado(a) con documento {{documento}} cursó y aprobó satisfactoriamente el programa {{curso}}, con una intensidad de {{horas}} horas.",
        isDefault: true,
      },
    });
  }
  contar("plantilla_certificado", !plantilla);

  /* ---------- Plantillas de notificación ---------- */
  for (const t of PLANTILLAS_NOTIFICACION) {
    const existente = await prisma.notificationTemplate.findUnique({ where: { code: t.code } });
    if (!existente) await prisma.notificationTemplate.create({ data: t });
    contar("plantillas_notificacion", !existente);
  }

  /* ---------- Insignias ---------- */
  for (const b of INSIGNIAS) {
    const existente = await prisma.badge.findUnique({ where: { code: b.code } });
    if (!existente) await prisma.badge.create({ data: b });
    contar("insignias", !existente);
  }

  /* ---------- Categorías ---------- */
  for (const c of CATEGORIAS) {
    const existente = await prisma.category.findUnique({ where: { slug: c.slug } });
    if (!existente) await prisma.category.create({ data: c });
    contar("categorias", !existente);
  }

  /* ---------- Planes ---------- */
  for (const p of PLANES) {
    const existente = await prisma.plan.findUnique({ where: { code: p.code } });
    if (!existente) await prisma.plan.create({ data: p });
    contar("planes", !existente);
  }

  /* ---------- Superadministrador ---------- */
  if (yaHaySuperadmin) {
    console.log(`Superadministrador existente: ${yaHaySuperadmin.email} (no se toca).`);
  } else if (nuevoAdmin) {
    const [firstName, ...resto] = nuevoAdmin.nombre.split(" ");
    await prisma.user.create({
      data: {
        email: nuevoAdmin.email,
        passwordHash: await bcrypt.hash(nuevoAdmin.clave, 10),
        firstName,
        lastName: resto.join(" ") || "",
        roleId: rolId.superadmin,
        status: "activo",
        emailVerified: true,
        acceptedTerms: true,
        acceptedDataAt: new Date(),
        jobTitle: "Directora General",
      },
    });
    console.log(`Superadministrador creado: ${nuevoAdmin.email}`);
  }

  /* ---------- Resumen ---------- */
  console.log("\nResumen:");
  for (const [grupo, r] of Object.entries(resumen)) {
    console.log(`  ${grupo.padEnd(26)} creados: ${String(r.creados).padStart(3)}   ya existían: ${String(r.existentes).padStart(3)}`);
  }
  console.log("\n=========== LISTO ===========");
}

main()
  .catch((e) => {
    console.error("\nERROR:", e.message ?? e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
