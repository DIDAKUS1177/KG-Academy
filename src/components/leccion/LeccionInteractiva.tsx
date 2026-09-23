"use client";

/**
 * MOTOR DE LECCIONES INTERACTIVAS · MODO JUEGO
 *
 * Cada lección es un NIVEL: una secuencia de pantallas con reglas de
 * videojuego.
 *   - 3 vidas. Cada decisión equivocada cuesta una vida; al clasificar, solo el
 *     primer error de la pantalla, y en la cacería de riesgos los toques
 *     fallidos solo restan XP. Sin vidas, el nivel se reinicia.
 *   - XP: 10 al primer intento, 6 al segundo, 2 después. La cacería de riesgos
 *     y la clasificación descuentan por cada error.
 *   - Racha: resolver pantallas seguidas sin errores suma XP extra.
 *   - Estrellas al terminar (1 a 3 según la precisión), que se ven en el mapa
 *     del curso.
 *   - Efectos de sonido sintetizados, con botón para silenciar.
 *
 * El avance se recuerda en el navegador: si el trabajador cierra la pestaña,
 * vuelve a la pantalla donde iba. Un nivel ya completado se abre en modo
 * repaso, con todas las pantallas libres y sin vidas en juego.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Bloque, LeccionInteractiva as Leccion } from "@/lib/leccion-interactiva";
import { BLOQUES_CALIFICABLES } from "@/lib/leccion-interactiva";
import { barajar, semilla } from "@/lib/barajar";
import { fijarSonido, sfx, sonidoActivo } from "@/lib/sonidos";
import { Ilustracion } from "./Ilustraciones";
import { Escena, TITULO_ESCENA } from "./Escenas";
import { Avatar } from "./Avatares";
import { IconArrowRight, IconCheck, IconClock, IconFire, IconSpark, IconX } from "@/components/Icons";

type Estado = { resuelto: boolean; fallos: number; vidaPerdida?: boolean; bonus?: number };
type Guardado = { indice: number; estado: Record<number, Estado>; vidas?: number; racha?: number };
/** vida: true = cuesta una vida; "primera" = solo el primer error de la pantalla; false = no cuesta. */
type FalloOpc = { vida?: boolean | "primera"; cantidad?: number };

export const VIDAS = 3;
const PUNTOS_MAX = 10;
const BONUS_RACHA = 3;

/** XP de una pantalla según los errores cometidos en ella. */
const puntosDe = (fallos: number, tipo?: string) =>
  tipo === "clasificar"
    ? Math.max(2, PUNTOS_MAX - fallos * 2)
    : tipo === "buscar"
      ? Math.max(2, PUNTOS_MAX - fallos)
      : fallos === 0 ? 10 : fallos === 1 ? 6 : 2;

export const estrellasDe = (precision: number) => (precision >= 90 ? 3 : precision >= 70 ? 2 : 1);
export const claveEstrellas = (leccionId: string) => `kg-estrellas-${leccionId}`;

