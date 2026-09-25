import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { puedeVerCurso } from "@/lib/acceso-cursos";
import { cantidad } from "@/lib/utils";
import { SectionTitle } from "@/components/ui";
import { IconArrowRight, IconBook } from "@/components/Icons";

/**
 * Cursos que la persona puede empezar y en los que todavía no está.
 *
 * Abrir uno lo matricula (lo hace la página del curso), así que nadie
 * necesita buscar el catálogo público para comenzar. El equipo de KG ve
 * además los borradores, para revisarlos como los verá el estudiante.
 */
export async function CursosDisponibles({ userId, rol }: { userId: string; rol: string }) {
  const cursos = await prisma.course.findMany({
    where: {
      status: { in: ["publicado", "borrador", "revision"] },
      enrollments: { none: { userId } },
    },
    include: { category: true, modules: { include: { lessons: { select: { id: true } } } } },
    orderBy: [{ publishedAt: "desc" }, { title: "asc" }],
  });
  const visibles = cursos.filter((c) => puedeVerCurso(rol, c.status));
  if (visibles.length === 0) return null;

  return (
    <div>
      <SectionTitle
        eyebrow="Catálogo"
        title="Cursos disponibles"
        description="Ábralo y empiece: queda inscrito y su avance se guarda automáticamente."
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {visibles.map((c) => {
          const lecciones = c.modules.reduce((n, m) => n + m.lessons.length, 0);
          const borrador = c.status !== "publicado";
          return (
            <Link key={c.id} href={`/aula/curso/${c.slug}`} className="card card-hover flex flex-col p-5">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-kg-gradient text-lime-400">
                  <IconBook width={20} height={20} />
                </span>
                <span className="min-w-0 flex-1 truncate text-[11px] font-bold uppercase tracking-wide text-navy-400">
                  {c.category.name}
                </span>
                {borrador && <span className="badge-amber shrink-0">Borrador · solo KG</span>}
              </div>
              <p className="mt-4 font-display text-[15px] font-bold leading-snug text-navy-700">{c.title}</p>
              <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-navy-400">{c.subtitle}</p>
              <div className="mt-auto flex items-center justify-between pt-4 text-[11px] text-navy-400">
                <span>
                  {cantidad(lecciones, "lección", "lecciones")} · {c.durationHours} h
                </span>
                <span className="inline-flex items-center gap-1 font-bold text-lime-600">
                  {borrador ? "Revisar" : "Empezar"} <IconArrowRight width={13} height={13} />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
