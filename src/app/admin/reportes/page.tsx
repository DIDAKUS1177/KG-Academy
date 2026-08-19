import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { ROLES } from "@/lib/constants";
import { ProgressBar, SectionTitle, StatCard } from "@/components/ui";
import { IconChart, IconUsers, IconAward, IconBook, IconDownload } from "@/components/Icons";

export const metadata: Metadata = { title: "Reportes globales" };
export const dynamic = "force-dynamic";

export default async function AdminReportes() {
  await requireRole(ROLES.SUPERADMIN, ROLES.ADMIN_KG);

  const [companies, courses, enrollments, certificates, attempts] = await Promise.all([
    prisma.company.findMany({ include: { assignments: { include: { enrollment: true } }, members: true } }),
    prisma.course.findMany({ include: { enrollments: true, certificates: true } }),
    prisma.enrollment.findMany(),
    prisma.certificate.count(),
    prisma.assessmentAttempt.findMany({ where: { status: "finalizado" } }),
  ]);

  const completados = enrollments.filter((e) => e.status === "completado").length;
  const tasaFinalizacion = enrollments.length ? (completados / enrollments.length) * 100 : 0;
  const notaProm = attempts.length ? attempts.reduce((s, a) => s + a.score, 0) / attempts.length : 0;

  return (
    <div>
      <SectionTitle
        eyebrow="Administración"
        title="Reportes globales"
        description="Indicadores consolidados de toda la plataforma."
      />

      <div className="mb-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Matrículas" value={enrollments.length} icon={<IconBook width={20} height={20} />} />
        <StatCard
          label="Tasa de finalización"
          value={`${Math.round(tasaFinalizacion)}%`}
          tone="lime"
          icon={<IconChart width={20} height={20} />}
        />
        <StatCard label="Certificados" value={certificates} tone="lime" icon={<IconAward width={20} height={20} />} />
        <StatCard
          label="Nota promedio"
          value={Math.round(notaProm)}
          hint={`${attempts.length} evaluaciones presentadas`}
          tone="amber"
          icon={<IconUsers width={20} height={20} />}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <p className="font-display text-base font-bold text-navy-700">Cumplimiento por empresa</p>
          <div className="mt-5 space-y-5">
            {companies.map((c) => {
              const total = c.assignments.length;
              const done = c.assignments.filter((a) => a.status === "completado").length;
              const pct = total ? (done / total) * 100 : 0;
              return (
                <div key={c.id}>
                  <div className="mb-1.5 flex items-baseline justify-between gap-3">
                    <p className="truncate text-sm font-semibold text-navy-700">
                      {c.tradeName ?? c.legalName}
                    </p>
                    <span className="shrink-0 text-xs font-bold text-navy-500">{Math.round(pct)}%</span>
                  </div>
                  <ProgressBar value={pct} />
                  <p className="mt-1 text-[11px] text-navy-400">
                    {c.members.length} trabajadores &middot; {done}/{total} asignaciones completadas
                  </p>
                </div>
              );
            })}
            {companies.length === 0 && (
              <p className="py-6 text-center text-sm text-navy-300">Sin empresas registradas</p>
            )}
          </div>
        </div>

        <div className="card p-6">
          <p className="font-display text-base font-bold text-navy-700">Desempeño por curso</p>
          <div className="mt-5 space-y-5">
            {courses.map((c) => {
              const av = c.enrollments.length
                ? c.enrollments.reduce((s, e) => s + e.progress, 0) / c.enrollments.length
                : 0;
              return (
                <div key={c.id}>
                  <div className="mb-1.5 flex items-baseline justify-between gap-3">
                    <p className="truncate text-sm font-semibold text-navy-700">{c.title}</p>
                    <span className="shrink-0 text-xs font-bold text-navy-500">{Math.round(av)}%</span>
                  </div>
                  <ProgressBar value={av} />
                  <p className="mt-1 text-[11px] text-navy-400">
                    {c.enrollments.length} matrículas &middot; {c.certificates.length} certificados
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="card mt-6 flex flex-wrap items-center gap-5 p-6">
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy-700 text-lime-400">
          <IconDownload width={22} height={22} />
        </span>
        <div className="min-w-[220px] flex-1">
          <p className="font-display text-base font-bold text-navy-700">Exportación consolidada</p>
          <p className="text-sm text-navy-400">
            Descargue el seguimiento por empresa desde el panel empresarial de cada cliente.
          </p>
        </div>
        <a href="/api/empresa/reporte?tipo=certificados" className="btn-lime btn-sm">
          Certificados (CSV)
        </a>
      </div>
    </div>
  );
}
