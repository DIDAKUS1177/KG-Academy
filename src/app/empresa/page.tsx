import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { resolveCompany, companyKpis, asignacionesVigentes, avanceEnLaEmpresa } from "@/lib/empresa";
import { cuposEmpresa, ROLES_CON_CUPO } from "@/lib/cupos";
import { ROLES } from "@/lib/constants";
import { formatDate, cantidad } from "@/lib/utils";
import { indicadoresEmpresa, semaforo } from "@/lib/indicadores";
import { TableroIndicadores } from "@/components/TableroIndicadores";
import {
  StatCard,
  SectionTitle,
  ProgressBar,
  ProgressRing,
  StatusBadge,
  EmptyState,
  Avatar,
} from "@/components/ui";
import {
  IconUsers,
  IconCheck,
  IconClock,
  IconAlert,
  IconArrowRight,
  IconClipboard,
  IconBuilding,
  IconLock,
  IconChart,
} from "@/components/Icons";

export const metadata: Metadata = { title: "Panel empresarial" };
export const dynamic = "force-dynamic";

export default async function EmpresaDashboard(props: { searchParams: Promise<{ empresa?: string }> }) {
  const searchParams = await props.searchParams;
  const user = await requireRole(ROLES.ADMIN_EMPRESA, ROLES.SUPERVISOR, ROLES.SUPERADMIN, ROLES.ADMIN_KG);
  const company = await resolveCompany(user, searchParams.empresa);

  if (!company) {
    return (
      <EmptyState
        icon={<IconBuilding width={30} height={30} />}
        title="Su usuario no está vinculado a una empresa"
        description="Solicite al administrador de KG Academy la vinculación de su cuenta a una empresa."
      />
    );
  }

  // El supervisor consulta; asignar y crear cuentas es del administrador.
  const gestiona = user.role.code !== ROLES.SUPERVISOR;

  const [kpis, indicadores, cupos, avance, porCurso, miembros, recientes] = await Promise.all([
    companyKpis(company.id),
    indicadoresEmpresa(company.id),
    cuposEmpresa(company.id),
    avanceEnLaEmpresa(company.id),
    prisma.courseAssignment.findMany({
      where: asignacionesVigentes(company.id),
      include: { course: true, enrollment: true },
    }),
    // Las personas que toman cursos (los administradores de la empresa no cuentan).
    prisma.companyMember.findMany({
      where: { companyId: company.id, status: { not: "retirado" }, user: { role: { code: { in: ROLES_CON_CUPO } } } },
      select: { userId: true, area: { select: { name: true } }, user: { select: { lastLoginAt: true } } },
    }),
    prisma.courseAssignment.findMany({
      where: asignacionesVigentes(company.id),
      include: { user: true, course: true, enrollment: true },
      orderBy: { updatedAt: "desc" },
      take: 8,
    }),
  ]);

  // Agregado por curso
  const cursos = new Map<string, { title: string; total: number; done: number; avance: number }>();
  for (const a of porCurso) {
    const cur = cursos.get(a.courseId) ?? { title: a.course.title, total: 0, done: 0, avance: 0 };
    cur.total++;
    if (a.status === "completado") cur.done++;
    cur.avance += a.enrollment?.progress ?? 0;
    cursos.set(a.courseId, cur);
  }

  // Agregado por área: promedio de avance en los cursos asignados a su gente.
  const areas = new Map<string, { personas: number; asignados: number; suma: number }>();
  for (const m of miembros) {
    const key = m.area?.name ?? "Sin área";
    const cur = areas.get(key) ?? { personas: 0, asignados: 0, suma: 0 };
    const p = avance(m.userId);
    cur.personas++;
    cur.asignados += p.asignados;
    cur.suma += (p.avance ?? 0) * p.asignados;
    areas.set(key, cur);
  }

  // Lo que pide atención, con un enlace directo a resolverlo.
  const nuncaEntraron = miembros.filter((m) => !m.user.lastLoginAt && avance(m.userId).asignados > 0).length;
  const sinCursos = miembros.filter((m) => avance(m.userId).asignados === 0).length;
  const pocosCupos = cupos.limite > 0 && cupos.disponibles <= Math.max(3, Math.ceil(cupos.limite * 0.05));
  const pendientes = [
    kpis.vencidos > 0 && {
      texto: `${cantidad(kpis.vencidos, "curso vencido", "cursos vencidos")} sin terminar`,
      ayuda: "Recuérdeles a esas personas que terminen, o amplíe la fecha límite.",
      href: "/empresa/seguimiento?estado=vencido",
      tono: "red",
    },
    nuncaEntraron > 0 && {
      texto: `${cantidad(nuncaEntraron, "persona no ha entrado", "personas no han entrado")} nunca`,
      ayuda: "Tienen cursos asignados pero no han ingresado. Verifique que tengan su usuario y contraseña.",
      href: "/empresa/seguimiento?estado=nunca",
      tono: "amber",
    },
    gestiona && sinCursos > 0 && {
      texto: `${cantidad(sinCursos, "persona sin cursos asignados", "personas sin cursos asignados")}`,
      ayuda: "Asígneles los cursos que deben tomar.",
      href: "/empresa/asignar",
      tono: "amber",
    },
    gestiona && pocosCupos && {
      texto: cupos.disponibles ? `Le quedan ${cantidad(cupos.disponibles, "cupo", "cupos")}` : "No le quedan cupos",
      ayuda: "Para sumar personas, retire a quienes ya no trabajan con ustedes o pídale a KG ampliar el plan.",
      href: "/empresa/trabajadores",
      tono: "amber",
    },
  ].filter((p): p is { texto: string; ayuda: string; href: string; tono: string } => !!p);

  // Primeros pasos: hasta que haya personas con cursos asignados.
  const pasos = [
    { hecho: miembros.length > 0, titulo: "Cree a sus trabajadores", texto: "De a uno o con un Excel.", href: "/empresa/trabajadores" },
    { hecho: kpis.total > 0, titulo: "Asígneles cursos", texto: "Elija el curso, las personas y la fecha límite.", href: "/empresa/asignar" },
    {
      hecho: miembros.some((m) => m.user.lastLoginAt),
      titulo: "Entrégueles su usuario y contraseña",
      texto: "Entran con su documento (o correo) en kgacademy.",
      href: "/empresa/trabajadores",
    },
    { hecho: false, titulo: "Haga seguimiento", texto: "Vea quién avanza, quién terminó y quién no ha entrado.", href: "/empresa/seguimiento" },
  ];
  const mostrarPasos = gestiona && (miembros.length === 0 || kpis.total === 0);

  const estados = indicadores.map(semaforo);
  const resumenIndicadores = [
    [estados.filter((s) => s === "cumple").length, "cumple", "cumplen"],
    [estados.filter((s) => s === "alerta").length, "en alerta", "en alerta"],
    [estados.filter((s) => s === "no_cumple").length, "no cumple", "no cumplen"],
  ]
    .filter(([n]) => (n as number) > 0)
    .map(([n, uno, varios]) => `${n} ${n === 1 ? uno : varios}`)
    .join(" · ");

  return (
    <div className="space-y-8">
      {/* Encabezado */}
      <div className="relative overflow-hidden rounded-3xl bg-kg-gradient p-6 text-white sm:p-8 lg:p-10">
        <div className="pointer-events-none absolute inset-0 bg-kg-mesh" />
        <div className="pointer-events-none absolute inset-0 bg-grid bg-[size:38px_38px] opacity-40" />
        <div className="relative flex flex-wrap items-center justify-between gap-8">
          <div>
            <p className="eyebrow">Panel empresarial</p>
            <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight lg:text-4xl">
              {company.tradeName ?? company.legalName}
            </h1>
            <p className="mt-2 text-sm text-white/55">
              NIT {company.nit} &middot; {company.economicSector} &middot; Riesgo {company.riskLevel} &middot;{" "}
              {cantidad(miembros.length, "trabajador", "trabajadores")}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {gestiona ? (
                <Link href="/empresa/asignar" className="btn-lime">
                  <IconClipboard width={16} height={16} /> Asignar cursos
                </Link>
              ) : (
                <Link href="/empresa/seguimiento" className="btn-lime">
                  <IconChart width={16} height={16} /> Ver seguimiento
                </Link>
              )}
              <Link
                href="/empresa/reportes"
                className="btn border border-white/20 bg-white/5 text-white hover:bg-white/10"
              >
                Ver reportes
              </Link>
            </div>
          </div>
          <div className="rounded-2xl border border-white/15 bg-white/10 p-5 text-center backdrop-blur">
            <ProgressRing value={kpis.cumplimiento} size={132} sub="cumplimiento" />
            <p className="mt-2 text-[11px] text-white/50">
              {kpis.completados} de {cantidad(kpis.total, "curso asignado", "cursos asignados")} terminados
            </p>
          </div>
        </div>
      </div>

      {/* Primeros pasos (empresa recién creada) */}
      {mostrarPasos && (
        <div className="card p-6">
          <p className="font-display text-lg font-bold text-navy-700">Primeros pasos</p>
          <p className="text-sm text-navy-400">Cuatro pasos para que su gente empiece a capacitarse.</p>
          <ol className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {pasos.map((p, i) => (
              <li key={p.titulo}>
                <Link
                  href={p.href}
                  className={`flex h-full gap-3 rounded-2xl border p-4 transition hover:-translate-y-0.5 ${
                    p.hecho ? "border-lime-200 bg-lime-50" : "border-navy-100 bg-white hover:border-navy-300"
                  }`}
                >
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-extrabold ${
                      p.hecho ? "bg-lime-500 text-white" : "bg-navy-50 text-navy-600"
                    }`}
                  >
                    {p.hecho ? <IconCheck width={15} height={15} strokeWidth={3} /> : i + 1}
                  </span>
                  <span>
                    <span className="block text-sm font-bold text-navy-700">{p.titulo}</span>
                    <span className="mt-0.5 block text-xs leading-relaxed text-navy-400">{p.texto}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Requiere su atención */}
      {!mostrarPasos && (
        <div className="card p-6">
          <p className="font-display text-lg font-bold text-navy-700">Requiere su atención</p>
          {pendientes.length === 0 ? (
            <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-lime-700">
              <IconCheck width={16} height={16} strokeWidth={3} /> Todo al día: no hay cursos vencidos ni personas sin entrar.
            </p>
          ) : (
            <ul className="mt-4 grid gap-3 md:grid-cols-2">
              {pendientes.map((p) => (
                <li key={p.texto}>
                  <Link
                    href={p.href}
                    className="group flex h-full items-start gap-3 rounded-2xl border border-navy-100 p-4 transition hover:border-navy-300"
                  >
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                        p.tono === "red" ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      <IconAlert width={17} height={17} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-bold text-navy-700">{p.texto}</span>
                      <span className="mt-0.5 block text-xs leading-relaxed text-navy-400">{p.ayuda}</span>
                    </span>
                    <IconArrowRight width={16} height={16} className="mt-1 shrink-0 text-navy-300 transition group-hover:translate-x-0.5" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* KPIs */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Cursos asignados" value={kpis.total} icon={<IconClipboard width={20} height={20} />} />
        <StatCard label="Completados" value={kpis.completados} tone="lime" icon={<IconCheck width={20} height={20} />} />
        <StatCard label="En progreso" value={kpis.enProgreso} tone="amber" hint={`${kpis.noIniciados} sin iniciar`} icon={<IconClock width={20} height={20} />} />
        <StatCard label="Vencidos" value={kpis.vencidos} tone="red" icon={<IconAlert width={20} height={20} />} />
      </div>

      {/* Indicadores de gestión con semáforo, plegados para no saturar el inicio */}
      <details className="group card overflow-hidden">
        <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-4 p-6 [&::-webkit-details-marker]:hidden">
          <span>
            <span className="eyebrow">SG-SST</span>
            <span className="mt-1 block font-display text-lg font-bold text-navy-700">Indicadores de gestión</span>
            <span className="mt-0.5 block text-xs text-navy-400">
              {resumenIndicadores || "Cobertura, cumplimiento, aprendizaje, participación y vigencia"}
            </span>
          </span>
          <span className="btn-outline btn-sm">
            <span className="group-open:hidden">Ver indicadores</span>
            <span className="hidden group-open:inline">Ocultar</span>
          </span>
        </summary>
        <div className="border-t border-navy-50 p-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <p className="max-w-2xl text-sm text-navy-400">
              Cada indicador muestra su fórmula y su meta de referencia. El semáforo compara el resultado con la meta.
            </p>
            <a href={`/api/empresa/reporte?tipo=indicadores&empresa=${company.id}`} className="btn-outline btn-sm">
              Descargar Excel (CSV)
            </a>
          </div>
          <TableroIndicadores indicadores={indicadores} />
        </div>
      </details>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Avance por curso */}
        <div className="card p-6">
          <p className="font-display text-base font-bold text-navy-700">Avance por curso</p>
          <p className="text-xs text-navy-400">Promedio de progreso de las personas asignadas</p>
          <div className="mt-5 space-y-5">
            {[...cursos.entries()].map(([id, c]) => (
              <div key={id}>
                <div className="mb-1.5 flex items-baseline justify-between gap-3">
                  <p className="truncate text-sm font-semibold text-navy-700">{c.title}</p>
                  <span className="shrink-0 text-xs font-bold text-navy-500">
                    {Math.round(c.avance / c.total)}%
                  </span>
                </div>
                <ProgressBar value={c.avance / c.total} />
                <p className="mt-1 text-[11px] text-navy-400">
                  {c.done} de {cantidad(c.total, "persona terminó", "personas terminaron")}
                </p>
              </div>
            ))}
            {cursos.size === 0 && (
              <p className="py-6 text-center text-sm text-navy-300">Aún no hay cursos asignados</p>
            )}
          </div>
        </div>

        {/* Avance por área */}
        <div className="card p-6">
          <p className="font-display text-base font-bold text-navy-700">Avance por área</p>
          <p className="text-xs text-navy-400">Promedio de progreso en los cursos asignados a cada área</p>
          <div className="mt-5 space-y-5">
            {[...areas.entries()].map(([name, a]) => (
              <div key={name}>
                <div className="mb-1.5 flex items-baseline justify-between gap-3">
                  <p className="truncate text-sm font-semibold text-navy-700">{name}</p>
                  <span className="shrink-0 text-xs font-bold text-navy-500">
                    {a.asignados ? `${Math.round(a.suma / a.asignados)}%` : "—"}
                  </span>
                </div>
                <ProgressBar value={a.asignados ? a.suma / a.asignados : 0} />
                <p className="mt-1 text-[11px] text-navy-400">
                  {cantidad(a.personas, "persona", "personas")} &middot;{" "}
                  {a.asignados ? cantidad(a.asignados, "curso asignado", "cursos asignados") : "sin cursos asignados"}
                </p>
              </div>
            ))}
            {areas.size === 0 && (
              <p className="py-6 text-center text-sm text-navy-300">Aún no hay trabajadores registrados</p>
            )}
          </div>
        </div>
      </div>

      {/* Actividad reciente */}
      <div>
        <SectionTitle
          eyebrow="Trazabilidad"
          title="Actividad reciente"
          action={
            <Link href="/empresa/seguimiento" className="btn-outline btn-sm">
              Ver seguimiento completo <IconArrowRight width={14} height={14} />
            </Link>
          }
        />
        <div className="card overflow-x-auto">
          <table className="table-kg">
            <thead>
              <tr>
                <th>Trabajador</th>
                <th>Curso</th>
                <th className="w-48">Avance</th>
                <th>Estado</th>
                <th>Fecha límite</th>
              </tr>
            </thead>
            <tbody>
              {recientes.map((a) => (
                <tr key={a.id}>
                  <td>
                    <Link href={`/empresa/trabajadores/${a.userId}`} className="flex items-center gap-3">
                      <Avatar first={a.user.firstName} last={a.user.lastName} size={32} />
                      <span className="font-semibold">
                        {a.user.firstName} {a.user.lastName}
                      </span>
                    </Link>
                  </td>
                  <td className="text-navy-500">{a.course.title}</td>
                  <td>
                    <ProgressBar value={a.enrollment?.progress ?? 0} showLabel />
                  </td>
                  <td>
                    <StatusBadge status={a.status} />
                  </td>
                  <td className="text-xs text-navy-400">{formatDate(a.dueDate)}</td>
                </tr>
              ))}
              {recientes.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-sm text-navy-300">
                    Sin actividad registrada
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="flex items-center justify-center gap-2 text-center text-[11px] text-navy-300">
        <IconLock width={13} height={13} /> Los datos de esta empresa están aislados de las demás
        empresas de la plataforma.
      </p>
    </div>
  );
}
