import type { Metadata } from "next";
import { Fragment } from "react";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { ROLES, ROLE_LABEL, PERMISSION_MATRIX } from "@/lib/constants";
import { SectionTitle } from "@/components/ui";
import { IconCheck, IconX, IconLayers } from "@/components/Icons";

export const metadata: Metadata = { title: "Matriz de permisos" };
export const dynamic = "force-dynamic";

export default async function PermisosPage() {
  await requireRole(ROLES.SUPERADMIN, ROLES.ADMIN_KG);

  const [roles, permisos] = await Promise.all([
    prisma.role.findMany({ orderBy: { code: "asc" } }),
    prisma.permission.findMany({ orderBy: [{ module: "asc" }, { action: "asc" }] }),
  ]);

  const porModulo = new Map<string, typeof permisos>();
  for (const p of permisos) {
    porModulo.set(p.module, [...(porModulo.get(p.module) ?? []), p]);
  }

  const tiene = (roleCode: string, code: string) => {
    const lista = PERMISSION_MATRIX[roleCode] ?? [];
    return lista.includes("*") || lista.includes(code);
  };

  return (
    <div>
      <SectionTitle
        eyebrow="Sistema"
        title="Matriz de roles y permisos"
        description="Punto 4 del esqueleto funcional. Los permisos se validan tanto en la interfaz como en el backend."
      />

      <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {roles.map((r) => (
          <div key={r.id} className="card p-5">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-navy-700 text-lime-400">
                <IconLayers width={17} height={17} />
              </span>
              <div className="min-w-0">
                <p className="truncate font-display text-sm font-bold text-navy-700">
                  {ROLE_LABEL[r.code] ?? r.name}
                </p>
                <p className="font-mono text-[10px] text-navy-300">{r.code}</p>
              </div>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-navy-400">{r.description}</p>
            <span className="badge-slate mt-3">Alcance: {r.scope}</span>
          </div>
        ))}
      </div>

      <div className="card overflow-x-auto">
        <table className="table-kg">
          <thead>
            <tr>
              <th className="sticky left-0 bg-navy-50">Permiso</th>
              {roles.map((r) => (
                <th key={r.id} className="text-center">
                  {(ROLE_LABEL[r.code] ?? r.name).split(" ")[0]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...porModulo.entries()].map(([modulo, lista]) => (
              <Fragment key={modulo}>
                <tr className="bg-navy-50/60">
                  <td colSpan={roles.length + 1} className="font-display text-xs font-bold uppercase tracking-wide text-navy-600">
                    {modulo}
                  </td>
                </tr>
                {lista.map((p) => (
                  <tr key={p.id}>
                    <td className="sticky left-0 bg-white font-mono text-[11px] text-navy-500">{p.code}</td>
                    {roles.map((r) => (
                      <td key={r.id} className="text-center">
                        {tiene(r.code, p.code) ? (
                          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-lime-500 text-white">
                            <IconCheck width={11} height={11} strokeWidth={4} />
                          </span>
                        ) : (
                          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-navy-50 text-navy-200">
                            <IconX width={11} height={11} strokeWidth={3} />
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </Fragment>
            ))}
          </tbody>
        </table>
        <p className="border-t border-navy-50 px-4 py-3 text-[11px] text-navy-400">
          {permisos.length} permisos definidos sobre {porModulo.size} modulos. La edicion de la matriz
          desde la interfaz corresponde a la Fase 1; las tablas <code>permissions</code> y{" "}
          <code>role_permissions</code> ya la soportan.
        </p>
      </div>
    </div>
  );
}
