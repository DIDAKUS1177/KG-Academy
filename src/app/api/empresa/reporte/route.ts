import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { ROLES } from "@/lib/constants";
import { toCsv, formatDate } from "@/lib/utils";

const PERMITIDOS: string[] = [ROLES.ADMIN_EMPRESA, ROLES.SUPERVISOR, ROLES.SUPERADMIN, ROLES.ADMIN_KG];

/** Exportación de reportes a CSV (punto 13 del esqueleto). */
export async function GET(req: Request) {
  const user = await requireUser();
  if (!PERMITIDOS.includes(user.role.code)) {
    return new Response("No autorizado", { status: 403 });
  }

  const url = new URL(req.url);
  const tipo = url.searchParams.get("tipo") ?? "seguimiento";
  const companyId =
    user.role.code === ROLES.ADMIN_EMPRESA || user.role.code === ROLES.SUPERVISOR
      ? user.companyId
      : url.searchParams.get("empresa") ?? user.companyId;

  if (!companyId) return new Response("Empresa no definida", { status: 400 });

  let rows: Record<string, unknown>[] = [];
  let nombre = "reporte";

  if (tipo === "trabajadores") {
    nombre = "trabajadores";
    const members = await prisma.companyMember.findMany({
      where: { companyId },
      include: { user: { include: { enrollments: true, certificates: true } }, area: true, position: true, location: true },
    });
    rows = members.map((m) => ({
      Codigo: m.employeeCode ?? "",
      Nombres: m.user.firstName,
      Apellidos: m.user.lastName,
      Documento: m.user.documentNumber ?? "",
      Correo: m.user.email,
      Area: m.area?.name ?? "",
      Cargo: m.position?.name ?? "",
      Sede: m.location?.name ?? "",
      Estado: m.status,
      Cursos_asignados: m.user.enrollments.length,
      Cursos_completados: m.user.enrollments.filter((e) => e.status === "completado").length,
      Avance_promedio: m.user.enrollments.length
        ? Math.round(m.user.enrollments.reduce((s, e) => s + e.progress, 0) / m.user.enrollments.length)
        : 0,
      Certificados: m.user.certificates.length,
      Ultimo_acceso: m.user.lastLoginAt ? formatDate(m.user.lastLoginAt) : "",
    }));
  } else if (tipo === "certificados") {
    nombre = "certificados";
    const certs = await prisma.certificate.findMany({
      where: { user: { companyId } },
      include: { user: true },
      orderBy: { issuedAt: "desc" },
    });
    rows = certs.map((c) => ({
      Codigo: c.code,
      Trabajador: c.studentName,
      Documento: c.studentDocument ?? "",
      Curso: c.courseTitle,
      Horas: c.hours,
      Nota: c.finalScore ?? "",
      Emitido: formatDate(c.issuedAt),
      Vence: c.expiresAt ? formatDate(c.expiresAt) : "Indefinida",
      Estado: c.status,
      Verificacion: c.verifyUrl,
    }));
  } else {
    nombre = "seguimiento";
    const asignaciones = await prisma.courseAssignment.findMany({
      where: { companyId },
      include: {
        user: { include: { memberships: { include: { area: true, position: true, location: true } } } },
        course: true,
        enrollment: true,
      },
      orderBy: { createdAt: "desc" },
    });
    rows = asignaciones.map((a) => {
      const m = a.user.memberships.find((x) => x.companyId === companyId);
      const hoy = new Date();
      const vencida = a.dueDate && new Date(a.dueDate) < hoy && a.status !== "completado";
      return {
        Documento: a.user.documentNumber ?? "",
        Trabajador: `${a.user.firstName} ${a.user.lastName}`,
        Correo: a.user.email,
        Area: m?.area?.name ?? "",
        Cargo: m?.position?.name ?? "",
        Sede: m?.location?.name ?? "",
        Curso: a.course.title,
        Codigo_curso: a.course.code,
        Obligatorio: a.isMandatory ? "SI" : "NO",
        Estado: vencida ? "vencido" : a.status,
        Avance_pct: Math.round(a.enrollment?.progress ?? 0),
        Nota_final: a.enrollment?.finalScore ?? "",
        Fecha_limite: a.dueDate ? formatDate(a.dueDate) : "",
        Inicio: a.enrollment?.startedAt ? formatDate(a.enrollment.startedAt) : "",
        Finalizacion: a.enrollment?.completedAt ? formatDate(a.enrollment.completedAt) : "",
      };
    });
  }

  const csv = "﻿" + toCsv(rows);
  const fecha = new Date().toISOString().slice(0, 10);

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="KG_Academy_${nombre}_${fecha}.csv"`,
    },
  });
}
