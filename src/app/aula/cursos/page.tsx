import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { formatDate } from "@/lib/utils";
import { CourseCard } from "@/components/CourseCard";
import { EmptyState, SectionTitle, StatusBadge } from "@/components/ui";
import { IconBook } from "@/components/Icons";

export const metadata: Metadata = { title: "Mis cursos" };
export const dynamic = "force-dynamic";

const TABS = [
  { key: "todos", label: "Todos" },
  { key: "no_iniciado", label: "No iniciados" },
  { key: "en_progreso", label: "En progreso" },
  { key: "completado", label: "Completados" },
];

export default async function MisCursosPage({ searchParams }: { searchParams: { estado?: string } }) {
  const user = await requireUser();
  const estado = searchParams.estado ?? "todos";

  const enrollments = await prisma.enrollment.findMany({
    where: { userId: user.id, ...(estado !== "todos" ? { status: estado } : {}) },
    include: {
      course: { include: { category: true, modules: { include: { lessons: true } } } },
      assignment: true,
    },
    orderBy: { updatedAt: "desc" },
  });

  const counts = await prisma.enrollment.groupBy({
    by: ["status"],
    where: { userId: user.id },
    _count: true,
  });
  const countOf = (k: string) =>
    k === "todos"
      ? counts.reduce((s, c) => s + c._count, 0)
      : counts.find((c) => c.status === k)?._count ?? 0;

  return (
    <div>
      <SectionTitle
        eyebrow="Mi aprendizaje"
        title="Mis cursos"
        description="Todos los cursos en los que está matriculado, con su estado y porcentaje de avance."
        action={
          <Link href="/catalogo" className="btn-outline btn-sm">
            Explorar catálogo
          </Link>
        }
      />

      <div className="mb-7 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <Link
            key={t.key}
            href={`/aula/cursos?estado=${t.key}`}
            className={`badge px-4 py-2 text-xs ${
              estado === t.key ? "bg-navy-700 text-white" : "bg-white text-navy-500 hover:bg-navy-50"
            }`}
          >
            {t.label}
            <span className={`ml-1 ${estado === t.key ? "text-lime-400" : "text-navy-300"}`}>
              {countOf(t.key)}
            </span>
          </Link>
        ))}
      </div>

      {enrollments.length === 0 ? (
        <EmptyState
          icon={<IconBook width={30} height={30} />}
          title="No hay cursos en esta categoría"
          description="Cambie el filtro o inscríbase en un nuevo curso desde el catálogo."
          action={
            <Link href="/catalogo" className="btn-lime">
              Ver catálogo
            </Link>
          }
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {enrollments.map((e) => (
            <div key={e.id} className="relative">
              {e.assignment?.dueDate && e.status !== "completado" && (
                <span className="absolute right-3 top-3 z-10 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold text-navy-600 shadow">
                  Límite {formatDate(e.assignment.dueDate)}
                </span>
              )}
              <CourseCard
                href={`/aula/curso/${e.course.slug}`}
                course={{
                  slug: e.course.slug,
                  code: e.course.code,
                  title: e.course.title,
                  subtitle: e.course.subtitle,
                  level: e.course.level,
                  durationHours: e.course.durationHours,
                  accessType: e.course.accessType,
                  price: e.course.price,
                  modulesCount: e.course.modules.length,
                  lessonsCount: e.course.modules.reduce((s, m) => s + m.lessons.length, 0),
                  categoryName: e.course.category.name,
                  categoryColor: e.course.category.color,
                  progress: e.progress,
                }}
              />
              <div className="mt-2 flex justify-end">
                <StatusBadge status={e.status} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
