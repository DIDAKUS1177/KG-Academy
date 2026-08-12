import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { resolveCompany, companyKpis } from "@/lib/empresa";
import { ROLES } from "@/lib/constants";
import { EmptyState, ProgressBar, SectionTitle, StatCard } from "@/components/ui";
import { IconDownload, IconFile, IconUsers, IconAward, IconChart, IconCheck } from "@/components/Icons";

export const metadata: Metadata = { title: "Reportes" };
export const dynamic = "force-dynamic";

export default async function ReportesPage({ searchParams }: { searchParams: { empresa?: string } }) {
  const user = await requireRole(ROLES.ADMIN_EMPRESA, ROLES.SUPERVISOR, ROLES.SUPERADMIN, ROLES.ADMIN_KG);
  const company = await resolveCompany(user, searchParams.empresa);
  if (!company) return <EmptyState title="Sin empresa asociada" />;

  const kpis = await companyKpis(company.id);

  const [porSede, porCargo, certs] = await Promise.all([
    prisma.companyMember.findMany({
      where: { companyId: company.id },
      include: { location: true, position: true, user: { include: { enrollments: true } } },
    }),
    prisma.position.findMany({ where: { companyId: company.id } }),
    prisma.certificate.count({ where: { user: { companyId: company.id } } }),
  ]);

  function agrupar(key: "location" | "position") {
    const map = new Map<string, { total: number; avance: number; completos: number }>();
    for (const m of porSede) {
      const name = key === "location" ? m.location?.name ?? "Sin sede" : m.position?.name ?? "Sin cargo";
      const cur = map.get(name) ?? { total: 0, avance: 0, completos: 0 };
      const enr = m.user.enrollments;
      cur.total++;
      cur.avance += enr.length ? enr.reduce((s, e) => s + e.progress, 0) / enr.length : 0;
      cur.completos += enr.filter((e) => e.status === "completado").length;
      map.set(name, cur);
    }
    return [...map.entries()];
  }

  const REPORTES = [
    {
      titulo: "Reporte de seguimiento",
      desc: "Estado, avance y nota de cada trabajador por curso asignado. Incluye area, cargo, sede y fechas.",
      tipo: "seguimiento",
      icon: <IconChart width={20} height={20} />,
    },
    {
      titulo: "Reporte de trabajadores",
      desc: "Nomina completa con cursos asignados, completados, avance promedio y certificados.",
      tipo: "trabajadores",
      icon: <IconUsers width={20} height={20} />,
    },
    {
      titulo: "Reporte de certificados",
      desc: "Certificados emitidos con codigo de verificacion, intensidad horaria, nota y vigencia.",
      tipo: "certificados",
      icon: <IconAward width={20} height={20} />,
    },
  ];

  return (
    <div>
      <SectionTitle
        eyebrow={company.tradeName ?? company.legalName}
        title="Reportes e indicadores"
        description="Descargue la evidencia de capacitacion para auditorias, ARL y el SG-SST."
      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Cumplimiento" value={`${Math.round(kpis.cumplimiento)}%`} tone="lime" icon={<IconCheck width={20} height={20} />} />
        <StatCard label="Avance promedio" value={`${Math.round(kpis.avance)}%`} icon={<IconChart width={20} height={20} />} />
        <StatCard label="Asignaciones" value={kpis.total} icon={<IconFile width={20} height={20} />} />
        <StatCard label="Certificados" value={certs} tone="lime" icon={<IconAward width={20} height={20} />} />
      </div>

      {/* Descargas */}
      <div className="mt-8 grid gap-5 lg:grid-cols-3">
        {REPORTES.map((r) => (
          <div key={r.tipo} className="card card-hover flex flex-col p-6">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-navy-700 text-lime-400">
              {r.icon}
            </span>
            <h3 className="mt-4 font-display text-base font-bold text-navy-700">{r.titulo}</h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-navy-400">{r.desc}</p>
            <a
              href={`/api/empresa/reporte?tipo=${r.tipo}&empresa=${company.id}`}
              className="btn-lime btn-sm mt-5 self-start"
            >
              <IconDownload width={14} height={14} /> Descargar CSV
            </a>
          </div>
        ))}
      </div>

      {/* Indicadores por sede y cargo */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {(
          [
            ["Indicador por sede", agrupar("location")],
            ["Indicador por cargo", agrupar("position")],
          ] as const
        ).map(([titulo, datos]) => (
          <div key={titulo} className="card p-6">
            <p className="font-display text-base font-bold text-navy-700">{titulo}</p>
            <div className="mt-5 space-y-5">
              {datos.map(([name, d]) => (
                <div key={name}>
                  <div className="mb-1.5 flex items-baseline justify-between gap-3">
                    <p className="truncate text-sm font-semibold text-navy-700">{name}</p>
                    <span className="shrink-0 text-xs font-bold text-navy-500">
                      {Math.round(d.avance / d.total)}%
                    </span>
                  </div>
                  <ProgressBar value={d.avance / d.total} />
                  <p className="mt-1 text-[11px] text-navy-400">
                    {d.total} trabajadores &middot; {d.completos} cursos completados
                  </p>
                </div>
              ))}
              {datos.length === 0 && (
                <p className="py-6 text-center text-sm text-navy-300">Sin datos disponibles</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <p className="mt-8 rounded-2xl border border-dashed border-navy-200 bg-white/60 p-5 text-center text-xs leading-relaxed text-navy-400">
        La exportacion a PDF con la imagen corporativa y el envio programado de reportes por correo
        quedaron previstos para la Fase 2 del backlog (punto 23 del esqueleto funcional).
      </p>
    </div>
  );
}
