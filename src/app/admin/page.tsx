import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { ROLES, ROLE_LABEL } from "@/lib/constants";
import { formatDateTime } from "@/lib/utils";
import { SectionTitle, StatCard, StatusBadge, ProgressBar, Avatar } from "@/components/ui";
import {
  IconUsers,
  IconBook,
  IconAward,
  IconBuilding,
  IconArrowRight,
  IconShield,
  IconChart,
} from "@/components/Icons";

export const metadata: Metadata = { title: "Administracion" };
export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  await requireRole(ROLES.SUPERADMIN, ROLES.ADMIN_KG);

  const [
    users,
    companies,
    courses,
    certificates,
    enrollments,
    publicados,
    porRol,
    ultimosUsuarios,
    auditoria,
    cursosTop,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.company.count(),
    prisma.course.count(),
    prisma.certificate.count(),
    prisma.enrollment.findMany({ select: { progress: true, status: true } }),
    prisma.course.count({ where: { status: "publicado" } }),
    prisma.user.groupBy({ by: ["roleId"], _count: true }),
    prisma.user.findMany({
      include: { role: true, company: true },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
    prisma.auditLog.findMany({ orderBy: { createdAt: "desc" }, take: 8 }),
    prisma.course.findMany({
      include: { enrollments: true, category: true, certificates: true },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  const roles = await prisma.role.findMany();
  const roleName = (id: string) => {
    const r = roles.find((x) => x.id === id);
    return r ? ROLE_LABEL[r.code] ?? r.name : "—";
  };

  const avanceGlobal = enrollments.length
    ? enrollments.reduce((s, e) => s + e.progress, 0) / enrollments.length
    : 0;
  const completados = enrollments.filter((e) => e.status === "completado").length;
  // El modelo comercial es la suscripcion a la plataforma, no la venta por curso:
  // el indicador util es la formacion efectivamente certificada.
  const horasCertificadas = cursosTop.reduce(
    (s, c) => s + c.durationHours * c.certificates.length,
    0
  );

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-3xl bg-kg-gradient p-8 text-white lg:p-10">
        <div className="pointer-events-none absolute inset-0 bg-kg-mesh" />
        <div className="pointer-events-none absolute inset-0 bg-grid bg-[size:38px_38px] opacity-40" />
        <div className="relative">
          <p className="eyebrow">Administracion KG Academy</p>
          <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight lg:text-4xl">
            Estado general de la plataforma
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-white/60">
            Vision consolidada de usuarios, empresas, cursos, matriculas y certificacion.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/admin/cursos" className="btn-lime">
              Gestionar cursos
            </Link>
            <Link href="/admin/usuarios" className="btn border border-white/20 bg-white/5 text-white hover:bg-white/10">
              Gestionar usuarios
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Usuarios" value={users} hint={`${companies} empresas`} icon={<IconUsers width={20} height={20} />} />
        <StatCard label="Cursos" value={courses} hint={`${publicados} publicados`} icon={<IconBook width={20} height={20} />} />
        <StatCard label="Matriculas" value={enrollments.length} hint={`${completados} completadas`} tone="amber" icon={<IconChart width={20} height={20} />} />
        <StatCard label="Certificados" value={certificates} tone="lime" icon={<IconAward width={20} height={20} />} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* Cursos */}
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between border-b border-navy-50 px-6 py-4">
            <p className="font-display text-sm font-bold text-navy-700">Desempeno por curso</p>
            <Link href="/admin/cursos" className="text-xs font-semibold text-lime-600 hover:underline">
              Ver todos
            </Link>
          </div>
          <table className="table-kg">
            <thead>
              <tr>
                <th>Curso</th>
                <th>Estado</th>
                <th>Matriculas</th>
                <th className="w-36">Avance</th>
              </tr>
            </thead>
            <tbody>
              {cursosTop.map((c) => {
                const av = c.enrollments.length
                  ? c.enrollments.reduce((s, e) => s + e.progress, 0) / c.enrollments.length
                  : 0;
                return (
                  <tr key={c.id}>
                    <td>
                      <p className="font-semibold text-navy-700">{c.title}</p>
                      <p className="font-mono text-[11px] text-navy-300">{c.code}</p>
                    </td>
                    <td>
                      <StatusBadge status={c.status} />
                    </td>
                    <td className="font-display font-bold">{c.enrollments.length}</td>
                    <td>
                      <ProgressBar value={av} showLabel />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Distribucion por rol */}
        <div className="space-y-6">
          <div className="card p-6">
            <p className="font-display text-sm font-bold text-navy-700">Usuarios por rol</p>
            <div className="mt-5 space-y-4">
              {porRol.map((r) => (
                <div key={r.roleId}>
                  <div className="mb-1.5 flex items-baseline justify-between text-xs">
                    <span className="font-semibold text-navy-600">{roleName(r.roleId)}</span>
                    <span className="font-bold text-navy-500">{r._count}</span>
                  </div>
                  <ProgressBar value={(r._count / users) * 100} />
                </div>
              ))}
            </div>
          </div>

          <div className="card p-6">
            <p className="font-display text-sm font-bold text-navy-700">Indicadores globales</p>
            <dl className="mt-4 space-y-3 text-sm">
              {[
                ["Avance promedio", `${Math.round(avanceGlobal)}%`],
                ["Tasa de finalizacion", `${enrollments.length ? Math.round((completados / enrollments.length) * 100) : 0}%`],
                ["Horas certificadas", `${Math.round(horasCertificadas)} h`],
              ].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between gap-4">
                  <dt className="text-navy-400">{k}</dt>
                  <dd className="font-display font-extrabold text-navy-700">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Ultimos usuarios */}
        <div>
          <SectionTitle
            title="Ultimos registros"
            action={
              <Link href="/admin/usuarios" className="btn-outline btn-sm">
                Ver todos <IconArrowRight width={13} height={13} />
              </Link>
            }
          />
          <div className="card divide-y divide-navy-50 overflow-hidden">
            {ultimosUsuarios.map((u) => (
              <div key={u.id} className="flex items-center gap-3 px-5 py-3.5">
                <Avatar first={u.firstName} last={u.lastName} size={34} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-navy-700">
                    {u.firstName} {u.lastName}
                  </p>
                  <p className="truncate text-[11px] text-navy-400">
                    {u.email} &middot; {u.company?.tradeName ?? "Particular"}
                  </p>
                </div>
                <span className="badge-blue shrink-0">{ROLE_LABEL[u.role.code]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Auditoria */}
        <div>
          <SectionTitle
            title="Auditoria reciente"
            action={
              <Link href="/admin/auditoria" className="btn-outline btn-sm">
                Ver registro <IconArrowRight width={13} height={13} />
              </Link>
            }
          />
          <div className="card divide-y divide-navy-50 overflow-hidden">
            {auditoria.map((a) => (
              <div key={a.id} className="flex items-start gap-3 px-5 py-3.5">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-navy-50 text-navy-500">
                  <IconShield width={14} height={14} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-navy-700">{a.summary ?? a.action}</p>
                  <p className="text-[11px] text-navy-400">
                    {a.actorEmail ?? "sistema"} &middot; {a.entity} &middot; {formatDateTime(a.createdAt)}
                  </p>
                </div>
              </div>
            ))}
            {auditoria.length === 0 && (
              <p className="px-5 py-8 text-center text-xs text-navy-300">Sin registros</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2 rounded-2xl border border-dashed border-navy-200 bg-white/60 p-5 text-center text-xs text-navy-400">
        <IconBuilding width={14} height={14} />
        KG Academy &middot; Plataforma disenada y desarrollada por
        <span className="font-semibold text-navy-600">Diego Alejandro Hernandez Blanco</span>
      </div>
    </div>
  );
}
