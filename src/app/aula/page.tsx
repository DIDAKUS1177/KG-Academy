import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { totalPoints } from "@/lib/progress";
import { formatDate, daysBetween } from "@/lib/utils";
import { ProgressRing, ProgressBar, StatCard, StatusBadge, EmptyState, SectionTitle } from "@/components/ui";
import {
  IconBook,
  IconAward,
  IconFire,
  IconSpark,
  IconArrowRight,
  IconPlay,
  IconClock,
  IconAlert,
} from "@/components/Icons";

export const metadata: Metadata = { title: "Mi aula" };
export const dynamic = "force-dynamic";

export default async function AulaHome() {
  const user = await requireUser();

  const [enrollments, certificates, streak, points, pendingAssignments] = await Promise.all([
    prisma.enrollment.findMany({
      where: { userId: user.id },
      include: { course: { include: { modules: { include: { lessons: true } } } } },
      orderBy: { lastAccessAt: "desc" },
    }),
    prisma.certificate.count({ where: { userId: user.id, status: "vigente" } }),
    prisma.streak.findUnique({ where: { userId: user.id } }),
    totalPoints(user.id),
    prisma.courseAssignment.findMany({
      where: { userId: user.id, status: { in: ["asignado", "en_progreso"] } },
      include: { course: true },
      orderBy: { dueDate: "asc" },
    }),
  ]);

  const enProgreso = enrollments.filter((e) => e.status === "en_progreso");
  const completados = enrollments.filter((e) => e.status === "completado");
  const avanceGlobal =
    enrollments.length > 0
      ? enrollments.reduce((s, e) => s + e.progress, 0) / enrollments.length
      : 0;

  const continuar = enProgreso[0] ?? enrollments.find((e) => e.status === "no_iniciado");

  return (
    <div className="space-y-8">
      {/* Saludo */}
      <div className="relative overflow-hidden rounded-3xl bg-kg-gradient p-8 text-white lg:p-10">
        <div className="pointer-events-none absolute inset-0 bg-kg-mesh" />
        <div className="pointer-events-none absolute inset-0 bg-grid bg-[size:38px_38px] opacity-40" />
        <div className="relative flex flex-wrap items-center justify-between gap-8">
          <div>
            <p className="eyebrow">Aula virtual KG Academy</p>
            <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight lg:text-4xl">
              Hola, {user.firstName.split(" ")[0]}
            </h1>
            <p className="mt-2 max-w-lg text-sm text-white/60">
              {enProgreso.length > 0
                ? `Tiene ${enProgreso.length} curso(s) en progreso. Retome donde quedo.`
                : "Explore el catalogo y comience su primera capacitacion."}
            </p>
            {continuar && (
              <Link href={`/aula/curso/${continuar.course.slug}`} className="btn-lime mt-6">
                <IconPlay width={16} height={16} />
                {continuar.progress > 0 ? "Continuar donde quede" : "Comenzar curso"}
              </Link>
            )}
          </div>
          <div className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur">
            <ProgressRing value={avanceGlobal} size={132} sub="avance global" />
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Cursos activos" value={enProgreso.length} icon={<IconBook width={20} height={20} />} />
        <StatCard label="Cursos completados" value={completados.length} tone="lime" icon={<IconAward width={20} height={20} />} />
        <StatCard label="Certificados" value={certificates} tone="lime" icon={<IconAward width={20} height={20} />} />
        <StatCard
          label="Racha de estudio"
          value={`${streak?.currentDays ?? 0} d`}
          hint={`${points} puntos acumulados`}
          tone="amber"
          icon={<IconFire width={20} height={20} />}
        />
      </div>

      {/* Asignaciones con fecha limite */}
      {pendingAssignments.length > 0 && (
        <div>
          <SectionTitle
            eyebrow="Su empresa le asigno"
            title="Capacitaciones pendientes"
            description="Cursos asignados por su empresa con fecha limite de cumplimiento."
          />
          <div className="grid gap-4 md:grid-cols-2">
            {pendingAssignments.map((a) => {
              const dias = a.dueDate ? daysBetween(new Date(a.dueDate), new Date()) : null;
              const urgente = dias !== null && dias <= 7;
              return (
                <Link
                  key={a.id}
                  href={`/aula/curso/${a.course.slug}`}
                  className="card card-hover flex items-center gap-4 p-5"
                >
                  <span
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                      urgente ? "bg-amber-100 text-amber-700" : "bg-navy-50 text-navy-500"
                    }`}
                  >
                    {urgente ? <IconAlert width={22} height={22} /> : <IconClock width={22} height={22} />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-display text-[15px] font-bold text-navy-700">
                      {a.course.title}
                    </p>
                    <p className="mt-0.5 text-xs text-navy-400">
                      {a.dueDate ? (
                        <>
                          Fecha limite: {formatDate(a.dueDate)}
                          {dias !== null && (
                            <span className={urgente ? "font-bold text-amber-600" : ""}>
                              {" "}
                              &middot; {dias > 0 ? `quedan ${dias} dias` : "vencida"}
                            </span>
                          )}
                        </>
                      ) : (
                        "Sin fecha limite"
                      )}
                    </p>
                  </div>
                  <StatusBadge status={a.status} />
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Mis cursos */}
      <div>
        <SectionTitle
          eyebrow="Mi aprendizaje"
          title="Mis cursos"
          action={
            <Link href="/aula/cursos" className="btn-outline btn-sm">
              Ver todos <IconArrowRight width={14} height={14} />
            </Link>
          }
        />

        {enrollments.length === 0 ? (
          <EmptyState
            icon={<IconBook width={30} height={30} />}
            title="Aun no tiene cursos"
            description="Explore el catalogo de KG Academy e inscribase en su primer curso."
            action={
              <Link href="/catalogo" className="btn-lime">
                Ver catalogo
              </Link>
            }
          />
        ) : (
          <div className="space-y-3">
            {enrollments.slice(0, 5).map((e) => {
              const totalLessons = e.course.modules.reduce((s, m) => s + m.lessons.length, 0);
              return (
                <Link
                  key={e.id}
                  href={`/aula/curso/${e.course.slug}`}
                  className="card card-hover flex flex-wrap items-center gap-5 p-5"
                >
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-kg-gradient font-display text-xs font-bold text-lime-400">
                    {e.course.code.split("-").pop()}
                  </span>
                  <div className="min-w-[220px] flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-display text-[15px] font-bold text-navy-700">{e.course.title}</p>
                      <StatusBadge status={e.status} />
                    </div>
                    <p className="mt-0.5 text-xs text-navy-400">
                      {e.course.modules.length} modulos &middot; {totalLessons} lecciones &middot;{" "}
                      {e.course.durationHours} h
                    </p>
                    <ProgressBar value={e.progress} className="mt-3" showLabel />
                  </div>
                  <span className="btn-outline btn-sm shrink-0">
                    {e.progress > 0 ? "Continuar" : "Comenzar"} <IconArrowRight width={13} height={13} />
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Gamificacion */}
      <div className="grid gap-5 lg:grid-cols-3">
        <div className="card p-6 lg:col-span-2">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime-100 text-lime-700">
              <IconSpark width={20} height={20} />
            </span>
            <div>
              <p className="font-display text-base font-bold text-navy-700">Su progreso general</p>
              <p className="text-xs text-navy-400">Avance promedio en todos sus cursos</p>
            </div>
            <span className="ml-auto font-display text-3xl font-extrabold text-lime-600">
              {Math.round(avanceGlobal)}%
            </span>
          </div>
          <ProgressBar value={avanceGlobal} className="mt-5" />
          <div className="mt-5 grid grid-cols-3 gap-4 border-t border-navy-50 pt-5 text-center">
            {[
              ["No iniciados", enrollments.filter((e) => e.status === "no_iniciado").length],
              ["En progreso", enProgreso.length],
              ["Completados", completados.length],
            ].map(([l, v]) => (
              <div key={String(l)}>
                <p className="font-display text-2xl font-extrabold text-navy-700">{v}</p>
                <p className="text-[11px] text-navy-400">{l}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="card flex flex-col items-center justify-center p-6 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
            <IconFire width={26} height={26} />
          </span>
          <p className="mt-4 font-display text-4xl font-extrabold text-navy-700">
            {streak?.currentDays ?? 0}
          </p>
          <p className="text-xs font-semibold uppercase tracking-wide text-navy-400">dias de racha</p>
          <p className="mt-2 text-xs text-navy-400">
            Racha mas larga: {streak?.longestDays ?? 0} dias
          </p>
          <Link href="/aula/logros" className="btn-outline btn-sm mt-5">
            Ver mis logros
          </Link>
        </div>
      </div>
    </div>
  );
}
