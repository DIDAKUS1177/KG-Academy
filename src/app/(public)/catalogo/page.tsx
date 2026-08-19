import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { CourseCard } from "@/components/CourseCard";
import { EmptyState } from "@/components/ui";
import { IconBook, IconSearch } from "@/components/Icons";

export const metadata: Metadata = { title: "Catálogo de cursos" };
export const dynamic = "force-dynamic";

export default async function CatalogoPage({
  searchParams,
}: {
  searchParams: { q?: string; categoria?: string };
}) {
  const q = searchParams.q?.trim();
  const categoria = searchParams.categoria;

  const [categories, courses] = await Promise.all([
    prisma.category.findMany({ where: { isActive: true }, orderBy: { order: "asc" } }),
    prisma.course.findMany({
      where: {
        status: { notIn: ["archivado"] },
        ...(categoria ? { category: { slug: categoria } } : {}),
        ...(q
          ? { OR: [{ title: { contains: q } }, { subtitle: { contains: q } }, { code: { contains: q } }] }
          : {}),
      },
      include: { category: true, modules: { include: { lessons: true } } },
      orderBy: [{ status: "asc" }, { createdAt: "asc" }],
    }),
  ]);

  return (
    <>
      <section className="relative -mt-[72px] overflow-hidden bg-kg-gradient pb-16 pt-[128px] text-white">
        <div className="pointer-events-none absolute inset-0 bg-kg-mesh" />
        <div className="pointer-events-none absolute inset-0 bg-grid bg-[size:44px_44px] opacity-40" />
        <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
          <p className="eyebrow">Catálogo</p>
          <h1 className="mt-2 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
            Cursos de KG Academy
          </h1>
          <p className="mt-3 max-w-2xl text-white/60">
            Formación virtual en Seguridad y Salud en el Trabajo con certificado verificable.
          </p>

          <form className="mt-8 flex max-w-xl gap-2">
            <div className="relative flex-1">
              <IconSearch
                width={18}
                height={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/40"
              />
              <input
                name="q"
                defaultValue={q}
                placeholder="Buscar por nombre o código del curso..."
                className="input border-white/20 bg-white/10 pl-11 text-white placeholder:text-white/40 focus:border-lime-500"
              />
            </div>
            <button className="btn-lime shrink-0">Buscar</button>
          </form>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 lg:px-8">
        <div className="mb-8 flex flex-wrap gap-2">
          <a
            href="/catalogo"
            className={`badge px-4 py-2 text-xs ${!categoria ? "bg-navy-700 text-white" : "bg-navy-50 text-navy-500 hover:bg-navy-100"}`}
          >
            Todas las categorías
          </a>
          {categories.map((c) => (
            <a
              key={c.id}
              href={`/catalogo?categoria=${c.slug}`}
              className={`badge px-4 py-2 text-xs ${categoria === c.slug ? "bg-navy-700 text-white" : "bg-navy-50 text-navy-500 hover:bg-navy-100"}`}
            >
              {c.name}
            </a>
          ))}
        </div>

        {courses.length === 0 ? (
          <EmptyState
            icon={<IconBook width={30} height={30} />}
            title="No se encontraron cursos"
            description="Ajuste la busqueda o consulte otra categoría."
          />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((c) => (
              <CourseCard
                key={c.id}
                course={{
                  slug: c.slug,
                  code: c.code,
                  title: c.title,
                  subtitle: c.subtitle,
                  level: c.level,
                  durationHours: c.durationHours,
                  accessType: c.accessType,
                  price: c.price,
                  status: c.status,
                  modulesCount: c.modules.length,
                  lessonsCount: c.modules.reduce((s, m) => s + m.lessons.length, 0),
                  categoryName: c.category.name,
                  categoryColor: c.category.color,
                }}
              />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
