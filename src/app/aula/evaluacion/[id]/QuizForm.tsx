"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { IconAlert, IconArrowRight, IconCheck, IconClock, IconFire } from "@/components/Icons";
import { barajar } from "@/lib/barajar";

type Q = {
  id: string;
  statement: string;
  type: string;
  options: { id: string; text: string }[];
};

const LETRAS = ["A", "B", "C", "D", "E", "F"];

/**
 * Presenta la evaluación una pregunta por pantalla, con un navegador para
 * saltar entre preguntas y una revisión antes de enviar.
 *
 * El orden de preguntas y opciones se baraja con una semilla que llega del
 * servidor (matrícula + número de intento): es estable al hidratar y cambia en
 * cada intento, para que no se aprenda "la C" de memoria.
 */
export function QuizForm({
  assessmentId,
  questions,
  shuffle,
  shuffleOptions,
  semilla,
  timeLimitMin,
  modoJuego = false,
  minScore,
}: {
  assessmentId: string;
  questions: Q[];
  shuffle: boolean;
  shuffleOptions: boolean;
  semilla: string;
  timeLimitMin: number | null;
  /** Curso en modo juego: la evaluación se presenta como desafío final. */
  modoJuego?: boolean;
  minScore?: number;
}) {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [actual, setActual] = useState(0);
  const [revisando, setRevisando] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // En modo juego el reloj arranca al aceptar el desafío, no al abrir la página.
  const [iniciado, setIniciado] = useState(!modoJuego);
  const [left, setLeft] = useState(timeLimitMin ? timeLimitMin * 60 : null);

  const list = useMemo(() => {
    const qs = shuffle ? barajar(questions, `${semilla}-preguntas`) : questions;
    if (!shuffleOptions) return qs;
    // Verdadero/Falso conserva su orden natural.
    return qs.map((q) =>
      q.type === "verdadero_falso" ? q : { ...q, options: barajar(q.options, `${semilla}-${q.id}`) }
    );
  }, [questions, shuffle, shuffleOptions, semilla]);

  useEffect(() => {
    if (left === null || !iniciado) return;
    if (left <= 0) {
      void submit();
      return;
    }
    const t = setTimeout(() => setLeft((s) => (s === null ? null : s - 1)), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [left, iniciado]);

  const answered = Object.keys(answers).length;
  const pendientes = list.length - answered;
  const q = list[actual];
  const esUltima = actual === list.length - 1;

  function responder(qid: string, oid: string) {
    setAnswers((a) => ({ ...a, [qid]: oid }));
  }

  function ir(n: number) {
    setRevisando(false);
    setActual(Math.max(0, Math.min(list.length - 1, n)));
  }

  async function submit() {
    if (sending) return;
    setSending(true);
    setError(null);
    const res = await fetch("/api/aula/evaluacion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        assessmentId,
        answers: list.map((p) => ({ questionId: p.id, optionId: answers[p.id] ?? null })),
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.error ?? "No fue posible enviar la evaluación");
      setSending(false);
      return;
    }
    router.push(`/aula/evaluacion/${assessmentId}?intento=${data.attemptId}`);
    router.refresh();
  }

  if (!iniciado) {
    return (
      <div className="relative overflow-hidden rounded-3xl bg-navy-900 p-8 text-center text-white shadow-kg-lg sm:p-12">
        <div className="pointer-events-none absolute inset-0 bg-kg-mesh opacity-70" />
        <div className="pointer-events-none absolute inset-0 bg-grid bg-[size:30px_30px] opacity-20" />
        <div className="relative">
          <span className="mx-auto flex h-24 w-24 animate-pulse items-center justify-center rounded-3xl bg-gradient-to-br from-red-500 to-amber-400 text-white shadow-kg-lg">
            <IconFire width={52} height={52} fill="currentColor" />
          </span>
          <p className="mt-6 font-display text-xs font-extrabold tracking-[0.3em] text-amber-300">DESAFÍO FINAL</p>
          <h3 className="mt-2 font-display text-3xl font-extrabold sm:text-4xl">Demuestre todo lo que aprendió</h3>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-white/70">
            Aquí no hay pistas ni vidas extra: las respuestas se revelan al final. Supérelo para ganar su certificado.
          </p>
          <div className="mx-auto mt-7 grid max-w-xl grid-cols-3 gap-3">
            {[
              ["Preguntas", String(questions.length)],
              ["Para ganar", minScore !== undefined ? `${minScore}/100` : "—"],
              ["Tiempo", timeLimitMin ? `${timeLimitMin} min` : "Libre"],
            ].map(([k, v]) => (
              <div key={k} className="rounded-xl bg-white/10 p-3">
                <p className="text-[10px] font-bold uppercase tracking-wide text-white/55">{k}</p>
                <p className="mt-0.5 font-display text-xl font-extrabold">{v}</p>
              </div>
            ))}
          </div>
          <button type="button" onClick={() => setIniciado(true)} className="btn-lime mt-8 px-10 py-4 text-base">
            ¡Aceptar el desafío! <IconArrowRight width={18} height={18} />
          </button>
        </div>
      </div>
    );
  }

  const mm = left !== null ? String(Math.floor(left / 60)).padStart(2, "0") : "";
  const ss = left !== null ? String(left % 60).padStart(2, "0") : "";

  return (
    // overflow-clip (no hidden): recorta las esquinas sin volver la tarjeta un
    // contenedor de desplazamiento, así la barra fija sigue pegada a la pantalla.
    <div className="card overflow-clip">
      {/* Barra de estado */}
      <div className="sticky top-16 z-10 border-b border-navy-50 bg-white/95 px-6 py-4 backdrop-blur">
        <div className="flex flex-wrap items-center gap-4">
          <div className="min-w-[160px] flex-1">
            <div className="flex items-center justify-between text-[11px] font-bold text-navy-500">
              <span>
                {answered} de {list.length} respondidas
              </span>
              <span>{Math.round((answered / list.length) * 100)}%</span>
            </div>
            <div className="progress-track mt-1.5">
              <div className="progress-fill" style={{ width: `${(answered / list.length) * 100}%` }} />
            </div>
          </div>
          {left !== null && (
            <span
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-mono text-sm font-bold ${
                left < 120 ? "bg-red-50 text-red-600" : "bg-navy-50 text-navy-600"
              }`}
              aria-live={left < 60 ? "polite" : "off"}
            >
              <IconClock width={15} height={15} /> {mm}:{ss}
            </span>
          )}
        </div>

        {/* Navegador de preguntas */}
        <nav aria-label="Preguntas" className="mt-3 flex flex-wrap gap-1.5">
          {list.map((p, i) => {
            const hecha = !!answers[p.id];
            const esta = !revisando && i === actual;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => ir(i)}
                aria-label={`Pregunta ${i + 1}${hecha ? ", respondida" : ""}`}
                aria-current={esta ? "step" : undefined}
                className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold transition ${
                  esta
                    ? "bg-navy-700 text-white ring-2 ring-navy-700 ring-offset-2"
                    : hecha
                      ? "bg-lime-500 text-white hover:bg-lime-600"
                      : "bg-navy-50 text-navy-500 hover:bg-navy-100"
                }`}
              >
                {i + 1}
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => setRevisando(true)}
            className={`ml-auto rounded-lg px-3 text-xs font-bold transition ${
              revisando ? "bg-navy-700 text-white" : "bg-navy-50 text-navy-600 hover:bg-navy-100"
            }`}
          >
            Revisar y enviar
          </button>
        </nav>
      </div>

      {!revisando ? (
        <div key={q.id} className="animate-fade-up p-6 sm:p-8">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-lime-600">
            Pregunta {actual + 1} de {list.length}
          </p>
          <fieldset className="mt-3">
            <legend className="font-display text-xl font-extrabold leading-snug text-navy-700 sm:text-2xl">
              {q.statement}
            </legend>

            <div className="mt-6 space-y-3">
              {q.options.map((o, i) => {
                const selected = answers[q.id] === o.id;
                return (
                  <label
                    key={o.id}
                    className={`group flex cursor-pointer items-center gap-4 rounded-2xl border-2 px-4 py-3.5 text-[15px] transition ${
                      selected
                        ? "border-lime-500 bg-lime-50 font-semibold text-navy-800 shadow-glow"
                        : "border-navy-100 bg-white text-navy-600 hover:-translate-y-0.5 hover:border-navy-300 hover:shadow-sm"
                    }`}
                  >
                    <input
                      type="radio"
                      name={q.id}
                      value={o.id}
                      checked={selected}
                      onChange={() => responder(q.id, o.id)}
                      className="sr-only"
                    />
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-extrabold transition ${
                        selected ? "bg-lime-500 text-white" : "bg-navy-50 text-navy-500 group-hover:bg-navy-100"
                      }`}
                    >
                      {selected ? <IconCheck width={15} height={15} strokeWidth={4} /> : LETRAS[i]}
                    </span>
                    {o.text}
                  </label>
                );
              })}
            </div>
          </fieldset>

          <div className="mt-8 flex items-center gap-3">
            {actual > 0 && (
              <button type="button" onClick={() => ir(actual - 1)} className="btn-ghost btn-sm">
                Anterior
              </button>
            )}
            <button
              type="button"
              onClick={() => (esUltima ? setRevisando(true) : ir(actual + 1))}
              className={`ml-auto ${answers[q.id] ? "btn-lime" : "btn-outline"}`}
            >
              {esUltima ? "Revisar y enviar" : answers[q.id] ? "Siguiente" : "Saltar por ahora"}
              <IconArrowRight width={16} height={16} />
            </button>
          </div>
        </div>
      ) : (
        <div className="animate-fade-up p-6 sm:p-8">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-lime-600">Antes de enviar</p>
          <h3 className="mt-2 font-display text-2xl font-extrabold text-navy-700">
            {pendientes === 0 ? "Respondió todas las preguntas" : `Le faltan ${pendientes} por responder`}
          </h3>
          <p className="mt-1 text-sm text-navy-500">
            Toque una pregunta para volver a ella. Las que queden sin responder se califican como incorrectas.
          </p>

          <ul className="mt-5 space-y-2">
            {list.map((p, i) => {
              const elegida = p.options.find((o) => o.id === answers[p.id]);
              return (
                <li key={p.id}>
                  <button
                    type="button"
                    onClick={() => ir(i)}
                    className={`flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left text-sm transition hover:border-navy-300 ${
                      elegida ? "border-navy-100 bg-white" : "border-amber-200 bg-amber-50"
                    }`}
                  >
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[11px] font-bold ${
                        elegida ? "bg-lime-500 text-white" : "bg-amber-400 text-white"
                      }`}
                    >
                      {i + 1}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold text-navy-700">{p.statement}</span>
                      <span className={`mt-0.5 block text-xs ${elegida ? "text-navy-500" : "font-bold text-amber-700"}`}>
                        {elegida ? elegida.text : "Sin responder"}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          {error && (
            <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              <IconAlert width={18} height={18} className="mt-0.5 shrink-0" />
              {error}
            </div>
          )}
          <button onClick={submit} disabled={sending} className="btn-lime mt-6 w-full py-3.5 text-base">
            {sending ? "Calificando..." : "Enviar evaluación"}
          </button>
        </div>
      )}
    </div>
  );
}