export function LeccionInteractiva({
  leccionId,
  contenido,
  completada,
  guardando,
  nivel,
  onTerminar,
  onCompletar,
}: {
  leccionId: string;
  contenido: Leccion;
  completada: boolean;
  guardando: boolean;
  /** Número del nivel en el curso y nombre de su mundo (módulo). */
  nivel?: { numero: number; total: number; mundo: string };
  /** Se llama una vez, al llegar al final con todo resuelto. */
  onTerminar: () => void;
  /** Botón final de la lección. */
  onCompletar: () => void;
}) {
  const { bloques, guia } = contenido;
  const clave = `kg-li-${leccionId}`;
  const [indice, setIndice] = useState(0);
  const [estado, setEstado] = useState<Record<number, Estado>>({});
  const [vidas, setVidas] = useState(VIDAS);
  const [racha, setRacha] = useState(0);
  const [cargado, setCargado] = useState(false);
  const [sonido, setSonido] = useState(true);
  const [aviso, setAviso] = useState<{ id: number; texto: string } | null>(null);
  const raiz = useRef<HTMLDivElement>(null);
  const avisado = useRef(false);

  // Espejo del estado para decidir sonidos y rachas fuera de los setState.
  const ref = useRef({ estado, vidas, racha, indice });
  ref.current = { estado, vidas, racha, indice };

  // Recupera el avance guardado (solo en el navegador).
  useEffect(() => {
    try {
      const g = JSON.parse(localStorage.getItem(clave) ?? "null") as Guardado | null;
      if (g && typeof g.indice === "number") {
        setEstado(g.estado ?? {});
        setIndice(Math.min(g.indice, bloques.length - 1));
        setVidas(g.vidas ?? VIDAS);
        setRacha(g.racha ?? 0);
      }
    } catch {
      /* Sin almacenamiento disponible: se arranca de cero. */
    }
    setSonido(sonidoActivo());
    setCargado(true);
  }, [clave, bloques.length]);

  useEffect(() => {
    if (!cargado) return;
    try {
      localStorage.setItem(clave, JSON.stringify({ indice, estado, vidas, racha } satisfies Guardado));
    } catch {
      /* Ignorado. */
    }
  }, [cargado, clave, indice, estado, vidas, racha]);

  const calificables = useMemo(
    () => bloques.map((b, i) => (BLOQUES_CALIFICABLES.has(b.tipo) ? i : -1)).filter((i) => i >= 0),
    [bloques]
  );
  const ganados = calificables.reduce(
    (s, i) => s + (estado[i]?.resuelto ? puntosDe(estado[i].fallos, bloques[i].tipo) : 0),
    0
  );
  const bonus = calificables.reduce((s, i) => s + (estado[i]?.bonus ?? 0), 0);
  const xp = ganados + bonus;
  const posibles = calificables.length * PUNTOS_MAX;
  const precision = posibles ? Math.round((ganados / posibles) * 100) : 100;
  const todoResuelto = calificables.every((i) => estado[i]?.resuelto);

  const bloque = bloques[indice];
  const esCalificable = BLOQUES_CALIFICABLES.has(bloque.tipo);
  const resuelto = completada || !esCalificable || !!estado[indice]?.resuelto;
  const esUltimo = indice === bloques.length - 1;
  const sinVidas = !completada && vidas <= 0;

  useEffect(() => {
    if (esUltimo && !avisado.current) {
      avisado.current = true;
      onTerminar();
    }
  }, [esUltimo, onTerminar]);

  // Guarda las estrellas del nivel para el mapa del curso.
  useEffect(() => {
    if (!cargado || !esUltimo || completada || !todoResuelto) return;
    try {
      const k = claveEstrellas(leccionId);
      const antes = Number(localStorage.getItem(k) ?? 0);
      localStorage.setItem(k, String(Math.max(antes, estrellasDe(precision))));
    } catch {
      /* Ignorado. */
    }
  }, [cargado, esUltimo, completada, todoResuelto, leccionId, precision]);

  const ir = useCallback((n: number) => {
    setIndice(n);
    raiz.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const avisar = useCallback((texto: string) => {
    const id = Date.now();
    setAviso({ id, texto });
    setTimeout(() => setAviso((a) => (a?.id === id ? null : a)), 1800);
  }, []);

  const fallo = useCallback(
    (o: FalloOpc = {}) => {
      const { estado: e, vidas: v, indice: i } = ref.current;
      const actual = e[i] ?? { resuelto: false, fallos: 0 };
      const regla = o.vida ?? true;
      const cuestaVida = !completada && (regla === true || (regla === "primera" && !actual.vidaPerdida));
      const nuevo: Estado = {
        ...actual,
        resuelto: false,
        fallos: actual.fallos + (o.cantidad ?? 1),
        vidaPerdida: actual.vidaPerdida || cuestaVida,
      };
      // El espejo se actualiza ya: un acierto inmediato (p. ej. "mostrar
      // todos") debe ver estos fallos aunque React no haya vuelto a dibujar.
      ref.current = { ...ref.current, estado: { ...e, [i]: nuevo }, racha: 0, vidas: cuestaVida ? v - 1 : v };
      setEstado((x) => ({ ...x, [i]: nuevo }));
      setRacha(0);
      if (cuestaVida) {
        const quedan = v - 1;
        setVidas(quedan);
        if (quedan <= 0) {
          sfx.derrota();
          raiz.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }
        else sfx.error();
      } else sfx.error();
    },
    [completada]
  );

  const acierto = useCallback(() => {
    const { estado: e, racha: r, indice: i } = ref.current;
    const actual = e[i] ?? { resuelto: false, fallos: 0 };
    if (actual.resuelto) return;
    const limpio = actual.fallos === 0;
    const nueva = limpio ? r + 1 : 0;
    const extra = limpio && nueva >= 2 ? BONUS_RACHA : 0;
    ref.current = { ...ref.current, estado: { ...e, [i]: { ...actual, resuelto: true, bonus: extra } }, racha: nueva };
    setEstado((x) => ({ ...x, [i]: { ...actual, resuelto: true, bonus: extra } }));
    setRacha(nueva);
    if (extra) {
      sfx.racha();
      avisar(`¡Racha x${nueva}! +${extra} XP extra`);
    } else sfx.acierto();
  }, [avisar]);

  function reiniciar() {
    try {
      localStorage.removeItem(clave);
    } catch {
      /* Ignorado. */
    }
    setEstado({});
    setVidas(VIDAS);
    setRacha(0);
    avisado.current = false;
    ir(0);
  }

  function alternarSonido() {
    const n = !sonido;
    setSonido(n);
    fijarSonido(n);
    if (n) sfx.clic();
  }

  function continuar() {
    sfx.clic();
    ir(indice + 1);
  }

  return (
    <div ref={raiz} className="relative scroll-mt-24 overflow-hidden rounded-3xl border-2 border-navy-900 bg-cloud shadow-kg-lg">
      <EstilosLeccion />

      {/* HUD */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-3 bg-navy-900 px-4 py-3 text-white sm:px-5">
        {nivel && (
          <div className="flex items-center gap-2">
            <span className="rounded-lg bg-lime-500 px-2.5 py-1 font-display text-xs font-extrabold tracking-wide text-navy-900">
              NIVEL {nivel.numero}
            </span>
            <span className="hidden max-w-[180px] truncate text-[11px] font-semibold text-white/50 md:inline">{nivel.mundo}</span>
          </div>
        )}
        <div className="flex min-w-[140px] flex-1 gap-1" aria-label={`Pantalla ${indice + 1} de ${bloques.length}`}>
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
                className={`h-2.5 flex-1 rounded-full transition ${
                  i === indice ? "bg-white" : hecho || i < indice ? "bg-lime-400" : "bg-white/15"
                } ${libre ? "cursor-pointer hover:opacity-80" : "cursor-default"}`}
              />
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          {!completada && (
            <span className="flex items-center gap-0.5" aria-label={`Vidas: ${vidas} de ${VIDAS}`} role="img">
              {Array.from({ length: VIDAS }, (_, i) => (
                <Corazon key={i} lleno={i < vidas} />
              ))}
            </span>
          )}
          {racha >= 2 && (
            <span className="kg-pop inline-flex items-center gap-1 rounded-full bg-orange-500/20 px-2 py-1 text-[11px] font-extrabold text-orange-300" title="Racha de pantallas sin errores">
              <IconFire width={13} height={13} /> x{racha}
            </span>
          )}
          <span key={xp} className="kg-pop inline-flex items-center gap-1.5 rounded-full bg-lime-400/15 px-3 py-1 text-xs font-extrabold text-lime-300">
            <IconSpark width={14} height={14} /> {xp} XP
          </span>
          <button
            type="button"
            onClick={alternarSonido}
            aria-label={sonido ? "Silenciar efectos de sonido" : "Activar efectos de sonido"}
            aria-pressed={sonido}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white/80 transition hover:bg-white/20"
          >
            <Parlante activo={sonido} />
          </button>
        </div>
      </div>

      {aviso && (
        <div key={aviso.id} role="status" className="kg-toast pointer-events-none absolute left-1/2 top-16 z-30 -translate-x-1/2 rounded-full bg-orange-500 px-5 py-2 font-display text-sm font-extrabold text-white shadow-kg-lg">
          {aviso.texto}
        </div>
      )}

      <div key={indice} className="animate-fade-up p-4 sm:p-8">
        {bloque.dice && guia && <Globo guia={guia} texto={bloque.dice} />}
        <Pantalla
          bloque={bloque}
          clave={`${leccionId}-${indice}`}
          resuelto={resuelto}
          fallos={estado[indice]?.fallos ?? 0}
          onFallo={fallo}
          onAcierto={acierto}
          onSiguiente={continuar}
          precision={precision}
          ganados={ganados}
          xp={xp}
          vidas={vidas}
          posibles={posibles}
          completada={completada}
          guardando={guardando}
          nivel={nivel}
          guia={guia}
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
            {!resuelto && <span className="hidden text-xs text-navy-400 sm:inline">Supere esta pantalla para continuar</span>}
            <button type="button" onClick={continuar} disabled={!resuelto} className="btn-lime">
              Continuar <IconArrowRight width={16} height={16} />
            </button>
          </div>
        )}
      </div>

      {sinVidas && <FinDelJuego onReintentar={reiniciar} />}
    </div>
  );
}

/* ====================================================================== */
/*  Piezas del HUD                                                         */
/* ====================================================================== */

function Corazon({ lleno }: { lleno: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className={`h-5 w-5 ${lleno ? "" : "kg-corazon-roto"}`} aria-hidden>
      <path
        d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 3 4.5 6.6 4.5c2.1 0 3.6 1.2 4.4 2.6.8-1.4 2.3-2.6 4.4-2.6 3.6 0 5.7 3.9 4.2 7.3C19.5 16.4 12 21 12 21z"
        fill={lleno ? "#FF4D5E" : "rgba(255,255,255,.14)"}
        stroke={lleno ? "#FF8A95" : "rgba(255,255,255,.2)"}
        strokeWidth="1.2"
      />
      {lleno && <ellipse cx="8" cy="9" rx="2" ry="1.3" fill="#fff" opacity=".55" />}
    </svg>
  );
}

function Parlante({ activo }: { activo: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
      <path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor" stroke="none" />
      {activo ? (
        <>
          <path d="M16 9a4 4 0 0 1 0 6" />
          <path d="M18.5 6.5a8 8 0 0 1 0 11" />
        </>
      ) : (
        <path d="M17 9l5 6M22 9l-5 6" />
      )}
    </svg>
  );
}

function FinDelJuego({ onReintentar }: { onReintentar: () => void }) {
  return (
    <div className="absolute inset-0 z-40 flex items-start justify-center bg-navy-900/85 p-6 pt-24 backdrop-blur-sm">
      <div role="alertdialog" aria-labelledby="kg-fin-titulo" className="kg-pop max-w-md rounded-3xl bg-white p-8 text-center shadow-kg-lg">
        <div className="mx-auto flex w-fit gap-1">
          {Array.from({ length: VIDAS }, (_, i) => (
            <Corazon key={i} lleno={false} />
          ))}
        </div>
        <p className="mt-4 text-[11px] font-extrabold uppercase tracking-[0.2em] text-red-500">Fin del juego</p>
        <h3 id="kg-fin-titulo" className="mt-1 font-display text-3xl font-extrabold text-navy-700">
          Se quedó sin vidas
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-navy-500">
          En una emergencia real no hay segundas oportunidades; aquí sí. Ya vio dónde estaban las trampas: vuelva a
          intentar el nivel desde el comienzo.
        </p>
        <button type="button" onClick={onReintentar} className="btn-lime mt-6 w-full py-3 text-base" autoFocus>
          Reintentar el nivel
        </button>
      </div>
    </div>
  );
}

/* ====================================================================== */
/*  Pantallas                                                              */
/* ====================================================================== */

type Guia = Leccion["guia"];

type PropsPantalla = {
  bloque: Bloque;
  clave: string;
  resuelto: boolean;
  fallos: number;
  onFallo: (o?: FalloOpc) => void;
  onAcierto: () => void;
  onSiguiente: () => void;
  precision: number;
  ganados: number;
  xp: number;
  vidas: number;
  posibles: number;
  completada: boolean;
  guardando: boolean;
  nivel?: { numero: number; total: number; mundo: string };
  guia: Guia;
  onCompletar: () => void;
  onReiniciar: () => void;
};

function Pantalla(p: PropsPantalla) {
  const b = p.bloque;
  switch (b.tipo) {
    case "portada":
      return <Portada b={b} {...p} />;
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
    case "buscar":
      return <Buscar b={b} {...p} />;
    case "mision":
      return <Mision b={b} {...p} />;
    case "resumen":
      return <Resumen b={b} {...p} />;
  }
}

type De<T extends Bloque["tipo"]> = Extract<Bloque, { tipo: T }>;

function Etiqueta({ children, tono = "navy" }: { children: React.ReactNode; tono?: "navy" | "lima" | "rojo" | "naranja" }) {
  const c =
    tono === "lima"
      ? "bg-lime-100 text-lime-800"
      : tono === "rojo"
        ? "bg-red-100 text-red-700"
        : tono === "naranja"
          ? "bg-orange-100 text-orange-700"
          : "bg-navy-100 text-navy-600";
  return <span className={`inline-block rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em] ${c}`}>{children}</span>;
}

function CaraGuia({ guia, className }: { guia: NonNullable<Guia>; className: string }) {
  if (guia.avatar) return <Avatar id={guia.avatar} className={`${className} shrink-0 drop-shadow`} />;
  const iniciales = guia.nombre.split(" ").map((x) => x[0]).slice(0, 2).join("");
  return (
    <span className={`${className} flex shrink-0 items-center justify-center rounded-full bg-kg-gradient font-display text-sm font-extrabold text-lime-400 shadow-kg`}>
      {iniciales}
    </span>
  );
}

function Globo({ guia, texto }: { guia: NonNullable<Guia>; texto: string }) {
  return (
    <div className="mb-6 flex items-start gap-3">
      <CaraGuia guia={guia} className="h-12 w-12" />
      <div className="relative rounded-2xl rounded-tl-sm bg-white px-4 py-3 shadow-sm ring-1 ring-navy-100">
        <p className="text-[11px] font-bold text-navy-400">
          {guia.nombre} · <span className="font-semibold">{guia.rol}</span>
        </p>
        <p className="mt-0.5 text-sm leading-relaxed text-navy-700">{texto}</p>
      </div>
    </div>
  );
}

function Portada({ b, nivel, guia, completada, onSiguiente }: { b: De<"portada"> } & PropsPantalla) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-navy-900 p-7 text-white sm:p-10">
      <div className="pointer-events-none absolute inset-0 bg-kg-mesh opacity-70" />
      <div className="pointer-events-none absolute inset-0 bg-grid bg-[size:28px_28px] opacity-20" />
      <div className="relative grid items-center gap-8 md:grid-cols-[1fr_auto]">
        <div>
          <p className="font-display text-sm font-extrabold tracking-[0.25em] text-lime-400">
            {nivel ? `NIVEL ${nivel.numero} DE ${nivel.total}` : "NUEVA MISIÓN"}
          </p>
          <h3 className="mt-3 font-display text-3xl font-extrabold leading-tight sm:text-5xl">{b.titulo}</h3>
          {b.subtitulo && <p className="mt-3 max-w-2xl text-white/75">{b.subtitulo}</p>}

          <div className="mt-5 flex flex-wrap gap-2 text-[11px] font-bold">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5">
              <Corazon lleno /> {VIDAS} vidas
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-lime-300">
              <IconSpark width={13} height={13} /> Gane XP en cada reto
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-orange-300">
              <IconFire width={13} height={13} /> Rachas sin error dan XP extra
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5">
              <IconClock width={13} height={13} /> {b.minutos} min
            </span>
          </div>

          <p className="mt-7 text-[11px] font-bold uppercase tracking-[0.16em] text-lime-300">Objetivos de la misión</p>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {b.objetivos.map((o, i) => (
              <li key={o} className="flex items-start gap-2.5 rounded-xl bg-white/[0.07] p-3 text-sm text-white/90">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-lime-500 font-display text-[11px] font-extrabold text-navy-900">
                  {i + 1}
                </span>
                {o}
              </li>
            ))}
          </ul>

          <button type="button" onClick={onSiguiente} className="kg-latir-suave btn-lime mt-8 px-8 py-3.5 text-base">
            {completada ? "Repasar el nivel" : "¡Comenzar misión!"} <IconArrowRight width={18} height={18} />
          </button>
        </div>
        {guia?.avatar && (
          <div className="hidden text-center md:block">
            <Avatar id={guia.avatar} className="kg-flotar mx-auto h-40 w-40 drop-shadow-2xl" />
            <p className="mt-3 font-display text-sm font-extrabold">{guia.nombre}</p>
            <p className="text-[11px] text-white/60">{guia.rol}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function Explicacion({ b }: { b: De<"explicacion"> }) {
  return (
    <div className={b.ilustracion ? "grid items-start gap-7 lg:grid-cols-[1.1fr_1fr]" : ""}>
      <div>
        <Etiqueta>Informe de inteligencia</Etiqueta>
        <h3 className="mt-3 font-display text-2xl font-extrabold text-navy-700">{b.titulo}</h3>
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
      <Etiqueta>Cartas</Etiqueta>
      <h3 className="mt-3 font-display text-2xl font-extrabold text-navy-700">{b.titulo}</h3>
      <p className="mt-2 text-sm text-navy-500">{b.instruccion ?? "Toque cada carta para descubrir la respuesta."}</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {b.tarjetas.map((t, i) => {
          const v = volteadas.has(i);
          return (
            <button
              key={i}
              type="button"
              aria-pressed={v}
              onClick={() => {
                if (!v) sfx.clic();
                setVolteadas((s) => new Set(s).add(i));
              }}
              className="kg-tarjeta group h-44 text-left [perspective:1000px]"
            >
              <span className={`kg-tarjeta__cara relative block h-full w-full ${v ? "kg-volteada" : ""}`}>
                <span className="kg-frente absolute inset-0 flex flex-col justify-between rounded-2xl bg-white p-5 shadow-sm ring-2 ring-navy-100 transition group-hover:-translate-y-1 group-hover:ring-lime-400">
                  <span className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-red-500">{t.etiqueta ?? "¿Mito o realidad?"}</span>
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
  oscuro,
}: {
  opciones: { texto: string; correcta?: boolean; retro: string }[];
  clave: string;
  resuelto: boolean;
  onElegir: (i: number) => void;
  elegidas: Set<number>;
  bloqueadas: boolean;
  oscuro?: boolean;
}) {
  const orden = useMemo(() => barajar(opciones.map((_, i) => i), clave), [opciones, clave]);
  return (
    <div className="mt-5 grid gap-3">
      {orden.map((i, pos) => {
        const o = opciones[i];
        const elegida = elegidas.has(i);
        const mostrarBien = (resuelto || elegida) && o.correcta;
        const mal = elegida && !o.correcta;
        return (
          <button
            key={i}
            type="button"
            disabled={resuelto || mal || bloqueadas || mostrarBien}
            onClick={() => onElegir(i)}
            className={`flex items-center gap-3 rounded-2xl border-2 px-4 py-3.5 text-left text-sm font-semibold transition ${
              mostrarBien
                ? "border-lime-500 bg-lime-50 text-navy-800"
                : mal
                  ? "kg-sacudir border-red-300 bg-red-50 text-red-700"
                  : oscuro
                    ? "border-white/15 bg-white/5 text-white hover:-translate-y-0.5 hover:border-lime-400 disabled:opacity-60 disabled:hover:translate-y-0"
                    : "border-navy-100 bg-white text-navy-700 hover:-translate-y-0.5 hover:border-navy-300 hover:shadow-sm disabled:hover:translate-y-0"
            }`}
          >
            <span
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg font-display text-xs font-extrabold ${
                mostrarBien ? "bg-lime-500 text-white" : mal ? "bg-red-500 text-white" : oscuro ? "bg-white/10 text-white/70" : "bg-navy-100 text-navy-500"
              }`}
            >
              {mostrarBien ? <IconCheck width={13} height={13} strokeWidth={4} /> : mal ? <IconX width={13} height={13} strokeWidth={3} /> : "ABCDEF"[pos]}
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
        <span className="kg-puntos shrink-0 rounded-full bg-navy-900 px-3 py-1 text-xs font-extrabold text-lime-400">+{puntos} XP</span>
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

function Contrarreloj({ b, clave, resuelto, fallos, vidas, completada, onFallo, onAcierto }: { b: De<"contrarreloj"> } & PropsPantalla) {
  const [fase, setFase] = useState<"lista" | "corriendo" | "agotado" | "fallo">(resuelto ? "corriendo" : "lista");
  const [restante, setRestante] = useState(b.segundos);
  const [elegidas, setElegidas] = useState<Set<number>>(new Set());
  const [ultima, setUltima] = useState<number | null>(null);

  const congelado = !completada && vidas <= 0;
  useEffect(() => {
    if (fase !== "corriendo" || resuelto || congelado) return;
    if (restante <= 0) {
      setFase("agotado");
      sfx.alarma();
      onFallo();
      return;
    }
    if (restante <= 3) sfx.tic();
    const t = setTimeout(() => setRestante((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [fase, restante, resuelto, onFallo, congelado]);

  function empezar() {
    sfx.clic();
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
        <div className="mt-4 rounded-2xl bg-navy-900 p-8 text-center text-white">
          <span className="kg-latir-suave mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-500 text-white">
            <IconClock width={30} height={30} />
          </span>
          {b.titulo && <p className="mt-4 font-display text-2xl font-extrabold">{b.titulo}</p>}
          <p className="mx-auto mt-3 max-w-lg text-white/75">
            En una emergencia no hay tiempo para pensarlo dos veces. Tendrá {b.segundos} segundos para decidir.
          </p>
          <button type="button" onClick={empezar} className="btn-lime mt-6">
            ¡Estoy listo! <IconArrowRight width={16} height={16} />
          </button>
        </div>
      ) : (
        <>
          {!resuelto && (
            <div className="mt-4 flex items-center gap-3">
              <div className="h-4 flex-1 overflow-hidden rounded-full bg-navy-100">
                <div
                  className={`h-full rounded-full transition-[width] duration-1000 ease-linear ${urgente ? "bg-red-500" : "bg-lime-500"}`}
                  style={{ width: `${fase === "corriendo" ? pct : 0}%` }}
                />
              </div>
              <span className={`w-14 text-right font-mono text-2xl font-extrabold ${urgente ? "kg-latir-suave text-red-600" : "text-navy-700"}`}>
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
    sfx.clic();
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
      else sfx.moneda();
    } else {
      const nombre = b.categorias.find((c) => c.id === e.categoria)?.nombre ?? "";
      setError(e.porque ?? `Este va en «${nombre}».`);
      setSacudir((x) => x + 1);
      onFallo({ vida: "primera" });
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
          <div key={`${actual}-${sacudir}`} className={`mx-auto mt-2 max-w-md rounded-2xl bg-white px-6 py-5 font-display text-lg font-bold text-navy-700 shadow-kg ring-2 ring-lime-300 ${sacudir ? "kg-sacudir" : "animate-fade-up"}`}>
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
                className="rounded-t-2xl bg-navy-700 px-4 py-3 text-left transition enabled:hover:bg-navy-600 enabled:active:scale-[.98] disabled:cursor-default"
              >
                <span className="block font-display text-sm font-extrabold text-white">{c.nombre}</span>
                {c.pista && <span className="block text-[11px] text-white/60">{c.pista}</span>}
              </button>
              <ul className="min-h-[56px] space-y-1.5 p-3">
                {dentro.map((i) => (
                  <li key={i} className="kg-pop flex items-start gap-2 rounded-lg bg-lime-50 px-2.5 py-1.5 text-xs font-semibold text-navy-700">
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

/* ------------------------- Cacería de riesgos ------------------------- */

function Buscar({ b, resuelto, fallos, onFallo, onAcierto }: { b: De<"buscar"> } & PropsPantalla) {
  const todos = useMemo(() => new Set(b.objetivos.map((_, i) => i)), [b.objetivos]);
  const [hallados, setHallados] = useState<Set<number>>(resuelto ? todos : new Set());
  // Dos toques seguidos, antes de que React vuelva a dibujar, deben sumar los dos.
  const halladosRef = useRef(hallados);
  halladosRef.current = hallados;
  const [ultimo, setUltimo] = useState<number | null>(null);
  const [fallas, setFallas] = useState<{ x: number; y: number; id: number }[]>([]);
  const [pista, setPista] = useState<number | null>(null);
  const svg = useRef<SVGSVGElement>(null);
  const radio = (i: number) => b.objetivos[i].r ?? 42;
  const listos = resuelto ? todos : hallados;

  function punto(ev: React.MouseEvent<SVGSVGElement>) {
    const s = svg.current;
    const m = s?.getScreenCTM();
    if (!s || !m) return null;
    const p = s.createSVGPoint();
    p.x = ev.clientX;
    p.y = ev.clientY;
    return p.matrixTransform(m.inverse());
  }

  function tocar(ev: React.MouseEvent<SVGSVGElement>) {
    if (resuelto) return;
    const p = punto(ev);
    if (!p) return;
    const cerca = (i: number) => Math.hypot(b.objetivos[i].x - p.x, b.objetivos[i].y - p.y) <= radio(i);
    const actuales = halladosRef.current;
    const i = b.objetivos.findIndex((_, j) => !actuales.has(j) && cerca(j));
    if (i >= 0) {
      const n = new Set(actuales).add(i);
      halladosRef.current = n;
      setHallados(n);
      setUltimo(i);
      if (pista === i) setPista(null);
      if (n.size === b.objetivos.length) onAcierto();
      else sfx.moneda();
      return;
    }
    if (b.objetivos.some((_, j) => actuales.has(j) && cerca(j))) return;
    const id = Date.now();
    setFallas((f) => [...f, { x: p.x, y: p.y, id }]);
    setTimeout(() => setFallas((f) => f.filter((x) => x.id !== id)), 800);
    onFallo({ vida: false });
  }

  function pedirPista() {
    const i = b.objetivos.findIndex((_, j) => !hallados.has(j));
    if (i < 0) return;
    setPista(i);
    onFallo({ vida: false });
    setTimeout(() => setPista((x) => (x === i ? null : x)), 2600);
  }

  function mostrarTodos() {
    const faltan = b.objetivos.length - hallados.size;
    setHallados(todos);
    setUltimo(null);
    onFallo({ vida: false, cantidad: faltan * 2 });
    onAcierto();
  }

  const detalle = ultimo;

  return (
    <div>
      <Etiqueta tono="naranja">Cacería de riesgos</Etiqueta>
      <h3 className="mt-3 font-display text-2xl font-extrabold text-navy-700">{b.titulo}</h3>
      <p className="mt-2 text-sm text-navy-500">{b.instruccion}</p>

      <div className="relative mt-5 overflow-hidden rounded-2xl bg-navy-900 ring-4 ring-navy-900">
        {/* En pantallas pequeñas la escena se agranda y se recorre de lado a lado,
            para que los peligros tengan un tamaño que se pueda tocar. */}
        <div className="overflow-x-auto overscroll-x-contain">
        <svg
          ref={svg}
          viewBox="0 0 800 450"
          className={`block w-[560px] max-w-none select-none sm:w-full sm:max-w-full ${resuelto ? "" : "cursor-crosshair"}`}
          onClick={tocar}
          role="img"
          aria-label={`${TITULO_ESCENA[b.escena]}. Toque los peligros que encuentre.`}
        >
          <Escena id={b.escena} />
          {b.objetivos.map((o, i) =>
            listos.has(i) ? (
              <g key={i} className="kg-marca">
                <circle cx={o.x} cy={o.y} r={radio(i)} fill="rgba(143,191,22,.18)" stroke="#8FBF16" strokeWidth="4" />
                <circle cx={o.x + radio(i) * 0.7} cy={o.y - radio(i) * 0.7} r="13" fill="#8FBF16" stroke="#fff" strokeWidth="2.5" />
                <text x={o.x + radio(i) * 0.7} y={o.y - radio(i) * 0.7 + 5} textAnchor="middle" fontSize="14" fontWeight="800" fill="#0A2D4D" fontFamily="sans-serif">
                  {i + 1}
                </text>
              </g>
            ) : pista === i ? (
              <circle key={i} cx={o.x} cy={o.y} r={radio(i) + 10} fill="none" stroke="#F59E0B" strokeWidth="5" className="kg-pista" />
            ) : null
          )}
          {fallas.map((f) => (
            <g key={f.id} className="kg-falla" transform={`translate(${f.x} ${f.y})`}>
              <circle r="16" fill="rgba(215,38,61,.2)" stroke="#D7263D" strokeWidth="3" />
              <path d="M-7 -7 L7 7 M7 -7 L-7 7" stroke="#D7263D" strokeWidth="3.5" strokeLinecap="round" />
            </g>
          ))}
        </svg>
        </div>
        <div className="pointer-events-none absolute left-3 top-3 flex flex-wrap gap-2">
          <span className="rounded-full bg-navy-900/85 px-3 py-1.5 font-display text-xs font-extrabold text-lime-300 backdrop-blur">
            Riesgos {listos.size}/{b.objetivos.length}
          </span>
          {!resuelto && fallos > 0 && (
            <span className="rounded-full bg-red-600/85 px-3 py-1.5 text-xs font-extrabold text-white backdrop-blur">Fallas {fallos}</span>
          )}
        </div>
        <span className="pointer-events-none absolute right-3 top-3 hidden rounded-full bg-navy-900/70 sm:block px-3 py-1 text-[10px] font-semibold text-white/80 backdrop-blur">
          {TITULO_ESCENA[b.escena]}
        </span>
      </div>

      <p className="mt-2 text-[11px] font-semibold text-navy-400 sm:hidden">Deslice la escena hacia los lados para verla completa.</p>
      {!resuelto && (
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button type="button" onClick={pedirPista} disabled={pista !== null} className="btn-outline btn-sm">
            Pedir una pista (−1 XP)
          </button>
          <button type="button" onClick={mostrarTodos} className="text-xs font-semibold text-navy-400 underline hover:text-navy-600">
            No puedo tocar la imagen: mostrar todos
          </button>
        </div>
      )}

      <ol className="mt-5 grid gap-2.5 sm:grid-cols-2">
        {b.objetivos.map((o, i) =>
          listos.has(i) ? (
            <li key={i} className={`kg-pop flex gap-3 rounded-2xl bg-white p-4 ring-1 ${detalle === i ? "ring-2 ring-lime-500" : "ring-navy-100"}`}>
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-lime-500 font-display text-xs font-extrabold text-navy-900">{i + 1}</span>
              <span>
                <span className="block text-sm font-bold text-navy-700">{o.nombre}</span>
                <span className="mt-0.5 block text-xs leading-relaxed text-navy-500">{o.explicacion}</span>
              </span>
            </li>
          ) : (
            <li key={i} className="flex items-center gap-3 rounded-2xl border-2 border-dashed border-navy-100 p-4 text-sm font-semibold text-navy-300">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-navy-50 font-display text-xs">?</span>
              Riesgo sin descubrir
            </li>
          )
        )}
      </ol>

      {resuelto && <Retro ok titulo="¡Zona asegurada!" texto="Encontró todos los riesgos de la escena." puntos={puntosDe(fallos, "buscar")} />}
    </div>
  );
}

/* ------------------------ Misión contra el tiempo ------------------------ */

function Mision({ b, clave, resuelto, fallos, vidas, completada, onFallo, onAcierto }: { b: De<"mision"> } & PropsPantalla) {
  const [fase, setFase] = useState<"lista" | "jugando" | "paso-ok" | "fracaso" | "exito">(resuelto ? "exito" : "lista");
  const [peligro, setPeligro] = useState(0);
  const [paso, setPaso] = useState(0);
  const [elegidas, setElegidas] = useState<Set<number>>(new Set());
  const [ultima, setUltima] = useState<number | null>(null);
  const [golpe, setGolpe] = useState(0);
  const alarmada = useRef(false);
  const esVida = b.medidor.tipo === "vida";

  // Sin vidas, el medidor se congela mientras se muestra el fin del juego.
  const congelado = !completada && vidas <= 0;
  useEffect(() => {
    if (fase !== "jugando" || congelado) return;
    const t = setInterval(() => setPeligro((p) => Math.min(100, p + b.velocidad / 5)), 200);
    return () => clearInterval(t);
  }, [fase, b.velocidad, congelado]);

  useEffect(() => {
    if (fase !== "jugando") return;
    if (peligro >= 100) {
      setFase("fracaso");
      sfx.derrota();
    } else if (peligro >= 70 && !alarmada.current) {
      alarmada.current = true;
      sfx.alarma();
    }
  }, [peligro, fase]);

  function iniciar() {
    sfx.clic();
    setPeligro(0);
    setPaso(0);
    setElegidas(new Set());
    setUltima(null);
    alarmada.current = false;
    setFase("jugando");
  }

  function elegir(i: number) {
    const o = b.pasos[paso].opciones[i];
    setElegidas((s) => new Set(s).add(i));
    setUltima(i);
    if (o.correcta) {
      if (paso === b.pasos.length - 1) {
        setFase("exito");
        onAcierto();
      } else {
        sfx.acierto();
        setFase("paso-ok");
      }
    } else {
      setPeligro((p) => Math.min(100, p + b.penalizacion));
      setGolpe((g) => g + 1);
      onFallo();
    }
  }

  function siguiente() {
    sfx.clic();
    setPaso((p) => p + 1);
    setElegidas(new Set());
    setUltima(null);
    setFase("jugando");
  }

  const valor = Math.round(esVida ? 100 - peligro : peligro);
  const critico = peligro >= 70;
  const color = esVida
    ? peligro < 40 ? "bg-lime-400" : peligro < 70 ? "bg-amber-400" : "bg-red-500"
    : peligro < 40 ? "bg-amber-300" : peligro < 70 ? "bg-orange-500" : "bg-red-600";

  const medidor = (
    <div key={golpe} className={`rounded-2xl bg-navy-900 p-4 text-white ${golpe && fase === "jugando" ? "kg-sacudir" : ""}`}>
      <div className="flex items-center justify-between gap-3">
        <span className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-white/70">{b.medidor.etiqueta}</span>
        <span className={`font-mono text-2xl font-extrabold ${critico ? "kg-latir-suave text-red-400" : "text-white"}`}>{valor}%</span>
      </div>
      <div className="mt-2 h-4 overflow-hidden rounded-full bg-white/10">
        <div className={`h-full rounded-full transition-[width] duration-200 ease-linear ${color}`} style={{ width: `${valor}%` }} />
      </div>
      {esVida ? (
        <svg viewBox="0 0 400 40" className="mt-2 h-8 w-full" aria-hidden>
          <g className="kg-ecg" style={{ animationDuration: `${Math.max(0.5, 2.2 - peligro / 60)}s` }}>
            {[0, 200, 400].map((x) => (
              <polyline key={x} transform={`translate(${x} 0)`} points="0,22 60,22 72,22 80,6 90,36 98,22 200,22" fill="none" stroke={critico ? "#FF4D5E" : "#A5CE30"} strokeWidth="2.5" />
            ))}
          </g>
        </svg>
      ) : (
        <div className="mt-2 flex h-8 items-end gap-1" aria-hidden>
          {Array.from({ length: 10 }, (_, i) => (
            <IconFire
              key={i}
              width={20}
              height={20}
              fill="currentColor"
              className={`kg-llama transition ${i < Math.ceil(peligro / 10) ? "text-orange-400 opacity-100" : "text-white/10"}`}
              style={{ animationDelay: `${i * 0.08}s`, transform: `scale(${0.7 + (i < Math.ceil(peligro / 10) ? peligro / 250 : 0)})` }}
            />
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div>
      <Etiqueta tono="rojo">Misión · {b.pasos.length} pasos</Etiqueta>
      <h3 className="mt-3 font-display text-2xl font-extrabold text-navy-700">{b.titulo}</h3>

      {fase === "lista" && (
        <div className="relative mt-4 overflow-hidden rounded-2xl bg-navy-900 p-8 text-white">
          <div className="pointer-events-none absolute inset-0 bg-kg-mesh opacity-60" />
          <div className="relative">
            <p className="max-w-2xl text-[15px] leading-relaxed text-white/85">{b.intro}</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {[
                [b.medidor.etiqueta, esVida ? "Baja cada segundo" : "Sube cada segundo"],
                ["Cada error", `${esVida ? "−" : "+"}${b.penalizacion}% y una vida`],
                ["Para ganar", `Supere los ${b.pasos.length} pasos a tiempo`],
              ].map(([k, v]) => (
                <div key={k} className="rounded-xl bg-white/10 p-3">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-white/60">{k}</p>
                  <p className="mt-0.5 text-sm font-bold">{v}</p>
                </div>
              ))}
            </div>
            <button type="button" onClick={iniciar} className="kg-latir-suave btn-lime mt-6 px-7 py-3 text-base">
              ¡Iniciar misión! <IconArrowRight width={18} height={18} />
            </button>
          </div>
        </div>
      )}

      {(fase === "jugando" || fase === "paso-ok") && (
        <div className="mt-4">
          {medidor}
          <div className="mt-4 flex gap-1.5" aria-label={`Paso ${paso + 1} de ${b.pasos.length}`}>
            {b.pasos.map((_, i) => (
              <span key={i} className={`h-2 flex-1 rounded-full ${i < paso || (i === paso && fase === "paso-ok") ? "bg-lime-500" : i === paso ? "bg-navy-700" : "bg-navy-100"}`} />
            ))}
          </div>
          <Situacion titulo={`Paso ${paso + 1}`} situacion={b.pasos[paso].situacion} pregunta={b.pasos[paso].pregunta} />
          <Opciones
            opciones={b.pasos[paso].opciones}
            clave={`${clave}-${paso}`}
            resuelto={fase === "paso-ok"}
            onElegir={elegir}
            elegidas={elegidas}
            bloqueadas={fase !== "jugando"}
          />
          {ultima !== null && <Retro ok={!!b.pasos[paso].opciones[ultima].correcta} texto={b.pasos[paso].opciones[ultima].retro} />}
          {fase === "paso-ok" && (
            <button type="button" onClick={siguiente} className="btn-lime mt-4">
              Siguiente paso <IconArrowRight width={16} height={16} />
            </button>
          )}
        </div>
      )}

      {fase === "fracaso" && (
        <div className="kg-pop mt-4 rounded-2xl bg-red-600 p-7 text-center text-white">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-white/70">Misión fallida</p>
          <p className="mx-auto mt-2 max-w-lg font-display text-xl font-extrabold leading-snug">{b.fracaso}</p>
          <button type="button" onClick={iniciar} className="mt-5 rounded-xl bg-white px-6 py-3 font-display text-sm font-extrabold text-red-600 transition hover:bg-red-50">
            Reintentar la misión
          </button>
        </div>
      )}

      {fase === "exito" && (
        <>
          <div className="kg-pop mt-4 rounded-2xl bg-lime-500 p-7 text-center text-navy-900">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-navy-900/60">Misión cumplida</p>
            <p className="mx-auto mt-2 max-w-lg font-display text-xl font-extrabold leading-snug">{b.exito}</p>
            <span className="kg-puntos mt-4 inline-block rounded-full bg-navy-900 px-4 py-1.5 text-xs font-extrabold text-lime-400">+{puntosDe(fallos)} XP</span>
          </div>
          <ol className="mt-5 space-y-2">
            {b.pasos.map((p, i) => (
              <li key={i} className="flex gap-3 rounded-xl bg-white p-3 text-sm ring-1 ring-navy-100">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-navy-700 font-display text-[11px] font-extrabold text-lime-400">{i + 1}</span>
                <span className="font-semibold text-navy-700">{p.opciones.find((o) => o.correcta)?.texto}</span>
              </li>
            ))}
          </ol>
        </>
      )}
    </div>
  );
}

/* --------------------------- Nivel completado --------------------------- */

function Resumen({ b, precision, ganados, xp, vidas, posibles, completada, guardando, onCompletar, onReiniciar }: { b: De<"resumen"> } & PropsPantalla) {
  const estrellas = estrellasDe(precision);
  useEffect(() => {
    sfx.nivel();
  }, []);
  return (
    <div className="relative">
      <Confeti />
      <div className="relative overflow-hidden rounded-2xl bg-navy-900 p-7 text-center text-white sm:p-10">
        <div className="pointer-events-none absolute inset-0 bg-kg-mesh opacity-80" />
        <div className="relative">
          <p className="kg-pop font-display text-sm font-extrabold tracking-[0.3em] text-lime-400">¡NIVEL COMPLETADO!</p>
          {posibles > 0 && (
            <div className="mt-5 flex items-end justify-center gap-3" role="img" aria-label={`${estrellas} de 3 estrellas`}>
              {[1, 2, 3].map((n) => (
                <Estrella key={n} llena={n <= estrellas} grande={n === 2} retraso={n * 0.25} />
              ))}
            </div>
          )}
          <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.18em] text-white/60">Insignia desbloqueada</p>
          <h3 className="mt-1 font-display text-3xl font-extrabold">{b.insignia}</h3>
          {posibles > 0 && (
            <div className="mx-auto mt-6 grid max-w-lg grid-cols-3 gap-3">
              {[
                ["XP ganada", `${xp}`],
                ["Precisión", `${precision}%`],
                ["Vidas", completada ? "—" : `${vidas}/${VIDAS}`],
              ].map(([k, v]) => (
                <div key={k} className="rounded-xl bg-white/10 p-3">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-white/60">{k}</p>
                  <p className="mt-0.5 font-display text-lg font-extrabold text-white">{v}</p>
                </div>
              ))}
            </div>
          )}
          {posibles > 0 && ganados < posibles && (
            <p className="mt-4 text-xs text-white/55">
              {estrellas < 3 ? "Repita el nivel sin errores para conseguir las 3 estrellas." : "¡Dominio total!"}
            </p>
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
            <IconCheck width={16} height={16} strokeWidth={3} /> Nivel superado
          </span>
        ) : (
          <button type="button" onClick={onCompletar} disabled={guardando} className="btn-lime px-7 py-3 text-base">
            {guardando ? "Guardando..." : "Guardar y seguir al próximo nivel"} <IconArrowRight width={18} height={18} />
          </button>
        )}
        <button type="button" onClick={onReiniciar} className="btn-ghost btn-sm">
          Jugar de nuevo
        </button>
      </div>
    </div>
  );
}

function Estrella({ llena, grande, retraso }: { llena: boolean; grande: boolean; retraso: number }) {
  return (
    <svg viewBox="0 0 24 24" className={`kg-estrella ${grande ? "h-20 w-20" : "h-14 w-14"}`} style={{ animationDelay: `${retraso}s` }} aria-hidden>
      <path
        d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z"
        fill={llena ? "#FFC83D" : "rgba(255,255,255,.12)"}
        stroke={llena ? "#FFE08A" : "rgba(255,255,255,.2)"}
        strokeWidth="1"
        strokeLinejoin="round"
      />
      {llena && <path d="M9 8.5l1.4-2.8" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" opacity=".7" />}
    </svg>
  );
}

/* ---------------------------- Efectos visuales ---------------------------- */

function Confeti() {
  const piezas = useMemo(() => {
    const azar = semilla("confeti");
    const colores = ["#8FBF16", "#A5CE30", "#FFC83D", "#F59E0B", "#ffffff", "#FF4D5E"];
    return Array.from({ length: 34 }, (_, i) => ({
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
      @keyframes kg-caer { 0%{opacity:0; transform:translateY(-20px) rotate(0)} 10%{opacity:1} 100%{opacity:0; transform:translateY(460px) rotate(540deg)} }
      .kg-confeti { animation-name: kg-caer; animation-timing-function: cubic-bezier(.25,.6,.4,1); animation-fill-mode: both; }
      @keyframes kg-subir { 0%{transform:translateY(8px); opacity:0} 100%{transform:none; opacity:1} }
      .kg-puntos { animation: kg-subir .4s ease-out both; }
      @keyframes kg-pop { 0%{transform:scale(.6); opacity:0} 60%{transform:scale(1.08); opacity:1} 100%{transform:scale(1)} }
      .kg-pop { animation: kg-pop .45s cubic-bezier(.2,.9,.3,1.3) both; }
      @keyframes kg-estrella { 0%{transform:scale(0) rotate(-60deg); opacity:0} 70%{transform:scale(1.25) rotate(8deg); opacity:1} 100%{transform:scale(1) rotate(0)} }
      .kg-estrella { animation: kg-estrella .6s cubic-bezier(.2,.9,.3,1.4) both; }
      @keyframes kg-latir-suave { 0%,100%{transform:scale(1)} 50%{transform:scale(1.06)} }
      .kg-latir-suave { animation: kg-latir-suave 1.4s ease-in-out infinite; }
      @keyframes kg-flotar { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
      .kg-flotar { animation: kg-flotar 3.2s ease-in-out infinite; }
      @keyframes kg-toast { 0%{opacity:0; transform:translate(-50%,10px) scale(.8)} 15%{opacity:1; transform:translate(-50%,0) scale(1.05)} 25%{transform:translate(-50%,0) scale(1)} 85%{opacity:1} 100%{opacity:0; transform:translate(-50%,-12px)} }
      .kg-toast { animation: kg-toast 1.8s ease-out both; }
      @keyframes kg-roto { 0%{transform:scale(1.4)} 100%{transform:scale(1)} }
      .kg-corazon-roto { animation: kg-roto .35s ease-out both; }
      @keyframes kg-chispa { 0%,100%{opacity:1; transform-box:fill-box} 45%{opacity:.25} 60%{opacity:1} 80%{opacity:.5} }
      .kg-chispa { animation: kg-chispa .9s steps(2) infinite; }
      @keyframes kg-brillo { 0%,100%{opacity:1} 50%{opacity:.55} }
      .kg-brillo { animation: kg-brillo 1.2s ease-in-out infinite; }
      @keyframes kg-girar { to { transform: rotate(360deg) } }
      .kg-girar { animation: kg-girar .6s linear infinite; }
      @keyframes kg-balanceo { 0%,100%{transform:rotate(-1.5deg)} 50%{transform:rotate(1.5deg)} }
      .kg-balanceo { transform-origin: 640px 110px; animation: kg-balanceo 2.6s ease-in-out infinite; }
      @keyframes kg-pista { 0%,100%{opacity:1; stroke-width:5} 50%{opacity:.35; stroke-width:9} }
      .kg-pista { animation: kg-pista .7s ease-in-out infinite; }
      @keyframes kg-marca { 0%{transform:scale(.3); opacity:0} 70%{transform:scale(1.1); opacity:1} 100%{transform:scale(1)} }
      .kg-marca { transform-box: fill-box; transform-origin: center; animation: kg-marca .4s cubic-bezier(.2,.9,.3,1.3) both; }
      @keyframes kg-falla { 0%{opacity:1} 100%{opacity:0} }
      .kg-falla { animation: kg-falla .8s ease-in both; }
      @keyframes kg-ecg { from{transform:translateX(0)} to{transform:translateX(-200px)} }
      .kg-ecg { animation: kg-ecg 2s linear infinite; }
      @keyframes kg-llama { 0%,100%{transform-origin:bottom} 50%{filter:brightness(1.3)} }
      .kg-llama { animation: kg-llama .5s ease-in-out infinite; }
      @media (prefers-reduced-motion: reduce) {
        .kg-tarjeta__cara, .kg-sacudir, .kg-confeti, .kg-puntos, .kg-pop, .kg-estrella, .kg-latir-suave, .kg-flotar,
        .kg-toast, .kg-corazon-roto, .kg-chispa, .kg-brillo, .kg-girar, .kg-balanceo, .kg-pista, .kg-marca, .kg-ecg, .kg-llama {
          animation: none !important; transition: none !important;
        }
        .kg-confeti { display: none; }
      }
    `}</style>
  );
}
