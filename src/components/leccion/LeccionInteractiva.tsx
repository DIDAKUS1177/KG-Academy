"use client";

/**
 * MOTOR DE LECCIONES INTERACTIVAS
 *
 * Dibuja una lección como una secuencia de pantallas. Las pantallas de
 * práctica (decidir, ordenar, clasificar, contrarreloj) hay que resolverlas
 * para avanzar, y dan puntos según los intentos: 10 al primero, 6 al segundo,
 * 2 después. Al final se muestra la precisión y se habilita completar.
 *
 * El avance se recuerda en el navegador: si el trabajador cierra la pestaña,
 * vuelve a la pantalla donde iba. Una lección ya completada se abre en modo
 * repaso, con todas las pantallas libres.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Bloque, LeccionInteractiva as Leccion } from "@/lib/leccion-interactiva";
import { BLOQUES_CALIFICABLES } from "@/lib/leccion-interactiva";
import { barajar, semilla } from "@/lib/barajar";
import { Ilustracion } from "./Ilustraciones";
import { IconArrowRight, IconAward, IconCheck, IconClock, IconSpark, IconX } from "@/components/Icons";

type Estado = { resuelto: boolean; fallos: number };
type Guardado = { indice: number; estado: Record<number, Estado> };

const PUNTOS_MAX = 10;
/**
 * Puntos de una pantalla según los errores. En clasificar cada error descuenta
 * 2 (hay muchos elementos); en las demás, 10 al primer intento, 6 al segundo y
 * 2 después.
 */
const puntosDe = (fallos: number, tipo?: string) =>
  tipo === "clasificar"
    ? Math.max(2, PUNTOS_MAX - fallos * 2)
    : fallos === 0 ? 10 : fallos === 1 ? 6 : 2;

