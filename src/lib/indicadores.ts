/**
 * Indicadores de gestión de la capacitación de una empresa.
 *
 * Cada indicador declara su fórmula y, si aplica, una meta con la que se
 * calcula el semáforo. Las metas son referencias de buena práctica para el
 * SG-SST; cada empresa puede fijar las suyas en su plan de trabajo anual.
 *
 * Se calculan sobre los trabajadores (rol estudiante) vinculados y no
 * retirados. Los usan el panel de la empresa, el informe imprimible y el
 * reporte "indicadores".
 */
import { prisma } from "@/lib/prisma";
import { ROLES } from "@/lib/constants";

export type Indicador = {
  clave: string;
  grupo: "Cobertura" | "Cumplimiento" | "Aprendizaje" | "Participación" | "Vigencia";
  nombre: string;
  /** null cuando todavía no hay datos para calcularlo. */
  valor: number | null;
  unidad: "%" | "h" | "días" | "";
  meta?: { valor: number; sentido: "min" | "max" };
  formula: string;
  detalle: string;
};

export type Semaforo = "cumple" | "alerta" | "no_cumple" | "sin_meta" | "sin_datos";

const DIA = 86_400_000;
const pct = (n: number, d: number) => (d ? (n / d) * 100 : null);
const promedio = (xs: number[]) => (xs.length ? xs.reduce((s, x) => s + x, 0) / xs.length : null);

/** Semáforo: en la meta cumple; a menos de 15 puntos (o el doble del máximo) es alerta. */
export function semaforo(i: Indicador): Semaforo {
  if (i.valor === null) return "sin_datos";
  if (!i.meta) return "sin_meta";
  const { valor: m, sentido } = i.meta;
  if (sentido === "min") return i.valor >= m ? "cumple" : i.valor >= m - 15 ? "alerta" : "no_cumple";
  return i.valor <= m ? "cumple" : i.valor <= Math.max(m * 2, m + 5) ? "alerta" : "no_cumple";
}

export const ETIQUETA_SEMAFORO: Record<Semaforo, string> = {
  cumple: "Cumple",
  alerta: "Alerta",
  no_cumple: "No cumple",
  sin_meta: "Informativo",
  sin_datos: "Sin datos",
};

/** Valor con su unidad, listo para mostrar. */
export function mostrarValor(i: Indicador) {
  if (i.valor === null) return "—";
  const v = i.unidad === "%" || i.unidad === "días" ? Math.round(i.valor) : Math.round(i.valor * 10) / 10;
  return i.unidad === "%" ? `${v}%` : i.unidad ? `${v} ${i.unidad}` : String(v);
}

export function mostrarMeta(i: Indicador) {
  if (!i.meta) return "—";
  if (i.meta.sentido === "max" && i.meta.valor === 0) return "0";
  const u = i.unidad === "%" ? "%" : i.unidad ? ` ${i.unidad}` : "";
  return `${i.meta.sentido === "min" ? "≥" : "≤"} ${i.meta.valor}${u}`;
}

