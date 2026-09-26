/**
 * Reglas para presentar una evaluación, comunes a empezar un intento y a
 * entregarlo.
 *
 * Tiempo límite: al empezar se abre un intento "en_curso" con su hora de
 * inicio y el servidor es quien decide si la entrega llegó a tiempo (con un
 * margen por la conexión). Una sesión abandonada no gasta intento, pero una
 * entrega fuera de tiempo no se califica.
 */
import { prisma } from "@/lib/prisma";
import { puedeVerCurso } from "@/lib/acceso-cursos";
import { exigeLecciones, leccionesPendientes } from "@/lib/evaluacion-final";

export const GRACIA_SEG = 120;

type Usuario = { id: string; role: { code: string } };

export async function validarPresentacion(user: Usuario, assessmentId: string) {
  const assessment = await prisma.assessment.findUnique({
    where: { id: assessmentId },
    include: { course: true, questions: { include: { question: { include: { options: true } } } } },
  });
  if (!assessment || !assessment.isPublished || !puedeVerCurso(user.role.code, assessment.course.status)) {
    return { error: "Evaluación no encontrada", status: 404 } as const;
  }
  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId: user.id, courseId: assessment.courseId } },
  });
  if (!enrollment) return { error: "No está matriculado en el curso", status: 403 } as const;

  const finalizados = await prisma.assessmentAttempt.findMany({
    where: { assessmentId: assessment.id, enrollmentId: enrollment.id, status: "finalizado" },
    select: { passed: true },
  });
  if (assessment.type !== "diagnostica" && finalizados.some((a) => a.passed)) {
    return { error: "Ya aprobó esta evaluación", status: 409 } as const;
  }
  if (finalizados.length >= assessment.maxAttempts) {
    return { error: "Agotó los intentos permitidos", status: 403 } as const;
  }
  if (exigeLecciones(assessment.type, assessment.course)) {
    const faltan = await leccionesPendientes(enrollment.id, assessment.courseId);
    if (faltan > 0) {
      return { error: `Complete las lecciones del curso antes de la evaluación final (le faltan ${faltan}).`, status: 409 } as const;
    }
  }
  return { assessment, enrollment, finalizados: finalizados.length } as const;
}

/** Segundos que le quedan a un intento en curso (null si no hay límite). */
export function segundosRestantes(inicio: Date, limiteMin: number | null) {
  if (!limiteMin) return null;
  return Math.floor(limiteMin * 60 - (Date.now() - inicio.getTime()) / 1000);
}
