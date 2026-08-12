"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { IconAlert, IconCheck, IconClock } from "@/components/Icons";

type Q = {
  id: string;
  statement: string;
  type: string;
  options: { id: string; text: string }[];
};

export function QuizForm({
  assessmentId,
  questions,
  shuffle,
  timeLimitMin,
}: {
  assessmentId: string;
  questions: Q[];
  shuffle: boolean;
  timeLimitMin: number | null;
}) {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [left, setLeft] = useState(timeLimitMin ? timeLimitMin * 60 : null);

  // Orden estable por render (evita re-barajar en cada cambio de estado)
  const list = useMemo(() => {
    if (!shuffle) return questions;
    return [...questions].sort(() => Math.random() - 0.5);
  }, [questions, shuffle]);

  useEffect(() => {
    if (left === null) return;
    if (left <= 0) {
      void submit();
      return;
    }
    const t = setTimeout(() => setLeft((s) => (s === null ? null : s - 1)), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [left]);

  const answered = Object.keys(answers).length;
  const allAnswered = answered === list.length;

  async function submit() {
    if (sending) return;
    setSending(true);
    setError(null);
    const res = await fetch("/api/aula/evaluacion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        assessmentId,
        answers: list.map((q) => ({ questionId: q.id, optionId: answers[q.id] ?? null })),
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.error ?? "No fue posible enviar la evaluacion");
      setSending(false);
      return;
    }
    router.push(`/aula/evaluacion/${assessmentId}?intento=${data.attemptId}`);
    router.refresh();
  }

  const mm = left !== null ? String(Math.floor(left / 60)).padStart(2, "0") : "";
  const ss = left !== null ? String(left % 60).padStart(2, "0") : "";

  return (
    <div className="card overflow-hidden">
      {/* Barra de estado */}
      <div className="sticky top-16 z-10 flex flex-wrap items-center gap-4 border-b border-navy-50 bg-white/95 px-6 py-4 backdrop-blur">
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
          >
            <IconClock width={15} height={15} /> {mm}:{ss}
          </span>
        )}
      </div>

      <div className="divide-y divide-navy-50">
        {list.map((q, i) => (
          <fieldset key={q.id} className="p-6">
            <legend className="mb-4 flex gap-3">
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                  answers[q.id] ? "bg-lime-500 text-white" : "bg-navy-100 text-navy-500"
                }`}
              >
                {i + 1}
              </span>
              <span className="pt-1 text-sm font-semibold leading-snug text-navy-700">{q.statement}</span>
            </legend>

            <div className="space-y-2 pl-10">
              {q.options.map((o) => {
                const selected = answers[q.id] === o.id;
                return (
                  <label
                    key={o.id}
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm transition ${
                      selected
                        ? "border-lime-500 bg-lime-50 font-semibold text-navy-800 shadow-glow"
                        : "border-navy-100 bg-white text-navy-600 hover:border-navy-300 hover:bg-navy-50/60"
                    }`}
                  >
                    <input
                      type="radio"
                      name={q.id}
                      value={o.id}
                      checked={selected}
                      onChange={() => setAnswers((a) => ({ ...a, [q.id]: o.id }))}
                      className="sr-only"
                    />
                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                        selected ? "border-lime-500 bg-lime-500 text-white" : "border-navy-200"
                      }`}
                    >
                      {selected && <IconCheck width={11} height={11} strokeWidth={4} />}
                    </span>
                    {o.text}
                  </label>
                );
              })}
            </div>
          </fieldset>
        ))}
      </div>

      <div className="border-t border-navy-50 bg-navy-50/40 p-6">
        {error && (
          <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            <IconAlert width={18} height={18} className="mt-0.5 shrink-0" />
            {error}
          </div>
        )}
        {!allAnswered && (
          <p className="mb-4 text-xs text-navy-400">
            Faltan {list.length - answered} pregunta(s) por responder. Puede enviar de todas formas; las
            no respondidas se califican como incorrectas.
          </p>
        )}
        <button onClick={submit} disabled={sending} className="btn-lime w-full py-3.5 text-base">
          {sending ? "Calificando..." : "Enviar evaluacion"}
        </button>
      </div>
    </div>
  );
}
