"use client";

/**
 * Editor de una evaluación: configuración, preguntas una a una y carga masiva.
 *
 * La carga masiva acepta una pregunta por línea, con los campos separados por
 * barras verticales o por tabuladores (lo que queda al copiar filas de Excel):
 *
 *   Enunciado | Opción A | Opción B | Opción C | Opción D | Letra correcta | Explicación
 *   Enunciado | V | Explicación          (verdadero/falso: V o F)
 *
 * Antes de guardar se muestra la vista previa con los errores de cada línea.
 */

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Aviso, Campo, Ventana, llamar, leerFormulario, type Mensaje } from "@/components/admin/Formulario";
import { IconCheck } from "@/components/Icons";

type Opcion = { text: string; isCorrect: boolean };
type Pregunta = {
  id: string;
  statement: string;
  explanation: string | null;
  type: string;
  respondida: boolean;
  options: Opcion[];
};
type Evaluacion = {
  id: string;
  title: string;
  description: string | null;
  type: string;
  minScore: number;
  maxAttempts: number;
  timeLimitMin: number | null;
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  showFeedback: boolean;
  showCorrectAnswers: boolean;
  isPublished: boolean;
};
type Nueva = { statement: string; explanation: string | null; type: "unica" | "verdadero_falso"; options: Opcion[] };

const LETRAS = "ABCDEF";

/* --------------------------- Lectura de la carga --------------------------- */

function leerLinea(linea: string): { ok: true; pregunta: Nueva } | { ok: false; error: string } {
  const campos = (linea.includes("|") ? linea.split("|") : linea.split("\t")).map((c) => c.trim());
  const [statement, ...resto] = campos;
  if (!statement || statement.length < 5) return { ok: false, error: "Falta el enunciado" };

  // Verdadero / falso: "Enunciado | V | Explicación"
  const vf = resto[0]?.toUpperCase();
  if (resto.length >= 1 && ["V", "F", "VERDADERO", "FALSO"].includes(vf ?? "")) {
    const verdadero = vf === "V" || vf === "VERDADERO";
    return {
      ok: true,
      pregunta: {
        statement,
        explanation: resto.slice(1).join(" | ") || null,
        type: "verdadero_falso",
        options: [
          { text: "Verdadero", isCorrect: verdadero },
          { text: "Falso", isCorrect: !verdadero },
        ],
      },
    };
  }

  // Selección única: la letra correcta es el último campo de una sola letra.
  let k = -1;
  for (let i = resto.length - 1; i >= 2; i--) {
    if (/^[A-Fa-f]$/.test(resto[i])) {
      k = i;
      break;
    }
  }
  if (k < 0) return { ok: false, error: "No encontré la letra de la respuesta correcta (A a F) después de las opciones" };
  const opciones = resto.slice(0, k).filter(Boolean);
  if (opciones.length < 2) return { ok: false, error: "Se necesitan al menos 2 opciones" };
  if (opciones.length > 6) return { ok: false, error: "Máximo 6 opciones" };
  const correcta = LETRAS.indexOf(resto[k].toUpperCase());
  if (correcta >= opciones.length) {
    return { ok: false, error: `La correcta es ${resto[k].toUpperCase()}, pero solo hay ${opciones.length} opciones` };
  }
  return {
    ok: true,
    pregunta: {
      statement,
      explanation: resto.slice(k + 1).join(" | ") || null,
      type: "unica",
      options: opciones.map((text, i) => ({ text, isCorrect: i === correcta })),
    },
  };
}

/* -------------------------------- Componente ------------------------------- */

