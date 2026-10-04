import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { resolveCompany, companyKpis, alcanceEmpresa, asignacionesVigentes } from "@/lib/empresa";
import { cuposEmpresa, ROLES_CON_CUPO } from "@/lib/cupos";
import { indicadoresEmpresa, mostrarMeta, mostrarValor } from "@/lib/indicadores";
import { EtiquetaSemaforo } from "@/components/TableroIndicadores";
import { ROLES } from "@/lib/constants";
import { formatDate, formatDateTime } from "@/lib/utils";
import { EmptyState } from "@/components/ui";
import { PrintButton } from "@/components/PrintButton";

export const metadata: Metadata = { title: "Informe de capacitación" };
export const dynamic = "force-dynamic";

/**
 * Informe de capacitación de la empresa, listo para imprimir o guardar en PDF:
 * la evidencia que pide una auditoría del SG-SST o la ARL en una sola hoja.
 */
export default async function InformePage(props: { searchParams: Promise<{ empresa?: string }> }) {
  const searchParams = await props.searchParams;
  const user = await requireRole(ROLES.ADMIN_EMPRESA, ROLES.SUPERVISOR, ROLES.SUPERADMIN, ROLES.ADMIN_KG);
  const company = await resolveCompany(user, searchParams.empresa);
  if (!company) return <EmptyState title="Sin empresa asociada" />;

  const hoy = new Date();
  const [kpis, cupos, asignaciones, miembros, certificados, indicadores] = await Promise.all([
    companyKpis(company.id),
    cuposEmpresa(company.id),
    prisma.courseAssignment.findMany({
      where: asignacionesVigentes(company.id),
      include: { course: true, enrollment: true, user: true },
    }),
    prisma.companyMember.findMany({
      where: { companyId: company.id, status: { not: "retirado" }, user: { role: { code: { in: ROLES_CON_CUPO } } } },
      include: { area: true },
    }),
    // Solo certificados de cursos que la empresa asignó a esa persona.
    alcanceEmpresa(company.id).then(async (alcance) =>
      (
        await prisma.certificate.findMany({
          where: { userId: { in: alcance.userIds }, courseId: { in: alcance.courseIds } },
          select: { status: true, expiresAt: true, hours: true, userId: true, courseId: true },
        })
      ).filter((c) => c.courseId && alcance.incluye(c.userId, c.courseId))
    ),
    indicadoresEmpresa(company.id),
  ]);

  const vigentes = certificados.filter((c) => c.status === "vigente" && (!c.expiresAt || c.expiresAt > hoy));
  const horasCertificadas = Math.round(vigentes.reduce((s, c) => s + c.hours, 0));
  const vencida = (a: (typeof asignaciones)[number]) => !!a.dueDate && a.dueDate < hoy && a.status !== "completado";

  // Por curso
  const porCurso = new Map<string, { codigo: string; titulo: string; horas: number; total: number; completos: number; enCurso: number; vencidos: number; notas: number[] }>();
  for (const a of asignaciones) {
    const c = porCurso.get(a.courseId) ?? { codigo: a.course.code, titulo: a.course.title, horas: a.course.durationHours, total: 0, completos: 0, enCurso: 0, vencidos: 0, notas: [] };
    c.total++;
    if (a.status === "completado") {
      c.completos++;
      if (a.enrollment?.finalScore != null) c.notas.push(a.enrollment.finalScore);
    } else if (a.status === "en_progreso") c.enCurso++;
    if (vencida(a)) c.vencidos++;
    porCurso.set(a.courseId, c);
  }
  const cursos = [...porCurso.values()].sort((x, y) => x.codigo.localeCompare(y.codigo));

  // Por área
  const areaDe = new Map(miembros.map((m) => [m.userId, m.area?.name ?? "Sin área"]));
  const porArea = new Map<string, { trabajadores: number; total: number; completos: number }>();
  for (const m of miembros) {
    const nombre = m.area?.name ?? "Sin área";
    const r = porArea.get(nombre) ?? { trabajadores: 0, total: 0, completos: 0 };
    r.trabajadores++;
    porArea.set(nombre, r);
  }
  for (const a of asignaciones) {
    const r = porArea.get(areaDe.get(a.userId) ?? "Sin área");
    if (!r) continue;
    r.total++;
    if (a.status === "completado") r.completos++;
  }
  const areas = [...porArea.entries()].sort((x, y) => x[0].localeCompare(y[0]));

  const pendientes = asignaciones
    .filter((a) => vencida(a) && a.isMandatory)
    .sort((x, y) => (x.dueDate?.getTime() ?? 0) - (y.dueDate?.getTime() ?? 0))
    .slice(0, 50);

  const pct = (n: number, d: number) => (d ? `${Math.round((n / d) * 100)}%` : "—");

  return (
    <div className="mx-auto max-w-5xl">
      {/* El informe se imprime en vertical (el certificado usa horizontal). */}
      <style>{"@media print { @page { size: A4 portrait; margin: 12mm; } }"}</style>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Link href="/empresa/reportes" className="btn-ghost btn-sm">← Volver a reportes</Link>
        <PrintButton texto="Imprimir o guardar en PDF" />
      </div>

      <article className="card space-y-8 p-8 print:border-0 print:p-0 print:shadow-none">
        <header className="flex flex-wrap items-start justify-between gap-4 border-b border-navy-100 pb-6">
          <div>
            <p className="eyebrow">Informe de capacitación SG-SST</p>
            <h1 className="mt-1 font-display text-2xl font-extrabold text-navy-700">{company.legalName}</h1>
            <p className="mt-1 text-sm text-navy-400">
              NIT {company.nit}
              {company.city ? ` · ${company.city}` : ""}
            </p>
          </div>
          <div className="text-right text-xs text-navy-400">
            <p className="font-display text-sm font-bold text-navy-700">KG Academy</p>
            <p>KG Gestión Integral S.A.S.</p>
            <p className="mt-2">Generado el {formatDateTime(hoy)}</p>
            <p>por {user.firstName} {user.lastName}</p>
          </div>
        </header>

        <section>
          <h2 className="font-display text-base font-bold text-navy-700">Resumen</h2>
          <dl className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              ["Trabajadores", `${cupos.usados} de ${cupos.limite} cupos`],
              ["Cursos asignados", String(kpis.total)],
              ["Cumplimiento", `${Math.round(kpis.cumplimiento)}%`],
              ["Avance promedio", `${Math.round(kpis.avance)}%`],
              ["Completados", String(kpis.completados)],
              ["En progreso", String(kpis.enProgreso)],
              ["Vencidos", String(kpis.vencidos)],
              ["Certificados vigentes", `${vigentes.length} (${horasCertificadas} h)`],
            ].map(([k, v]) => (
              <div key={k} className="rounded-xl bg-navy-50/60 p-3">
                <dt className="text-[11px] font-bold uppercase tracking-wide text-navy-400">{k}</dt>
                <dd className="mt-1 font-display text-lg font-extrabold text-navy-700">{v}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section>
          <h2 className="font-display text-base font-bold text-navy-700">Indicadores de gestión</h2>
          <div className="mt-3 overflow-x-auto print:overflow-visible">
            <table className="table-kg">
              <thead>
                <tr>
                  <th>Indicador</th>
                  <th>Resultado</th>
                  <th>Meta</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {indicadores.map((i) => (
                  <tr key={i.clave}>
                    <td>
                      <p className="font-semibold text-navy-700">{i.nombre}</p>
                      <p className="text-[11px] text-navy-400">{i.formula}</p>
                    </td>
                    <td className="whitespace-nowrap font-bold">{mostrarValor(i)}</td>
                    <td className="whitespace-nowrap">{mostrarMeta(i)}</td>
                    <td><EtiquetaSemaforo indicador={i} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="font-display text-base font-bold text-navy-700">Por curso</h2>
          <div className="mt-3 overflow-x-auto print:overflow-visible">
            <table className="table-kg">
              <thead>
                <tr>
                  <th>Curso</th>
                  <th>Horas</th>
                  <th>Asignados</th>
                  <th>Completados</th>
                  <th>En progreso</th>
                  <th>Vencidos</th>
                  <th>Cumplimiento</th>
                  <th>Nota prom.</th>
                </tr>
              </thead>
              <tbody>
                {cursos.map((c) => (
                  <tr key={c.codigo}>
                    <td>
                      <p className="font-semibold text-navy-700">{c.titulo}</p>
                      <p className="text-[11px] text-navy-400">{c.codigo}</p>
                    </td>
                    <td>{c.horas}</td>
                    <td>{c.total}</td>
                    <td>{c.completos}</td>
                    <td>{c.enCurso}</td>
                    <td>{c.vencidos}</td>
                    <td className="font-bold">{pct(c.completos, c.total)}</td>
                    <td>{c.notas.length ? Math.round(c.notas.reduce((s, n) => s + n, 0) / c.notas.length) : "—"}</td>
                  </tr>
                ))}
                {cursos.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-6 text-center text-sm text-navy-300">Aún no hay cursos asignados</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="font-display text-base font-bold text-navy-700">Por área</h2>
          <div className="mt-3 overflow-x-auto print:overflow-visible">
            <table className="table-kg">
              <thead>
                <tr>
                  <th>Área</th>
                  <th>Trabajadores</th>
                  <th>Asignaciones</th>
                  <th>Completadas</th>
                  <th>Cumplimiento</th>
                </tr>
              </thead>
              <tbody>
                {areas.map(([nombre, r]) => (
                  <tr key={nombre}>
                    <td className="font-semibold text-navy-700">{nombre}</td>
                    <td>{r.trabajadores}</td>
                    <td>{r.total}</td>
                    <td>{r.completos}</td>
                    <td className="font-bold">{pct(r.completos, r.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="font-display text-base font-bold text-navy-700">Cursos obligatorios vencidos</h2>
          {pendientes.length === 0 ? (
            <p className="mt-3 text-sm text-navy-400">No hay cursos obligatorios vencidos a la fecha.</p>
          ) : (
            <div className="mt-3 overflow-x-auto print:overflow-visible">
              <table className="table-kg">
                <thead>
                  <tr>
                    <th>Trabajador</th>
                    <th>Documento</th>
                    <th>Curso</th>
                    <th>Fecha límite</th>
                    <th>Avance</th>
                  </tr>
                </thead>
                <tbody>
                  {pendientes.map((a) => (
                    <tr key={a.id}>
                      <td className="font-semibold text-navy-700">{a.user.firstName} {a.user.lastName}</td>
                      <td>{a.user.documentNumber ?? "—"}</td>
                      <td>{a.course.title}</td>
                      <td>{a.dueDate ? formatDate(a.dueDate) : "—"}</td>
                      <td>{Math.round(a.enrollment?.progress ?? 0)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <footer className="grid gap-10 pt-10 sm:grid-cols-2">
          {["Responsable del SG-SST", "Representante legal"].map((cargo) => (
            <div key={cargo} className="border-t border-navy-300 pt-2 text-xs text-navy-500">
              <p className="font-semibold text-navy-700">{cargo}</p>
              <p>Nombre y firma</p>
            </div>
          ))}
          <p className="text-[11px] text-navy-400 sm:col-span-2">
            Los certificados se pueden verificar con su código en kg-academy.vercel.app/verificar. El detalle por
            trabajador, lección y evaluación se descarga en Reportes.
          </p>
        </footer>
      </article>
    </div>
  );
}
