"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { IconCheck, IconAlert, IconClipboard, IconFile, IconLayers } from "@/components/Icons";
import { ASSESSMENT_TYPE_LABEL } from "@/lib/constants";

type Lesson = {
  id: string;
  title: string;
  contentType: string;
  contentUrl: string | null;
  durationMin: number;
  isRequired: boolean;
  isPublished: boolean;
};
type Module = { id: string; title: string; description: string | null; lessons: Lesson[] };
type Assessment = {
  id: string;
  title: string;
  type: string;
  minScore: number;
  maxAttempts: number;
  questions: number;
};
type Course = {
  id: string;
  status: string;
  minPassingScore: number;
  maxAttempts: number;
  progressRule: string;
  requiresFinalExam: boolean;
  requiresAllLessons: boolean;
  certificateEnabled: boolean;
  certificateValidityMonths: number | null;
};

const TIPOS = [
  { v: "pendiente", l: "Pendiente (sin contenido)" },
  { v: "video", l: "Video (URL embebible)" },
  { v: "genially", l: "Genially / interactivo" },
  { v: "pdf", l: "PDF / documento" },
  { v: "texto", l: "Texto enriquecido" },
  { v: "enlace", l: "Enlace externo" },
  { v: "scorm", l: "Paquete SCORM" },
];

