import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { resolveCompany } from "@/lib/empresa";
import { ROLES } from "@/lib/constants";
import { formatDate, daysBetween } from "@/lib/utils";
import { Avatar, EmptyState, ProgressBar, SectionTitle, StatusBadge, StatCard } from "@/components/ui";
import { IconDownload, IconSearch, IconCheck, IconClock, IconAlert, IconClipboard } from "@/components/Icons";

export const metadata: Metadata = { title: "Seguimiento" };
export const dynamic = "force-dynamic";

export default async function SeguimientoPage({
  searchParams,
}: {
  searchParams: { q?: string; curso?: string; estado?: string; area?: string; empresa?: string };
}) {
  const user = await requireRole(ROLES.ADMIN_EMPRESA, ROLES.SUPERVISOR, ROLES.SUPERADMIN, ROLES.ADMIN_KG);
  const company = await resolveCompany(user, searchParams.empresa);
  if (!company) return <EmptyState title="Sin empresa asociada" />;

  const q = searchParams.q?.trim();

  const [asignaciones, cursos, areas] = await Promise.all([
    prisma.courseAssignment.findMany({
      where: {
        companyId: company.id,
        ...(searchParams.curso ? { courseId: searchParams.curso } : {}),
        ...(searchParams.estado ? { status: searchParams.estado } : {}),
        ...(q
          ? {
              user: {
                OR: [
                  { firstName: { contains: q } },
                  { lastName: { contains: q } },
                  { documentNumber: { contains: q } },
                ],
              },
            }
          : {}),
      },
      include: {
        user: { include: { memberships: { include: { area: true, position: true } } } },
        course: true,
        enrollment: true,
      },
      orderBy: [{ status: "asc" }, { dueDate: "asc" }],
    }),
    prisma.course.findMany({
      where: { assignments: { some: { companyId: company.id } } },
      select: { id: true, title: true },
    }),
    prisma.area.findMany({ where: { companyId: company.id } }),
  ]);

  const filtradas = searchParams.area
    ? asignaciones.filter((a) =>
        a.user.memberships.some((m) => m.companyId === company.id && m.areaId === searchParams.area)
      )
    : asignaciones;

  const hoy = new Date();
  const stats = {
    total: filtradas.length,
    completados: filtradas.filter((a) => a.status === "completado").length,
    progreso: filtradas.filter((a) => a.status === "en_progreso").length,
    sinIniciar: filtradas.filter((a) => a.status === "asignado").length,
    vencidos: filtradas.filter(
      (a) => a.dueDate && new Date(a.dueDate) < hoy && a.status !== "completado"
    ).length,
  };

  return (
    <div>
      <SectionTitle
        eyebrow={company.tradeName ?? company.legalName}
        title="Seguimiento de capacitacion"
        description="Quien inicio, quien va en progreso, quien termino y quien no ha entrado."
        action={
          <a href={`/api/empresa/reporte?tipo=seguimiento&empresa=${company.id}`} className="btn-lime btn-sm">
            <IconDownload width={14} height={14} /> Exportar CSV
          </a>
        }
      />

      <div className="mb-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Completados" value={stats.completados} tone="lime" icon={<IconCheck width={20} height={20} />} />
        <StatCard label="En progreso" value={stats.progreso} tone="amber" icon={<IconClock width={20} height={20} />} />
        <StatCard label="Sin iniciar" value={stats.sinIniciar} icon={<IconClipboard width={20} height={20} />} />
        <StatCard label="Vencidos" value={stats.vencidos} tone="red" icon={<IconAlert width={20} height={20} />} />
      </div>

      {/* Filtros */}
      <form className="card mb-6 flex flex-wrap items-end gap-3 p-4">
        <div className="min-w-[200px] flex-1">
          <label className="label">Buscar trabajador</label>
          <div className="relative">
            <IconSearch
              width={16}
              height={16}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-300"
            />
            <input name="q" defaultValue={q} className="input pl-10" placeholder="Nombre o documento" />
          </div>
        </div>
        <div className="min-w-[180px]">
          <label className="label">Curso</label>
          <select name="curso" defaultValue={searchParams.curso ?? ""} className="select">
            <option value="">Todos</option>
            {cursos.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </div>
        <div className="min-w-[150px]">
          <label className="label">Area</label>
          <select name="area" defaultValue={searchParams.area ?? ""} className="select">
            <option value="">Todas</option>
            {areas.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </div>
        <div className="min-w-[150px]">
          <label className="label">Estado</label>
          <select name="estado" defaultValue={searchParams.estado ?? ""} className="select">
            <option value="">Todos</option>
            <option value="asignado">No iniciado</option>
            <option value="en_progreso">En progreso</option>
            <option value="completado">Completado</option>
          </select>
        </div>
        <button className="btn-primary">Filtrar</button>
        <Link href="/empresa/seguimiento" className="btn-ghost">
          Limpiar
        </Link>
      </form>

      <div className="card overflow-x-auto">
        <table className="table-kg">
          <thead>
            <tr>
              <th>Trabajador</th>
              <th>Area / Cargo</th>
              <th>Curso</th>
              <th className="w-44">Avance</th>
              <th>Nota</th>
              <th>Estado</th>
              <th>Fecha limite</th>
            </tr>
          </thead>
          <tbody>
            {filtradas.map((a) => {
              const m = a.user.memberships.find((x) => x.companyId === company.id);
              const dias = a.dueDate ? daysBetween(new Date(a.dueDate), hoy) : null;
              const vencido = dias !== null && dias < 0 && a.status !== "completado";
              return (
                <tr key={a.id}>
                  <td>
                    <Link href={`/empresa/trabajadores/${a.userId}`} className="flex items-center gap-3">
                      <Avatar first={a.user.firstName} last={a.user.lastName} size={32} />
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-navy-700">
                          {a.user.firstName} {a.user.lastName}
                        </p>
                        <p className="truncate text-[11px] text-navy-400">{a.user.documentNumber}</p>
                      </div>
                    </Link>
                  </td>
                  <td className="text-xs text-navy-500">
                    {m?.area?.name ?? "—"}
                    <span className="block text-[11px] text-navy-300">{m?.position?.name ?? "—"}</span>
                  </td>
                  <td className="text-xs text-navy-600">{a.course.title}</td>
                  <td>
                    <ProgressBar value={a.enrollment?.progress ?? 0} showLabel />
                  </td>
                  <td className="font-display text-sm font-bold">
                    {a.enrollment?.finalScore ? Math.round(a.enrollment.finalScore) : "—"}
                  </td>
                  <td>
                    <StatusBadge status={vencido ? "vencido" : a.status} />
                  </td>
                  <td className="text-xs">
                    <span className={vencido ? "font-bold text-red-600" : "text-navy-400"}>
                      {formatDate(a.dueDate)}
                    </span>
                    {dias !== null && a.status !== "completado" && (
                      <span className="block text-[10px] text-navy-300">
                        {dias >= 0 ? `${dias} dias restantes` : `vencido hace ${-dias} dias`}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
            {filtradas.length === 0 && (
              <tr>
                <td colSpan={7} className="py-12 text-center text-sm text-navy-300">
                  No hay registros con los filtros seleccionados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
