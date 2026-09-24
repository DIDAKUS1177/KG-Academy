/**
 * La evaluación final se abre cuando el estudiante termina las lecciones.
 *
 * Presentarla antes no certificaba (el curso exige ambas cosas), pero sí
 * gastaba intentos sin haber estudiado. Se cuentan solo las lecciones
 * obligatorias y publicadas: una en preparación no puede bloquear a nadie.
 */
import { prisma } from "@/lib/prisma";

export async function leccionesPendientes(enrollmentId: string, courseId: string) {
  const lecciones = await prisma.lesson.findMany({
    where: { module: { courseId }, isRequired: true, isPublished: true },
    select: { id: true },
  });
  if (lecciones.length === 0) return 0;
  const hechas = await prisma.lessonProgress.count({
    where: { enrollmentId, lessonId: { in: lecciones.map((l) => l.id) }, status: "completado" },
  });
  return lecciones.length - hechas;
}

export function exigeLecciones(tipo: string, curso: { requiresAllLessons: boolean }) {
  return tipo === "final" && curso.requiresAllLessons;
}
