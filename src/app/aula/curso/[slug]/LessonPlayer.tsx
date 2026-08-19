"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { IconCheck, IconArrowRight, IconFile, IconPlay, IconClock } from "@/components/Icons";

type Lesson = {
  id: string;
  title: string;
  description: string | null;
  contentType: string;
  contentUrl: string | null;
  contentBody: string | null;
  durationMin: number;
  moduleTitle: string;
  index: number;
  total: number;
};

export function LessonPlayer({
  enrollmentId,
  courseSlug,
  lesson,
  completed,
  prevHref,
  nextHref,
}: {
  enrollmentId: string;
  courseSlug: string;
  lesson: Lesson;
  completed: boolean;
  prevHref: string | null;
  nextHref: string | null;
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const startedRef = useRef(false);

  // Cronometro de permanencia en la leccion (trazabilidad de tiempo)
  useEffect(() => {
    setSeconds(0);
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [lesson.id]);

  // Registra el inicio de la leccion una sola vez
  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    fetch("/api/aula/leccion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enrollmentId, lessonId: lesson.id, completed: false, percent: 5 }),
    }).catch(() => {});
  }, [enrollmentId, lesson.id]);

  async function marcar() {
    setSaving(true);
    await fetch("/api/aula/leccion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        enrollmentId,
        lessonId: lesson.id,
        completed: true,
        addSeconds: seconds,
      }),
    });
    setSaving(false);
    if (nextHref) router.push(nextHref);
    else router.push(`/aula/curso/${courseSlug}?leccion=${lesson.id}`);
    router.refresh();
  }

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <div className="card overflow-hidden">
      {/* Cabecera de la leccion */}
      <div className="flex flex-wrap items-center gap-3 border-b border-navy-50 px-6 py-4">
        <span className="badge-blue">
          Leccion {lesson.index} de {lesson.total}
        </span>
        <span className="text-[11px] font-semibold uppercase tracking-wide text-navy-300">
          {lesson.moduleTitle}
        </span>
        <span className="ml-auto inline-flex items-center gap-1.5 text-[11px] font-semibold text-navy-400">
          <IconClock width={13} height={13} /> {mm}:{ss} en esta leccion
        </span>
        {completed && (
          <span className="badge-green">
            <IconCheck width={11} height={11} strokeWidth={4} /> Completada
          </span>
        )}
      </div>

      {/* Contenedor del contenido */}
      <div className="p-6">
        <h2 className="font-display text-xl font-extrabold text-navy-700 lg:text-2xl">{lesson.title}</h2>
        {lesson.description && <p className="mt-2 text-sm text-navy-400">{lesson.description}</p>}

        <div className="mt-6">
          <ContentSlot lesson={lesson} />
        </div>

        {/* Barra de acciones */}
        <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-navy-50 pt-6">
          {prevHref ? (
            <Link href={prevHref} className="btn-outline btn-sm">
              Leccion anterior
            </Link>
          ) : (
            <span />
          )}

          <div className="ml-auto flex flex-wrap items-center gap-3">
            {!completed ? (
              <button onClick={marcar} disabled={saving} className="btn-lime">
                {saving ? "Guardando..." : "Marcar como completada"}
                {!saving && <IconCheck width={16} height={16} strokeWidth={3} />}
              </button>
            ) : (
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-lime-600">
                <IconCheck width={16} height={16} strokeWidth={3} /> Leccion completada
              </span>
            )}
            {nextHref && (
              <Link href={nextHref} className={completed ? "btn-lime" : "btn-outline"}>
                Siguiente leccion <IconArrowRight width={16} height={16} />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * CONTENEDOR DE CONTENIDO.
 * Segun el tipo definido en la leccion renderiza video, PDF, texto, enlace o
 * un embed de Genially. Si el contenido aun no fue cargado por KG, muestra el
 * espacio reservado.
 */
function ContentSlot({ lesson }: { lesson: Lesson }) {
  if (!lesson.contentUrl && lesson.contentType === "pendiente") {
    return (
      <div className="relative overflow-hidden rounded-2xl border-2 border-dashed border-navy-200 bg-navy-50/50 px-6 py-16 text-center">
        <div className="pointer-events-none absolute inset-0 bg-grid bg-[size:26px_26px] opacity-50" />
        <div className="relative">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-kg">
            <span className="font-display text-2xl font-extrabold text-lime-500">KG</span>
          </div>
          <p className="mt-5 font-display text-lg font-bold text-navy-700">
            Contenido de esta leccion en produccion
          </p>
          <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-navy-400">
            Aqui se mostrara el video, el documento o el recurso interactivo de Genially. Mientras
            tanto puede recorrer la estructura del curso y presentar las evaluaciones de ejemplo.
          </p>
          <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[11px] font-semibold text-navy-500 shadow-sm">
            <IconFile width={13} height={13} /> Duracion estimada: {lesson.durationMin} minutos
          </p>
        </div>
      </div>
    );
  }

  if (lesson.contentType === "video" && lesson.contentUrl) {
    return (
      <div className="aspect-video overflow-hidden rounded-2xl bg-navy-900">
        <iframe
          src={lesson.contentUrl}
          title={lesson.title}
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  // Genially: las presentaciones son 16:9, se embeben por URL publica.
  if (lesson.contentType === "genially" && lesson.contentUrl) {
    return (
      <div>
        <div className="aspect-video overflow-hidden rounded-2xl border border-navy-100 bg-navy-900">
          <iframe
            src={lesson.contentUrl}
            title={lesson.title}
            className="h-full w-full"
            allow="fullscreen; autoplay"
            allowFullScreen
          />
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-navy-400">
          <span className="inline-flex items-center gap-1.5">
            <IconFile width={13} height={13} /> Presentacion interactiva &middot; use las flechas para avanzar
          </span>
          <a
            href={lesson.contentUrl}
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-navy-500 hover:text-lime-600"
          >
            Abrir en pantalla completa
          </a>
        </div>
      </div>
    );
  }

  if (lesson.contentType === "scorm" && lesson.contentUrl) {
    return (
      <div className="aspect-[16/10] overflow-hidden rounded-2xl border border-navy-100 bg-white">
        <iframe src={lesson.contentUrl} title={lesson.title} className="h-full w-full" allowFullScreen />
      </div>
    );
  }

  if (lesson.contentType === "pdf" && lesson.contentUrl) {
    return (
      <div className="overflow-hidden rounded-2xl border border-navy-100">
        <object data={lesson.contentUrl} type="application/pdf" className="h-[70vh] w-full">
          <div className="p-8 text-center text-sm text-navy-500">
            Su navegador no puede mostrar el PDF.{" "}
            <a href={lesson.contentUrl} className="link-kg" target="_blank" rel="noreferrer">
              Descargarlo aqui
            </a>
          </div>
        </object>
      </div>
    );
  }

  if (lesson.contentType === "texto" && lesson.contentBody) {
    return (
      <article
        className="prose prose-slate max-w-none rounded-2xl border border-navy-100 bg-white p-7 text-navy-600"
        dangerouslySetInnerHTML={{ __html: lesson.contentBody }}
      />
    );
  }

  if (lesson.contentUrl) {
    return (
      <a
        href={lesson.contentUrl}
        target="_blank"
        rel="noreferrer"
        className="card card-hover flex items-center gap-4 p-6"
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-lime-500 text-navy-900">
          <IconPlay width={22} height={22} />
        </span>
        <div>
          <p className="font-display font-bold text-navy-700">Abrir recurso externo</p>
          <p className="truncate text-xs text-navy-400">{lesson.contentUrl}</p>
        </div>
      </a>
    );
  }

  return null;
}
