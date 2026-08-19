import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { ROLES } from "@/lib/constants";
import { formatDateTime } from "@/lib/utils";
import { SectionTitle, EmptyState } from "@/components/ui";
import { IconShield, IconSearch } from "@/components/Icons";

export const metadata: Metadata = { title: "Auditoría" };
export const dynamic = "force-dynamic";

const ACCION_TONO: Record<string, string> = {
  login: "badge-blue",
  logout: "badge-slate",
  crear: "badge-green",
  editar: "badge-amber",
  eliminar: "badge-red",
  publicar: "badge-green",
  asignar: "badge-blue",
  revocar: "badge-red",
  exportar: "badge-slate",
};

export default async function AuditoriaPage({
  searchParams,
}: {
  searchParams: { entidad?: string; accion?: string };
}) {
  await requireRole(ROLES.SUPERADMIN, ROLES.ADMIN_KG);

  const logs = await prisma.auditLog.findMany({
    where: {
      ...(searchParams.entidad ? { entity: searchParams.entidad } : {}),
      ...(searchParams.accion ? { action: searchParams.accion } : {}),
    },
    orderBy: { createdAt: "desc" },
    take: 250,
  });

  const entidades = await prisma.auditLog.groupBy({ by: ["entity"], _count: true });
  const acciones = await prisma.auditLog.groupBy({ by: ["action"], _count: true });

  return (
    <div>
      <SectionTitle
        eyebrow="Sistema"
        title="Registro de auditoría"
        description="Trazabilidad de las acciones relevantes de la plataforma (punto 17 del esqueleto funcional)."
      />

      <form className="card mb-6 flex flex-wrap items-end gap-3 p-4">
        <div className="min-w-[180px]">
          <label className="label">Entidad</label>
          <select name="entidad" defaultValue={searchParams.entidad ?? ""} className="select">
            <option value="">Todas</option>
            {entidades.map((e) => (
              <option key={e.entity} value={e.entity}>
                {e.entity} ({e._count})
              </option>
            ))}
          </select>
        </div>
        <div className="min-w-[180px]">
          <label className="label">Acción</label>
          <select name="accion" defaultValue={searchParams.accion ?? ""} className="select">
            <option value="">Todas</option>
            {acciones.map((a) => (
              <option key={a.action} value={a.action}>
                {a.action} ({a._count})
              </option>
            ))}
          </select>
        </div>
        <button className="btn-primary">
          <IconSearch width={15} height={15} /> Filtrar
        </button>
        <Link href="/admin/auditoria" className="btn-ghost">
          Limpiar
        </Link>
      </form>

      {logs.length === 0 ? (
        <EmptyState icon={<IconShield width={30} height={30} />} title="Sin registros de auditoría" />
      ) : (
        <div className="card overflow-x-auto">
          <table className="table-kg">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Actor</th>
                <th>Acción</th>
                <th>Entidad</th>
                <th>Detalle</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((l) => (
                <tr key={l.id}>
                  <td className="whitespace-nowrap text-xs text-navy-400">{formatDateTime(l.createdAt)}</td>
                  <td className="text-xs font-semibold text-navy-600">{l.actorEmail ?? "sistema"}</td>
                  <td>
                    <span className={ACCION_TONO[l.action] ?? "badge-slate"}>{l.action}</span>
                  </td>
                  <td className="font-mono text-[11px] text-navy-500">{l.entity}</td>
                  <td className="text-xs text-navy-600">{l.summary ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="border-t border-navy-50 px-4 py-3 text-[11px] text-navy-400">
            {logs.length} registro(s). La tabla <code>audit_logs</code> conserva además el estado antes y
            después del cambio en formato JSON.
          </p>
        </div>
      )}
    </div>
  );
}