export function CursoConstructor({
  course,
  modules,
  assessments,
}: {
  course: Course;
  modules: Module[];
  assessments: Assessment[];
}) {
  const router = useRouter();
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [saving, setSaving] = useState<string | null>(null);
  const [draft, setDraft] = useState<Record<string, { contentType: string; contentUrl: string }>>(
    Object.fromEntries(
      modules.flatMap((m) =>
        m.lessons.map((l) => [l.id, { contentType: l.contentType, contentUrl: l.contentUrl ?? "" }])
      )
    )
  );

  async function guardarLeccion(id: string) {
    setSaving(id);
    setMsg(null);
    const res = await fetch("/api/admin/leccion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lessonId: id, ...draft[id] }),
    });
    const data = await res.json().catch(() => ({}));
    setSaving(null);
    if (!res.ok) return setMsg({ ok: false, text: data.error ?? "No se pudo guardar" });
    setMsg({ ok: true, text: "Contenido de la lección actualizado" });
    router.refresh();
  }

  async function cambiarEstado(status: string) {
    setSaving("curso");
    const res = await fetch("/api/admin/curso", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseId: course.id, status }),
    });
    const data = await res.json().catch(() => ({}));
    setSaving(null);
    if (!res.ok) return setMsg({ ok: false, text: data.error ?? "No se pudo cambiar el estado" });
    setMsg({ ok: true, text: `Curso marcado como "${status}"` });
    router.refresh();
  }

  const totalLecciones = modules.reduce((s, m) => s + m.lessons.length, 0);
  const listas = Object.values(draft).filter((d) => d.contentType !== "pendiente").length;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_330px]">
      <div className="space-y-5">
        {msg && (
          <div
            className={`flex items-start gap-2.5 rounded-xl border p-3 text-sm ${
              msg.ok ? "border-lime-200 bg-lime-50 text-lime-800" : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            {msg.ok ? <IconCheck width={18} height={18} strokeWidth={3} /> : <IconAlert width={18} height={18} />}
            {msg.text}
          </div>
        )}

        {modules.map((m, mi) => (
          <div key={m.id} className="card overflow-hidden">
            <div className="flex items-center gap-3 border-b border-navy-50 bg-navy-50/50 px-5 py-4">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-navy-700 text-xs font-bold text-lime-400">
                {mi + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-display text-sm font-bold text-navy-700">{m.title}</p>
                <p className="truncate text-[11px] text-navy-400">{m.description}</p>
              </div>
              <span className="badge-slate shrink-0">{m.lessons.length} lecciones</span>
            </div>

            <div className="divide-y divide-navy-50">
              {m.lessons.map((l) => {
                const d = draft[l.id];
                const cambio = d.contentType !== l.contentType || d.contentUrl !== (l.contentUrl ?? "");
                return (
                  <div key={l.id} className="p-5">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="min-w-0 flex-1 text-sm font-semibold text-navy-700">{l.title}</p>
                      {d.contentType === "pendiente" ? (
                        <span className="badge-amber">Contenido pendiente</span>
                      ) : (
                        <span className="badge-green">Contenido cargado</span>
                      )}
                    </div>

                    <div className="mt-3 grid gap-3 sm:grid-cols-[200px_1fr_auto]">
                      <select
                        value={d.contentType}
                        onChange={(e) =>
                          setDraft((s) => ({ ...s, [l.id]: { ...s[l.id], contentType: e.target.value } }))
                        }
                        className="select py-2 text-sm"
                      >
                        {TIPOS.map((t) => (
                          <option key={t.v} value={t.v}>
                            {t.l}
                          </option>
                        ))}
                      </select>
                      <input
                        value={d.contentUrl}
                        onChange={(e) =>
                          setDraft((s) => ({ ...s, [l.id]: { ...s[l.id], contentUrl: e.target.value } }))
                        }
                        placeholder="https://... (URL del video, Genially, PDF o recurso)"
                        className="input py-2 text-sm"
                        disabled={d.contentType === "pendiente"}
                      />
                      <button
                        onClick={() => guardarLeccion(l.id)}
                        disabled={!cambio || saving === l.id}
                        className="btn-lime btn-sm"
                      >
                        {saving === l.id ? "..." : "Guardar"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Evaluaciones */}
        <div className="card overflow-hidden">
          <div className="flex items-center gap-3 border-b border-navy-50 bg-navy-50/50 px-5 py-4">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-lime-500 text-navy-900">
              <IconClipboard width={17} height={17} />
            </span>
            <p className="font-display text-sm font-bold text-navy-700">Evaluaciones del curso</p>
          </div>
          <table className="table-kg">
            <thead>
              <tr>
                <th>Evaluación</th>
                <th>Tipo</th>
                <th>Preguntas</th>
                <th>Nota mínima</th>
                <th>Intentos</th>
              </tr>
            </thead>
            <tbody>
              {assessments.map((a) => (
                <tr key={a.id}>
                  <td className="font-semibold text-navy-700">{a.title}</td>
                  <td className="text-xs text-navy-500">{ASSESSMENT_TYPE_LABEL[a.type] ?? a.type}</td>
                  <td className="font-bold">{a.questions}</td>
                  <td>{a.minScore}</td>
                  <td>{a.maxAttempts}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="border-t border-navy-50 px-5 py-3 text-[11px] text-navy-400">
            El banco de preguntas cargado es de EJEMPLO. KG debe reemplazarlo por el banco oficial de
            cada curso desde <Link href="/admin/evaluaciones" className="link-kg">Evaluaciones</Link>.
          </p>
        </div>
      </div>

      {/* Panel lateral */}
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="card p-6">
          <p className="font-display text-base font-bold text-navy-700">Publicación</p>
          <p className="mt-1 text-xs text-navy-400">Estado actual del curso en el catálogo.</p>

          <div className="mt-4 space-y-2">
            {["borrador", "revision", "publicado", "despublicado"].map((s) => (
              <button
                key={s}
                onClick={() => cambiarEstado(s)}
                disabled={saving === "curso"}
                className={`w-full rounded-xl border px-4 py-2.5 text-left text-sm font-semibold capitalize transition ${
                  course.status === s
                    ? "border-lime-500 bg-lime-50 text-navy-800"
                    : "border-navy-100 bg-white text-navy-500 hover:border-navy-300"
                }`}
              >
                {s}
                {course.status === s && <span className="float-right text-lime-600">actual</span>}
              </button>
            ))}
          </div>

          <div className="mt-6 rounded-xl bg-kg-gradient p-4 text-center text-white">
            <p className="font-display text-3xl font-extrabold text-lime-400">
              {listas}/{totalLecciones}
            </p>
            <p className="text-[11px] text-white/60">lecciones con contenido cargado</p>
          </div>
        </div>

        <div className="card mt-5 p-6">
          <div className="flex items-center gap-2">
            <IconLayers width={17} height={17} className="text-navy-400" />
            <p className="font-display text-sm font-bold text-navy-700">Reglas del curso</p>
          </div>
          <dl className="mt-4 space-y-2.5 text-xs">
            {[
              ["Regla de progreso", course.progressRule],
              ["Nota mínima", `${course.minPassingScore}/100`],
              ["Intentos", String(course.maxAttempts)],
              ["Evaluación final", course.requiresFinalExam ? "Obligatoria" : "Opcional"],
              ["Todas las lecciones", course.requiresAllLessons ? "Si" : "No"],
              ["Certificado", course.certificateEnabled ? "Automático" : "Desactivado"],
              [
                "Vigencia",
                course.certificateValidityMonths ? `${course.certificateValidityMonths} meses` : "Indefinida",
              ],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-3">
                <dt className="text-navy-400">{k}</dt>
                <dd className="text-right font-semibold text-navy-700">{v}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 flex gap-2 rounded-lg bg-navy-50/70 p-3 text-[11px] leading-relaxed text-navy-400">
            <IconFile width={13} height={13} className="mt-0.5 shrink-0" />
            La edicion de estas reglas desde la interfaz corresponde a la Fase 1 del backlog; hoy se
            configuran en el seed o directamente en la base de datos.
          </p>
        </div>
      </aside>
    </div>
  );
}
