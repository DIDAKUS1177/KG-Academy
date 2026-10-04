import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { puedeCursar } from "@/lib/acceso-cursos";
import { totalPoints } from "@/lib/progress";
import { formatDate, daysBetween, cantidad } from "@/lib/utils";
import { CursosDisponibles } from "./CursosDisponibles";
import { ProgressBar, EmptyState, SectionTitle } from "@/components/ui";
import { SimboloCurso, numeroCurso } from "@/components/SimboloCurso";
import { IconBook, IconAward, IconFire, IconArrowRight, IconPlay, IconClock, IconAlert, IconCheck, IconClipboard } from "@/components/Icons";

export const metadata: Metadata = { title: "Mi aula" };
export const dynamic = "force-dynamic";

/** Fecha límite legible y su urgencia (para los cursos que asignó la empresa). */
function plazo(dueDate: Date | null) {
  if (!dueDate) return null;
  const dias = daysBetween(new Date(dueDate), new Date());
  return {
    texto: dias < 0 ? `Venció el ${formatDate(dueDate)}` : dias === 0 ? "Vence hoy" : `Vence el ${formatDate(dueDate)} · quedan ${cantidad(dias, "día", "días")}`,
    tono: dias < 0 ? "text-red-600" : dias <= 7 ? "text-amber-700" : "text-navy-400",
  };
}

/**
 * Inicio del aula. Pensado para que quien entra por primera vez sepa qué hacer
 * sin explicaciones: un solo botón grande que lleva a la lección que sigue,
 * una guía de tres pasos mientras no haya avance y una sola lista de cursos.
 */
