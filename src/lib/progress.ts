import { prisma } from "./prisma";
import { certificateCode } from "./utils";
import { issueCertificate } from "./certificates";

/**
 * MOTOR DE PROGRESO Y TRAZABILIDAD (punto 8 del esqueleto funcional).
 *
 * Regla implementada (configurable por curso en Course.progressRule):
 *   - "obligatorios"     -> % = lecciones obligatorias completadas / total obligatorias
 *   - "peso_lecciones"   -> % = suma de pesos de lecciones completadas
 *   - "peso_modulos"     -> % = suma ponderada del avance de cada modulo
 *
 * Un curso se marca COMPLETADO cuando:
 *   1. progreso >= 100 (segun la regla activa), y
 *   2. si Course.requiresFinalExam -> existe intento aprobado de la evaluacion final.
 *
 * La trazabilidad historica (lesson_progress, assessment_attempts) nunca se borra.
 */
export async function recalcEnrollment(enrollmentId: string) {
  const enrollment = await prisma.enrollment.findUnique({
    where: { id: enrollmentId },
    include: {
      course: {
        include: {
          modules: { include: { lessons: true }, orderBy: { order: "asc" } },
          assessments: true,
        },
      },
      lessonProgress: true,
      attempts: true,
    },
  });
  if (!enrollment) return null;

  const course = enrollment.course;
  const allLessons = course.modules.flatMap((m) => m.lessons);
  const done = new Map(enrollment.lessonProgress.map((lp) => [lp.lessonId, lp]));

  // ---- 1. Porcentaje global ----
  let progress = 0;
  if (course.progressRule === "peso_lecciones") {
    const totalWeight = allLessons.reduce((s, l) => s + (l.weight || 1), 0) || 1;
    const doneWeight = allLessons.reduce(
      (s, l) => s + (done.get(l.id)?.status === "completado" ? l.weight || 1 : 0),
      0
    );
    progress = (doneWeight / totalWeight) * 100;
  } else if (course.progressRule === "peso_modulos") {
    const totalWeight = course.modules.reduce((s, m) => s + (m.weight || 1), 0) || 1;
    let acc = 0;
    for (const m of course.modules) {
      const req = m.lessons.filter((l) => l.isRequired);
      const base = req.length || m.lessons.length || 1;
      const completed = (req.length ? req : m.lessons).filter(
        (l) => done.get(l.id)?.status === "completado"
      ).length;
      acc += (completed / base) * (m.weight || 1);
    }
    progress = (acc / totalWeight) * 100;
  } else {
    const required = allLessons.filter((l) => l.isRequired);
    const base = required.length || allLessons.length;
    if (base > 0) {
      const completed = (required.length ? required : allLessons).filter(
        (l) => done.get(l.id)?.status === "completado"
      ).length;
      progress = (completed / base) * 100;
    }
  }
  progress = Math.min(100, Math.round(progress * 10) / 10);

  // ---- 2. Estado de cada modulo ----
  for (const m of course.modules) {
    const lessons = m.lessons;
    const total = lessons.length || 1;
    const completed = lessons.filter((l) => done.get(l.id)?.status === "completado").length;
    const started = lessons.some((l) => done.has(l.id));
    const mp = completed === lessons.length && lessons.length > 0
      ? "completado"
      : started
        ? "en_progreso"
        : "no_iniciado";

    await prisma.moduleProgress.upsert({
      where: { enrollmentId_moduleId: { enrollmentId, moduleId: m.id } },
      create: {
        enrollmentId,
        moduleId: m.id,
        userId: enrollment.userId,
        status: mp,
        progress: (completed / total) * 100,
        startedAt: started ? new Date() : null,
        completedAt: mp === "completado" ? new Date() : null,
      },
      update: {
        status: mp,
        progress: (completed / total) * 100,
        completedAt: mp === "completado" ? new Date() : null,
      },
    });
  }

  // ---- 3. Evaluacion final aprobada ----
  const finalAssessment = course.assessments.find((a) => a.type === "final");
  const finalPassed = finalAssessment
    ? enrollment.attempts.some((a) => a.assessmentId === finalAssessment.id && a.passed)
    : true;
  const bestFinal = finalAssessment
    ? Math.max(
        0,
        ...enrollment.attempts
          .filter((a) => a.assessmentId === finalAssessment.id)
          .map((a) => a.score)
      )
    : null;

  const lessonsOk = course.requiresAllLessons ? progress >= 100 : progress > 0;
  const isComplete = lessonsOk && (!course.requiresFinalExam || finalPassed);

  const status = isComplete ? "completado" : progress > 0 ? "en_progreso" : "no_iniciado";

  const updated = await prisma.enrollment.update({
    where: { id: enrollmentId },
    data: {
      progress,
      status,
      finalScore: bestFinal && bestFinal > 0 ? bestFinal : enrollment.finalScore,
      startedAt: enrollment.startedAt ?? (progress > 0 ? new Date() : null),
      completedAt: isComplete ? enrollment.completedAt ?? new Date() : null,
      lastAccessAt: new Date(),
    },
  });

  // ---- 4. Sincronizar la asignacion empresarial ----
  if (enrollment.assignmentId) {
    await prisma.courseAssignment.update({
      where: { id: enrollment.assignmentId },
      data: { status: isComplete ? "completado" : progress > 0 ? "en_progreso" : "asignado" },
    });
  }

  // ---- 5. Certificado automatico ----
  if (isComplete && course.certificateEnabled) {
    const exists = await prisma.certificate.findUnique({ where: { enrollmentId } });
    if (!exists) {
      await issueCertificate(enrollmentId);
      await addPoints(enrollment.userId, 100, "curso_completado", "curso", course.id);
      await prisma.notification.create({
        data: {
          userId: enrollment.userId,
          title: "Tu certificado esta listo",
          message: `Completaste "${course.title}". Ya puedes descargar tu certificado.`,
          linkUrl: "/aula/certificados",
          type: "exito",
        },
      });
    }
  }

  return updated;
}

