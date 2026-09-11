"use client";

import { useState } from "react";
import Link from "next/link";
import { formatCOP } from "@/lib/utils";
import { EmptyState, ProgressBar, SectionTitle, StatusBadge } from "@/components/ui";
import { IconBuilding, IconArrowRight } from "@/components/Icons";
import { GestionEmpresas, GestionPlanes, type EmpresaFila, type PlanFila } from "./GestionEmpresas";

type Tarjeta = EmpresaFila & {
  trabajadores: number;
  asignaciones: number;
  completadas: number;
  avance: number;
  planNombre: string | null;
  planValor: number | null;
};

/**
 * Tarjetas de empresas y tabla de planes, con creación y edición.
 * Todo el estado de "qué ventana está abierta" vive aquí.
 */
export function PanelEmpresas({ empresas, planes }: { empresas: Tarjeta[]; planes: PlanFila[] }) {
  const [editar, setEditar] = useState<EmpresaFila | null>(null);
  const [editarPlan, setEditarPlan] = useState<PlanFila | null>(null);

  return (
    <>
      <div className="mb-5 flex justify-end">
        <GestionEmpresas planes={planes} editar={editar} onCerrarEdicion={() => setEditar(null)} />
      </div>

      {empresas.length === 0 ? (
        <EmptyState icon={<IconBuilding width={30} height={30} />} title="Aún no hay empresas registradas" description="Cree la primera con el botón de arriba." />
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {empresas.map((c) => (
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
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-display text-base font-bold text-navy-700">{c.tradeName ?? c.legalName}</p>
                    <p className="text-xs text-navy-400">
                      NIT {c.nit} &middot; {c.economicSector ?? "—"} &middot; Riesgo {c.riskLevel ?? "—"}
                    </p>
                  </div>
                  <button onClick={() => setEditar(c)} className="btn-outline btn-sm shrink-0">Editar</button>
                </div>

                <dl className="mt-4 grid grid-cols-3 gap-3 text-center">
                  {[["Trabajadores", c.trabajadores], ["Asignaciones", c.asignaciones], ["Completadas", c.completadas]].map(([k, v]) => (
                    <div key={String(k)} className="rounded-xl bg-navy-50/70 p-2.5">
                      <dt className="text-[10px] font-bold uppercase tracking-wide text-navy-400">{k}</dt>
                      <dd className="font-display text-lg font-extrabold text-navy-700">{v}</dd>
                    </div>
                  ))}
                </dl>

                <div className="mt-4">
                  <div className="mb-1.5 flex items-baseline justify-between text-[11px] font-semibold text-navy-500">
                    <span>Avance de capacitación</span>
                    <span>{Math.round(c.avance)}%</span>
                  </div>
                  <ProgressBar value={c.avance} />
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-navy-50 pt-4 text-xs">
                  <span className="text-navy-400">
                    Plan: <span className="font-semibold text-navy-700">{c.planNombre ?? "Sin plan"}</span>
                    {c.planValor ? ` · ${formatCOP(c.planValor)}/mes` : ""}
                    {c.seats ? ` · ${c.seats} cupos` : ""}
                  </span>
                  <Link href={`/empresa?empresa=${c.id}`} className="inline-flex items-center gap-1.5 font-bold text-lime-600 hover:underline">
                    Abrir panel <IconArrowRight width={12} height={12} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <SectionTitle
        title="Planes comerciales"
        description="Catálogo de planes B2B. Un plan con suscripciones no se borra: se desactiva."
        action={<GestionPlanes editar={editarPlan} onCerrarEdicion={() => setEditarPlan(null)} />}
      />
      <div className="card overflow-x-auto">
        <table className="table-kg">
          <thead>
            <tr>
              <th>Plan</th><th>Descripción</th><th>Máx. usuarios</th><th>Valor mensual</th><th>Estado</th><th />
            </tr>
          </thead>
          <tbody>
            {planes.map((p) => (
              <tr key={p.id}>
                <td>
                  <p className="font-semibold text-navy-700">{p.name}</p>
                  <p className="font-mono text-[10px] text-navy-300">{p.code}</p>
                </td>
                <td className="text-xs text-navy-500">{p.description}</td>
                <td>{p.maxUsers ?? "Ilimitado"}</td>
                <td className="font-display font-bold">{p.pricePerMonth ? formatCOP(p.pricePerMonth) : "A cotizar"}</td>
                <td><StatusBadge status={p.isActive ? "activo" : "inactivo"} /></td>
                <td className="text-right">
                  <button onClick={() => setEditarPlan(p)} className="btn-outline btn-sm">
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
