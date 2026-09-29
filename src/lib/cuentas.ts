/**
 * Cuándo se puede borrar una cuenta.
 *
 * Solo las que no dejaron rastro: creadas por error o de prueba. Quien ya
 * presentó evaluaciones, tiene certificados o avance en lecciones es evidencia
 * ante la ARL y se inactiva o bloquea, no se borra. Sesiones, matrículas sin
 * avance, membresías y notificaciones se van con la cuenta; la auditoría queda.
 */
import { prisma } from "@/lib/prisma";

/** Motivo por el que la cuenta no se puede eliminar, o null si se puede. */
export async function motivoParaConservar(userId: string) {
  const c = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      _count: {
        select: {
          attempts: true,
          certificates: true,
          lessonProgress: true,
          orders: true,
          revokedCerts: true,
          coursesTaught: true,
        },
      },
    },
  });
  if (!c) return "Usuario no encontrado";
  const n = c._count;
  if (n.coursesTaught > 0) return "Esta cuenta es instructora de cursos: reasígnelos antes de eliminarla.";
  if (n.attempts + n.certificates + n.lessonProgress + n.orders + n.revokedCerts > 0) {
    return "Esta cuenta ya tiene avance, evaluaciones o certificados y es evidencia ante la ARL: no se elimina, se inactiva.";
  }
  return null;
}