/** Marca (o actualiza) el avance de una leccion y recalcula el curso. */
export async function trackLesson(params: {
  enrollmentId: string;
  lessonId: string;
  userId: string;
  completed?: boolean;
  percent?: number;
  positionSec?: number;
  addSeconds?: number;
}) {
  const { enrollmentId, lessonId, userId } = params;
  const now = new Date();
  const completed = params.completed ?? false;

  const existing = await prisma.lessonProgress.findUnique({
    where: { enrollmentId_lessonId: { enrollmentId, lessonId } },
  });

  await prisma.lessonProgress.upsert({
    where: { enrollmentId_lessonId: { enrollmentId, lessonId } },
    create: {
      enrollmentId,
      lessonId,
      userId,
      status: completed ? "completado" : "en_progreso",
      percent: completed ? 100 : params.percent ?? 0,
      lastPositionSec: params.positionSec ?? 0,
      timeSpentSec: params.addSeconds ?? 0,
      views: 1,
      startedAt: now,
      completedAt: completed ? now : null,
    },
    update: {
      status: completed ? "completado" : existing?.status === "completado" ? "completado" : "en_progreso",
      percent: completed ? 100 : Math.max(existing?.percent ?? 0, params.percent ?? 0),
      lastPositionSec: params.positionSec ?? existing?.lastPositionSec ?? 0,
      timeSpentSec: (existing?.timeSpentSec ?? 0) + (params.addSeconds ?? 0),
      views: (existing?.views ?? 0) + 1,
      completedAt: completed ? existing?.completedAt ?? now : existing?.completedAt,
    },
  });

  if (completed && existing?.status !== "completado") {
    await addPoints(userId, 10, "leccion_completada", "leccion", lessonId);
    await touchStreak(userId);
  }

  return recalcEnrollment(enrollmentId);
}

/** Gamificacion: suma puntos al ledger. */
export async function addPoints(
  userId: string,
  points: number,
  reason: string,
  refType?: string,
  refId?: string
) {
  await prisma.pointsLedger.create({ data: { userId, points, reason, refType, refId } });
}

export async function totalPoints(userId: string) {
  const agg = await prisma.pointsLedger.aggregate({
    where: { userId },
    _sum: { points: true },
  });
  return agg._sum.points ?? 0;
}

/** Gamificacion: racha diaria de estudio. */
export async function touchStreak(userId: string) {
  const s = await prisma.streak.findUnique({ where: { userId } });
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (!s) {
    await prisma.streak.create({
      data: { userId, currentDays: 1, longestDays: 1, lastActiveAt: new Date() },
    });
    return;
  }
  const last = s.lastActiveAt ? new Date(s.lastActiveAt) : null;
  if (last) last.setHours(0, 0, 0, 0);
  const diff = last ? Math.round((today.getTime() - last.getTime()) / 86_400_000) : 99;
  if (diff === 0) return;

  const current = diff === 1 ? s.currentDays + 1 : 1;
  await prisma.streak.update({
    where: { userId },
    data: {
      currentDays: current,
      longestDays: Math.max(current, s.longestDays),
      lastActiveAt: new Date(),
    },
  });
}

/** Matricula perezosa: crea la matricula si no existe (compra, asignacion o gratuito). */
export async function ensureEnrollment(userId: string, courseId: string, origin = "gratuito") {
  const found = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId } },
  });
  if (found) return found;
  return prisma.enrollment.create({ data: { userId, courseId, origin } });
}

export { certificateCode };
