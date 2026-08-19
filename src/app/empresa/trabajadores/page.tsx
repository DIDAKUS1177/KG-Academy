import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { resolveCompany } from "@/lib/empresa";
import { ROLES } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { Avatar, EmptyState, ProgressBar, SectionTitle, StatusBadge } from "@/components/ui";
import { NuevoTrabajador } from "./NuevoTrabajador";
import { IconUsers, IconSearch, IconDownload, IconArrowRight } from "@/components/Icons";

export const metadata: Metadata = { title: "Trabajadores" };
export const dynamic = "force-dynamic";

export default async function TrabajadoresPage({
  searchParams,
}: {
  searchParams: { q?: string; area?: string; empresa?: string };
}) {
  const user = await requireRole(ROLES.ADMIN_EMPRESA, ROLES.SUPERVISOR, ROLES.SUPERADMIN, ROLES.ADMIN_KG);
  const company = await resolveCompany(user, searchParams.empresa);
  if (!company) return <EmptyState title="Sin empresa asociada" />;

  const q = searchParams.q?.trim();

  const [members, areas, positions, locations] = await Promise.all([
    prisma.companyMember.findMany({
      where: {
        companyId: company.id,
        ...(searchParams.area ? { areaId: searchParams.area } : {}),
        ...(q
          ? {
              user: {
                OR: [
                  { firstName: { contains: q } },
                  { lastName: { contains: q } },
                  { email: { contains: q } },
                  { documentNumber: { contains: q } },
                ],
              },
            }
          : {}),
      },
      include: {
        area: true,
        position: true,
        location: true,
        user: { include: { enrollments: true, certificates: true } },
      },
      orderBy: { createdAt: "asc" },
    }),
    prisma.area.findMany({ where: { companyId: company.id } }),
    prisma.position.findMany({ where: { companyId: company.id } }),
    prisma.companyLocation.findMany({ where: { companyId: company.id } }),
  ]);

  const puedeEditar = user.role.code !== ROLES.SUPERVISOR;

  return (
    <div>
      <SectionTitle
        eyebrow={company.tradeName ?? company.legalName}
        title="Trabajadores"
        description="Nomina registrada en KG Academy, organizada por área, cargo y sede."
        action={
          <div className="flex gap-2">
            <a href={`/api/empresa/reporte?tipo=trabajadores&empresa=${company.id}`} className="btn-outline btn-sm">
              <IconDownload width={14} height={14} /> Exportar CSV
            </a>
          </div>
        }
      />

      {/* Filtros */}
      <form className="card mb-6 flex flex-wrap items-end gap-3 p-4">
        <div className="min-w-[220px] flex-1">
          <label className="label">Buscar</label>
          <div className="relative">
            <IconSearch
              width={16}
              height={16}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-300"
            />
            <input name="q" defaultValue={q} className="input pl-10" placeholder="Nombre, correo o documento" />
          </div>
        </div>
        <div className="min-w-[180px]">
          <label className="label">Área</label>
          <select name="area" defaultValue={searchParams.area ?? ""} className="select">
            <option value="">Todas</option>
            {areas.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </div>
        <button className="btn-primary">Filtrar</button>
        <Link href="/empresa/trabajadores" className="btn-ghost">
          Limpiar
        </Link>
      </form>

      {puedeEditar && (
        <NuevoTrabajador
          companyId={company.id}
          areas={areas.map((a) => ({ id: a.id, name: a.name }))}
          positions={positions.map((p) => ({ id: p.id, name: p.name }))}
          locations={locations.map((l) => ({ id: l.id, name: l.name }))}
        />
      )}

      {members.length === 0 ? (
        <EmptyState
          icon={<IconUsers width={30} height={30} />}
          title="No hay trabajadores registrados"
          description="Agregue trabajadores para poder asignarles capacitaciones."
        />
      ) : (
        <div className="card mt-6 overflow-x-auto">
          <table className="table-kg">
            <thead>
              <tr>
                <th>Trabajador</th>
                <th>Código</th>
                <th>Área / Cargo</th>
                <th>Sede</th>
                <th className="w-44">Avance promedio</th>
                <th>Cursos</th>
                <th>Cert.</th>
                <th>Estado</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {members.map((m) => {
                const enr = m.user.enrollments;
                const avance = enr.length ? enr.reduce((s, e) => s + e.progress, 0) / enr.length : 0;
                const completos = enr.filter((e) => e.status === "completado").length;
                return (
                  <tr key={m.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <Avatar first={m.user.firstName} last={m.user.lastName} size={34} />
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-navy-700">
                            {m.user.firstName} {m.user.lastName}
                          </p>
                          <p className="truncate text-[11px] text-navy-400">{m.user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="font-mono text-xs text-navy-400">{m.employeeCode ?? "—"}</td>
                    <td>
                      <p className="text-xs font-semibold text-navy-600">{m.area?.name ?? "—"}</p>
                      <p className="text-[11px] text-navy-400">{m.position?.name ?? "—"}</p>
                    </td>
                    <td className="text-xs text-navy-500">{m.location?.name ?? "—"}</td>
                    <td>
                      <ProgressBar value={avance} showLabel />
                    </td>
                    <td className="text-xs">
                      <span className="font-bold text-navy-700">{completos}</span>
                      <span className="text-navy-300">/{enr.length}</span>
                    </td>
                    <td className="text-xs font-bold text-lime-600">{m.user.certificates.length}</td>
                    <td>
                      <StatusBadge status={m.status} />
                    </td>
                    <td className="text-right">
                      <Link href={`/empresa/trabajadores/${m.userId}`} className="btn-outline btn-sm">
                        Ver <IconArrowRight width={12} height={12} />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <p className="border-t border-navy-50 px-4 py-3 text-[11px] text-navy-400">
            {members.length} trabajador(es) &middot; última actualización {formatDate(new Date())}
          </p>
        </div>
      )}
    </div>
  );
}
