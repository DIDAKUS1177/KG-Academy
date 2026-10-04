import Link from "next/link";
import type { Metadata } from "next";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { asignacionesVigentes, resolveCompany } from "@/lib/empresa";
import { ROLES } from "@/lib/constants";
import { buscarPersona } from "@/lib/busqueda";
import { cantidad, formatDate, daysBetween } from "@/lib/utils";
import { Avatar, EmptyState, ProgressBar, SectionTitle, StatusBadge, StatCard } from "@/components/ui";
import { IconDownload, IconSearch, IconCheck, IconClock, IconAlert, IconClipboard } from "@/components/Icons";

export const metadata: Metadata = { title: "Seguimiento" };
export const dynamic = "force-dynamic";

const ESTADOS = [
  ["", "Todos"],
  ["vencido", "Vencidos"],
  ["nunca", "Nunca ha entrado"],
  ["asignado", "Sin iniciar"],
  ["en_progreso", "En progreso"],
  ["completado", "Completados"],
] as const;

export default async function SeguimientoPage(props: {
  searchParams: Promise<{ q?: string; curso?: string; estado?: string; area?: string; empresa?: string }>;
}) {
  const searchParams = await props.searchParams;
  const user = await requireRole(ROLES.ADMIN_EMPRESA, ROLES.SUPERVISOR, ROLES.SUPERADMIN, ROLES.ADMIN_KG);
  const company = await resolveCompany(user, searchParams.empresa);
  if (!company) return <EmptyState title="Sin empresa asociada" />;

  const q = searchParams.q?.trim();
  const estado = searchParams.estado ?? "";
  const hoy = new Date();

  const filtroEstado: Prisma.CourseAssignmentWhereInput =
    estado === "vencido"
      ? { dueDate: { lt: hoy }, status: { not: "completado" } }
      : estado === "nunca"
        ? { status: { not: "completado" }, user: { lastLoginAt: null } }
        : estado
          ? { status: estado }
          : {};

  const [asignaciones, cursos, areas] = await Promise.all([
    prisma.courseAssignment.findMany({
      where: {
        AND: [
          asignacionesVigentes(company.id),
          filtroEstado,
          searchParams.curso ? { courseId: searchParams.curso } : {},
          q ? { user: buscarPersona(q) } : {},
          searchParams.area ? { user: { memberships: { some: { companyId: company.id, areaId: searchParams.area } } } } : {},
        ],
      },
      include: {
        user: { include: { memberships: { include: { area: true, position: true } } } },
        course: true,
        enrollment: true,
      },
    }),
    prisma.course.findMany({
      where: { assignments: { some: { companyId: company.id } } },
      select: { id: true, title: true },
    }),
    prisma.area.findMany({ where: { companyId: company.id } }),
  ]);

  // Lo más urgente primero: lo vencido (lo más atrasado arriba), luego lo que
  // vence antes, lo que no tiene fecha y, al final, lo terminado.
  const urgencia = (a: (typeof asignaciones)[number]) => {
    if (a.status === "completado") return Number.MAX_SAFE_INTEGER;
    return a.dueDate ? new Date(a.dueDate).getTime() : Number.MAX_SAFE_INTEGER - 1;
  };
  const filas = [...asignaciones].sort((a, b) => urgencia(a) - urgencia(b));

  const stats = {
    completados: filas.filter((a) => a.status === "completado").length,
    progreso: filas.filter((a) => a.status === "en_progreso").length,
    sinIniciar: filas.filter((a) => a.status === "asignado").length,
    vencidos: filas.filter((a) => a.dueDate && new Date(a.dueDate) < hoy && a.status !== "completado").length,
  };
  const filtrando = !!(q || searchParams.curso || searchParams.area || estado);

  return (
    <div>
      <SectionTitle
        eyebrow={company.tradeName ?? company.legalName}
        title="Seguimiento de capacitación"
        description="Quién inició, quién va en progreso, quién terminó y quién no ha entrado. Lo más urgente aparece primero."
        action={
          <a href={`/api/empresa/reporte?tipo=seguimiento&empresa=${company.id}`} className="btn-lime btn-sm">
            <IconDownload width={14} height={14} /> Descargar Excel (CSV)
          </a>
        }
      />

      <div className="mb-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Completados" value={stats.completados} tone="lime" icon={<IconCheck width={20} height={20} />} />
        <StatCard label="En progreso" value={stats.progreso} tone="amber" icon={<IconClock width={20} height={20} />} />
        <StatCard label="Sin iniciar" value={stats.sinIniciar} icon={<IconClipboard width={20} height={20} />} />
        <StatCard label="Vencidos" value={stats.vencidos} tone="red" icon={<IconAlert width={20} height={20} />} />
      </div>

      {/* Atajos por estado */}
      <div className="mb-4 flex flex-wrap gap-2">
        {ESTADOS.map(([valor, etiqueta]) => {
          const params = new URLSearchParams();
          if (q) params.set("q", q);
          if (searchParams.curso) params.set("curso", searchParams.curso);
          if (searchParams.area) params.set("area", searchParams.area);
          if (valor) params.set("estado", valor);
          const activo = estado === valor;
          return (
            <Link
              key={valor || "todos"}
              href={`/empresa/seguimiento${params.size ? `?${params}` : ""}`}
              className={`rounded-full border px-3 py-1.5 text-xs font-bold transition ${
                activo ? "border-navy-700 bg-navy-700 text-white" : "border-navy-100 bg-white text-navy-500 hover:border-navy-300"
              }`}
            >
              {etiqueta}
            </Link>
          );
        })}
      </div>

      {/* Filtros */}
      <form className="card mb-6 flex flex-wrap items-end gap-3 p-4">
        {estado && <input type="hidden" name="estado" value={estado} />}
        <div className="min-w-[200px] flex-1">
          <label className="label">Buscar trabajador</label>
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
          <label className="label">Curso</label>
          <select name="curso" defaultValue={searchParams.curso ?? ""} className="select">
            <option value="">Todos</option>
            {cursos.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </div>
        <div className="min-w-[150px]">
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
        <Link href="/empresa/seguimiento" className="btn-ghost">
          Limpiar
        </Link>
      </form>

      <div className="card overflow-x-auto">
        <table className="table-kg">
          <thead>
            <tr>
              <th>Trabajador</th>
              <th>Área / Cargo</th>
              <th>Curso</th>
              <th className="w-44">Avance</th>
              <th>Nota</th>
              <th>Estado</th>
              <th>Fecha límite</th>
            </tr>
          </thead>
          <tbody>
            {filas.map((a) => {
              const m = a.user.memberships.find((x) => x.companyId === company.id);
              const dias = a.dueDate ? daysBetween(new Date(a.dueDate), hoy) : null;
              const vencido = dias !== null && dias < 0 && a.status !== "completado";
              return (
                <tr key={a.id}>
                  <td>
                    <Link href={`/empresa/trabajadores/${a.userId}`} className="flex items-center gap-3">
                      <Avatar first={a.user.firstName} last={a.user.lastName} size={32} />
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-navy-700">
                          {a.user.firstName} {a.user.lastName}
                        </p>
                        <p className="truncate text-[11px] text-navy-400">
                          {a.user.documentNumber}
                          {!a.user.lastLoginAt && a.status !== "completado" && (
                            <span className="font-semibold text-amber-700"> · nunca ha entrado</span>
                          )}
                        </p>
                      </div>
                    </Link>
                  </td>
                  <td className="text-xs text-navy-500">
                    {m?.area?.name ?? "—"}
                    <span className="block text-[11px] text-navy-300">{m?.position?.name ?? "—"}</span>
                  </td>
                  <td className="text-xs text-navy-600">{a.course.title}</td>
                  <td>
                    <ProgressBar value={a.enrollment?.progress ?? 0} showLabel />
                  </td>
                  <td className="font-display text-sm font-bold">
                    {a.enrollment?.finalScore ? Math.round(a.enrollment.finalScore) : "—"}
                  </td>
                  <td>
                    <StatusBadge status={vencido ? "vencido" : a.status} />
                  </td>
                  <td className="text-xs">
                    <span className={vencido ? "font-bold text-red-600" : "text-navy-400"}>
                      {formatDate(a.dueDate)}
                    </span>
                    {dias !== null && a.status !== "completado" && (
                      <span className={`block text-[10px] ${vencido ? "text-red-500" : dias <= 7 ? "text-amber-700" : "text-navy-300"}`}>
                        {dias > 0 ? `quedan ${cantidad(dias, "día", "días")}` : dias === 0 ? "vence hoy" : `vencido hace ${cantidad(-dias, "día", "días")}`}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
            {filas.length === 0 && (
              <tr>
                <td colSpan={7} className="py-12 text-center text-sm text-navy-300">
                  {filtrando ? "No hay registros con los filtros seleccionados" : "Aún no hay cursos asignados"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
