import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { ROLES } from "@/lib/constants";
import { formatCOP, formatDate } from "@/lib/utils";
import { EmptyState, ProgressBar, SectionTitle, StatusBadge } from "@/components/ui";
import { IconBuilding, IconArrowRight } from "@/components/Icons";

export const metadata: Metadata = { title: "Empresas y planes" };
export const dynamic = "force-dynamic";

export default async function AdminEmpresas() {
  await requireRole(ROLES.SUPERADMIN, ROLES.ADMIN_KG);

  const [companies, plans] = await Promise.all([
    prisma.company.findMany({
      include: {
        members: true,
        assignments: { include: { enrollment: true } },
        subscriptions: { include: { plan: true }, orderBy: { startsAt: "desc" }, take: 1 },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.plan.findMany({ orderBy: { pricePerMonth: "asc" } }),
  ]);

  return (
    <div>
      <SectionTitle
        eyebrow="Administración"
        title="Empresas y planes"
        description="Clientes B2B, su plan contratado y su nivel de cumplimiento en capacitación."
      />

      {companies.length === 0 ? (
        <EmptyState icon={<IconBuilding width={30} height={30} />} title="Aún no hay empresas registradas" />
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {companies.map((c) => {
            const total = c.assignments.length;
            const done = c.assignments.filter((a) => a.status === "completado").length;
            const avance = total
              ? c.assignments.reduce((s, a) => s + (a.enrollment?.progress ?? 0), 0) / total
              : 0;
            const sub = c.subscriptions[0];
            return (
              <div key={c.id} className="card card-hover overflow-hidden">
                <div className="relative h-20 bg-kg-gradient p-5">
                  <div className="absolute inset-0 bg-kg-mesh opacity-70" />
                  <div className="relative flex items-start justify-between">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 text-lime-400 backdrop-blur">
                      <IconBuilding width={19} height={19} />
                    </span>
                    <StatusBadge status={c.status} />
                  </div>
                </div>
                <div className="p-5">
                  <p className="font-display text-base font-bold text-navy-700">
                    {c.tradeName ?? c.legalName}
                  </p>
                  <p className="text-xs text-navy-400">
                    NIT {c.nit} &middot; {c.economicSector ?? "—"} &middot; Riesgo {c.riskLevel ?? "—"}
                  </p>

                  <dl className="mt-4 grid grid-cols-3 gap-3 text-center">
                    {[
                      ["Trabajadores", c.members.length],
                      ["Asignaciones", total],
                      ["Completadas", done],
                    ].map(([k, v]) => (
                      <div key={String(k)} className="rounded-xl bg-navy-50/70 p-2.5">
                        <dt className="text-[10px] font-bold uppercase tracking-wide text-navy-400">{k}</dt>
                        <dd className="font-display text-lg font-extrabold text-navy-700">{v}</dd>
                      </div>
                    ))}
                  </dl>

                  <div className="mt-4">
                    <div className="mb-1.5 flex items-baseline justify-between text-[11px] font-semibold text-navy-500">
                      <span>Avance de capacitación</span>
                      <span>{Math.round(avance)}%</span>
                    </div>
                    <ProgressBar value={avance} />
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-navy-50 pt-4 text-xs">
                    <span className="text-navy-400">
                      Plan:{" "}
                      <span className="font-semibold text-navy-700">{sub?.plan.name ?? "Sin plan"}</span>
                      {sub && ` · ${formatCOP(sub.plan.pricePerMonth)}/mes`}
                    </span>
                    <Link
                      href={`/empresa?empresa=${c.id}`}
                      className="inline-flex items-center gap-1.5 font-bold text-lime-600 hover:underline"
                    >
                      Abrir panel <IconArrowRight width={12} height={12} />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <SectionTitle title="Planes comerciales" description="Catálogo de planes B2B configurados." />
      <div className="card overflow-x-auto">
        <table className="table-kg">
          <thead>
            <tr>
              <th>Plan</th>
              <th>Descripción</th>
              <th>Max. usuarios</th>
              <th>Valor mensual</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {plans.map((p) => (
              <tr key={p.id}>
                <td className="font-semibold text-navy-700">{p.name}</td>
                <td className="text-xs text-navy-500">{p.description}</td>
                <td>{p.maxUsers ?? "Ilimitado"}</td>
                <td className="font-display font-bold">
                  {p.pricePerMonth ? formatCOP(p.pricePerMonth) : "A cotizar"}
                </td>
                <td>
                  <StatusBadge status={p.isActive ? "activo" : "inactivo"} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="border-t border-navy-50 px-4 py-3 text-[11px] text-navy-400">
          La pasarela de pagos y la facturación quedaron marcadas como POR DEFINIR en el punto 16 del
          esqueleto. Las tablas <code>orders</code>, <code>order_items</code> y <code>coupons</code> ya
          están modeladas para cuando KG defina el proveedor.
        </p>
      </div>
    </div>
  );
}