export default async function AulaHome() {
  const user = await requireUser();

  const [enrollments, certificados, streak, points, asignaciones, hechas] = await Promise.all([
    prisma.enrollment.findMany({
      where: { userId: user.id },
      include: { course: { include: { modules: { include: { lessons: { where: { isPublished: true }, select: { id: true } } } } } } },
      orderBy: { lastAccessAt: "desc" },
    }),
    prisma.certificate.findMany({ where: { userId: user.id, status: "vigente" }, select: { code: true, courseId: true } }),
    prisma.streak.findUnique({ where: { userId: user.id } }),
    totalPoints(user.id),
    prisma.courseAssignment.findMany({
      where: { userId: user.id, status: { in: ["asignado", "en_progreso"] } },
      select: { courseId: true, dueDate: true },
    }),
    prisma.lessonProgress.groupBy({ by: ["enrollmentId"], where: { userId: user.id, status: "completado" }, _count: true }),
  ]);

  const plazoDe = new Map(asignaciones.map((a) => [a.courseId, a.dueDate]));
  const hechasDe = new Map(hechas.map((h) => [h.enrollmentId, h._count]));
  const certificadoDe = new Map(certificados.map((c) => [c.courseId, c.code]));

  // Orden: lo empezado, luego lo asignado (lo que vence antes primero), luego lo demás; lo terminado al final.
  const peso = (e: (typeof enrollments)[number]) =>
    e.status === "completado" ? 3 : e.status === "en_progreso" ? 0 : plazoDe.has(e.courseId) ? 1 : 2;
  const cursos = [...enrollments].sort((a, b) => {
    const p = peso(a) - peso(b);
    if (p) return p;
    const da = plazoDe.get(a.courseId)?.getTime() ?? Infinity;
    const db = plazoDe.get(b.courseId)?.getTime() ?? Infinity;
    return da - db;
  });
  // Un curso que KG devolvió a borrador para corregirlo no se ofrece para continuar.
  const disponible = (e: (typeof enrollments)[number]) => puedeCursar(user.role.code, e.course.status, true);
  const continuar = cursos.find((e) => e.status !== "completado" && disponible(e));
  const completados = enrollments.filter((e) => e.status === "completado").length;
  const leccionesDe = (e: (typeof enrollments)[number]) => e.course.modules.reduce((s, m) => s + m.lessons.length, 0);
  const sinAvance = enrollments.every((e) => e.progress === 0);

  return (
    <div className="space-y-8">
      {/* Saludo y lo que sigue */}
      <div className="relative overflow-hidden rounded-3xl bg-kg-gradient p-6 text-white sm:p-8 lg:p-10">
        <div className="pointer-events-none absolute inset-0 bg-kg-mesh" />
        <div className="pointer-events-none absolute inset-0 bg-grid bg-[size:38px_38px] opacity-40" />
        <div className="relative">
          <h1 className="font-display text-3xl font-extrabold tracking-tight lg:text-4xl">Hola, {user.firstName.split(" ")[0]}</h1>
          <p className="mt-1.5 text-sm text-white/70">
            {continuar
              ? continuar.status === "en_progreso"
                ? "Siga donde quedó:"
                : plazoDe.has(continuar.courseId)
                  ? "Su empresa le asignó esta capacitación:"
                  : "Su siguiente curso:"
              : enrollments.length
                ? "¡Está al día con todos sus cursos!"
                : "Elija un curso aquí abajo para empezar."}
          </p>

          {continuar && (
            <Link
              href={`/aula/curso/${continuar.course.slug}#leccion`}
              className="group mt-5 flex flex-wrap items-center gap-4 rounded-2xl bg-white p-4 text-navy-700 shadow-kg-lg transition hover:-translate-y-0.5 sm:p-5"
            >
              <span className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-kg-gradient text-lime-400">
                <SimboloCurso code={continuar.course.code} width={24} height={24} />
                <span className="text-[9px] font-extrabold leading-none">{numeroCurso(continuar.course.code)}</span>
              </span>
              <span className="min-w-[180px] flex-1">
                <span className="block font-display text-base font-extrabold leading-snug sm:text-lg">{continuar.course.title}</span>
                <span className="mt-0.5 block text-xs text-navy-400">
                  {hechasDe.get(continuar.id) ?? 0} de {cantidad(leccionesDe(continuar), "lección", "lecciones")} completadas
                </span>
                <ProgressBar value={continuar.progress} className="mt-2" />
              </span>
              <span className="btn-lime w-full justify-center sm:w-auto">
                <IconPlay width={16} height={16} /> {continuar.progress > 0 ? "Continuar" : "Empezar"}
              </span>
            </Link>
          )}
          {!continuar && certificados.length > 0 && (
            <Link href="/aula/certificados" className="btn-lime mt-5">
              <IconAward width={16} height={16} /> Ver mis certificados
            </Link>
          )}
        </div>
      </div>

      {/* Guía de tres pasos, mientras no haya avance */}
      {continuar && sinAvance && (
        <div className="card p-5">
          <p className="font-display text-sm font-bold text-navy-700">Así funciona</p>
          <ol className="mt-4 grid gap-4 sm:grid-cols-3">
            {[
              { icono: <IconPlay width={18} height={18} />, titulo: "1. Haga las lecciones", texto: "Ábralas en orden. Su avance se guarda solo; puede seguir otro día donde quedó." },
              { icono: <IconClipboard width={18} height={18} />, titulo: "2. Presente la evaluación", texto: "Al terminar las lecciones se abre la evaluación final. Tiene varios intentos." },
              { icono: <IconAward width={18} height={18} />, titulo: "3. Descargue su certificado", texto: "Si aprueba, su certificado queda listo para descargar y verificar con su código." },
            ].map((p) => (
              <li key={p.titulo} className="flex gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-lime-100 text-lime-700">{p.icono}</span>
                <span>
                  <span className="block text-sm font-bold text-navy-700">{p.titulo}</span>
                  <span className="mt-0.5 block text-xs leading-relaxed text-navy-400">{p.texto}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Mis cursos: una sola lista */}
      <div>
        <SectionTitle title="Mis cursos" />
        {cursos.length === 0 ? (
          <EmptyState icon={<IconBook width={30} height={30} />} title="Aún no tiene cursos" description="Elija uno de los cursos disponibles aquí abajo para empezar." />
        ) : (
          <div className="space-y-3">
            {cursos.map((e) => {
              const fecha = e.status !== "completado" ? plazo(plazoDe.get(e.courseId) ?? null) : null;
              const certificado = certificadoDe.get(e.courseId);
              const href = e.status === "completado" && certificado ? `/aula/certificado/${certificado}` : `/aula/curso/${e.course.slug}#leccion`;
              return (
                <Link key={e.id} href={href} className="card card-hover flex flex-wrap items-center gap-4 p-4 sm:p-5">
                  <span className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-kg-gradient text-lime-400">
                    <SimboloCurso code={e.course.code} width={20} height={20} />
                    <span className="text-[8px] font-extrabold leading-none">{numeroCurso(e.course.code)}</span>
                  </span>
                  <span className="min-w-[180px] flex-1">
                    <span className="block font-display text-[15px] font-bold leading-snug text-navy-700">{e.course.title}</span>
                    <span className="mt-0.5 block text-xs text-navy-400">
                      {e.status === "completado"
                        ? "Completado"
                        : `${hechasDe.get(e.id) ?? 0} de ${cantidad(leccionesDe(e), "lección", "lecciones")} · ${e.course.durationHours} h`}
                    </span>
                    {!disponible(e) && (
                      <span className="mt-0.5 block text-xs font-semibold text-amber-700">En actualización: su avance está guardado</span>
                    )}
                    {fecha && (
                      <span className={`mt-0.5 flex items-center gap-1 text-xs font-semibold ${fecha.tono}`}>
                        {fecha.tono === "text-navy-400" ? <IconClock width={12} height={12} /> : <IconAlert width={12} height={12} />} {fecha.texto}
                      </span>
                    )}
                    {e.status !== "completado" && <ProgressBar value={e.progress} className="mt-2" />}
                  </span>
                  <span className={`${e.status === "completado" ? "btn-outline" : "btn-lime"} btn-sm w-full justify-center sm:w-auto`}>
                    {e.status === "completado" ? (
                      <>
                        <IconCheck width={14} height={14} strokeWidth={3} /> {certificado ? "Ver certificado" : "Repasar"}
                      </>
                    ) : (
                      <>
                        {e.progress > 0 ? "Continuar" : "Empezar"} <IconArrowRight width={14} height={14} />
                      </>
                    )}
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Su avance, compacto */}
      {enrollments.length > 0 && (
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 rounded-2xl bg-white px-5 py-4 text-sm text-navy-500 shadow-kg">
          <span className="inline-flex items-center gap-1.5">
            <IconCheck width={15} height={15} className="text-lime-600" strokeWidth={3} /> {cantidad(completados, "curso completado", "cursos completados")}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <IconAward width={15} height={15} className="text-lime-600" /> {cantidad(certificados.length, "certificado", "certificados")}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <IconFire width={15} height={15} className="text-amber-500" /> Racha de {cantidad(streak?.currentDays ?? 0, "día", "días")} · {points} puntos
          </span>
          <Link href="/aula/logros" className="ml-auto text-xs font-bold text-lime-700 hover:underline">
            Ver mis logros
          </Link>
        </div>
      )}

      <div id="disponibles">
        <CursosDisponibles userId={user.id} rol={user.role.code} companyId={user.companyId} />
      </div>
    </div>
  );
}