export function LeccionInteractiva({
  leccionId,
  contenido,
  completada,
  guardando,
  onTerminar,
  onCompletar,
}: {
  leccionId: string;
  contenido: Leccion;
  completada: boolean;
  guardando: boolean;
  /** Se llama una vez, al llegar al final con todo resuelto. */
  onTerminar: () => void;
  /** Botón final de la lección. */
  onCompletar: () => void;
}) {
  const { bloques, guia } = contenido;
  const clave = `kg-li-${leccionId}`;
  const [indice, setIndice] = useState(0);
  const [estado, setEstado] = useState<Record<number, Estado>>({});
  const [cargado, setCargado] = useState(false);
  const raiz = useRef<HTMLDivElement>(null);
  const avisado = useRef(false);

  // Recupera el avance guardado (solo en el navegador).
  useEffect(() => {
    try {
      const g = JSON.parse(localStorage.getItem(clave) ?? "null") as Guardado | null;
      if (g && typeof g.indice === "number") {
        setEstado(g.estado ?? {});
        setIndice(Math.min(g.indice, bloques.length - 1));
      }
    } catch {
      /* Sin almacenamiento disponible: se arranca de cero. */
    }
    setCargado(true);
  }, [clave, bloques.length]);

  useEffect(() => {
    if (!cargado) return;
    try {
      localStorage.setItem(clave, JSON.stringify({ indice, estado } satisfies Guardado));
    } catch {
      /* Ignorado. */
    }
  }, [cargado, clave, indice, estado]);

  const calificables = useMemo(
    () => bloques.map((b, i) => (BLOQUES_CALIFICABLES.has(b.tipo) ? i : -1)).filter((i) => i >= 0),
    [bloques]
  );
  const ganados = calificables.reduce(
    (s, i) => s + (estado[i]?.resuelto ? puntosDe(estado[i].fallos, bloques[i].tipo) : 0),
    0
  );
  const posibles = calificables.length * PUNTOS_MAX;
  const precision = posibles ? Math.round((ganados / posibles) * 100) : 100;

  const bloque = bloques[indice];
  const esCalificable = BLOQUES_CALIFICABLES.has(bloque.tipo);
  const resuelto = completada || !esCalificable || !!estado[indice]?.resuelto;
  const esUltimo = indice === bloques.length - 1;

  useEffect(() => {
    if (esUltimo && !avisado.current) {
      avisado.current = true;
      onTerminar();
    }
  }, [esUltimo, onTerminar]);

  const ir = useCallback((n: number) => {
    setIndice(n);
    raiz.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const fallo = useCallback(
    () => setEstado((e) => ({ ...e, [indice]: { resuelto: false, fallos: (e[indice]?.fallos ?? 0) + 1 } })),
    [indice]
  );
  const acierto = useCallback(
    () => setEstado((e) => ({ ...e, [indice]: { resuelto: true, fallos: e[indice]?.fallos ?? 0 } })),
    [indice]
  );

  function reiniciar() {
    try {
      localStorage.removeItem(clave);
    } catch {
      /* Ignorado. */
    }
    setEstado({});
    avisado.current = false;
    ir(0);
  }

  return (
    <div ref={raiz} className="scroll-mt-24 overflow-hidden rounded-3xl border border-navy-100 bg-cloud">
      <EstilosLeccion />

      {/* Barra superior: avance y puntos */}
      <div className="flex flex-wrap items-center gap-4 border-b border-navy-100 bg-white px-5 py-3">
        <div className="flex min-w-[180px] flex-1 gap-1" aria-label={`Pantalla ${indice + 1} de ${bloques.length}`}>
          {bloques.map((b, i) => {
            const hecho = completada || !BLOQUES_CALIFICABLES.has(b.tipo) ? i < indice : !!estado[i]?.resuelto;
            const libre = completada || i <= indice || hecho;
            return (
              <button
                key={i}
                type="button"
                disabled={!libre}
                onClick={() => ir(i)}
                aria-label={`Ir a la pantalla ${i + 1}`}
                className={`h-2 flex-1 rounded-full transition ${
                  i === indice ? "bg-navy-700" : hecho || i < indice ? "bg-lime-500" : "bg-navy-100"
                } ${libre ? "cursor-pointer hover:opacity-80" : "cursor-default"}`}
              />
            );
          })}
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-lime-50 px-3 py-1 text-xs font-extrabold text-lime-700">
          <IconSpark width={14} height={14} /> {ganados} pts
        </span>
        <span className="text-[11px] font-semibold text-navy-400">
          {indice + 1}/{bloques.length}
        </span>
      </div>

      <div key={indice} className="animate-fade-up p-5 sm:p-8">
        {bloque.dice && guia && <Globo guia={guia} texto={bloque.dice} />}
        <Pantalla
          bloque={bloque}
          clave={`${leccionId}-${indice}`}
          resuelto={resuelto}
          fallos={estado[indice]?.fallos ?? 0}
          onFallo={fallo}
          onAcierto={acierto}
          precision={precision}
          ganados={ganados}
          posibles={posibles}
          completada={completada}
          guardando={guardando}
          onCompletar={onCompletar}
          onReiniciar={reiniciar}
        />
      </div>

      {/* Navegación */}
      <div className="flex items-center gap-3 border-t border-navy-100 bg-white px-5 py-4">
        {indice > 0 ? (
          <button type="button" onClick={() => ir(indice - 1)} className="btn-ghost btn-sm">
            Anterior
          </button>
        ) : (
          <span />
        )}
        {!esUltimo && (
          <div className="ml-auto flex items-center gap-3">
            {!resuelto && <span className="hidden text-xs text-navy-400 sm:inline">Resuelva esta pantalla para continuar</span>}
            <button type="button" onClick={() => ir(indice + 1)} disabled={!resuelto} className="btn-lime">
              Continuar <IconArrowRight width={16} height={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ====================================================================== */
/*  Pantallas                                                              */
/* ====================================================================== */

type PropsPantalla = {
  bloque: Bloque;
  clave: string;
  resuelto: boolean;
  fallos: number;
  onFallo: () => void;
  onAcierto: () => void;
  precision: number;
  ganados: number;
  posibles: number;
  completada: boolean;
  guardando: boolean;
  onCompletar: () => void;
  onReiniciar: () => void;
};

function Pantalla(p: PropsPantalla) {
  const b = p.bloque;
  switch (b.tipo) {
    case "portada":
      return <Portada b={b} />;
    case "explicacion":
      return <Explicacion b={b} />;
    case "tarjetas":
      return <Tarjetas b={b} />;
    case "decision":
      return <Decision b={b} {...p} />;
    case "contrarreloj":
      return <Contrarreloj b={b} {...p} />;
    case "ordenar":
      return <Ordenar b={b} {...p} />;
    case "clasificar":
      return <Clasificar b={b} {...p} />;
    case "resumen":
      return <Resumen b={b} {...p} />;
  }
}

type De<T extends Bloque["tipo"]> = Extract<Bloque, { tipo: T }>;

function Etiqueta({ children, tono = "navy" }: { children: React.ReactNode; tono?: "navy" | "lima" | "rojo" }) {
  const c =
    tono === "lima" ? "bg-lime-100 text-lime-800" : tono === "rojo" ? "bg-red-100 text-red-700" : "bg-navy-100 text-navy-600";
  return <span className={`inline-block rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em] ${c}`}>{children}</span>;
}

function Globo({ guia, texto }: { guia: { nombre: string; rol: string }; texto: string }) {
  const iniciales = guia.nombre.split(" ").map((x) => x[0]).slice(0, 2).join("");
  return (
    <div className="mb-6 flex items-start gap-3">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-kg-gradient font-display text-sm font-extrabold text-lime-400 shadow-kg">
        {iniciales}
      </span>
      <div className="relative rounded-2xl rounded-tl-sm bg-white px-4 py-3 shadow-sm ring-1 ring-navy-100">
        <p className="text-[11px] font-bold text-navy-400">
          {guia.nombre} · <span className="font-semibold">{guia.rol}</span>
        </p>
        <p className="mt-0.5 text-sm leading-relaxed text-navy-700">{texto}</p>
      </div>
    </div>
  );
}

function Portada({ b }: { b: De<"portada"> }) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-kg-gradient p-7 text-white sm:p-10">
      <div className="pointer-events-none absolute inset-0 bg-kg-mesh opacity-80" />
      <div className="relative">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold text-lime-300">
          <IconClock width={13} height={13} /> {b.minutos} minutos · lección interactiva
        </span>
        <h3 className="mt-4 font-display text-3xl font-extrabold leading-tight sm:text-4xl">{b.titulo}</h3>
        {b.subtitulo && <p className="mt-3 max-w-2xl text-white/75">{b.subtitulo}</p>}
        <p className="mt-7 text-[11px] font-bold uppercase tracking-[0.16em] text-lime-300">Al terminar podrá</p>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {b.objetivos.map((o) => (
            <li key={o} className="flex items-start gap-2.5 rounded-xl bg-white/[0.07] p-3 text-sm text-white/90">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-lime-500 text-navy-900">
                <IconCheck width={11} height={11} strokeWidth={4} />
              </span>
              {o}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Explicacion({ b }: { b: De<"explicacion"> }) {
  return (
    <div className={b.ilustracion ? "grid items-start gap-7 lg:grid-cols-[1.1fr_1fr]" : ""}>
      <div>
        <h3 className="font-display text-2xl font-extrabold text-navy-700">{b.titulo}</h3>
        <div className="mt-4 space-y-3 text-[15px] leading-relaxed text-navy-600">
          {b.parrafos.map((t) => (
            <p key={t}>{t}</p>
          ))}
        </div>
        {b.clave && (
          <div className="mt-6 flex gap-3 rounded-2xl border-l-4 border-lime-500 bg-lime-50 p-4">
            <IconSpark width={20} height={20} className="mt-0.5 shrink-0 text-lime-600" />
            <p className="text-sm font-semibold leading-relaxed text-navy-700">{b.clave}</p>
          </div>
        )}
      </div>
      {b.ilustracion && <Ilustracion id={b.ilustracion} />}
      {b.puntos && (
        <div className={`mt-6 grid gap-3 sm:grid-cols-2 ${b.ilustracion ? "lg:col-span-2" : ""}`}>
          {b.puntos.map((x) => (
            <div key={x.titulo} className="rounded-2xl bg-white p-4 ring-1 ring-navy-100">
              <p className="font-display text-sm font-bold text-navy-700">{x.titulo}</p>
              <p className="mt-1 text-sm leading-relaxed text-navy-500">{x.texto}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Tarjetas({ b }: { b: De<"tarjetas"> }) {
  const [volteadas, setVolteadas] = useState<Set<number>>(new Set());
  return (
    <div>
      <Etiqueta>Tarjetas</Etiqueta>
      <h3 className="mt-3 font-display text-2xl font-extrabold text-navy-700">{b.titulo}</h3>
      <p className="mt-2 text-sm text-navy-500">{b.instruccion ?? "Toque cada tarjeta para descubrir la respuesta."}</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {b.tarjetas.map((t, i) => {
          const v = volteadas.has(i);
          return (
            <button
              key={i}
              type="button"
              aria-pressed={v}
              onClick={() => setVolteadas((s) => new Set(s).add(i))}
              className="kg-tarjeta group h-44 text-left [perspective:1000px]"
            >
              <span className={`kg-tarjeta__cara relative block h-full w-full ${v ? "kg-volteada" : ""}`}>
                <span className="kg-frente absolute inset-0 flex flex-col justify-between rounded-2xl bg-white p-5 shadow-sm ring-1 ring-navy-100 transition group-hover:ring-lime-400">
                  <span className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-red-500">{t.etiqueta ?? "¿Qué cree?"}</span>
                  <span className="font-display text-base font-bold leading-snug text-navy-700">{t.frente}</span>
                  <span className="text-[11px] font-semibold text-navy-300">Toque para voltear</span>
                </span>
                <span className="kg-reverso absolute inset-0 flex flex-col justify-center rounded-2xl bg-kg-gradient p-5 text-white shadow-kg">
                  <span className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-lime-300">La respuesta</span>
                  <span className="mt-2 text-sm leading-relaxed">{t.reverso}</span>
                </span>
              </span>
            </button>
          );
        })}
      </div>
      <p className="mt-4 text-xs font-semibold text-navy-400">
        {volteadas.size} de {b.tarjetas.length} descubiertas
      </p>
    </div>
  );
}

function Opciones({
  opciones,
  clave,
  resuelto,
  onElegir,
  elegidas,
  bloqueadas,
}: {
  opciones: { texto: string; correcta?: boolean; retro: string }[];
  clave: string;
  resuelto: boolean;
  onElegir: (i: number) => void;
  elegidas: Set<number>;
  bloqueadas: boolean;
}) {
  const orden = useMemo(() => barajar(opciones.map((_, i) => i), clave), [opciones, clave]);
  return (
    <div className="mt-5 grid gap-3">
      {orden.map((i) => {
        const o = opciones[i];
        const elegida = elegidas.has(i);
        const mostrarBien = resuelto && o.correcta;
        const mal = elegida && !o.correcta;
        return (
          <button
            key={i}
            type="button"
            disabled={resuelto || mal || bloqueadas}
            onClick={() => onElegir(i)}
            className={`flex items-start gap-3 rounded-2xl border-2 px-4 py-3.5 text-left text-sm font-semibold transition ${
              mostrarBien
                ? "border-lime-500 bg-lime-50 text-navy-800"
                : mal
                  ? "kg-sacudir border-red-300 bg-red-50 text-red-700"
                  : "border-navy-100 bg-white text-navy-700 hover:-translate-y-0.5 hover:border-navy-300 hover:shadow-sm disabled:hover:translate-y-0"
            }`}
          >
            <span
              className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                mostrarBien ? "bg-lime-500 text-white" : mal ? "bg-red-500 text-white" : "bg-navy-100 text-navy-500"
              }`}
            >
              {mostrarBien ? <IconCheck width={12} height={12} strokeWidth={4} /> : mal ? <IconX width={12} height={12} strokeWidth={3} /> : null}
            </span>
            <span className="flex-1">{o.texto}</span>
          </button>
        );
      })}
    </div>
  );
}

function Retro({ ok, texto, puntos, titulo }: { ok: boolean; texto: string; puntos?: number; titulo?: string }) {
  return (
    <div
      role="status"
      className={`mt-5 flex items-start gap-3 rounded-2xl p-4 text-sm leading-relaxed ${
        ok ? "bg-lime-500 text-navy-900" : "bg-red-50 text-red-800 ring-1 ring-red-200"
      }`}
    >
      <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${ok ? "bg-navy-900 text-lime-400" : "bg-red-500 text-white"}`}>
        {ok ? <IconCheck width={12} height={12} strokeWidth={4} /> : <IconX width={12} height={12} strokeWidth={3} />}
      </span>
      <div className="flex-1">
        <p className="font-bold">{titulo ?? (ok ? "¡Correcto!" : "No es la mejor opción")}</p>
        <p className="mt-0.5">{texto}</p>
      </div>
      {ok && puntos !== undefined && (
        <span className="kg-puntos shrink-0 rounded-full bg-navy-900 px-3 py-1 text-xs font-extrabold text-lime-400">+{puntos}</span>
      )}
    </div>
  );
}

function Situacion({ titulo, situacion, pregunta }: { titulo?: string; situacion: string; pregunta: string }) {
  return (
    <>
      {titulo && <h3 className="mt-3 font-display text-2xl font-extrabold text-navy-700">{titulo}</h3>}
      <div className="mt-4 rounded-2xl border border-navy-100 bg-white p-5">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-navy-400">Situación</p>
        <p className="mt-1.5 text-[15px] leading-relaxed text-navy-700">{situacion}</p>
      </div>
      <p className="mt-5 font-display text-lg font-bold text-navy-700">{pregunta}</p>
    </>
  );
}

function Decision({ b, clave, resuelto, fallos, onFallo, onAcierto }: { b: De<"decision"> } & PropsPantalla) {
  const [elegidas, setElegidas] = useState<Set<number>>(new Set());
  const [ultima, setUltima] = useState<number | null>(null);
  const correcta = b.opciones.findIndex((o) => o.correcta);

  function elegir(i: number) {
    setElegidas((s) => new Set(s).add(i));
    setUltima(i);
    if (b.opciones[i].correcta) onAcierto();
    else onFallo();
  }
  const mostrar = ultima ?? (resuelto ? correcta : null);

  return (
    <div className={b.ilustracion ? "grid items-start gap-7 lg:grid-cols-[1.2fr_1fr]" : ""}>
      <div>
        <Etiqueta tono="lima">Usted decide</Etiqueta>
        <Situacion titulo={b.titulo} situacion={b.situacion} pregunta={b.pregunta} />
        <Opciones opciones={b.opciones} clave={clave} resuelto={resuelto} onElegir={elegir} elegidas={elegidas} bloqueadas={false} />
        {mostrar !== null && (
          <Retro ok={!!b.opciones[mostrar].correcta} texto={b.opciones[mostrar].retro} puntos={b.opciones[mostrar].correcta ? puntosDe(fallos) : undefined} />
        )}
      </div>
      {b.ilustracion && <Ilustracion id={b.ilustracion} />}
    </div>
  );
}

function Contrarreloj({ b, clave, resuelto, fallos, onFallo, onAcierto }: { b: De<"contrarreloj"> } & PropsPantalla) {
  const [fase, setFase] = useState<"lista" | "corriendo" | "agotado" | "fallo">(resuelto ? "corriendo" : "lista");
  const [restante, setRestante] = useState(b.segundos);
  const [elegidas, setElegidas] = useState<Set<number>>(new Set());
  const [ultima, setUltima] = useState<number | null>(null);

  useEffect(() => {
    if (fase !== "corriendo" || resuelto) return;
    if (restante <= 0) {
      setFase("agotado");
      onFallo();
      return;
    }
    const t = setTimeout(() => setRestante((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [fase, restante, resuelto, onFallo]);

  function empezar() {
    setRestante(b.segundos);
    setElegidas(new Set());
    setUltima(null);
    setFase("corriendo");
  }
  function elegir(i: number) {
    setUltima(i);
    setElegidas((s) => new Set(s).add(i));
    if (b.opciones[i].correcta) onAcierto();
    else {
      onFallo();
      setFase("fallo");
    }
  }

  const pct = (restante / b.segundos) * 100;
  const urgente = restante <= Math.ceil(b.segundos / 3);

  return (
    <div>
      <Etiqueta tono="rojo">Contrarreloj · {b.segundos} segundos</Etiqueta>
      {fase === "lista" && !resuelto ? (
        <div className="mt-4 rounded-2xl bg-kg-gradient p-8 text-center text-white">
          {b.titulo && <p className="font-display text-2xl font-extrabold">{b.titulo}</p>}
          <p className="mx-auto mt-3 max-w-lg text-white/75">
            En una emergencia no hay tiempo para pensarlo dos veces. Tendrá {b.segundos} segundos para decidir.
          </p>
          <button type="button" onClick={empezar} className="btn-lime mt-6">
            Estoy listo <IconClock width={16} height={16} />
          </button>
        </div>
      ) : (
        <>
          {!resuelto && (
            <div className="mt-4 flex items-center gap-3">
              <div className="h-3 flex-1 overflow-hidden rounded-full bg-navy-100">
                <div
                  className={`h-full rounded-full transition-[width] duration-1000 ease-linear ${urgente ? "bg-red-500" : "bg-lime-500"}`}
                  style={{ width: `${fase === "corriendo" ? pct : 0}%` }}
                />
              </div>
              <span className={`w-12 text-right font-mono text-lg font-extrabold ${urgente ? "text-red-600" : "text-navy-700"}`}>
                {fase === "corriendo" ? restante : 0}s
              </span>
            </div>
          )}
          <Situacion situacion={b.situacion} pregunta={b.pregunta} />
          <Opciones
            opciones={b.opciones}
            clave={clave}
            resuelto={resuelto}
            onElegir={elegir}
            elegidas={elegidas}
            bloqueadas={fase !== "corriendo"}
          />
          {fase === "agotado" && !resuelto && (
            <div className="mt-5 rounded-2xl bg-amber-50 p-4 text-sm text-amber-900 ring-1 ring-amber-200">
              <p className="font-bold">Se acabó el tiempo</p>
              <p className="mt-0.5">{b.alAgotar}</p>
            </div>
          )}
          {ultima !== null && <Retro ok={!!b.opciones[ultima].correcta} texto={b.opciones[ultima].retro} puntos={b.opciones[ultima].correcta ? puntosDe(fallos) : undefined} />}
          {(fase === "agotado" || fase === "fallo") && !resuelto && (
            <button type="button" onClick={empezar} className="btn-outline mt-4">
              Intentar otra vez
            </button>
          )}
        </>
      )}
    </div>
  );
}

function Ordenar({ b, clave, resuelto, fallos, onFallo, onAcierto }: { b: De<"ordenar"> } & PropsPantalla) {
  const inicial = useMemo(() => {
    const idx = b.pasos.map((_, i) => i);
    let r = barajar(idx, clave);
    // Que nunca arranque ya ordenado.
    if (r.every((v, i) => v === i)) r = [...r.slice(1), r[0]];
    return r;
  }, [b.pasos, clave]);
  const [orden, setOrden] = useState<number[]>(resuelto ? b.pasos.map((_, i) => i) : inicial);
  const [revisado, setRevisado] = useState(false);

  function mover(pos: number, d: -1 | 1) {
    const dest = pos + d;
    if (dest < 0 || dest >= orden.length) return;
    const n = [...orden];
    [n[pos], n[dest]] = [n[dest], n[pos]];
    setOrden(n);
    setRevisado(false);
  }
  function comprobar() {
    setRevisado(true);
    if (orden.every((v, i) => v === i)) onAcierto();
    else onFallo();
  }
  const enSuLugar = orden.filter((v, i) => v === i).length;

  return (
    <div>
      <Etiqueta tono="lima">Ordene los pasos</Etiqueta>
      <h3 className="mt-3 font-display text-2xl font-extrabold text-navy-700">{b.titulo}</h3>
      <p className="mt-2 text-sm text-navy-500">{b.instruccion}</p>
      <ol className="mt-5 space-y-2.5">
        {orden.map((paso, pos) => {
          const bien = (revisado || resuelto) && paso === pos;
          const mal = revisado && !resuelto && paso !== pos;
          return (
            <li
              key={paso}
              className={`flex items-center gap-3 rounded-2xl border-2 bg-white px-4 py-3 transition ${
                bien ? "border-lime-500 bg-lime-50" : mal ? "border-red-300 bg-red-50" : "border-navy-100"
              }`}
            >
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl font-display text-sm font-extrabold ${
                  bien ? "bg-lime-500 text-white" : "bg-navy-700 text-lime-400"
                }`}
              >
                {pos + 1}
              </span>
              <span className="flex-1 text-sm font-semibold text-navy-700">{b.pasos[paso]}</span>
              {!resuelto && (
                <span className="flex shrink-0 gap-1">
                  <button type="button" onClick={() => mover(pos, -1)} disabled={pos === 0} aria-label="Subir" className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy-50 text-navy-600 transition hover:bg-navy-100 disabled:opacity-30">↑</button>
                  <button type="button" onClick={() => mover(pos, 1)} disabled={pos === orden.length - 1} aria-label="Bajar" className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy-50 text-navy-600 transition hover:bg-navy-100 disabled:opacity-30">↓</button>
                </span>
              )}
            </li>
          );
        })}
      </ol>
      {!resuelto && (
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button type="button" onClick={comprobar} className="btn-primary">
            Comprobar orden
          </button>
          {revisado && (
            <span className="text-sm font-semibold text-red-600">
              {enSuLugar} de {orden.length} en su lugar. Ajuste y vuelva a comprobar.
            </span>
          )}
        </div>
      )}
      {resuelto && <Retro ok texto={b.explicacion} puntos={puntosDe(fallos)} />}
    </div>
  );
}

function Clasificar({ b, clave, resuelto, fallos, onFallo, onAcierto }: { b: De<"clasificar"> } & PropsPantalla) {
  const orden = useMemo(() => barajar(b.elementos.map((_, i) => i), clave), [b.elementos, clave]);
  const [ubicados, setUbicados] = useState<Set<number>>(resuelto ? new Set(orden) : new Set());
  const [error, setError] = useState<string | null>(null);
  const [sacudir, setSacudir] = useState(0);
  const pendientes = orden.filter((i) => !ubicados.has(i));
  const actual = pendientes[0];

  function ubicar(cat: string) {
    if (actual === undefined) return;
    const e = b.elementos[actual];
    if (e.categoria === cat) {
      const n = new Set(ubicados).add(actual);
      setUbicados(n);
      setError(null);
      if (n.size === b.elementos.length) onAcierto();
    } else {
      const nombre = b.categorias.find((c) => c.id === e.categoria)?.nombre ?? "";
      setError(e.porque ?? `Este va en «${nombre}».`);
      setSacudir((x) => x + 1);
      onFallo();
    }
  }

  return (
    <div>
      <Etiqueta tono="lima">Clasifique</Etiqueta>
      <h3 className="mt-3 font-display text-2xl font-extrabold text-navy-700">{b.titulo}</h3>
      <p className="mt-2 text-sm text-navy-500">{b.instruccion}</p>

      {!resuelto && actual !== undefined && (
        <div className="mt-6 text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-navy-400">
            {b.elementos.length - pendientes.length + 1} de {b.elementos.length}
          </p>
          <div key={`${actual}-${sacudir}`} className={`mx-auto mt-2 max-w-md rounded-2xl bg-white px-6 py-5 font-display text-lg font-bold text-navy-700 shadow-kg ring-1 ring-navy-100 ${sacudir ? "kg-sacudir" : "animate-fade-up"}`}>
            {b.elementos[actual].texto}
          </div>
          {error && <p className="mx-auto mt-3 max-w-md rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-700 ring-1 ring-red-200">{error}</p>}
        </div>
      )}

      <div className={`mt-6 grid gap-3 ${b.categorias.length >= 4 ? "sm:grid-cols-2 lg:grid-cols-4" : b.categorias.length === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
        {b.categorias.map((c) => {
          const dentro = orden.filter((i) => ubicados.has(i) && b.elementos[i].categoria === c.id);
          return (
            <div key={c.id} className="flex flex-col rounded-2xl bg-white ring-1 ring-navy-100">
              <button
                type="button"
                disabled={resuelto || actual === undefined}
                onClick={() => ubicar(c.id)}
                className="rounded-t-2xl bg-navy-700 px-4 py-3 text-left transition enabled:hover:bg-navy-600 disabled:cursor-default"
              >
                <span className="block font-display text-sm font-extrabold text-white">{c.nombre}</span>
                {c.pista && <span className="block text-[11px] text-white/60">{c.pista}</span>}
              </button>
              <ul className="min-h-[56px] space-y-1.5 p-3">
                {dentro.map((i) => (
                  <li key={i} className="flex items-start gap-2 rounded-lg bg-lime-50 px-2.5 py-1.5 text-xs font-semibold text-navy-700">
                    <IconCheck width={12} height={12} strokeWidth={4} className="mt-0.5 shrink-0 text-lime-600" />
                    {b.elementos[i].texto}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
      {resuelto && (
        <Retro
          ok
          titulo={fallos === 0 ? "¡Perfecto!" : "¡Listo!"}
          texto={
            fallos === 0
              ? "Clasificó todo correctamente al primer intento."
              : `Terminó la clasificación con ${fallos} ${fallos === 1 ? "error" : "errores"} en el camino. Repase los que se le escaparon.`
          }
          puntos={puntosDe(fallos, "clasificar")}
        />
      )}
    </div>
  );
}

function Resumen({ b, precision, ganados, posibles, completada, guardando, onCompletar, onReiniciar }: { b: De<"resumen"> } & PropsPantalla) {
  const nivel = precision >= 90 ? "Dominio experto" : precision >= 70 ? "Dominio sólido" : "En práctica";
  return (
    <div className="relative">
      <Confeti />
      <div className="relative overflow-hidden rounded-2xl bg-kg-gradient p-7 text-center text-white sm:p-10">
        <div className="pointer-events-none absolute inset-0 bg-kg-mesh opacity-80" />
        <div className="relative">
          <span className="kg-insignia mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-lime-500 text-navy-900 shadow-kg-lg">
            <IconAward width={38} height={38} />
          </span>
          <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.18em] text-lime-300">Insignia obtenida</p>
          <h3 className="mt-1 font-display text-3xl font-extrabold">{b.insignia}</h3>
          {posibles > 0 && (
            <div className="mx-auto mt-6 grid max-w-md grid-cols-3 gap-3">
              {[
                ["Puntos", `${ganados}/${posibles}`],
                ["Precisión", `${precision}%`],
                ["Nivel", nivel],
              ].map(([k, v]) => (
                <div key={k} className="rounded-xl bg-white/10 p-3">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-white/60">{k}</p>
                  <p className="mt-0.5 font-display text-sm font-extrabold text-white">{v}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <h4 className="mt-7 font-display text-xl font-extrabold text-navy-700">{b.titulo}</h4>
      <ul className="mt-4 grid gap-2.5">
        {b.puntos.map((x) => (
          <li key={x} className="flex items-start gap-3 rounded-2xl bg-white p-4 text-sm font-semibold text-navy-700 ring-1 ring-navy-100">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-lime-500 text-white">
              <IconCheck width={11} height={11} strokeWidth={4} />
            </span>
            {x}
          </li>
        ))}
      </ul>
      {b.cierre && <p className="mt-5 text-sm italic leading-relaxed text-navy-500">{b.cierre}</p>}

      <div className="mt-7 flex flex-wrap items-center gap-3">
        {completada ? (
          <span className="inline-flex items-center gap-2 text-sm font-bold text-lime-700">
            <IconCheck width={16} height={16} strokeWidth={3} /> Lección completada
          </span>
        ) : (
          <button type="button" onClick={onCompletar} disabled={guardando} className="btn-lime">
            {guardando ? "Guardando..." : "Completar la lección"} <IconCheck width={16} height={16} strokeWidth={3} />
          </button>
        )}
        <button type="button" onClick={onReiniciar} className="btn-ghost btn-sm">
          Repetir la práctica
        </button>
      </div>
    </div>
  );
}

/* ---------------------------- Efectos visuales ---------------------------- */

function Confeti() {
  const piezas = useMemo(() => {
    const azar = semilla("confeti");
    const colores = ["#8FBF16", "#A5CE30", "#0A2D4D", "#F59E0B", "#ffffff"];
    return Array.from({ length: 26 }, (_, i) => ({
      left: `${Math.round(azar() * 100)}%`,
      delay: `${(azar() * 0.6).toFixed(2)}s`,
      dur: `${(1.6 + azar() * 1.2).toFixed(2)}s`,
      color: colores[i % colores.length],
      rot: Math.round(azar() * 360),
    }));
  }, []);
  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 z-10 h-0">
      {piezas.map((p, i) => (
        <span
          key={i}
          className="kg-confeti absolute top-0 block h-3 w-2 rounded-sm"
          style={{ left: p.left, background: p.color, animationDelay: p.delay, animationDuration: p.dur, transform: `rotate(${p.rot}deg)` }}
        />
      ))}
    </div>
  );
}

/** Animaciones propias del motor. Quien prefiere menos movimiento no las ve. */
function EstilosLeccion() {
  return (
    <style>{`
      .kg-tarjeta__cara { transition: transform .6s cubic-bezier(.2,.8,.2,1); transform-style: preserve-3d; }
      .kg-volteada { transform: rotateY(180deg); }
      .kg-frente, .kg-reverso { backface-visibility: hidden; -webkit-backface-visibility: hidden; }
      .kg-reverso { transform: rotateY(180deg); }
      @keyframes kg-sacudir { 10%,90%{transform:translateX(-1px)} 20%,80%{transform:translateX(3px)} 30%,50%,70%{transform:translateX(-6px)} 40%,60%{transform:translateX(6px)} }
      .kg-sacudir { animation: kg-sacudir .45s both; }
      @keyframes kg-caer { 0%{opacity:0; transform:translateY(-20px) rotate(0)} 10%{opacity:1} 100%{opacity:0; transform:translateY(420px) rotate(540deg)} }
      .kg-confeti { animation-name: kg-caer; animation-timing-function: cubic-bezier(.25,.6,.4,1); animation-fill-mode: both; }
      @keyframes kg-latir { 0%{transform:scale(.4); opacity:0} 60%{transform:scale(1.12); opacity:1} 100%{transform:scale(1)} }
      .kg-insignia { animation: kg-latir .7s cubic-bezier(.2,.9,.3,1.3) both; }
      @keyframes kg-subir { 0%{transform:translateY(8px); opacity:0} 100%{transform:none; opacity:1} }
      .kg-puntos { animation: kg-subir .4s ease-out both; }
      @media (prefers-reduced-motion: reduce) {
        .kg-tarjeta__cara, .kg-sacudir, .kg-confeti, .kg-insignia, .kg-puntos { animation: none !important; transition: none !important; }
        .kg-confeti { display: none; }
      }
    `}</style>
  );
}
