import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { filtroCatalogo } from "@/lib/acceso-cursos";
import { requireRole } from "@/lib/auth";
import { alcanceEmpresa, avanceEnLaEmpresa, resolveCompany } from "@/lib/empresa";
import { ROLES } from "@/lib/constants";
import { cantidad, formatDate } from "@/lib/utils";
import { buscarPersona } from "@/lib/busqueda";
import { Avatar, EmptyState, ProgressBar, SectionTitle, StatusBadge } from "@/components/ui";
import { cuposEmpresa, ROLES_CON_CUPO } from "@/lib/cupos";
import { NuevoTrabajador } from "./NuevoTrabajador";
import { IconUsers, IconSearch, IconDownload, IconArrowRight } from "@/components/Icons";
import { correoVisible } from "@/lib/identidad";

export const metadata: Metadata = { title: "Trabajadores" };
export const dynamic = "force-dynamic";

export default async function TrabajadoresPage(props: {
  searchParams: Promise<{ q?: string; area?: string; estado?: string; empresa?: string }>;
}) {
  const searchParams = await props.searchParams;
  const user = await requireRole(ROLES.ADMIN_EMPRESA, ROLES.SUPERVISOR, ROLES.SUPERADMIN, ROLES.ADMIN_KG);
  const company = await resolveCompany(user, searchParams.empresa);
  if (!company) return <EmptyState title="Sin empresa asociada" />;

  const q = searchParams.q?.trim();
  const verRetirados = searchParams.estado === "retirados";

  const [members, retirados, areas, positions, locations, cupos, cursos, avance, alcance] = await Promise.all([
    prisma.companyMember.findMany({
      where: {
        companyId: company.id,
        status: verRetirados ? "retirado" : { not: "retirado" },
        ...(searchParams.area ? { areaId: searchParams.area } : {}),
        ...(q ? { user: buscarPersona(q) } : {}),
      },
      include: {
        area: true,
        position: true,
        location: true,
        user: { select: { firstName: true, lastName: true, email: true, lastLoginAt: true, role: { select: { code: true } } } },
      },
      orderBy: { createdAt: "asc" },
    }),
    prisma.companyMember.count({ where: { companyId: company.id, status: "retirado" } }),
    prisma.area.findMany({ where: { companyId: company.id } }),
    prisma.position.findMany({ where: { companyId: company.id } }),
    prisma.companyLocation.findMany({ where: { companyId: company.id } }),
    cuposEmpresa(company.id),
    filtroCatalogo(company.id).then((catalogo) =>
      prisma.course.findMany({ where: { status: "publicado", ...catalogo }, select: { id: true, code: true, title: true }, orderBy: { code: "asc" } })
    ),
    avanceEnLaEmpresa(company.id),
    alcanceEmpresa(company.id),
  ]);

  // Certificados de los cursos que la empresa asignó a cada persona.
  const certificados = new Map<string, number>();
  for (const c of await prisma.certificate.findMany({
    where: { userId: { in: members.map((m) => m.userId) }, courseId: { in: alcance.courseIds } },
    select: { userId: true, courseId: true },
  })) {
    if (c.courseId && alcance.incluye(c.userId, c.courseId)) certificados.set(c.userId, (certificados.get(c.userId) ?? 0) + 1);
  }

  const puedeEditar = user.role.code !== ROLES.SUPERVISOR;
  const filtrando = !!q || !!searchParams.area;

  return (
    <div>
      <SectionTitle
        eyebrow={company.tradeName ?? company.legalName}
        title={verRetirados ? "Trabajadores retirados" : "Trabajadores"}
        description={
          verRetirados
            ? "Personas que la empresa retiró. No ocupan cupo; su historial se conserva como evidencia."
            : puedeEditar
              ? "Su nómina en KG Academy. Con «Ver» abre la ficha de cada persona: su avance, cambiar su contraseña o retirarla de la empresa."
              : "Nómina registrada en KG Academy, organizada por área, cargo y sede."
        }
        action={
          <a href={`/api/empresa/reporte?tipo=trabajadores&empresa=${company.id}`} className="btn-outline btn-sm">
            <IconDownload width={14} height={14} /> Descargar Excel (CSV)
          </a>
        }
      />

      {/* Filtros */}
      <form className="card mb-6 flex flex-wrap items-end gap-3 p-4">
        {verRetirados && <input type="hidden" name="estado" value="retirados" />}
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
        <Link href={verRetirados ? "/empresa/trabajadores?estado=retirados" : "/empresa/trabajadores"} className="btn-ghost">
          Limpiar
        </Link>
      </form>

      {/* Cupos del plan contratado (lo gestiona el administrador) */}
      {puedeEditar && !verRetirados && (
        <div className="card mb-6 flex flex-wrap items-center gap-4 p-4">
          <div className="min-w-[220px] flex-1">
            <div className="mb-1.5 flex items-baseline justify-between gap-3">
              <p className="text-sm font-semibold text-navy-700">Cupos de trabajadores</p>
              <span className="text-xs font-bold text-navy-500">
                {cupos.usados} de {cupos.limite} usados
              </span>
            </div>
            <ProgressBar value={cupos.limite ? (cupos.usados / cupos.limite) * 100 : 100} />
          </div>
          <p className={`text-xs font-semibold ${cupos.disponibles ? "text-lime-600" : "text-red-600"}`}>
            {cupos.limite === 0
              ? "Sin cupos activos: comuníquese con KG"
              : cupos.disponibles
                ? `${cupos.disponibles} disponibles`
                : "Cupos agotados: retire a quienes ya no trabajan con ustedes o pídale a KG ampliar el plan"}
          </p>
        </div>
      )}

      {puedeEditar && !verRetirados && (
        <NuevoTrabajador
          companyId={company.id}
          disponibles={cupos.disponibles}
          cursos={cursos}
          areas={areas.map((a) => ({ id: a.id, name: a.name }))}
          positions={positions.map((p) => ({ id: p.id, name: p.name }))}
          locations={locations.map((l) => ({ id: l.id, name: l.name }))}
        />
      )}

      {members.length === 0 ? (
        filtrando ? (
          <EmptyState
            icon={<IconSearch width={30} height={30} />}
            title={q ? `Nadie coincide con «${q}»` : "Nadie en esa área"}
            description="Revise lo que escribió o limpie los filtros."
            action={
              <Link href={verRetirados ? "/empresa/trabajadores?estado=retirados" : "/empresa/trabajadores"} className="btn-outline btn-sm">
                Limpiar filtros
              </Link>
            }
          />
        ) : (
          <EmptyState
            icon={<IconUsers width={30} height={30} />}
            title={verRetirados ? "No hay personas retiradas" : "No hay trabajadores registrados"}
            description={verRetirados ? "Cuando retire a alguien de la empresa, aparecerá aquí." : "Agregue trabajadores para poder asignarles capacitaciones."}
          />
        )
      ) : (
        <div className="card mt-6 overflow-x-auto">
          <table className="table-kg">
            <thead>
              <tr>
                <th>Trabajador</th>
                <th>Código</th>
                <th>Área / Cargo</th>
                <th>Sede</th>
                <th className="w-44">Avance en lo asignado</th>
                <th>Cursos</th>
                <th>Cert.</th>
                <th>Estado</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {members.map((m) => {
                const a = avance(m.userId);
                const ocupaCupo = ROLES_CON_CUPO.includes(m.user.role.code);
                return (
                  <tr key={m.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <Avatar first={m.user.firstName} last={m.user.lastName} size={34} />
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-navy-700">
                            {m.user.firstName} {m.user.lastName}
                          </p>
                          <p className="truncate text-[11px] text-navy-400">
                            {correoVisible(m.user.email)}
                            {!ocupaCupo && " · administrador, no ocupa cupo"}
                            {m.user.role.code === ROLES.SUPERVISOR && " · supervisor"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="font-mono text-xs text-navy-400">{m.employeeCode ?? "—"}</td>
                    <td>
                      <p className="text-xs font-semibold text-navy-600">{m.area?.name ?? "—"}</p>
                      <p className="text-[11px] text-navy-400">{m.position?.name ?? "—"}</p>
                    </td>
                    <td className="text-xs text-navy-500">{m.location?.name ?? "—"}</td>
                    <td>
                      {a.avance === null ? (
                        <span className="text-xs text-navy-300">Sin cursos asignados</span>
                      ) : (
                        <ProgressBar value={a.avance} showLabel />
                      )}
                    </td>
                    <td className="text-xs">
                      <span className="font-bold text-navy-700">{a.completados}</span>
                      <span className="text-navy-300">/{a.asignados}</span>
                    </td>
                    <td className="text-xs font-bold text-lime-600">{certificados.get(m.userId) ?? 0}</td>
                    <td>
                      <StatusBadge status={m.status} />
                      {!verRetirados && !m.user.lastLoginAt && ocupaCupo && (
                        <span className="mt-1 block text-[10px] font-semibold text-amber-700">Nunca ha entrado</span>
                      )}
                    </td>
                    <td className="text-right">
                      <Link href={`/empresa/trabajadores/${m.userId}`} className="btn-outline btn-sm">
                        Ver <IconArrowRight width={12} height={12} />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <p className="border-t border-navy-50 px-4 py-3 text-[11px] text-navy-400">
            {cantidad(members.length, "persona", "personas")} &middot; actualizado al {formatDate(new Date())}
          </p>
        </div>
      )}

      <p className="mt-4 text-center text-xs text-navy-400">
        {verRetirados ? (
          <Link href="/empresa/trabajadores" className="font-bold text-lime-700 hover:underline">
            Volver a los trabajadores activos
          </Link>
        ) : (
          retirados > 0 && (
            <Link href="/empresa/trabajadores?estado=retirados" className="font-bold text-navy-500 hover:underline">
              Ver {cantidad(retirados, "persona retirada", "personas retiradas")}
            </Link>
          )
        )}
      </p>
    </div>
  );
}
