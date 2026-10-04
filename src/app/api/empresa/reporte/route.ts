import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { ASSESSMENT_TYPE_LABEL, ROLES, STATUS_LABEL } from "@/lib/constants";
import { toCsv, fechaCorta } from "@/lib/utils";
import { alcanceEmpresa, avanceEnLaEmpresa } from "@/lib/empresa";
import { ROLES_CON_CUPO } from "@/lib/cupos";
import { correoVisible, usuarioDeIngreso } from "@/lib/identidad";
import { ETIQUETA_SEMAFORO, indicadoresEmpresa, mostrarMeta, mostrarValor, semaforo } from "@/lib/indicadores";

const PERMITIDOS: string[] = [ROLES.ADMIN_EMPRESA, ROLES.SUPERVISOR, ROLES.SUPERADMIN, ROLES.ADMIN_KG];

/** Estado legible en español (en el CSV iba el código: "en_progreso"). */
const estado = (codigo: string) => STATUS_LABEL[codigo] ?? codigo;

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
 * Las fechas van como dd/mm/aaaa para que Excel las reconozca.
 *
 * El equipo de KG sin empresa elegida puede bajar todos los certificados
 * (Administración → Reportes).
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

  const esKG = user.role.code === ROLES.SUPERADMIN || user.role.code === ROLES.ADMIN_KG;
  if (!companyId && !(esKG && tipo === "certificados")) return new Response("Empresa no definida", { status: 400 });

  let rows: Record<string, unknown>[] = [];
  let nombre = "reporte";

  if (!companyId) {
    // Todos los certificados de la plataforma, con la empresa de cada persona.
    nombre = "certificados_todos";
    const certs = await prisma.certificate.findMany({
      orderBy: { issuedAt: "desc" },
      include: { user: { select: { company: { select: { tradeName: true, legalName: true } } } } },
    });
    rows = certs.map((c) => ({
      Codigo: c.code,
      Trabajador: c.studentName,
      Documento: c.studentDocument ?? "",
      Empresa: c.user.company ? (c.user.company.tradeName ?? c.user.company.legalName) : "Independiente",
      Curso: c.courseTitle,
      Horas: c.hours,
      Nota: c.finalScore ?? "",
      Emitido: fechaCorta(c.issuedAt),
      Vence: c.expiresAt ? fechaCorta(c.expiresAt) : "Indefinida",
      Estado: estado(c.status),
      Verificacion: c.verifyUrl,
    }));
  } else if (tipo === "trabajadores") {
    nombre = "trabajadores";
    // Las cifras son solo de los cursos que esta empresa asignó.
    const [members, avance, alcance] = await Promise.all([
      prisma.companyMember.findMany({
        where: { companyId },
        include: { user: { include: { role: true } }, area: true, position: true, location: true },
        orderBy: { createdAt: "asc" },
      }),
      avanceEnLaEmpresa(companyId),
      alcanceEmpresa(companyId),
    ]);
    const certificados = new Map<string, number>();
    for (const c of await prisma.certificate.findMany({
      where: { userId: { in: alcance.userIds }, courseId: { in: alcance.courseIds } },
      select: { userId: true, courseId: true },
    })) {
      if (alcance.incluye(c.userId, c.courseId)) certificados.set(c.userId, (certificados.get(c.userId) ?? 0) + 1);
    }
    rows = members.map((m) => {
      const a = avance(m.userId);
      return {
        Codigo: m.employeeCode ?? "",
        Nombres: m.user.firstName,
        Apellidos: m.user.lastName,
        Documento: m.user.documentNumber ?? "",
        Correo: correoVisible(m.user.email),
        Usuario_de_ingreso: usuarioDeIngreso(m.user),
        Rol: ROLES_CON_CUPO.includes(m.user.role.code) ? (m.user.role.code === ROLES.SUPERVISOR ? "Supervisor" : "Trabajador") : "Administrador (no ocupa cupo)",
        Area: m.area?.name ?? "",
        Cargo: m.position?.name ?? "",
        Sede: m.location?.name ?? "",
        Estado: m.status === "retirado" ? "Retirado" : estado(m.status),
        Cursos_asignados: a.asignados,
        Cursos_completados: a.completados,
        Avance_promedio_pct: a.avance === null ? "" : Math.round(a.avance),
        Certificados: certificados.get(m.userId) ?? 0,
        Ultimo_ingreso: m.user.lastLoginAt ? fechaCorta(m.user.lastLoginAt) : "Nunca",
      };
    });
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
      Fecha_corte: fechaCorta(new Date()),
    }));
  } else if (tipo === "evaluaciones") {
    nombre = "evaluaciones";
    const datos = await fichas(companyId);
    const alcance = await alcanceEmpresa(companyId);
    const intentos = (
      await prisma.assessmentAttempt.findMany({
        where: { status: "finalizado", userId: { in: alcance.userIds }, assessment: { courseId: { in: alcance.courseIds } } },
        include: { user: true, assessment: { include: { course: true } } },
        orderBy: { submittedAt: "desc" },
      })
    ).filter((i) => alcance.incluye(i.userId, i.assessment.courseId));
    rows = intentos.map((i) => ({
      Documento: i.user.documentNumber ?? "",
      Trabajador: `${i.user.firstName} ${i.user.lastName}`,
      Correo: correoVisible(i.user.email),
      ...datos(i.userId),
      Curso: i.assessment.course.title,
      Codigo_curso: i.assessment.course.code,
      Evaluacion: i.assessment.title,
      Tipo: ASSESSMENT_TYPE_LABEL[i.assessment.type] ?? i.assessment.type,
      Intento: i.attemptNo,
      Nota: Math.round(i.score ?? 0),
      Correctas: `${i.correctCount ?? 0}/${i.totalCount ?? 0}`,
      Resultado: i.passed ? "Aprobó" : "No aprobó",
      Fecha: fechaCorta(i.submittedAt),
      Duracion_min: i.durationSec ? Math.round(i.durationSec / 60) : "",
    }));
  } else if (tipo === "lecciones") {
    nombre = "avance_por_leccion";
    const datos = await fichas(companyId);
    const alcance = await alcanceEmpresa(companyId);
    const avances = (
      await prisma.lessonProgress.findMany({
        where: { userId: { in: alcance.userIds }, lesson: { module: { courseId: { in: alcance.courseIds } } } },
        select: {
          userId: true, status: true, percent: true, timeSpentSec: true, startedAt: true, completedAt: true,
          user: { select: { firstName: true, lastName: true, documentNumber: true } },
          lesson: { select: { title: true, module: { select: { title: true, courseId: true, course: { select: { title: true } } } } } },
        },
        orderBy: [{ userId: "asc" }, { updatedAt: "desc" }],
      })
    ).filter((a) => alcance.incluye(a.userId, a.lesson.module.courseId));
    rows = avances.map((a) => ({
      Documento: a.user.documentNumber ?? "",
      Trabajador: `${a.user.firstName} ${a.user.lastName}`,
      ...datos(a.userId),
      Curso: a.lesson.module.course.title,
      Modulo: a.lesson.module.title,
      Leccion: a.lesson.title,
      Estado: estado(a.status),
      Avance_pct: Math.round(a.percent),
      Tiempo_min: Math.round(a.timeSpentSec / 60),
      Inicio: fechaCorta(a.startedAt),
      Completada: fechaCorta(a.completedAt),
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
    const alcance = await alcanceEmpresa(companyId);
    const certs = (
      await prisma.certificate.findMany({
        where: { userId: { in: alcance.userIds }, courseId: { in: alcance.courseIds } },
        orderBy: { issuedAt: "desc" },
      })
    ).filter((c) => alcance.incluye(c.userId, c.courseId));
    rows = certs.map((c) => ({
      Codigo: c.code,
      Trabajador: c.studentName,
      Documento: c.studentDocument ?? "",
      Curso: c.courseTitle,
      Horas: c.hours,
      Nota: c.finalScore ?? "",
      Emitido: fechaCorta(c.issuedAt),
      Vence: c.expiresAt ? fechaCorta(c.expiresAt) : "Indefinida",
      Estado: estado(c.status),
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
        // Incluye a quienes la empresa retiró: su capacitación sigue siendo evidencia.
        Vinculacion: m?.status === "retirado" ? "Retirado" : "Activo",
        Curso: a.course.title,
        Codigo_curso: a.course.code,
        Obligatorio: a.isMandatory ? "SI" : "NO",
        Estado: estado(vencida ? "vencido" : a.status),
        Avance_pct: Math.round(a.enrollment?.progress ?? 0),
        Nota_final: a.enrollment?.finalScore ?? "",
        Fecha_limite: fechaCorta(a.dueDate),
        Inicio: fechaCorta(a.enrollment?.startedAt),
        Finalizacion: fechaCorta(a.enrollment?.completedAt),
        Ultimo_ingreso: a.user.lastLoginAt ? fechaCorta(a.user.lastLoginAt) : "Nunca",
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
