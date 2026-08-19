import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { ROLES } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { SectionTitle, StatCard, StatusBadge, EmptyState } from "@/components/ui";
import { IconAward, IconSearch, IconArrowRight, IconQr, IconAlert } from "@/components/Icons";

export const metadata: Metadata = { title: "Certificados" };
export const dynamic = "force-dynamic";

export default async function AdminCertificados({ searchParams }: { searchParams: { q?: string } }) {
  await requireRole(ROLES.SUPERADMIN, ROLES.ADMIN_KG);
  const q = searchParams.q?.trim();

  const certs = await prisma.certificate.findMany({
    where: q
      ? {
          OR: [
            { code: { contains: q.toUpperCase() } },
            { studentName: { contains: q } },
            { studentDocument: { contains: q } },
          ],
        }
      : {},
    include: { user: { include: { company: true } }, course: true },
    orderBy: { issuedAt: "desc" },
    take: 200,
  });

  const [total, vigentes, revocados, plantillas] = await Promise.all([
    prisma.certificate.count(),
    prisma.certificate.count({ where: { status: "vigente" } }),
    prisma.certificate.count({ where: { status: "revocado" } }),
    prisma.certificateTemplate.findMany(),
  ]);

  return (
    <div>
      <SectionTitle
        eyebrow="Administración"
        title="Certificados emitidos"
        description="Historial de certificados con código único, verificación pública y estado."
      />

      <div className="mb-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Emitidos" value={total} icon={<IconAward width={20} height={20} />} />
        <StatCard label="Vigentes" value={vigentes} tone="lime" icon={<IconAward width={20} height={20} />} />
        <StatCard label="Revocados" value={revocados} tone="red" icon={<IconAlert width={20} height={20} />} />
        <StatCard label="Plantillas" value={plantillas.length} icon={<IconQr width={20} height={20} />} />
      </div>

      <form className="card mb-6 flex flex-wrap items-end gap-3 p-4">
        <div className="min-w-[240px] flex-1">
          <label className="label">Buscar certificado</label>
          <div className="relative">
            <IconSearch
              width={16}
              height={16}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-300"
            />
            <input name="q" defaultValue={q} className="input pl-10" placeholder="Código, titular o documento" />
          </div>
        </div>
        <button className="btn-primary">Buscar</button>
        <Link href="/admin/certificados" className="btn-ghost">
          Limpiar
        </Link>
      </form>

      {certs.length === 0 ? (
        <EmptyState icon={<IconAward width={30} height={30} />} title="No hay certificados con ese criterio" />
      ) : (
        <div className="card overflow-x-auto">
          <table className="table-kg">
            <thead>
              <tr>
                <th>Código</th>
                <th>Titular</th>
                <th>Curso</th>
                <th>Empresa</th>
                <th>Horas</th>
                <th>Nota</th>
                <th>Emitido</th>
                <th>Vence</th>
                <th>Estado</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {certs.map((c) => (
                <tr key={c.id}>
                  <td className="font-mono text-xs font-bold text-lime-700">{c.code}</td>
                  <td>
                    <p className="font-semibold text-navy-700">{c.studentName}</p>
                    <p className="text-[11px] text-navy-400">{c.studentDocument}</p>
                  </td>
                  <td className="text-xs text-navy-500">{c.courseTitle}</td>
                  <td className="text-xs text-navy-400">{c.user.company?.tradeName ?? "Particular"}</td>
                  <td>{c.hours}</td>
                  <td className="font-display font-bold">{c.finalScore ? Math.round(c.finalScore) : "—"}</td>
                  <td className="text-xs text-navy-400">{formatDate(c.issuedAt)}</td>
                  <td className="text-xs text-navy-400">
                    {c.expiresAt ? formatDate(c.expiresAt) : "Indefinida"}
                  </td>
                  <td>
                    <StatusBadge status={c.status} />
                  </td>
                  <td className="text-right">
                    <Link href={`/verificar/${c.code}`} target="_blank" className="btn-outline btn-sm">
                      Verificar <IconArrowRight width={12} height={12} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="border-t border-navy-50 px-4 py-3 text-[11px] text-navy-400">
            La revocación de certificados con registro de motivo está modelada en la base de datos
            (campos <code>status</code>, <code>revokedReason</code>, <code>revokedById</code>); la acción
            desde la interfaz corresponde a la Fase 1 del backlog.
          </p>
        </div>
      )}
    </div>
  );
}
