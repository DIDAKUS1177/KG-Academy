/**
 * Clases y reuniones que una empresa comparte con su gente.
 *
 * Son un enlace (Meet, Zoom, Teams o una grabación) con título y, si es en
 * vivo, fecha y hora. Llegan como notificación y se ven en el aula hasta que
 * terminan: una clase en vivo, hasta que pasa su duración; un material sin
 * fecha, durante 30 días.
 *
 * Los destinatarios se calculan al momento: todos los que toman cursos en la
 * empresa, los de un área o quienes tienen asignado un curso de esa empresa.
 */
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { ROLES_CON_CUPO } from "@/lib/cupos";

export type Audiencia = "todos" | "area" | "curso";

/** Minutos que se supone que dura una clase sin duración indicada. */
export const DURACION_POR_DEFECTO = 60;
/** Días que un material sin fecha sigue a la vista. */
export const DIAS_MATERIAL = 30;

/** Ids de las personas que reciben un encuentro. */
export async function destinatarios(companyId: string, audiencia: Audiencia, areaId?: string | null, courseId?: string | null) {
  const persona: Prisma.UserWhereInput = {
    role: { code: { in: ROLES_CON_CUPO } },
    status: { notIn: ["inactivo", "bloqueado"] },
    ...(audiencia === "curso" ? { assignments: { some: { companyId, courseId: courseId ?? "", status: { not: "cancelado" } } } } : {}),
  };
  const miembros = await prisma.companyMember.findMany({
    where: {
      companyId,
      status: { not: "retirado" },
      ...(audiencia === "area" ? { areaId: areaId ?? "" } : {}),
      user: persona,
    },
    select: { userId: true },
  });
  return miembros.map((m) => m.userId);
}

/** Fin del encuentro: el de una clase en vivo es su inicio más su duración. */
export function finDe(e: { startsAt: Date | null; durationMin: number | null; createdAt: Date }) {
  if (e.startsAt) return new Date(e.startsAt.getTime() + (e.durationMin ?? DURACION_POR_DEFECTO) * 60_000);
  return new Date(e.createdAt.getTime() + DIAS_MATERIAL * 86_400_000);
}

/** ¿Está por empezar (15 minutos antes) o en curso? */
export function enCurso(e: { startsAt: Date | null; durationMin: number | null; createdAt: Date }, ahora = new Date()) {
  return !!e.startsAt && ahora.getTime() >= e.startsAt.getTime() - 15 * 60_000 && ahora < finDe(e);
}

/** Dominio del enlace, para que la persona sepa a qué sitio la lleva. */
export function dominio(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

/**
 * Encuentros que le llegan a una persona: los de sus empresas que la incluyen.
 * `vigentes` deja solo los que no han terminado; si no, también los de los
 * últimos 30 días.
 */
export async function encuentrosDe(userId: string, opciones: { vigentes: boolean }) {
  const ahora = new Date();
  const [membresias, asignaciones] = await Promise.all([
    prisma.companyMember.findMany({ where: { userId, status: { not: "retirado" } }, select: { companyId: true, areaId: true } }),
    prisma.courseAssignment.findMany({ where: { userId, status: { not: "cancelado" } }, select: { companyId: true, courseId: true } }),
  ]);
  if (!membresias.length) return [];
  const desde = new Date(ahora.getTime() - 30 * 86_400_000);
  const candidatos = await prisma.companyMeeting.findMany({
    where: {
      companyId: { in: membresias.map((m) => m.companyId) },
      canceledAt: null,
      // Los que pueden seguir a la vista; el filtro exacto por fin va abajo.
      OR: [{ startsAt: { gte: opciones.vigentes ? new Date(ahora.getTime() - 24 * 3_600_000) : desde } }, { startsAt: null, createdAt: { gte: desde } }],
    },
    include: { company: { select: { tradeName: true, legalName: true } }, course: { select: { title: true } }, area: { select: { name: true } } },
  });
  const areaEn = new Map(membresias.map((m) => [m.companyId, m.areaId]));
  const cursos = new Set(asignaciones.map((a) => `${a.companyId}|${a.courseId}`));
  return candidatos
    .filter((e) =>
      e.audience === "todos" ||
      (e.audience === "area" && !!e.areaId && areaEn.get(e.companyId) === e.areaId) ||
      (e.audience === "curso" && !!e.courseId && cursos.has(`${e.companyId}|${e.courseId}`))
    )
    .filter((e) => !opciones.vigentes || finDe(e) > ahora)
    .sort((a, b) => (a.startsAt?.getTime() ?? a.createdAt.getTime()) - (b.startsAt?.getTime() ?? b.createdAt.getTime()));
}
