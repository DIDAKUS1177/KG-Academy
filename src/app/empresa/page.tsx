import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { resolveCompany, companyKpis } from "@/lib/empresa";
import { ROLES } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import {
  StatCard,
  SectionTitle,
  ProgressBar,
  ProgressRing,
  StatusBadge,
  EmptyState,
  Avatar,
} from "@/components/ui";
import {
  IconUsers,
  IconCheck,
  IconClock,
  IconAlert,
  IconArrowRight,
  IconClipboard,
  IconBuilding,
} from "@/components/Icons";

export const metadata: Metadata = { title: "Panel empresarial" };
export const dynamic = "force-dynamic";

export default async function EmpresaDashboard({ searchParams }: { searchParams: { empresa?: string } }) {
  const user = await requireRole(ROLES.ADMIN_EMPRESA, ROLES.SUPERVISOR, ROLES.SUPERADMIN, ROLES.ADMIN_KG);
  const company = await resolveCompany(user, searchParams.empresa);

  if (!company) {
    return (
      <EmptyState
        icon={<IconBuilding width={30} height={30} />}
        title="Su usuario no esta vinculado a una empresa"
        description="Solicite al administrador de KG Academy la vinculacion de su cuenta a una empresa."
      />
    );
  }

  const kpis = await companyKpis(company.id);

  const [porCurso, porArea, recientes, workers] = await Promise.all([
    prisma.courseAssignment.findMany({
      where: { companyId: company.id },
      include: { course: true, enrollment: true },
    }),
    prisma.companyMember.findMany({
      where: { companyId: company.id },
      include: { area: true, user: { include: { enrollments: true } } },
    }),
    prisma.courseAssignment.findMany({
      where: { companyId: company.id },
      include: { user: true, course: true, enrollment: true },
      orderBy: { updatedAt: "desc" },
      take: 8,
    }),
    prisma.companyMember.count({ where: { companyId: company.id, status: "activo" } }),
  ]);

  // Agregado por curso
  const cursos = new Map<string, { title: string; total: number; done: number; avance: number }>();
  for (const a of porCurso) {
    const cur = cursos.get(a.courseId) ?? { title: a.course.title, total: 0, done: 0, avance: 0 };
    cur.total++;
    if (a.status === "completado") cur.done++;
    cur.avance += a.enrollment?.progress ?? 0;
    cursos.set(a.courseId, cur);
  }

  // Agregado por area
  const areas = new Map<string, { total: number; avance: number }>();
  for (const m of porArea) {
    const key = m.area?.name ?? "Sin area";
    const cur = areas.get(key) ?? { total: 0, avance: 0 };
    const prom =
      m.user.enrollments.length > 0
        ? m.user.enrollments.reduce((s, e) => s + e.progress, 0) / m.user.enrollments.length
        : 0;
    cur.total++;
    cur.avance += prom;
    areas.set(key, cur);
  }

  return (
    <div className="space-y-8">
      {/* Encabezado */}
      <div className="relative overflow-hidden rounded-3xl bg-kg-gradient p-8 text-white lg:p-10">
        <div className="pointer-events-none absolute inset-0 bg-kg-mesh" />
        <div className="pointer-events-none absolute inset-0 bg-grid bg-[size:38px_38px] opacity-40" />
        <div className="relative flex flex-wrap items-center justify-between gap-8">
          <div>
            <p className="eyebrow">Panel empresarial</p>
            <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight lg:text-4xl">
              {company.tradeName ?? company.legalName}
            </h1>
            <p className="mt-2 text-sm text-white/55">
              NIT {company.nit} &middot; {company.economicSector} &middot; Riesgo {company.riskLevel} &middot;{" "}
              {workers} trabajadores activos
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/empresa/asignar" className="btn-lime">
                <IconClipboard width={16} height={16} /> Asignar cursos
              </Link>
              <Link
                href="/empresa/reportes"
                className="btn border border-white/20 bg-white/5 text-white hover:bg-white/10"
              >
                Ver reportes
              </Link>
            </div>
          </div>
          <div className="rounded-2xl border border-white/15 bg-white/10 p-5 text-center backdrop-blur">
            <ProgressRing value={kpis.cumplimiento} size={132} sub="cumplimiento" />
            <p className="mt-2 text-[11px] text-white/50">
              {kpis.completados} de {kpis.total} asignaciones
            </p>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Asignaciones" value={kpis.total} icon={<IconClipboard width={20} height={20} />} />
        <StatCard label="Completadas" value={kpis.completados} tone="lime" icon={<IconCheck width={20} height={20} />} />
        <StatCard label="En progreso" value={kpis.enProgreso} tone="amber" icon={<IconClock width={20} height={20} />} />
        <StatCard
          label="Vencidas"
          value={kpis.vencidos}
          tone="red"
          hint={`${kpis.noIniciados} sin iniciar`}
          icon={<IconAlert width={20} height={20} />}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Avance por curso */}
        <div className="card p-6">
          <p className="font-display text-base font-bold text-navy-700">Avance por curso</p>
          <p className="text-xs text-navy-400">Promedio de progreso de los trabajadores asignados</p>
          <div className="mt-5 space-y-5">
            {[...cursos.entries()].map(([id, c]) => (
              <div key={id}>
                <div className="mb-1.5 flex items-baseline justify-between gap-3">
                  <p className="truncate text-sm font-semibold text-navy-700">{c.title}</p>
                  <span className="shrink-0 text-xs font-bold text-navy-500">
                    {Math.round(c.avance / c.total)}%
                  </span>
                </div>
                <ProgressBar value={c.avance / c.total} />
                <p className="mt-1 text-[11px] text-navy-400">
                  {c.done} de {c.total} trabajadores completaron
                </p>
              </div>
            ))}
            {cursos.size === 0 && (
              <p className="py-6 text-center text-sm text-navy-300">Aun no hay cursos asignados</p>
            )}
          </div>
        </div>

        {/* Avance por area */}
        <div className="card p-6">
          <p className="font-display text-base font-bold text-navy-700">Avance por area</p>
          <p className="text-xs text-navy-400">Indicador de capacitacion por area organizacional</p>
          <div className="mt-5 space-y-5">
            {[...areas.entries()].map(([name, a]) => (
              <div key={name}>
                <div className="mb-1.5 flex items-baseline justify-between gap-3">
                  <p className="truncate text-sm font-semibold text-navy-700">{name}</p>
                  <span className="shrink-0 text-xs font-bold text-navy-500">
                    {Math.round(a.avance / a.total)}%
                  </span>
                </div>
                <ProgressBar value={a.avance / a.total} />
                <p className="mt-1 text-[11px] text-navy-400">{a.total} trabajadores</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Actividad reciente */}
      <div>
        <SectionTitle
          eyebrow="Trazabilidad"
          title="Actividad reciente"
          action={
            <Link href="/empresa/seguimiento" className="btn-outline btn-sm">
              Ver seguimiento completo <IconArrowRight width={14} height={14} />
            </Link>
          }
        />
        <div className="card overflow-x-auto">
          <table className="table-kg">
            <thead>
              <tr>
                <th>Trabajador</th>
                <th>Curso</th>
                <th className="w-48">Avance</th>
                <th>Estado</th>
                <th>Fecha limite</th>
              </tr>
            </thead>
            <tbody>
              {recientes.map((a) => (
                <tr key={a.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <Avatar first={a.user.firstName} last={a.user.lastName} size={32} />
                      <span className="font-semibold">
                        {a.user.firstName} {a.user.lastName}
                      </span>
                    </div>
                  </td>
                  <td className="text-navy-500">{a.course.title}</td>
                  <td>
                    <ProgressBar value={a.enrollment?.progress ?? 0} showLabel />
                  </td>
                  <td>
                    <StatusBadge status={a.status} />
                  </td>
                  <td className="text-xs text-navy-400">{formatDate(a.dueDate)}</td>
                </tr>
              ))}
              {recientes.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-sm text-navy-300">
                    Sin actividad registrada
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="flex items-center justify-center gap-2 text-center text-[11px] text-navy-300">
        <IconUsers width={13} height={13} /> Los datos de esta empresa estan aislados de las demas
        empresas de la plataforma.
      </p>
    </div>
  );
}
