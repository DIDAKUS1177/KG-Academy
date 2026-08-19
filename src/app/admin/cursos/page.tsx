import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { ROLES } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { ProgressBar, SectionTitle, StatusBadge, StatCard } from "@/components/ui";
import { IconBook, IconArrowRight, IconAlert, IconCheck, IconLayers } from "@/components/Icons";

export const metadata: Metadata = { title: "Gestión de cursos" };
export const dynamic = "force-dynamic";

export default async function AdminCursos() {
  await requireRole(ROLES.SUPERADMIN, ROLES.ADMIN_KG, ROLES.INSTRUCTOR);

  const courses = await prisma.course.findMany({
    include: {
      category: true,
      instructor: true,
      modules: { include: { lessons: true } },
      enrollments: true,
      assessments: true,
      certificates: true,
    },
    orderBy: { createdAt: "asc" },
  });

  const totalLecciones = courses.reduce(
    (s, c) => s + c.modules.reduce((x, m) => x + m.lessons.length, 0),
    0
  );
  const pendientes = courses.reduce(
    (s, c) =>
      s + c.modules.reduce((x, m) => x + m.lessons.filter((l) => l.contentType === "pendiente").length, 0),
    0
  );

  return (
    <div>
      <SectionTitle
        eyebrow="Administración"
        title="Gestión de cursos"
        description="Estructura, estado de publicación y carga de contenido de cada curso."
      />

      <div className="mb-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Cursos" value={courses.length} icon={<IconBook width={20} height={20} />} />
        <StatCard
          label="Publicados"
          value={courses.filter((c) => c.status === "publicado").length}
          tone="lime"
          icon={<IconCheck width={20} height={20} />}
        />
        <StatCard label="Lecciones" value={totalLecciones} icon={<IconLayers width={20} height={20} />} />
        <StatCard
          label="Contenido pendiente"
          value={pendientes}
          tone="amber"
          hint="lecciones sin material cargado"
          icon={<IconAlert width={20} height={20} />}
        />
      </div>

      <div className="space-y-5">
        {courses.map((c) => {
          const lecciones = c.modules.reduce((s, m) => s + m.lessons.length, 0);
          const listas = c.modules.reduce(
            (s, m) => s + m.lessons.filter((l) => l.contentType !== "pendiente").length,
            0
          );
          const avance = c.enrollments.length
            ? c.enrollments.reduce((s, e) => s + e.progress, 0) / c.enrollments.length
            : 0;

          return (
            <div key={c.id} className="card overflow-hidden">
              <div className="flex flex-wrap items-start gap-5 p-6">
                <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-kg-gradient font-display text-sm font-extrabold text-lime-400">
                  {c.code.split("-").pop()}
                </span>

                <div className="min-w-[240px] flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-display text-lg font-bold text-navy-700">{c.title}</h3>
                    <StatusBadge status={c.status} />
                    <span className="badge-slate">{c.category.name}</span>
                  </div>
                  <p className="mt-1 line-clamp-2 max-w-2xl text-sm text-navy-400">{c.subtitle}</p>
                  <p className="mt-2 text-[11px] text-navy-300">
                    {c.code} &middot; {c.durationHours} h &middot; {c.modules.length} módulos &middot;{" "}
                    {lecciones} lecciones &middot; {c.assessments.length} evaluaciones
                    {c.instructor && ` · ${`${c.instructor.firstName} ${c.instructor.lastName}`.trim()}`}
                  </p>
                </div>

                <div className="w-full max-w-[220px] space-y-3">
                  <div>
                    <div className="mb-1 flex items-baseline justify-between text-[11px] font-semibold text-navy-500">
                      <span>Contenido cargado</span>
                      <span>
                        {listas}/{lecciones}
                      </span>
                    </div>
                    <ProgressBar value={lecciones ? (listas / lecciones) * 100 : 0} />
                  </div>
                  <div>
                    <div className="mb-1 flex items-baseline justify-between text-[11px] font-semibold text-navy-500">
                      <span>Avance estudiantes</span>
                      <span>{Math.round(avance)}%</span>
                    </div>
                    <ProgressBar value={avance} />
                  </div>
                </div>

                <div className="flex shrink-0 flex-col gap-2">
                  <Link href={`/admin/cursos/${c.id}`} className="btn-lime btn-sm">
                    Constructor <IconArrowRight width={13} height={13} />
                  </Link>
                  <Link href={`/curso/${c.slug}`} target="_blank" className="btn-outline btn-sm">
                    Vista pública
                  </Link>
                </div>
              </div>

              <div className="flex flex-wrap gap-6 border-t border-navy-50 bg-navy-50/40 px-6 py-3 text-[11px] text-navy-400">
                <span>Matrículas: <strong className="text-navy-600">{c.enrollments.length}</strong></span>
                <span>
                  Completados:{" "}
                  <strong className="text-navy-600">
                    {c.enrollments.filter((e) => e.status === "completado").length}
                  </strong>
                </span>
                <span>Certificados: <strong className="text-navy-600">{c.certificates.length}</strong></span>
                <span>Nota mínima: <strong className="text-navy-600">{c.minPassingScore}</strong></span>
                <span>Creado: <strong className="text-navy-600">{formatDate(c.createdAt)}</strong></span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
