import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { resolveCompany, companyKpis, alcanceEmpresa, avanceEnLaEmpresa } from "@/lib/empresa";
import { ROLES } from "@/lib/constants";
import { ROLES_CON_CUPO } from "@/lib/cupos";
import { cantidad } from "@/lib/utils";
import { EmptyState, ProgressBar, SectionTitle, StatCard } from "@/components/ui";
import { IconDownload, IconFile, IconUsers, IconAward, IconChart, IconCheck, IconClipboard, IconBook, IconClock, IconArrowRight } from "@/components/Icons";

export const metadata: Metadata = { title: "Reportes" };
export const dynamic = "force-dynamic";

export default async function ReportesPage(props: { searchParams: Promise<{ empresa?: string }> }) {
  const searchParams = await props.searchParams;
  const user = await requireRole(ROLES.ADMIN_EMPRESA, ROLES.SUPERVISOR, ROLES.SUPERADMIN, ROLES.ADMIN_KG);
  const company = await resolveCompany(user, searchParams.empresa);
  if (!company) return <EmptyState title="Sin empresa asociada" />;

  const kpis = await companyKpis(company.id);

  const [miembros, avance, certs] = await Promise.all([
    // Las personas que toman cursos y siguen en la empresa.
    prisma.companyMember.findMany({
      where: { companyId: company.id, status: { not: "retirado" }, user: { role: { code: { in: ROLES_CON_CUPO } } } },
      include: { location: true, position: true },
    }),
    avanceEnLaEmpresa(company.id),
    // Solo certificados de cursos que la empresa asignó a esa persona.
    alcanceEmpresa(company.id).then(async (alcance) =>
      (
        await prisma.certificate.findMany({
          where: { userId: { in: alcance.userIds }, courseId: { in: alcance.courseIds } },
          select: { userId: true, courseId: true },
        })
      ).filter((c) => c.courseId && alcance.incluye(c.userId, c.courseId)).length
    ),
  ]);

  /** Promedio de avance en los cursos que la empresa asignó, por sede o por cargo. */
  function agrupar(key: "location" | "position") {
    const map = new Map<string, { personas: number; asignados: number; suma: number; completos: number }>();
    for (const m of miembros) {
      const name = key === "location" ? m.location?.name ?? "Sin sede" : m.position?.name ?? "Sin cargo";
      const cur = map.get(name) ?? { personas: 0, asignados: 0, suma: 0, completos: 0 };
      const a = avance(m.userId);
      cur.personas++;
      cur.asignados += a.asignados;
      cur.suma += (a.avance ?? 0) * a.asignados;
      cur.completos += a.completados;
      map.set(name, cur);
    }
    return [...map.entries()];
  }

  const REPORTES = [
    {
      titulo: "Reporte de seguimiento",
      desc: "Estado, avance y nota de cada trabajador por curso asignado. Incluye área, cargo, sede y fechas.",
      tipo: "seguimiento",
      icon: <IconChart width={20} height={20} />,
    },
    {
      titulo: "Reporte de trabajadores",
      desc: "Nómina completa con usuario de ingreso, cursos asignados, completados, avance promedio y certificados.",
      tipo: "trabajadores",
      icon: <IconUsers width={20} height={20} />,
    },
    {
      titulo: "Reporte de certificados",
      desc: "Certificados emitidos con código de verificación, intensidad horaria, nota y vigencia.",
      tipo: "certificados",
      icon: <IconAward width={20} height={20} />,
    },
    {
      titulo: "Indicadores de gestión",
      desc: "Cobertura, cumplimiento, oportunidad, aprobación, participación y vigencia, con fórmula, meta y semáforo.",
      tipo: "indicadores",
      icon: <IconCheck width={20} height={20} />,
    },
    {
      titulo: "Reporte de evaluaciones",
      desc: "Cada intento presentado: nota, respuestas correctas, resultado, fecha y duración.",
      tipo: "evaluaciones",
      icon: <IconClipboard width={20} height={20} />,
    },
    {
      titulo: "Avance por lección",
      desc: "Detalle de cada lección por trabajador: estado, porcentaje, tiempo de estudio y fechas.",
      tipo: "lecciones",
      icon: <IconClock width={20} height={20} />,
    },
    {
      titulo: "Programa de capacitación",
      desc: "Ficha técnica de los cursos asignados: objetivo, intensidad, contenido, reglas de aprobación y cobertura.",
      tipo: "cursos",
      icon: <IconBook width={20} height={20} />,
    },
  ];

  return (
    <div>
      <SectionTitle
        eyebrow={company.tradeName ?? company.legalName}
        title="Reportes e indicadores"
        description="Descargue la evidencia de capacitación para auditorías, ARL y el SG-SST."
      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Cumplimiento" value={`${Math.round(kpis.cumplimiento)}%`} tone="lime" icon={<IconCheck width={20} height={20} />} />
        <StatCard label="Avance promedio" value={`${Math.round(kpis.avance)}%`} icon={<IconChart width={20} height={20} />} />
        <StatCard label="Asignaciones" value={kpis.total} icon={<IconFile width={20} height={20} />} />
        <StatCard label="Certificados" value={certs} tone="lime" icon={<IconAward width={20} height={20} />} />
      </div>

      {/* Informe consolidado para auditoría */}
      <Link
        href={`/empresa/reportes/informe?empresa=${company.id}`}
        className="card card-hover mt-8 flex flex-wrap items-center gap-5 bg-kg-gradient p-6 text-white"
      >
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-lime-500 text-navy-900">
          <IconFile width={22} height={22} />
        </span>
        <div className="min-w-[220px] flex-1">
          <p className="font-display text-lg font-bold">Informe de capacitación para auditoría (PDF)</p>
          <p className="mt-1 text-sm text-white/70">
            Resumen de cumplimiento por curso y por área, cursos vencidos y espacio de firmas, listo para la ARL o el SG-SST.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 text-sm font-bold text-lime-300">
          Abrir informe <IconArrowRight width={16} height={16} />
        </span>
      </Link>

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
              <IconDownload width={14} height={14} /> Descargar Excel (CSV)
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
                      {d.asignados ? `${Math.round(d.suma / d.asignados)}%` : "—"}
                    </span>
                  </div>
                  <ProgressBar value={d.asignados ? d.suma / d.asignados : 0} />
                  <p className="mt-1 text-[11px] text-navy-400">
                    {cantidad(d.personas, "persona", "personas")} &middot; {d.completos} de{" "}
                    {cantidad(d.asignados, "curso asignado terminado", "cursos asignados terminados")}
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

    </div>
  );
}
