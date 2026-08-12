import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { ensureEnrollment } from "@/lib/progress";
import { Breadcrumb, ProgressRing, StatusBadge, ContentPlaceholder } from "@/components/ui";
import { LessonPlayer } from "./LessonPlayer";
import {
  IconCheck,
  IconPlay,
  IconClipboard,
  IconAward,
  IconLayers,
  IconClock,
  IconLock,
} from "@/components/Icons";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const c = await prisma.course.findUnique({ where: { slug: params.slug } });
  return { title: c ? `Aula | ${c.title}` : "Aula virtual" };
}

export default async function AulaCursoPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { leccion?: string };
}) {
  const user = await requireUser();

  const course = await prisma.course.findUnique({
    where: { slug: params.slug },
    include: {
      modules: { include: { lessons: { orderBy: { order: "asc" } } }, orderBy: { order: "asc" } },
      assessments: { orderBy: { order: "asc" } },
    },
  });
  if (!course) notFound();

  const enrollment = await ensureEnrollment(user.id, course.id, "gratuito");

  const [progressRows, attempts, certificate] = await Promise.all([
    prisma.lessonProgress.findMany({ where: { enrollmentId: enrollment.id } }),
    prisma.assessmentAttempt.findMany({
      where: { enrollmentId: enrollment.id },
      orderBy: { startedAt: "desc" },
    }),
    prisma.certificate.findUnique({ where: { enrollmentId: enrollment.id } }),
  ]);

  const doneMap = new Map(progressRows.map((p) => [p.lessonId, p]));
  const allLessons = course.modules.flatMap((m) => m.lessons);
  if (allLessons.length === 0) notFound();

  // Leccion activa: la de la URL, la ultima vista o la primera pendiente
  const activeId =
    searchParams.leccion && allLessons.some((l) => l.id === searchParams.leccion)
      ? searchParams.leccion
      : (allLessons.find((l) => doneMap.get(l.id)?.status !== "completado") ?? allLessons[0]).id;

  const active = allLessons.find((l) => l.id === activeId)!;
  const activeIndex = allLessons.findIndex((l) => l.id === activeId);
  const prev = activeIndex > 0 ? allLessons[activeIndex - 1] : null;
  const next = activeIndex < allLessons.length - 1 ? allLessons[activeIndex + 1] : null;
  const activeModule = course.modules.find((m) => m.lessons.some((l) => l.id === activeId))!;

  const finalAssessment = course.assessments.find((a) => a.type === "final");
  const finalPassed = finalAssessment
    ? attempts.some((a) => a.assessmentId === finalAssessment.id && a.passed)
    : false;
  const finalAttempts = finalAssessment
    ? attempts.filter((a) => a.assessmentId === finalAssessment.id).length
    : 0;

  const completedCount = allLessons.filter((l) => doneMap.get(l.id)?.status === "completado").length;
  const lessonsDone = completedCount === allLessons.length;

  if (enrollment.status === "no_iniciado" && searchParams.leccion) {
    redirect(`/aula/curso/${course.slug}?leccion=${searchParams.leccion}`);
  }

  return (
    <div>
      <Breadcrumb
        items={[
          { label: "Aula", href: "/aula" },
          { label: "Mis cursos", href: "/aula/cursos" },
          { label: course.title },
        ]}
      />

      {/* Cabecera del curso */}
      <div className="relative mb-7 overflow-hidden rounded-3xl bg-kg-gradient p-7 text-white lg:p-9">
        <div className="pointer-events-none absolute inset-0 bg-kg-mesh" />
        <div className="pointer-events-none absolute inset-0 bg-grid bg-[size:36px_36px] opacity-40" />
        <div className="relative flex flex-wrap items-center justify-between gap-7">
          <div className="min-w-[260px] flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-[11px] text-white/50">{course.code}</span>
              <StatusBadge status={enrollment.status} />
            </div>
            <h1 className="mt-3 font-display text-2xl font-extrabold tracking-tight lg:text-3xl">
              {course.title}
            </h1>
            <div className="mt-4 flex flex-wrap gap-5 text-xs text-white/60">
              <span className="inline-flex items-center gap-1.5">
                <IconLayers width={14} height={14} className="text-lime-400" /> {course.modules.length} modulos
              </span>
              <span className="inline-flex items-center gap-1.5">
                <IconPlay width={14} height={14} className="text-lime-400" /> {completedCount}/{allLessons.length} lecciones
              </span>
              <span className="inline-flex items-center gap-1.5">
                <IconClock width={14} height={14} className="text-lime-400" /> {course.durationHours} horas
              </span>
            </div>
          </div>
          <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
            <ProgressRing value={enrollment.progress} size={116} sub="completado" />
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
        {/* Indice del curso */}
        <aside className="lg:sticky lg:top-24 lg:max-h-[calc(100vh-8rem)] lg:self-start lg:overflow-y-auto">
          <div className="card overflow-hidden">
            <div className="border-b border-navy-50 bg-navy-50/50 px-5 py-4">
              <p className="font-display text-sm font-bold text-navy-700">Contenido del curso</p>
              <p className="mt-0.5 text-[11px] text-navy-400">
                {completedCount} de {allLessons.length} lecciones completadas
              </p>
            </div>

            <div className="divide-y divide-navy-50">
              {course.modules.map((m, mi) => {
                const done = m.lessons.filter((l) => doneMap.get(l.id)?.status === "completado").length;
                return (
                  <div key={m.id}>
                    <div className="flex items-center gap-3 bg-white px-5 py-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-navy-700 text-[11px] font-bold text-lime-400">
                        {mi + 1}
                      </span>
                      <p className="min-w-0 flex-1 truncate text-xs font-bold text-navy-700">{m.title}</p>
                      <span
                        className={`shrink-0 text-[10px] font-bold ${
                          done === m.lessons.length ? "text-lime-600" : "text-navy-300"
                        }`}
                      >
                        {done}/{m.lessons.length}
                      </span>
                    </div>
                    <ul>
                      {m.lessons.map((l) => {
                        const st = doneMap.get(l.id);
                        const isActive = l.id === activeId;
                        return (
                          <li key={l.id}>
                            <Link
                              href={`/aula/curso/${course.slug}?leccion=${l.id}`}
                              className={`flex items-start gap-3 py-2.5 pl-5 pr-4 text-xs transition ${
                                isActive
                                  ? "border-l-[3px] border-lime-500 bg-lime-50/70 font-semibold text-navy-800"
                                  : "border-l-[3px] border-transparent text-navy-500 hover:bg-navy-50/60"
                              }`}
                            >
                              <span
                                className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${
                                  st?.status === "completado"
                                    ? "bg-lime-500 text-white"
                                    : "border-2 border-navy-200"
                                }`}
                              >
                                {st?.status === "completado" && (
                                  <IconCheck width={10} height={10} strokeWidth={4} />
                                )}
                              </span>
                              <span className="min-w-0 flex-1 leading-snug">{l.title}</span>
                              <span className="shrink-0 text-[10px] text-navy-300">{l.durationMin}m</span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })}

              {/* Evaluaciones */}
              {course.assessments.map((a) => {
                const at = attempts.filter((x) => x.assessmentId === a.id);
                const passed = at.some((x) => x.passed);
                const locked = a.type === "final" && !lessonsDone;
                return (
                  <Link
                    key={a.id}
                    href={locked ? "#" : `/aula/evaluacion/${a.id}`}
                    className={`flex items-center gap-3 px-5 py-3.5 text-xs transition ${
                      locked ? "cursor-not-allowed opacity-55" : "hover:bg-lime-50/60"
                    }`}
                  >
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                        passed ? "bg-lime-500 text-white" : "bg-navy-50 text-navy-400"
                      }`}
                    >
                      {locked ? (
                        <IconLock width={13} height={13} />
                      ) : (
                        <IconClipboard width={14} height={14} />
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-bold text-navy-700">{a.title}</span>
                      <span className="text-[10px] text-navy-400">
                        {locked
                          ? "Complete todas las lecciones"
                          : passed
                            ? "Aprobada"
                            : `${at.length}/${a.maxAttempts} intentos`}
                      </span>
                    </span>
                  </Link>
                );
              })}

              {/* Certificado */}
              <div className="flex items-center gap-3 px-5 py-3.5 text-xs">
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                    certificate ? "bg-lime-500 text-white" : "bg-navy-50 text-navy-300"
                  }`}
                >
                  <IconAward width={14} height={14} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-bold text-navy-700">Certificado</span>
                  <span className="text-[10px] text-navy-400">
                    {certificate ? "Disponible para descarga" : "Se emite al aprobar el curso"}
                  </span>
                </span>
                {certificate && (
                  <Link href={`/aula/certificado/${certificate.code}`} className="btn-lime btn-sm shrink-0">
                    Ver
                  </Link>
                )}
              </div>
            </div>
          </div>
        </aside>

        {/* Reproductor / contenido */}
        <section>
          <LessonPlayer
            enrollmentId={enrollment.id}
            courseSlug={course.slug}
            lesson={{
              id: active.id,
              title: active.title,
              description: active.description,
              contentType: active.contentType,
              contentUrl: active.contentUrl,
              contentBody: active.contentBody,
              durationMin: active.durationMin,
              moduleTitle: activeModule.title,
              index: activeIndex + 1,
              total: allLessons.length,
            }}
            completed={doneMap.get(active.id)?.status === "completado"}
            prevHref={prev ? `/aula/curso/${course.slug}?leccion=${prev.id}` : null}
            nextHref={next ? `/aula/curso/${course.slug}?leccion=${next.id}` : null}
          />

          {/* Cierre del curso */}
          {lessonsDone && finalAssessment && !finalPassed && (
            <div className="card mt-6 flex flex-wrap items-center gap-5 border-lime-300 bg-lime-50/60 p-6">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-lime-500 text-navy-900">
                <IconClipboard width={22} height={22} />
              </span>
              <div className="min-w-[220px] flex-1">
                <p className="font-display text-base font-bold text-navy-700">
                  Termino todas las lecciones
                </p>
                <p className="mt-0.5 text-sm text-navy-500">
                  Presente la evaluacion final para obtener su certificado. Nota minima{" "}
                  {finalAssessment.minScore}/100 &middot; intentos usados {finalAttempts}/
                  {finalAssessment.maxAttempts}.
                </p>
              </div>
              <Link href={`/aula/evaluacion/${finalAssessment.id}`} className="btn-lime">
                Presentar evaluacion final
              </Link>
            </div>
          )}

          {certificate && (
            <div className="card mt-6 flex flex-wrap items-center gap-5 border-lime-300 bg-white p-6">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-lime-500 text-navy-900">
                <IconAward width={22} height={22} />
              </span>
              <div className="min-w-[220px] flex-1">
                <p className="font-display text-base font-bold text-navy-700">Curso aprobado</p>
                <p className="mt-0.5 text-sm text-navy-500">
                  Su certificado <span className="font-mono font-bold">{certificate.code}</span> ya esta
                  disponible.
                </p>
              </div>
              <Link href={`/aula/certificado/${certificate.code}`} className="btn-primary">
                Ver certificado
              </Link>
            </div>
          )}

          {/* Nota para KG */}
          {allLessons.filter((l) => l.contentType === "pendiente").length > 0 && (
            <div className="mt-6">
              <ContentPlaceholder
                compact
                title="Espacio reservado para el material del curso"
                description="Cada leccion tiene su contenedor listo. Desde Administracion > Cursos > Constructor se define el tipo (video, PDF, texto, enlace o Genially) y se pega la URL del recurso."
              />
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