export async function indicadoresEmpresa(companyId: string): Promise<Indicador[]> {
  const hoy = new Date();
  const miembros = await prisma.companyMember.findMany({
    where: { companyId, status: { not: "retirado" }, user: { role: { code: ROLES.ESTUDIANTE } } },
    select: { userId: true, user: { select: { lastLoginAt: true } } },
  });
  const ids = miembros.map((m) => m.userId);

  const [asignaciones, intentos, certificados, tiempo] = await Promise.all([
    prisma.courseAssignment.findMany({
      where: { companyId, userId: { in: ids } },
      select: { userId: true, status: true, dueDate: true, createdAt: true, enrollment: { select: { completedAt: true, finalScore: true } } },
    }),
    prisma.assessmentAttempt.findMany({
      where: { userId: { in: ids }, status: "finalizado", attemptNo: 1, assessment: { type: "final" } },
      select: { passed: true },
    }),
    prisma.certificate.findMany({
      where: { userId: { in: ids }, status: "vigente" },
      select: { hours: true, expiresAt: true },
    }),
    prisma.lessonProgress.aggregate({ where: { userId: { in: ids } }, _sum: { timeSpentSec: true } }),
  ]);

  const total = ids.length;
  const conCurso = new Set(asignaciones.map((a) => a.userId)).size;
  const completadas = asignaciones.filter((a) => a.status === "completado");
  const vencidas = asignaciones.filter((a) => a.dueDate && a.dueDate < hoy && a.status !== "completado");
  // Oportunidad: entre las asignaciones con fecha límite cuyo plazo ya se cumplió
  // o que ya se completaron, cuántas se terminaron dentro del plazo.
  const conPlazo = asignaciones.filter((a) => a.dueDate && (a.dueDate < hoy || a.status === "completado"));
  const aTiempo = conPlazo.filter(
    (a) => a.status === "completado" && a.enrollment?.completedAt && a.dueDate && a.enrollment.completedAt <= a.dueDate
  );
  const notas = completadas.map((a) => a.enrollment?.finalScore).filter((n): n is number => typeof n === "number");
  const dias = completadas
    .filter((a) => a.enrollment?.completedAt)
    .map((a) => (a.enrollment!.completedAt!.getTime() - a.createdAt.getTime()) / DIA);
  const activados = miembros.filter((m) => m.user.lastLoginAt).length;
  const activos30 = miembros.filter((m) => m.user.lastLoginAt && hoy.getTime() - m.user.lastLoginAt.getTime() <= 30 * DIA).length;
  const vigentes = certificados.filter((c) => !c.expiresAt || c.expiresAt > hoy);
  const porVencer = vigentes.filter((c) => c.expiresAt && c.expiresAt.getTime() - hoy.getTime() <= 60 * DIA).length;
  const horas = vigentes.reduce((s, c) => s + c.hours, 0);
  const aprobados1 = intentos.filter((i) => i.passed).length;

  return [
    {
      clave: "cobertura",
      grupo: "Cobertura",
      nombre: "Cobertura de capacitación",
      valor: pct(conCurso, total),
      unidad: "%",
      meta: { valor: 90, sentido: "min" },
      formula: "Trabajadores con al menos un curso asignado ÷ trabajadores vinculados × 100",
      detalle: `${conCurso} de ${total} trabajadores`,
    },
    {
      clave: "cumplimiento",
      grupo: "Cumplimiento",
      nombre: "Cumplimiento del programa",
      valor: pct(completadas.length, asignaciones.length),
      unidad: "%",
      meta: { valor: 80, sentido: "min" },
      formula: "Cursos completados ÷ cursos asignados × 100",
      detalle: `${completadas.length} de ${asignaciones.length} asignaciones`,
    },
    {
      clave: "oportunidad",
      grupo: "Cumplimiento",
      nombre: "Cumplimiento dentro del plazo",
      valor: pct(aTiempo.length, conPlazo.length),
      unidad: "%",
      meta: { valor: 85, sentido: "min" },
      formula: "Cursos completados antes de su fecha límite ÷ cursos con fecha límite ya cumplida o completados × 100",
      detalle: `${aTiempo.length} de ${conPlazo.length} con plazo`,
    },
    {
      clave: "vencidas",
      grupo: "Cumplimiento",
      nombre: "Asignaciones vencidas",
      valor: pct(vencidas.length, asignaciones.length),
      unidad: "%",
      meta: { valor: 5, sentido: "max" },
      formula: "Cursos no completados con la fecha límite ya pasada ÷ cursos asignados × 100",
      detalle: `${vencidas.length} vencidas`,
    },
    {
      clave: "aprobacion",
      grupo: "Aprendizaje",
      nombre: "Aprobación en el primer intento",
      valor: pct(aprobados1, intentos.length),
      unidad: "%",
      meta: { valor: 70, sentido: "min" },
      formula: "Evaluaciones finales aprobadas en el primer intento ÷ primeros intentos presentados × 100",
      detalle: `${aprobados1} de ${intentos.length} primeros intentos`,
    },
    {
      clave: "nota",
      grupo: "Aprendizaje",
      nombre: "Nota promedio de aprobación",
      valor: promedio(notas),
      unidad: "",
      meta: { valor: 85, sentido: "min" },
      formula: "Promedio de la nota final (sobre 100) de los cursos completados",
      detalle: `${notas.length} cursos completados con nota`,
    },
    {
      clave: "activacion",
      grupo: "Participación",
      nombre: "Activación de cuentas",
      valor: pct(activados, total),
      unidad: "%",
      meta: { valor: 90, sentido: "min" },
      formula: "Trabajadores que ya ingresaron al menos una vez ÷ trabajadores vinculados × 100",
      detalle: `${activados} de ${total} ya ingresaron`,
    },
    {
      clave: "participacion",
      grupo: "Participación",
      nombre: "Participación en los últimos 30 días",
      valor: pct(activos30, total),
      unidad: "%",
      meta: { valor: 60, sentido: "min" },
      formula: "Trabajadores que ingresaron en los últimos 30 días ÷ trabajadores vinculados × 100",
      detalle: `${activos30} de ${total} trabajadores`,
    },
    {
      clave: "dias",
      grupo: "Participación",
      nombre: "Tiempo promedio para completar un curso",
      valor: promedio(dias),
      unidad: "días",
      meta: { valor: 30, sentido: "max" },
      formula: "Promedio de días entre la asignación y la finalización del curso",
      detalle: `${dias.length} cursos completados`,
    },
    {
      clave: "horas",
      grupo: "Vigencia",
      nombre: "Horas de formación certificadas por trabajador",
      valor: total ? horas / total : null,
      unidad: "h",
      formula: "Horas de los certificados vigentes ÷ trabajadores vinculados",
      detalle: `${Math.round(horas)} h certificadas en total`,
    },
    {
      clave: "estudio",
      grupo: "Vigencia",
      nombre: "Tiempo de estudio registrado",
      valor: (tiempo._sum.timeSpentSec ?? 0) / 3600,
      unidad: "h",
      formula: "Suma del tiempo que los trabajadores pasaron dentro de las lecciones",
      detalle: total ? `${Math.round((tiempo._sum.timeSpentSec ?? 0) / 60 / total)} min por trabajador` : "Sin trabajadores",
    },
    {
      clave: "por_vencer",
      grupo: "Vigencia",
      nombre: "Certificados por vencer (60 días)",
      valor: porVencer,
      unidad: "",
      meta: { valor: 0, sentido: "max" },
      formula: "Certificados vigentes que vencen en los próximos 60 días: programar el reentrenamiento",
      detalle: `${vigentes.length} certificados vigentes`,
    },
  ];
}
