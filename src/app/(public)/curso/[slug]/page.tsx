import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { StatusBadge, ContentPlaceholder } from "@/components/ui";
import {
  IconClock,
  IconLayers,
  IconGraduation,
  IconAward,
  IconCheck,
  IconPlay,
  IconLock,
  IconClipboard,
  IconEye,
} from "@/components/Icons";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const c = await prisma.course.findUnique({ where: { slug: params.slug } });
  return { title: c?.title ?? "Curso" };
}

export default async function CursoPublicoPage({ params }: { params: { slug: string } }) {
  const course = await prisma.course.findUnique({
    where: { slug: params.slug },
    include: {
      category: true,
      instructor: true,
      modules: { include: { lessons: { orderBy: { order: "asc" } } }, orderBy: { order: "asc" } },
      assessments: { orderBy: { order: "asc" } },
    },
  });
  if (!course) notFound();

  const user = await getCurrentUser();
  const enrollment = user
    ? await prisma.enrollment.findUnique({
        where: { userId_courseId: { userId: user.id, courseId: course.id } },
      })
    : null;

  const totalLessons = course.modules.reduce((s, m) => s + m.lessons.length, 0);
  const pendientes = course.modules
    .flatMap((m) => m.lessons)
    .filter((l) => l.contentType === "pendiente").length;

  return (
    <>
      {/* Cabecera */}
      <section className="relative -mt-[72px] overflow-hidden bg-kg-gradient pb-16 pt-[128px] text-white">
        <div className="pointer-events-none absolute inset-0 bg-kg-mesh" />
        <div className="pointer-events-none absolute inset-0 bg-grid bg-[size:44px_44px] opacity-40" />

        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 lg:grid-cols-[1.4fr_1fr] lg:px-8">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wide">
                {course.category.name}
              </span>
              <span className="font-mono text-[11px] text-white/50">{course.code}</span>
              <StatusBadge status={course.status} />
            </div>

            <h1 className="mt-5 font-display text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              {course.title}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/65">{course.subtitle}</p>

            <div className="mt-7 flex flex-wrap gap-5 text-sm text-white/70">
              <span className="inline-flex items-center gap-2">
                <IconClock width={16} height={16} className="text-lime-400" /> {course.durationHours} horas
              </span>
              <span className="inline-flex items-center gap-2">
                <IconLayers width={16} height={16} className="text-lime-400" /> {course.modules.length} modulos
              </span>
              <span className="inline-flex items-center gap-2">
                <IconPlay width={16} height={16} className="text-lime-400" /> {totalLessons} lecciones
              </span>
              <span className="inline-flex items-center gap-2">
                <IconAward width={16} height={16} className="text-lime-400" /> Certificado verificable
              </span>
            </div>

            {course.instructor && (
              <p className="mt-6 text-sm text-white/45">
                Instructor:{" "}
                <span className="font-semibold text-white/80">
                  {course.instructor.firstName} {course.instructor.lastName}
                </span>
              </p>
            )}
          </div>

          {/* Tarjeta de inscripcion */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="card overflow-hidden p-0">
              <div className="border-b border-navy-50 bg-navy-50/50 p-6 text-center">
                <span className="inline-flex items-center gap-2 rounded-full bg-lime-500 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-navy-900">
                  <IconCheck width={14} height={14} strokeWidth={3.5} /> Incluido en el plan
                </span>
                <p className="mt-3 font-display text-xl font-extrabold text-navy-700">
                  Acceso por suscripcion
                </p>
                <p className="mt-1 text-xs leading-relaxed text-navy-400">
                  KG Academy se contrata como servicio: su empresa activa el plan y todo el catalogo,
                  con evaluaciones y certificados, queda disponible para sus trabajadores.
                </p>
              </div>

              <div className="space-y-3 p-6">
                {enrollment ? (
                  <Link href={`/aula/curso/${course.slug}`} className="btn-lime w-full py-3">
                    <IconPlay width={16} height={16} /> Continuar el curso
                  </Link>
                ) : user ? (
                  <form action="/api/aula/matricular" method="post">
                    <input type="hidden" name="courseId" value={course.id} />
                    <button className="btn-lime w-full py-3">
                      <IconGraduation width={16} height={16} /> Inscribirme ahora
                    </button>
                  </form>
                ) : (
                  <>
                    <Link href="/registro" className="btn-lime w-full py-3">
                      Crear cuenta e inscribirme
                    </Link>
                    <Link href="/ingresar" className="btn-outline w-full">
                      Ya tengo cuenta
                    </Link>
                  </>
                )}

                <ul className="space-y-2.5 pt-3 text-sm text-navy-500">
                  {[
                    "Acceso 24/7 desde cualquier dispositivo",
                    "Evaluacion diagnostica y final",
                    "Certificado con codigo unico y QR",
                    `Nota minima aprobatoria: ${course.minPassingScore}/100`,
                    `Intentos permitidos: ${course.maxAttempts}`,
                  ].map((t) => (
                    <li key={t} className="flex gap-2.5">
                      <IconCheck width={15} height={15} className="mt-0.5 shrink-0 text-lime-500" strokeWidth={3} />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Contenido */}
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 lg:grid-cols-[1.4fr_1fr] lg:px-8">
        <div className="space-y-12">
          <div>
            <h2 className="h-display text-2xl">Objetivo del curso</h2>
            <span className="kg-rule mt-3 block" />
            <p className="mt-5 leading-relaxed text-navy-500">{course.objective}</p>
          </div>

          <div>
            <h2 className="h-display text-2xl">Contenido programatico</h2>
            <span className="kg-rule mt-3 block" />
            <p className="mt-4 text-sm text-navy-400">
              {course.modules.length} modulos &middot; {totalLessons} lecciones
              {pendientes > 0 && (
                <>
                  {" "}
                  &middot;{" "}
                  <span className="font-semibold text-amber-600">
                    {pendientes} lecciones con contenido en produccion
                  </span>
                </>
              )}
            </p>

            <div className="mt-6 space-y-4">
              {course.modules.map((m, mi) => (
                <details key={m.id} open={mi === 0} className="group card overflow-hidden">
                  <summary className="flex cursor-pointer list-none items-center gap-4 p-5 transition hover:bg-navy-50/50">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-navy-700 font-display text-sm font-bold text-lime-400">
                      {String(mi + 1).padStart(2, "0")}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-display text-[15px] font-bold text-navy-700">{m.title}</span>
                      <span className="mt-0.5 block text-xs text-navy-400">
                        {m.lessons.length} lecciones &middot; {m.description}
                      </span>
                    </span>
                    <span className="shrink-0 text-navy-300 transition-transform group-open:rotate-180">▾</span>
                  </summary>

                  <ul className="divide-y divide-navy-50 border-t border-navy-50">
                    {m.lessons.map((l) => (
                      <li key={l.id} className="flex items-center gap-3 px-5 py-3.5 text-sm">
                        <span
                          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                            l.isPreview ? "bg-lime-100 text-lime-700" : "bg-navy-50 text-navy-300"
                          }`}
                        >
                          {l.isPreview ? <IconEye width={14} height={14} /> : <IconLock width={14} height={14} />}
                        </span>
                        <span className="min-w-0 flex-1 text-navy-600">{l.title}</span>
                        {l.contentType === "pendiente" && (
                          <span className="badge-amber shrink-0">Contenido pendiente</span>
                        )}
                        <span className="shrink-0 text-xs text-navy-300">{l.durationMin} min</span>
                      </li>
                    ))}
                  </ul>
                </details>
              ))}

              {/* Evaluaciones */}
              {course.assessments.map((a) => (
                <div key={a.id} className="card flex items-center gap-4 p-5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-lime-500 text-navy-900">
                    <IconClipboard width={18} height={18} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-[15px] font-bold text-navy-700">{a.title}</p>
                    <p className="text-xs text-navy-400">{a.description}</p>
                  </div>
                  <span className="badge-blue shrink-0">
                    {a.type === "final" ? `Minimo ${a.minScore}` : "No calificable"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {pendientes > 0 && (
            <ContentPlaceholder
              title="Material audiovisual en produccion"
              description="La estructura del curso, las evaluaciones y el certificado ya estan operativos. Cuando KG Gestion Integral tenga listos los videos, PDF o recursos de Genially, se cargan desde Administracion > Cursos > Constructor, sin intervencion del desarrollador."
            />
          )}
        </div>

        {/* Ficha lateral */}
        <aside className="space-y-6">
          <div className="panel">
            <h3 className="font-display text-base font-bold text-navy-700">Dirigido a</h3>
            <p className="mt-2 text-sm leading-relaxed text-navy-500">{course.targetAudience}</p>
          </div>
          <div className="panel">
            <h3 className="font-display text-base font-bold text-navy-700">Requisitos</h3>
            <p className="mt-2 text-sm leading-relaxed text-navy-500">{course.requirements}</p>
          </div>
          <div className="panel">
            <h3 className="font-display text-base font-bold text-navy-700">Metodologia</h3>
            <p className="mt-2 text-sm leading-relaxed text-navy-500">{course.methodology}</p>
          </div>
          <div className="panel bg-navy-50/60">
            <h3 className="font-display text-base font-bold text-navy-700">Reglas de aprobacion</h3>
            <dl className="mt-3 space-y-2 text-sm">
              {[
                ["Nota minima", `${course.minPassingScore} / 100`],
                ["Intentos", String(course.maxAttempts)],
                ["Lecciones obligatorias", course.requiresAllLessons ? "Todas" : "Segun peso"],
                ["Evaluacion final", course.requiresFinalExam ? "Obligatoria" : "Opcional"],
                ["Vigencia del certificado", course.certificateValidityMonths ? `${course.certificateValidityMonths} meses` : "Indefinida"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4">
                  <dt className="text-navy-400">{k}</dt>
                  <dd className="font-semibold text-navy-700">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </aside>
      </section>
    </>
  );
}
