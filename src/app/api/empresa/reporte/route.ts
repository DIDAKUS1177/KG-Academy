import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { ROLES } from "@/lib/constants";
import { toCsv, formatDate } from "@/lib/utils";
import { correoVisible, usuarioDeIngreso } from "@/lib/identidad";
import { ETIQUETA_SEMAFORO, indicadoresEmpresa, mostrarMeta, mostrarValor, semaforo } from "@/lib/indicadores";

const PERMITIDOS: string[] = [ROLES.ADMIN_EMPRESA, ROLES.SUPERVISOR, ROLES.SUPERADMIN, ROLES.ADMIN_KG];

/** Área, cargo y sede de cada trabajador de la empresa, para cruzar en los reportes. */
async function fichas(companyId: string) {
  const miembros = await prisma.companyMember.findMany({
    where: { companyId },
    include: { area: true, position: true, location: true },
  });
  const porUsuario = new Map(miembros.map((m) => [m.userId, m]));
  return (userId: string) => {
    const m = porUsuario.get(userId);
    return { Area: m?.area?.name ?? "", Cargo: m?.position?.name ?? "", Sede: m?.location?.name ?? "" };
  };
}

/**
 * Exportación de reportes a CSV (se abre directo en Excel):
 * seguimiento, trabajadores, indicadores, evaluaciones, lecciones, cursos y certificados.
 */
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
      Correo: correoVisible(m.user.email),
      Usuario_de_ingreso: usuarioDeIngreso(m.user),
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
  } else if (tipo === "indicadores") {
    nombre = "indicadores";
    const lista = await indicadoresEmpresa(companyId);
    rows = lista.map((i) => ({
      Grupo: i.grupo,
      Indicador: i.nombre,
      Resultado: mostrarValor(i),
      Meta: mostrarMeta(i),
      Estado: ETIQUETA_SEMAFORO[semaforo(i)],
      Detalle: i.detalle,
      Formula: i.formula,
      Fecha_corte: formatDate(new Date()),
    }));
  } else if (tipo === "evaluaciones") {
    nombre = "evaluaciones";
    const datos = await fichas(companyId);
    const intentos = await prisma.assessmentAttempt.findMany({
      where: { status: "finalizado", user: { memberships: { some: { companyId } } } },
      include: { user: true, assessment: { include: { course: true } } },
      orderBy: { submittedAt: "desc" },
    });
    rows = intentos.map((i) => ({
      Documento: i.user.documentNumber ?? "",
      Trabajador: `${i.user.firstName} ${i.user.lastName}`,
      Correo: correoVisible(i.user.email),
      ...datos(i.userId),
      Curso: i.assessment.course.title,
      Codigo_curso: i.assessment.course.code,
      Evaluacion: i.assessment.title,
      Tipo: i.assessment.type,
      Intento: i.attemptNo,
      Nota: Math.round(i.score ?? 0),
      Correctas: `${i.correctCount ?? 0}/${i.totalCount ?? 0}`,
      Resultado: i.passed ? "Aprobó" : "No aprobó",
      Fecha: i.submittedAt ? formatDate(i.submittedAt) : "",
      Duracion_min: i.durationSec ? Math.round(i.durationSec / 60) : "",
    }));
  } else if (tipo === "lecciones") {
    nombre = "avance_por_leccion";
    const datos = await fichas(companyId);
    const avances = await prisma.lessonProgress.findMany({
      where: { user: { memberships: { some: { companyId } } } },
      include: { user: true, lesson: { include: { module: { include: { course: true } } } } },
      orderBy: [{ userId: "asc" }, { updatedAt: "desc" }],
    });
    rows = avances.map((a) => ({
      Documento: a.user.documentNumber ?? "",
      Trabajador: `${a.user.firstName} ${a.user.lastName}`,
      ...datos(a.userId),
      Curso: a.lesson.module.course.title,
      Modulo: a.lesson.module.title,
      Leccion: a.lesson.title,
      Estado: a.status,
      Avance_pct: Math.round(a.percent),
      Tiempo_min: Math.round(a.timeSpentSec / 60),
      Inicio: a.startedAt ? formatDate(a.startedAt) : "",
      Completada: a.completedAt ? formatDate(a.completedAt) : "",
    }));
  } else if (tipo === "cursos") {
    // Programa de capacitación: lo que la empresa asignó, con su ficha técnica.
    nombre = "programa_de_capacitacion";
    const cursos = await prisma.course.findMany({
      where: { assignments: { some: { companyId } } },
      include: {
        modules: { where: { isPublished: true }, orderBy: { order: "asc" } },
        assignments: { where: { companyId }, select: { status: true } },
      },
      orderBy: { code: "asc" },
    });
    rows = cursos.map((c) => ({
      Codigo: c.code,
      Curso: c.title,
      Intensidad_horas: c.durationHours,
      Modalidad: c.modality,
      Objetivo: c.objective ?? "",
      Dirigido_a: c.targetAudience ?? "",
      Contenido: c.modules.map((m) => m.title).join(" | "),
      Nota_minima: c.minPassingScore,
      Intentos: c.maxAttempts,
      Vigencia_certificado_meses: c.certificateValidityMonths ?? "",
      Asignados: c.assignments.length,
      Completados: c.assignments.filter((a) => a.status === "completado").length,
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
        Correo: correoVisible(a.user.email),
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
