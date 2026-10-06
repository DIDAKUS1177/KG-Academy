import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { resolveCompany } from "@/lib/empresa";
import { ROLES } from "@/lib/constants";
import { cantidad, formatDateTime } from "@/lib/utils";
import { dominio, enCurso, finDe } from "@/lib/encuentros";
import { EmptyState, SectionTitle } from "@/components/ui";
import { IconPlay } from "@/components/Icons";
import { CancelarEncuentro, NuevoEncuentro } from "./NuevoEncuentro";

export const metadata: Metadata = { title: "Clases y reuniones" };
export const dynamic = "force-dynamic";

export default async function EncuentrosEmpresa(props: { searchParams: Promise<{ empresa?: string }> }) {
  const searchParams = await props.searchParams;
  const user = await requireRole(ROLES.ADMIN_EMPRESA, ROLES.SUPERVISOR, ROLES.SUPERADMIN, ROLES.ADMIN_KG);
  const company = await resolveCompany(user, searchParams.empresa);
  if (!company) return <EmptyState title="Sin empresa asociada" />;
  const gestiona = user.role.code !== ROLES.SUPERVISOR;

  const ahora = new Date();
  const [encuentros, areas, cursos] = await Promise.all([
    prisma.companyMeeting.findMany({
      where: { companyId: company.id, createdAt: { gte: new Date(ahora.getTime() - 90 * 86_400_000) } },
      include: { area: { select: { name: true } }, course: { select: { title: true } } },
      orderBy: [{ startsAt: "desc" }, { createdAt: "desc" }],
    }),
    prisma.area.findMany({ where: { companyId: company.id }, orderBy: { name: "asc" } }),
    prisma.course.findMany({ where: { assignments: { some: { companyId: company.id } } }, select: { id: true, title: true }, orderBy: { title: "asc" } }),
  ]);
  const cuando = (e: (typeof encuentros)[number]) => (e.startsAt ?? e.createdAt).getTime();
  const vigentes = encuentros.filter((e) => !e.canceledAt && finDe(e) > ahora).sort((a, b) => cuando(a) - cuando(b));
  const pasados = encuentros.filter((e) => e.canceledAt || finDe(e) <= ahora);

  const grupo = (e: (typeof encuentros)[number]) =>
    e.audience === "area" ? `Área ${e.area?.name ?? "—"}` : e.audience === "curso" ? `Curso: ${e.course?.title ?? "—"}` : "Todo el personal";

  const fila = (e: (typeof encuentros)[number], conAcciones: boolean) => (
    <li key={e.id} className="flex flex-wrap items-start gap-4 px-5 py-4">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-navy-50 text-navy-600">
        <IconPlay width={18} height={18} />
      </span>
      <div className="min-w-[220px] flex-1">
        <p className="font-semibold text-navy-700">
          {e.title}
          {e.canceledAt && <span className="ml-2 rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-bold text-red-600">Cancelada</span>}
          {!e.canceledAt && enCurso(e, ahora) && <span className="ml-2 rounded-full bg-lime-100 px-2 py-0.5 text-[11px] font-bold text-lime-700">En curso</span>}
        </p>
        <p className="text-xs text-navy-400">
          {e.startsAt ? formatDateTime(e.startsAt) : "Material sin fecha"}
          {e.startsAt && e.durationMin ? ` · ${e.durationMin} min` : ""} · {grupo(e)} · {cantidad(e.recipients, "persona", "personas")}
        </p>
        <a href={e.url} target="_blank" rel="noopener noreferrer" className="mt-1 inline-block break-all text-xs font-semibold text-lime-700 hover:underline">
          {dominio(e.url)}
        </a>
      </div>
      {conAcciones && gestiona && !e.canceledAt && <CancelarEncuentro meetingId={e.id} titulo={e.title} />}
    </li>
  );

  return (
    <div className="space-y-8">
      <SectionTitle
        eyebrow={company.tradeName ?? company.legalName}
        title="Clases y reuniones"
        description="Comparta el enlace de una clase en vivo (Meet, Zoom o Teams) o de una grabación. Su gente recibe la notificación y lo ve en su aula, con el botón para unirse."
      />

      {gestiona && (
        <NuevoEncuentro
          companyId={company.id}
          areas={areas.map((a) => ({ id: a.id, nombre: a.name }))}
          cursos={cursos.map((c) => ({ id: c.id, nombre: c.title }))}
        />
      )}

      <section className="space-y-3">
        <h2 className="font-display text-lg font-bold text-navy-700">Programadas y vigentes</h2>
        {vigentes.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-navy-200 bg-white/60 p-6 text-center text-sm text-navy-400">
            {gestiona ? "Aún no hay clases programadas. Use el formulario de arriba para compartir la primera." : "Aún no hay clases programadas."}
          </p>
        ) : (
          <ul className="card divide-y divide-navy-50">{vigentes.map((e) => fila(e, true))}</ul>
        )}
      </section>

      {pasados.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-display text-lg font-bold text-navy-700">Anteriores</h2>
          <ul className="card divide-y divide-navy-50">{pasados.map((e) => fila(e, false))}</ul>
        </section>
      )}
    </div>
  );
}
