"use client";

import { useState } from "react";
import { STATUS_LABEL, ROLE_LABEL } from "@/lib/constants";
import { Avatar, StatusBadge } from "@/components/ui";
import { IconUsers } from "@/components/Icons";
import { GestionUsuarios, type UsuarioFila } from "./GestionUsuarios";

type Fila = UsuarioFila & {
  companyName: string | null;
  cursos: number;
  certificados: number;
  ultimoAcceso: string;
};
type Opcion = { id: string; nombre: string };

/**
 * Tabla de usuarios con el botón de crear y la edición por fila.
 * Recibe los datos ya serializados desde la página de servidor.
 */
export function TablaUsuarios({
  filas,
  roles,
  empresas,
  actorRole,
  actorId,
}: {
  filas: Fila[];
  roles: Opcion[];
  empresas: Opcion[];
  actorRole: string;
  actorId: string;
}) {
  const [editar, setEditar] = useState<UsuarioFila | null>(null);

  return (
    <>
      <div className="mb-5 flex justify-end">
        <GestionUsuarios
          roles={roles}
          empresas={empresas}
          actorRole={actorRole}
          actorId={actorId}
          editar={editar}
          onCerrarEdicion={() => setEditar(null)}
        />
      </div>

      <div className="card overflow-x-auto">
        <table className="table-kg">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Rol</th>
              <th>Empresa</th>
              <th>Cursos</th>
              <th>Cert.</th>
              <th>Último acceso</th>
              <th>Estado</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {filas.map((u) => (
              <tr key={u.id}>
                <td>
                  <div className="flex items-center gap-3">
                    <Avatar first={u.firstName} last={u.lastName} size={34} />
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-navy-700">
                        {u.firstName} {u.lastName}
                      </p>
                      <p className="truncate text-[11px] text-navy-400">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td>
                  <span className="badge-blue">{ROLE_LABEL[u.roleCode] ?? u.roleCode}</span>
                </td>
                <td className="text-xs text-navy-500">{u.companyName ?? "—"}</td>
                <td className="text-xs font-bold text-navy-700">{u.cursos}</td>
                <td className="text-xs font-bold text-lime-600">{u.certificados}</td>
                <td className="text-xs text-navy-400">{u.ultimoAcceso}</td>
                <td>
                  <StatusBadge status={u.status} label={STATUS_LABEL[u.status]} />
                </td>
                <td className="text-right">
                  <button onClick={() => setEditar(u)} className="btn-outline btn-sm">
                    Editar
                  </button>
                </td>
              </tr>
            ))}
            {filas.length === 0 && (
              <tr>
                <td colSpan={8} className="py-12 text-center text-sm text-navy-300">
                  <IconUsers width={26} height={26} className="mx-auto mb-2 text-navy-200" />
                  No hay usuarios con esos criterios
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <p className="border-t border-navy-50 px-4 py-3 text-[11px] text-navy-400">
          {filas.length} usuario(s). Las cuentas no se eliminan: un usuario con matrículas o
          certificados es evidencia ante la ARL. Para retirarlo, cámbielo a inactivo o bloqueado.
        </p>
      </div>
    </>
  );
}
