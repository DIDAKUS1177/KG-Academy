import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { resolveCompany } from "@/lib/empresa";
import { ROLES } from "@/lib/constants";
import { formatDate, formatDateTime } from "@/lib/utils";
import { Avatar, Breadcrumb, ProgressBar, ProgressRing, StatCard, StatusBadge } from "@/components/ui";
import { IconAward, IconBook, IconCheck, IconClock, IconArrowRight } from "@/components/Icons";

export const dynamic = "force-dynamic";

export default async function DetalleTrabajador({ params }: { params: { id: string } }) {
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
          enrollments: { include: { course: true }, orderBy: { updatedAt: "desc" } },
          certificates: { orderBy: { issuedAt: "desc" } },
          attempts: { include: { assessment: true }, orderBy: { startedAt: "desc" }, take: 10 },
          assignments: { include: { course: true } },
        },
      },
    },
  });
  if (!member) notFound();

  const u = member.user;
  const avance = u.enrollments.length
    ? u.enrollments.reduce((s, e) => s + e.progress, 0) / u.enrollments.length
    : 0;
  const completados = u.enrollments.filter((e) => e.status === "completado").length;

  return (
    <div>
      <Breadcrumb
        items={[
          { label: "Panel empresarial", href: "/empresa" },
          { label: "Trabajadores", href: "/empresa/trabajadores" },
          { label: `${u.firstName} ${u.lastName}` },
        ]}
      />

      {/* Ficha */}
      <div className="card mb-6 overflow-hidden">
        <div className="relative h-24 bg-kg-gradient">
          <div className="absolute inset-0 bg-kg-mesh opacity-80" />
          <div className="absolute inset-0 bg-grid bg-[size:24px_24px] opacity-40" />
        </div>
        <div className="px-7 pb-7">
          <div className="-mt-9 flex flex-wrap items-end gap-5">
            <Avatar first={u.firstName} last={u.lastName} size={78} className="ring-4 ring-white" />
            <div className="mb-1 min-w-0 flex-1">
              <h1 className="font-display text-2xl font-extrabold text-navy-700">
                {u.firstName} {u.lastName}
              </h1>
              <p className="text-sm text-navy-400">
                {u.email} &middot; CC {u.documentNumber ?? "—"}
              </p>
            </div>
            <div className="mb-2">
              <StatusBadge status={member.status} />
            </div>
          </div>

          <dl className="mt-7 grid gap-5 sm:grid-cols-4">
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
        <StatCard
          label="Certificados"
          value={u.certificates.length}
          tone="lime"
          hint={`Último acceso: ${u.lastLoginAt ? formatDate(u.lastLoginAt) : "nunca"}`}
          icon={<IconAward width={20} height={20} />}
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        {/* Cursos */}
        <div className="card overflow-hidden">
          <p className="border-b border-navy-50 px-6 py-4 font-display text-sm font-bold text-navy-700">
            Cursos y progreso
          </p>
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
              {u.enrollments.map((e) => (
                <tr key={e.id}>
                  <td>
                    <p className="font-semibold text-navy-700">{e.course.title}</p>
                    <p className="text-[11px] text-navy-400">
                      Último acceso: {e.lastAccessAt ? formatDate(e.lastAccessAt) : "—"}
                    </p>
                  </td>
                  <td>
                    <ProgressBar value={e.progress} showLabel />
                  </td>
                  <td>
                    <StatusBadge status={e.status} />
                  </td>
                  <td className="font-display font-bold">
                    {e.finalScore ? Math.round(e.finalScore) : "—"}
                  </td>
                </tr>
              ))}
              {u.enrollments.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-10 text-center text-sm text-navy-300">
                    Sin cursos asignados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="space-y-6">
          {/* Certificados */}
          <div className="card overflow-hidden">
            <p className="border-b border-navy-50 px-6 py-4 font-display text-sm font-bold text-navy-700">
              Certificados
            </p>
            <ul className="divide-y divide-navy-50">
              {u.certificates.map((c) => (
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
              {u.certificates.length === 0 && (
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
              {u.attempts.map((a) => (
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
              {u.attempts.length === 0 && (
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
