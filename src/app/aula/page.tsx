import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { totalPoints } from "@/lib/progress";
import { formatDate, daysBetween, cantidad } from "@/lib/utils";
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

  // Lo primero que se sugiere: seguir lo empezado; si no, lo que asignó la empresa.
  const asignado = pendingAssignments[0]
    ? enrollments.find((e) => e.courseId === pendingAssignments[0].courseId)
    : undefined;
  const continuar = enProgreso[0] ?? asignado ?? enrollments.find((e) => e.status === "no_iniciado");

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
                ? `Tiene ${cantidad(enProgreso.length, "curso", "cursos")} en progreso. Retome donde quedó.`
                : pendingAssignments.length > 0
                  ? `Su empresa le asignó ${cantidad(pendingAssignments.length, "capacitación", "capacitaciones")}.`
                  : enrollments.length > 0
                    ? "Todo al día. Puede repasar sus cursos cuando quiera."
                    : "Explore el catálogo y comience su primera capacitación."}
            </p>
            {continuar && (
              <Link href={`/aula/curso/${continuar.course.slug}`} className="btn-lime mt-6">
                <IconPlay width={16} height={16} />
                {continuar.progress > 0 ? "Continuar donde quedó" : "Comenzar curso"}
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
        <StatCard label="En progreso" value={enProgreso.length} icon={<IconBook width={20} height={20} />} />
        <StatCard label="Completados" value={completados.length} tone="lime" icon={<IconAward width={20} height={20} />} />
        <StatCard label="Certificados" value={certificates} tone="lime" icon={<IconAward width={20} height={20} />} />
        <StatCard
          label="Racha de estudio"
          value={`${streak?.currentDays ?? 0} d`}
          hint={`${points} puntos acumulados`}
          tone="amber"
          icon={<IconFire width={20} height={20} />}
        />
      </div>

      {/* Asignaciones con fecha límite */}
      {pendingAssignments.length > 0 && (
        <div>
          <SectionTitle
            eyebrow="Su empresa le asignó"
            title="Capacitaciones pendientes"
            description="Cursos asignados por su empresa con fecha límite de cumplimiento."
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
                          Fecha límite: {formatDate(a.dueDate)}
                          {dias !== null && (
                            <span className={urgente ? "font-bold text-amber-600" : ""}>
                              {" "}
                              &middot; {dias > 0 ? `quedan ${dias} días` : "vencida"}
                            </span>
                          )}
                        </>
                      ) : (
                        "Sin fecha límite"
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
            title="Aún no tiene cursos"
            description="Explore el catálogo de KG Academy e inscríbase en su primer curso."
            action={
              <Link href="/catalogo" className="btn-lime">
                Ver catálogo
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
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-kg-gradient text-lime-400">
                    <IconBook width={22} height={22} />
                  </span>
                  <div className="min-w-[220px] flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-display text-[15px] font-bold text-navy-700">{e.course.title}</p>
                      <StatusBadge status={e.status} />
                    </div>
                    <p className="mt-0.5 text-xs text-navy-400">
                      {cantidad(e.course.modules.length, "módulo", "módulos")} &middot; {cantidad(totalLessons, "lección", "lecciones")} &middot;{" "}
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

    </div>
  );
}
