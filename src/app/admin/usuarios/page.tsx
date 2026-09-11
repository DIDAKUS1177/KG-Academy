import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { ROLES, ROLE_LABEL } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { SectionTitle } from "@/components/ui";
import { IconSearch } from "@/components/Icons";
import { TablaUsuarios } from "./TablaUsuarios";

export const metadata: Metadata = { title: "Usuarios y roles" };
export const dynamic = "force-dynamic";

export default async function AdminUsuarios({
  searchParams,
}: {
  searchParams: { q?: string; rol?: string; estado?: string };
}) {
  const actor = await requireRole(ROLES.SUPERADMIN, ROLES.ADMIN_KG);
  const q = searchParams.q?.trim();

  const [users, roles, empresas] = await Promise.all([
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
      include: {
        role: true,
        company: true,
        _count: { select: { enrollments: true, certificates: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 200,
    }),
    prisma.role.findMany({ orderBy: { code: "asc" } }),
    prisma.company.findMany({
      where: { status: { not: "inactiva" } },
      select: { id: true, tradeName: true, legalName: true },
      orderBy: { legalName: "asc" },
    }),
  ]);

  return (
    <div>
      <SectionTitle
        eyebrow="Administración"
        title="Usuarios y roles"
        description="Cree cuentas de cualquier rol, cambie su empresa o estado y restablezca contraseñas."
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

      <TablaUsuarios
        actorRole={actor.role.code}
        actorId={actor.id}
        roles={roles.map((r) => ({ id: r.code, nombre: ROLE_LABEL[r.code] ?? r.name }))}
        empresas={empresas.map((c) => ({ id: c.id, nombre: c.tradeName ?? c.legalName }))}
        filas={users.map((u) => ({
          id: u.id,
          firstName: u.firstName,
          lastName: u.lastName,
          email: u.email,
          roleCode: u.role.code,
          companyId: u.companyId,
          companyName: u.company?.tradeName ?? null,
          documentType: u.documentType,
          documentNumber: u.documentNumber,
          phone: u.phone,
          jobTitle: u.jobTitle,
          city: u.city,
          status: u.status,
          cursos: u._count.enrollments,
          certificados: u._count.certificates,
          ultimoAcceso: u.lastLoginAt ? formatDate(u.lastLoginAt) : "Nunca",
        }))}
      />
    </div>
  );
}