export function EditorEvaluacion({ evaluacion: e, preguntas }: { evaluacion: Evaluacion; preguntas: Pregunta[] }) {
  const router = useRouter();
  const [msg, setMsg] = useState<Mensaje>(null);
  const [guardando, setGuardando] = useState(false);
  const [editando, setEditando] = useState<Pregunta | "nueva" | null>(null);
  const [masiva, setMasiva] = useState(false);

  const listo = useCallback(
    (text: string) => {
      setMsg({ ok: true, text });
      router.refresh();
    },
    [router]
  );

  async function guardarConfig(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const f = leerFormulario(ev.currentTarget);
    setGuardando(true);
    const r = await llamar("/api/admin/evaluacion", "PATCH", {
      assessmentId: e.id,
      title: f.title,
      description: f.description,
      minScore: f.minScore,
      maxAttempts: f.maxAttempts,
      timeLimitMin: f.timeLimitMin === "" ? 0 : f.timeLimitMin,
      shuffleQuestions: f.shuffleQuestions,
      shuffleOptions: f.shuffleOptions,
      showFeedback: f.showFeedback,
      showCorrectAnswers: f.showCorrectAnswers,
    });
    setGuardando(false);
    if (r.ok) listo("Configuración guardada");
    else setMsg({ ok: false, text: r.data.error ?? "No se pudo guardar" });
  }

  async function publicar(valor: boolean) {
    setGuardando(true);
    const r = await llamar("/api/admin/evaluacion", "PATCH", { assessmentId: e.id, isPublished: valor });
    setGuardando(false);
    if (r.ok) listo(valor ? "Evaluación publicada: los estudiantes ya pueden presentarla" : "Evaluación retirada");
    else setMsg({ ok: false, text: r.data.error ?? "No se pudo cambiar" });
  }

  async function quitar(p: Pregunta) {
    const aviso = p.respondida
      ? "Esta pregunta ya fue respondida: se quitará de la evaluación y quedará inactiva en el banco para conservar el historial. ¿Continuar?"
      : "¿Quitar esta pregunta? Se eliminará del banco.";
    if (!window.confirm(aviso)) return;
    const r = await llamar("/api/admin/pregunta", "DELETE", { assessmentId: e.id, questionId: p.id });
    if (r.ok) listo("Pregunta quitada");
    else setMsg({ ok: false, text: r.data.error ?? "No se pudo quitar" });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
      <div className="space-y-6">
        <Aviso msg={msg} />

        {/* Preguntas */}
        <div className="card overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-navy-50 px-5 py-4">
            <div>
              <p className="font-display text-sm font-bold text-navy-700">Preguntas ({preguntas.length})</p>
              <p className="text-[11px] text-navy-400">Cada pregunta vale lo mismo. La nota se calcula sobre 100.</p>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => setMasiva(true)} className="btn-outline btn-sm">
                Carga masiva
              </button>
              <button type="button" onClick={() => setEditando("nueva")} className="btn-lime btn-sm">
                + Pregunta
              </button>
            </div>
          </div>

          {preguntas.length === 0 ? (
            <div className="p-8 text-center text-sm text-navy-400">
              Esta evaluación aún no tiene preguntas. Agréguelas una a una o péguelas todas con{" "}
              <button type="button" onClick={() => setMasiva(true)} className="link-kg">
                carga masiva
              </button>
              .
            </div>
          ) : (
            <ol className="divide-y divide-navy-50">
              {preguntas.map((p, i) => (
                <li key={p.id} className="p-5">
                  <div className="flex items-start gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-navy-50 text-xs font-bold text-navy-500">
                      {i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-navy-700">{p.statement}</p>
                      <ul className="mt-2 grid gap-1 sm:grid-cols-2">
                        {p.options.map((o, j) => (
                          <li
                            key={j}
                            className={`flex items-start gap-2 rounded-lg px-2.5 py-1.5 text-xs ${
                              o.isCorrect ? "bg-lime-50 font-semibold text-lime-800" : "text-navy-500"
                            }`}
                          >
                            <span className="font-bold">{p.type === "verdadero_falso" ? "" : `${LETRAS[j]}.`}</span>
                            {o.text}
                            {o.isCorrect && <IconCheck width={13} height={13} strokeWidth={3} className="ml-auto mt-0.5 shrink-0" />}
                          </li>
                        ))}
                      </ul>
                      {p.explanation && (
                        <p className="mt-2 rounded-lg bg-navy-50/70 px-3 py-2 text-[11px] leading-relaxed text-navy-500">
                          {p.explanation}
                        </p>
                      )}
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1.5">
                      {p.respondida && <span className="badge-amber">Respondida</span>}
                      <button type="button" onClick={() => setEditando(p)} className="btn-ghost btn-sm">
                        Editar
                      </button>
                      <button type="button" onClick={() => quitar(p)} className="text-[11px] font-semibold text-red-600 hover:underline">
                        Quitar
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>

      {/* Configuración */}
      <aside className="space-y-6">
        <div className="card p-5">
          <p className="font-display text-sm font-bold text-navy-700">Publicación</p>
          <p className="mt-1 text-xs leading-relaxed text-navy-400">
            {e.isPublished
              ? "Publicada: los estudiantes que terminen las lecciones pueden presentarla."
              : "Sin publicar. Cargue y revise las preguntas antes de publicarla."}
          </p>
          <button
            type="button"
            disabled={guardando}
            onClick={() => publicar(!e.isPublished)}
            className={`mt-4 w-full ${e.isPublished ? "btn-outline" : "btn-lime"}`}
          >
            {e.isPublished ? "Retirar publicación" : "Publicar evaluación"}
          </button>
        </div>

        <form onSubmit={guardarConfig} className="card space-y-4 p-5">
          <p className="font-display text-sm font-bold text-navy-700">Configuración</p>
          <Campo label="Título">
            <input name="title" defaultValue={e.title} className="input" required />
          </Campo>
          <Campo label="Instrucciones para el estudiante">
            <textarea name="description" defaultValue={e.description ?? ""} rows={3} className="input" />
          </Campo>
          <div className="grid grid-cols-3 gap-3">
            <Campo label="Nota mín.">
              <input name="minScore" type="number" min={1} max={100} defaultValue={e.minScore} className="input" />
            </Campo>
            <Campo label="Intentos">
              <input name="maxAttempts" type="number" min={1} max={10} defaultValue={e.maxAttempts} className="input" />
            </Campo>
            <Campo label="Minutos">
              <input name="timeLimitMin" type="number" min={0} max={240} defaultValue={e.timeLimitMin ?? ""} placeholder="Sin" className="input" />
            </Campo>
          </div>
          <div className="space-y-2 text-xs text-navy-600">
            {(
              [
                ["shuffleQuestions", "Barajar el orden de las preguntas", e.shuffleQuestions],
                ["shuffleOptions", "Barajar el orden de las opciones", e.shuffleOptions],
                ["showFeedback", "Mostrar resultado pregunta por pregunta", e.showFeedback],
                ["showCorrectAnswers", "Mostrar la respuesta correcta al fallar", e.showCorrectAnswers],
              ] as const
            ).map(([name, label, valor]) => (
              <label key={name} className="flex items-center gap-2">
                <input type="checkbox" name={name} defaultChecked={valor} /> {label}
              </label>
            ))}
          </div>
          <button type="submit" disabled={guardando} className="btn-primary w-full">
            {guardando ? "Guardando..." : "Guardar configuración"}
          </button>
        </form>
      </aside>

      {editando && (
        <EditorPregunta
          assessmentId={e.id}
          pregunta={editando === "nueva" ? null : editando}
          onCerrar={() => setEditando(null)}
          onListo={(t) => {
            setEditando(null);
            listo(t);
          }}
        />
      )}
      {masiva && (
        <CargaMasiva
          assessmentId={e.id}
          onCerrar={() => setMasiva(false)}
          onListo={(t) => {
            setMasiva(false);
            listo(t);
          }}
        />
      )}
    </div>
  );
}

/* ----------------------------- Una pregunta ----------------------------- */

function EditorPregunta({
  assessmentId,
  pregunta,
  onCerrar,
  onListo,
}: {
  assessmentId: string;
  pregunta: Pregunta | null;
  onCerrar: () => void;
  onListo: (t: string) => void;
}) {
  const bloqueadas = !!pregunta?.respondida;
  const [statement, setStatement] = useState(pregunta?.statement ?? "");
  const [explanation, setExplanation] = useState(pregunta?.explanation ?? "");
  const [tipo, setTipo] = useState<"unica" | "verdadero_falso">(pregunta?.type === "verdadero_falso" ? "verdadero_falso" : "unica");
  const [opciones, setOpciones] = useState<Opcion[]>(
    pregunta?.options ?? [
      { text: "", isCorrect: true },
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
    ]
  );
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  function cambiarTipo(t: "unica" | "verdadero_falso") {
    setTipo(t);
    if (t === "verdadero_falso") {
      setOpciones([
        { text: "Verdadero", isCorrect: true },
        { text: "Falso", isCorrect: false },
      ]);
    } else {
      setOpciones([
        { text: "", isCorrect: true },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
      ]);
    }
  }

  async function guardar(ev: React.FormEvent) {
    ev.preventDefault();
    setError(null);
    const limpias = opciones.map((o) => ({ ...o, text: o.text.trim() })).filter((o) => o.text);
    if (!bloqueadas) {
      if (limpias.length < 2) return setError("Escriba al menos 2 opciones");
      if (limpias.filter((o) => o.isCorrect).length !== 1) return setError("Marque la opción correcta (debe estar escrita)");
    }
    setEnviando(true);
    const r = pregunta
      ? await llamar("/api/admin/pregunta", "PATCH", {
          questionId: pregunta.id,
          statement,
          explanation,
          ...(bloqueadas ? {} : { options: limpias }),
        })
      : await llamar("/api/admin/pregunta", "PUT", {
          assessmentId,
          preguntas: [{ statement, explanation, type: tipo, options: limpias }],
        });
    setEnviando(false);
    if (r.ok) onListo(pregunta ? "Pregunta actualizada" : "Pregunta agregada");
    else setError(r.data.error ?? "No se pudo guardar");
  }

  return (
    <Ventana titulo={pregunta ? "Editar pregunta" : "Nueva pregunta"} onCerrar={onCerrar}>
      <form onSubmit={guardar} className="space-y-4">
        {!pregunta && (
          <div className="flex gap-2">
            {(
              [
                ["unica", "Selección única"],
                ["verdadero_falso", "Verdadero / falso"],
              ] as const
            ).map(([t, label]) => (
              <button
                key={t}
                type="button"
                onClick={() => cambiarTipo(t)}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold ${tipo === t ? "bg-navy-700 text-white" : "bg-navy-50 text-navy-600"}`}
              >
                {label}
              </button>
            ))}
          </div>
        )}
        <Campo label="Enunciado">
          <textarea value={statement} onChange={(ev) => setStatement(ev.target.value)} rows={2} className="input" required />
        </Campo>

        <div>
          <p className="label">Opciones · marque la correcta</p>
          {bloqueadas && (
            <p className="mb-2 rounded-lg bg-amber-50 px-3 py-2 text-[11px] text-amber-800">
              Ya fue respondida en evaluaciones presentadas: las opciones no se pueden cambiar. Si están mal, quite la
              pregunta y cree una nueva.
            </p>
          )}
          <div className="space-y-2">
            {opciones.map((o, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="correcta"
                  checked={o.isCorrect}
                  disabled={bloqueadas}
                  onChange={() => setOpciones((os) => os.map((x, j) => ({ ...x, isCorrect: j === i })))}
                  aria-label={`Marcar la opción ${LETRAS[i]} como correcta`}
                />
                <span className="w-4 text-xs font-bold text-navy-400">{LETRAS[i]}</span>
                <input
                  value={o.text}
                  disabled={bloqueadas || tipo === "verdadero_falso"}
                  onChange={(ev) => setOpciones((os) => os.map((x, j) => (j === i ? { ...x, text: ev.target.value } : x)))}
                  className="input flex-1"
                  placeholder={`Opción ${LETRAS[i]}`}
                />
                {!bloqueadas && tipo === "unica" && opciones.length > 2 && (
                  <button
                    type="button"
                    onClick={() => setOpciones((os) => os.filter((_, j) => j !== i))}
                    aria-label={`Quitar la opción ${LETRAS[i]}`}
                    className="px-1 text-navy-300 hover:text-red-600"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
          {!bloqueadas && tipo === "unica" && opciones.length < 6 && (
            <button
              type="button"
              onClick={() => setOpciones((os) => [...os, { text: "", isCorrect: false }])}
              className="mt-2 text-xs font-semibold text-navy-600 hover:underline"
            >
              + Agregar opción
            </button>
          )}
        </div>

        <Campo label="Explicación (se muestra al revisar el resultado)">
          <textarea value={explanation} onChange={(ev) => setExplanation(ev.target.value)} rows={2} className="input" />
        </Campo>

        {error && <Aviso msg={{ ok: false, text: error }} />}
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onCerrar} className="btn-ghost">
            Cancelar
          </button>
          <button type="submit" disabled={enviando} className="btn-lime">
            {enviando ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </form>
    </Ventana>
  );
}

/* ------------------------------ Carga masiva ------------------------------ */

const EJEMPLO = `¿Qué tres elementos forman el triángulo del fuego? | Combustible, oxígeno y calor | Agua, aire y tierra | Humo, llama y ceniza | A | Si falta uno, el fuego se apaga.
El agua sirve para apagar un tablero eléctrico. | F | El agua conduce la electricidad.`;

function CargaMasiva({
  assessmentId,
  onCerrar,
  onListo,
}: {
  assessmentId: string;
  onCerrar: () => void;
  onListo: (t: string) => void;
}) {
  const [texto, setTexto] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  const lineas = useMemo(
    () =>
      texto
        .split(/\r?\n/)
        .map((l, i) => ({ n: i + 1, l: l.trim() }))
        .filter((x) => x.l)
        .map((x) => ({ ...x, r: leerLinea(x.l) })),
    [texto]
  );
  const validas = lineas.filter((x) => x.r.ok);
  const conError = lineas.filter((x) => !x.r.ok);

  async function cargar() {
    setError(null);
    setEnviando(true);
    const r = await llamar<{ creadas: number }>("/api/admin/pregunta", "PUT", {
      assessmentId,
      preguntas: validas.map((x) => (x.r as { ok: true; pregunta: Nueva }).pregunta),
    });
    setEnviando(false);
    if (r.ok) onListo(`${r.data.creadas} pregunta(s) cargadas`);
    else setError(r.data.error ?? "No se pudo cargar");
  }

  return (
    <Ventana
      titulo="Carga masiva de preguntas"
      descripcion="Una pregunta por línea. Puede pegar filas copiadas de Excel."
      onCerrar={onCerrar}
      ancho="max-w-4xl"
    >
      <div className="space-y-4">
        <div className="rounded-xl bg-navy-50/70 p-4 text-xs leading-relaxed text-navy-600">
          <p className="font-bold text-navy-700">Formato</p>
          <p className="mt-1 font-mono text-[11px]">Enunciado | Opción A | Opción B | Opción C | Opción D | Letra correcta | Explicación</p>
          <p className="mt-1 font-mono text-[11px]">Enunciado | V o F | Explicación</p>
          <p className="mt-2">
            De 2 a 6 opciones. La explicación es opcional. En Excel, ponga cada campo en una columna y copie las filas.
          </p>
          <button type="button" onClick={() => setTexto(EJEMPLO)} className="mt-2 font-semibold text-navy-700 underline">
            Ver un ejemplo
          </button>
        </div>

        <textarea
          value={texto}
          onChange={(ev) => setTexto(ev.target.value)}
          rows={8}
          className="input font-mono text-xs"
          placeholder="Pegue aquí las preguntas"
          aria-label="Preguntas para cargar"
        />

        {lineas.length > 0 && (
          <div className="max-h-72 overflow-y-auto rounded-xl border border-navy-100">
            <p className="sticky top-0 border-b border-navy-50 bg-white px-4 py-2 text-xs font-bold text-navy-600">
              Vista previa: {validas.length} lista(s){conError.length > 0 && `, ${conError.length} con error`}
            </p>
            <ul className="divide-y divide-navy-50">
              {lineas.map((x) => (
                <li key={x.n} className={`px-4 py-2.5 text-xs ${x.r.ok ? "" : "bg-red-50"}`}>
                  <span className="mr-2 font-mono text-navy-300">{x.n}</span>
                  {x.r.ok ? (
                    <>
                      <span className="font-semibold text-navy-700">{x.r.pregunta.statement}</span>
                      <span className="ml-2 text-lime-700">
                        ✓ {x.r.pregunta.options.find((o) => o.isCorrect)?.text}
                      </span>
                      <span className="ml-2 text-navy-400">({x.r.pregunta.options.length} opciones)</span>
                    </>
                  ) : (
                    <span className="font-semibold text-red-700">{x.r.error}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {error && <Aviso msg={{ ok: false, text: error }} />}
        <div className="flex flex-wrap items-center justify-end gap-2">
          {conError.length > 0 && validas.length > 0 && (
            <p className="mr-auto text-[11px] text-navy-400">Las líneas con error no se cargan.</p>
          )}
          <button type="button" onClick={onCerrar} className="btn-ghost">
            Cancelar
          </button>
          <button type="button" onClick={cargar} disabled={enviando || validas.length === 0} className="btn-lime">
            {enviando ? "Cargando..." : `Cargar ${validas.length} pregunta(s)`}
          </button>
        </div>
      </div>
    </Ventana>
  );
}
