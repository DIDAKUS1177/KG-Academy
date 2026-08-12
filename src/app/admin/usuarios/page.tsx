import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { ROLES, ROLE_LABEL } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { Avatar, SectionTitle, StatusBadge } from "@/components/ui";
import { IconSearch, IconUsers } from "@/components/Icons";

export const metadata: Metadata = { title: "Usuarios y roles" };
export const dynamic = "force-dynamic";

export default async function AdminUsuarios({
  searchParams,
}: {
  searchParams: { q?: string; rol?: string; estado?: string };
}) {
  await requireRole(ROLES.SUPERADMIN, ROLES.ADMIN_KG);
  const q = searchParams.q?.trim();

  const [users, roles] = await Promise.all([
    prisma.user.findMany({
      where: {
        ...(searchParams.rol ? { role: { code: searchParams.rol } } : {}),
        ...(searchParams.estado ? { status: searchParams.estado } : {}),
        ...(q
          ? {
              OR: [
                { firstName: { contains: q } },
                { lastName: { contains: q } },
                { email: { contains: q } },
                { documentNumber: { contains: q } },
              ],
            }
          : {}),
      },
      include: { role: true, company: true, enrollments: true, certificates: true },
      orderBy: { createdAt: "desc" },
      take: 200,
    }),
    prisma.role.findMany({ orderBy: { code: "asc" } }),
  ]);

  return (
    <div>
      <SectionTitle
        eyebrow="Administracion"
        title="Usuarios y roles"
        description="Gestion de todas las cuentas de la plataforma, su rol y estado."
      />

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
          <label className="label">Rol</label>
          <select name="rol" defaultValue={searchParams.rol ?? ""} className="select">
            <option value="">Todos</option>
            {roles.map((r) => (
              <option key={r.id} value={r.code}>
                {ROLE_LABEL[r.code] ?? r.name}
              </option>
            ))}
          </select>
        </div>
        <div className="min-w-[160px]">
          <label className="label">Estado</label>
          <select name="estado" defaultValue={searchParams.estado ?? ""} className="select">
            <option value="">Todos</option>
            <option value="activo">Activo</option>
            <option value="pendiente_activacion">Pendiente</option>
            <option value="inactivo">Inactivo</option>
            <option value="bloqueado">Bloqueado</option>
          </select>
        </div>
        <button className="btn-primary">Filtrar</button>
        <Link href="/admin/usuarios" className="btn-ghost">
          Limpiar
        </Link>
      </form>

      <div className="card overflow-x-auto">
        <table className="table-kg">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Rol</th>
              <th>Empresa</th>
              <th>Cursos</th>
              <th>Cert.</th>
              <th>Ultimo acceso</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
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
                  <span className="badge-blue">{ROLE_LABEL[u.role.code] ?? u.role.name}</span>
                </td>
                <td className="text-xs text-navy-500">{u.company?.tradeName ?? "—"}</td>
                <td className="text-xs font-bold text-navy-700">{u.enrollments.length}</td>
                <td className="text-xs font-bold text-lime-600">{u.certificates.length}</td>
                <td className="text-xs text-navy-400">{u.lastLoginAt ? formatDate(u.lastLoginAt) : "Nunca"}</td>
                <td>
                  <StatusBadge status={u.status} />
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={7} className="py-12 text-center text-sm text-navy-300">
                  <IconUsers width={26} height={26} className="mx-auto mb-2 text-navy-200" />
                  No hay usuarios con esos criterios
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <p className="border-t border-navy-50 px-4 py-3 text-[11px] text-navy-400">
          {users.length} usuario(s). La creacion y edicion de cuentas desde este panel corresponde a la
          Fase 1 del backlog; el modelo de datos y los permisos ya estan implementados.
        </p>
      </div>
    </div>
  );
}
