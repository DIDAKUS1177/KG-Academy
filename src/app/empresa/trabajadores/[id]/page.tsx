import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { resolveCompany } from "@/lib/empresa";
import { ROLES } from "@/lib/constants";
import { ROLES_CON_CUPO } from "@/lib/cupos";
import { formatDate, formatDateTime } from "@/lib/utils";
import { Avatar, Breadcrumb, ProgressBar, ProgressRing, StatCard, StatusBadge } from "@/components/ui";
import { IconAward, IconBook, IconCheck, IconClock, IconArrowRight, IconAlert } from "@/components/Icons";
import { motivoParaConservar } from "@/lib/cuentas";
import { RestablecerClave } from "./RestablecerClave";
import { RetirarTrabajador } from "./RetirarTrabajador";
import { EliminarTrabajador } from "./EliminarTrabajador";
import { correoVisible, usuarioDeIngreso } from "@/lib/identidad";

export const dynamic = "force-dynamic";

export default async function DetalleTrabajador(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const staff = await requireRole(ROLES.ADMIN_EMPRESA, ROLES.SUPERVISOR, ROLES.SUPERADMIN, ROLES.ADMIN_KG);
  const company = await resolveCompany(staff);
  if (!company) notFound();

  const member = await prisma.companyMember.findFirst({
    where: { companyId: company.id, userId: params.id },
    include: {
      area: true,
      position: true,
      location: true,
      user: {
        include: {
          role: true,
          // Solo lo que la empresa le asignó: lo que estudió por su cuenta o
          // para otra empresa no se le muestra a esta.
          assignments: {
            where: { companyId: company.id },
            include: { course: true, enrollment: true },
            orderBy: { updatedAt: "desc" },
          },
        },
      },
    },
  });
  if (!member) notFound();

  const u = member.user;
  const cursosAsignados = u.assignments.map((a) => a.courseId);
  const [certificados, intentos] = await Promise.all([
    prisma.certificate.findMany({ where: { userId: u.id, courseId: { in: cursosAsignados } }, orderBy: { issuedAt: "desc" } }),
    prisma.assessmentAttempt.findMany({
      where: { userId: u.id, status: "finalizado", assessment: { courseId: { in: cursosAsignados } } },
      include: { assessment: true },
      orderBy: { startedAt: "desc" },
      take: 10,
    }),
  ]);

  const avance = u.assignments.length
    ? u.assignments.reduce((s, a) => s + (a.enrollment?.progress ?? 0), 0) / u.assignments.length
    : 0;
  const completados = u.assignments.filter((a) => a.status === "completado").length;
  const retirado = member.status === "retirado";
  const gestiona = staff.role.code !== ROLES.SUPERVISOR;
  // El supervisor solo consulta; la cuenta la gestiona el administrador.
  const acciones = gestiona && !retirado && ROLES_CON_CUPO.includes(u.role.code);
  // La empresa solo elimina trabajadores suyos que no dejaron historial.
  const eliminable =
    acciones &&
    u.role.code === ROLES.ESTUDIANTE &&
    u.companyId === company.id &&
    !(await motivoParaConservar(u.id));
  const hoy = new Date();

  return (
    <div>
      <Breadcrumb
        items={[
          { label: "Panel empresarial", href: "/empresa" },
          { label: "Trabajadores", href: "/empresa/trabajadores" },
          { label: `${u.firstName} ${u.lastName}` },
        ]}
      />

      {retirado && (
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-navy-100 bg-navy-50 p-4 text-sm text-navy-600">
          <IconAlert width={18} height={18} className="mt-0.5 shrink-0" />
          <span>
            <strong>Retirado de la empresa.</strong> No ocupa cupo y no aparece en las cifras del panel. Su historial se conserva
            como evidencia. Si vuelve, créelo otra vez con su documento en Trabajadores y recupera su historial.
          </span>
        </div>
      )}

      {/* Ficha */}
      <div className="card mb-6 overflow-hidden">
        <div className="relative h-24 bg-kg-gradient">
          <div className="absolute inset-0 bg-kg-mesh opacity-80" />
          <div className="absolute inset-0 bg-grid bg-[size:24px_24px] opacity-40" />
        </div>
        <div className="px-5 pb-6 sm:px-7 sm:pb-7">
          {/* El texto arranca debajo de la franja oscura: con items-end, un bloque
              de varias líneas subía y el nombre quedaba escondido sobre ella. */}
          <div className="relative z-[1] -mt-9 flex items-start gap-4 sm:gap-5">
            <Avatar first={u.firstName} last={u.lastName} size={78} className="shrink-0 ring-4 ring-white" />
            <div className="min-w-0 flex-1 pt-10">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="mr-1 font-display text-2xl font-extrabold text-navy-700">
                  {u.firstName} {u.lastName}
                </h1>
                {!ROLES_CON_CUPO.includes(u.role.code) && (
                  <span className="rounded-full bg-navy-50 px-2.5 py-1 text-[11px] font-bold text-navy-500">Administrador · no ocupa cupo</span>
                )}
                {u.role.code === ROLES.SUPERVISOR && (
                  <span className="rounded-full bg-navy-50 px-2.5 py-1 text-[11px] font-bold text-navy-500">Supervisor</span>
                )}
                <StatusBadge status={member.status} />
              </div>
              <p className="mt-1 break-words text-sm text-navy-400">
                {correoVisible(u.email)} &middot; CC {u.documentNumber ?? "—"}
              </p>
              <p className="mt-0.5 break-words text-xs text-navy-500">
                Entra con: <span className="font-semibold text-navy-700">{usuarioDeIngreso(u)}</span> &middot; Último ingreso:{" "}
                {u.lastLoginAt ? formatDate(u.lastLoginAt) : "nunca"}
              </p>
            </div>
          </div>

          {acciones && (
            <div className="mt-5 flex flex-wrap items-start gap-2">
              <RestablecerClave userId={u.id} nombre={`${u.firstName} ${u.lastName}`} usuario={usuarioDeIngreso(u)} />
              <RetirarTrabajador userId={u.id} companyId={company.id} nombre={`${u.firstName} ${u.lastName}`} />
              {eliminable && (
                <EliminarTrabajador userId={u.id} nombre={`${u.firstName} ${u.lastName}`} volver="/empresa/trabajadores" />
              )}
            </div>
          )}

          <dl className="mt-7 grid grid-cols-2 gap-5 sm:grid-cols-4">
            {[
              ["Código", member.employeeCode ?? "—"],
              ["Área", member.area?.name ?? "—"],
              ["Cargo", member.position?.name ?? "—"],
              ["Sede", member.location?.name ?? "—"],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="text-[10px] font-bold uppercase tracking-wider text-navy-400">{k}</dt>
                <dd className="mt-1 text-sm font-semibold text-navy-700">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card flex items-center justify-center p-5">
          <ProgressRing value={avance} size={112} sub="avance" />
        </div>
        <StatCard label="Cursos asignados" value={u.assignments.length} icon={<IconBook width={20} height={20} />} />
        <StatCard label="Completados" value={completados} tone="lime" icon={<IconCheck width={20} height={20} />} />
        <StatCard label="Certificados" value={certificados.length} tone="lime" icon={<IconAward width={20} height={20} />} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        {/* Cursos */}
        <div className="card overflow-hidden">
          <p className="border-b border-navy-50 px-6 py-4 font-display text-sm font-bold text-navy-700">
            Cursos asignados por la empresa
          </p>
          <div className="overflow-x-auto">
            <table className="table-kg">
              <thead>
                <tr>
                  <th>Curso</th>
                  <th className="w-40">Avance</th>
                  <th>Estado</th>
                  <th>Nota</th>
                </tr>
              </thead>
              <tbody>
                {u.assignments.map((a) => {
                  const vencido = a.dueDate && new Date(a.dueDate) < hoy && a.status !== "completado";
                  return (
                    <tr key={a.id}>
                      <td>
                        <p className="font-semibold text-navy-700">{a.course.title}</p>
                        <p className="text-[11px] text-navy-400">
                          {a.dueDate ? `Fecha límite: ${formatDate(a.dueDate)} · ` : ""}Último acceso:{" "}
                          {a.enrollment?.lastAccessAt ? formatDate(a.enrollment.lastAccessAt) : "nunca"}
                        </p>
                      </td>
                      <td>
                        <ProgressBar value={a.enrollment?.progress ?? 0} showLabel />
                      </td>
                      <td>
                        <StatusBadge status={vencido ? "vencido" : a.status} />
                      </td>
                      <td className="font-display font-bold">
                        {a.enrollment?.finalScore ? Math.round(a.enrollment.finalScore) : "—"}
                      </td>
                    </tr>
                  );
                })}
                {u.assignments.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-10 text-center text-sm text-navy-300">
                      Sin cursos asignados
                      {gestiona && !retirado && (
                        <Link href="/empresa/asignar" className="mt-2 block text-xs font-bold text-lime-700 hover:underline">
                          Asignarle cursos
                        </Link>
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          {/* Certificados */}
          <div className="card overflow-hidden">
            <p className="border-b border-navy-50 px-6 py-4 font-display text-sm font-bold text-navy-700">
              Certificados
            </p>
            <ul className="divide-y divide-navy-50">
              {certificados.map((c) => (
                <li key={c.id} className="flex items-center gap-3 px-6 py-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-lime-100 text-lime-700">
                    <IconAward width={17} height={17} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-navy-700">{c.courseTitle}</p>
                    <p className="font-mono text-[11px] text-navy-400">{c.code}</p>
                  </div>
                  <Link href={`/verificar/${c.code}`} target="_blank" className="btn-outline btn-sm shrink-0">
                    Ver <IconArrowRight width={12} height={12} />
                  </Link>
                </li>
              ))}
              {certificados.length === 0 && (
                <li className="px-6 py-8 text-center text-xs text-navy-300">Sin certificados aún</li>
              )}
            </ul>
          </div>

          {/* Evaluaciones */}
          <div className="card overflow-hidden">
            <p className="border-b border-navy-50 px-6 py-4 font-display text-sm font-bold text-navy-700">
              Resultados de evaluación
            </p>
            <ul className="divide-y divide-navy-50">
              {intentos.map((a) => (
                <li key={a.id} className="flex items-center gap-3 px-6 py-3.5 text-xs">
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold text-navy-600">{a.assessment.title}</span>
                    <span className="text-navy-300">
                      Intento {a.attemptNo} &middot; {formatDateTime(a.submittedAt ?? a.startedAt)}
                    </span>
                  </span>
                  <span
                    className={`shrink-0 font-display text-base font-extrabold ${
                      a.passed ? "text-lime-600" : "text-red-500"
                    }`}
                  >
                    {Math.round(a.score)}
                  </span>
                </li>
              ))}
              {intentos.length === 0 && (
                <li className="px-6 py-8 text-center text-xs text-navy-300">
                  <IconClock width={20} height={20} className="mx-auto mb-2 text-navy-200" />
                  Sin evaluaciones presentadas
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
