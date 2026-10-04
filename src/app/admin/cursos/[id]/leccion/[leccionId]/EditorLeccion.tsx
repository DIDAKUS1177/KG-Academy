"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AVATARES,
  BLOQUES_CALIFICABLES,
  huellaContenido,
  leccionInteractivaSchema,
  problemasDeContenido,
  type Bloque,
  type LeccionInteractiva,
} from "@/lib/leccion-interactiva";
import {
  NOMBRE_TIPO,
  TIPOS_BLOQUE,
  bloqueNuevo,
  guiaIncompleta,
  pantallasConEjemplo,
  pantallasConVacios,
  problemasDeOrden,
  type TipoBloque,
} from "@/lib/plantillas-leccion";
import { LeccionInteractiva as VistaPrevia } from "@/components/leccion/LeccionInteractiva";
import { pedirApi } from "@/lib/api-cliente";
import { IconAlert, IconCheck, IconEye } from "@/components/Icons";
import { EditorBloque } from "./EditorBloque";
import { Acciones, Seleccion, Texto, mover } from "./campos";

export type VersionGuardada = { id: string; fecha: string; autor: string; pantallas: number; contenido: LeccionInteractiva };

/** Borrador guardado en el navegador mientras hay cambios sin guardar. */
type BorradorLocal = { contenido: LeccionInteractiva; huellaBase: string; fecha: string };

/** Lee el borrador local; descarta lo que no tenga la forma de una lección. */
function leerBorrador(clave: string): BorradorLocal | null {
  try {
    const g = JSON.parse(localStorage.getItem(clave) ?? "null") as BorradorLocal | null;
    const bloques = g?.contenido?.bloques;
    if (!g || typeof g.huellaBase !== "string" || !Array.isArray(bloques) || !bloques.length) return null;
    return bloques.every((b) => b && typeof b === "object" && b.tipo in NOMBRE_TIPO) ? g : null;
  } catch {
    return null;
  }
}

/** Texto corto para reconocer una pantalla en la lista. */
function resumen(b: Bloque) {
  const t = "titulo" in b && b.titulo ? b.titulo : "situacion" in b ? b.situacion : "";
  return t.replace(/^✎\s*/, "").slice(0, 70) || NOMBRE_TIPO[b.tipo];
}

/**
 * Editor visual de una lección interactiva: lista de pantallas a la izquierda
 * (la elegida se despliega en su formulario) y, a la derecha, la vista previa
 * tal como la verá el trabajador. Solo deja guardar contenido válido, sin
 * textos de ejemplo ni campos vacíos, con la Portada al inicio y el Resumen al
 * final.
 *
 * Mientras hay cambios, el borrador se guarda en este navegador: si se cierra
 * la pestaña, se vence la sesión o se sale por un enlace, al volver se ofrece
 * recuperarlo.
 */
export function EditorLeccion({
  leccion,
  inicial,
  historial,
  aviso,
}: {
  /** huellaBase: huella del contenido que se abrió (detecta si otra persona guardó después). */
  leccion: { id: string; titulo: string; huellaBase: string; cursoId: string; cursoSlug: string; modulo: string };
  inicial: LeccionInteractiva;
  historial: VersionGuardada[];
  /** Advertencia al abrir (p. ej., la lección hoy es de otro tipo). */
  aviso: string | null;
}) {
  const router = useRouter();
  const [borrador, setBorrador] = useState<LeccionInteractiva>(inicial);
  const [sel, setSel] = useState(0);
  const [guardadoJson, setGuardadoJson] = useState(() => JSON.stringify(inicial));
  const [huellaBase, setHuellaBase] = useState(leccion.huellaBase);
  const [msg, setMsg] = useState<{ ok: boolean; text: string; conflicto?: boolean } | null>(null);
  const [recuperable, setRecuperable] = useState<BorradorLocal | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [agregando, setAgregando] = useState(false);
  const [verHistorial, setVerHistorial] = useState(false);
  const [vistaMovil, setVistaMovil] = useState<"editar" | "previa">("editar");

  const json = useMemo(() => JSON.stringify(borrador), [borrador]);
  const cambios = json !== guardadoJson;
  const validacion = useMemo(() => leccionInteractivaSchema.safeParse(borrador), [borrador]);
  const conEjemplo = useMemo(() => pantallasConEjemplo(borrador), [borrador]);
  const conVacios = useMemo(() => pantallasConVacios(borrador), [borrador]);
  const errores = useMemo(() => {
    const porPantalla = new Map<number, string[]>();
    const generales: string[] = [];
    if (!validacion.success) {
      for (const issue of validacion.error.issues) {
        const [raiz, n] = issue.path;
        const texto = problemasDeContenido([issue])[0].replace(/^Pantalla \d+: /, "");
        if (raiz === "bloques" && typeof n === "number") porPantalla.set(n, [...(porPantalla.get(n) ?? []), texto]);
        else generales.push(texto);
      }
    }
    return { porPantalla, generales };
  }, [validacion]);
  const sinGuia = guiaIncompleta(borrador);
  const orden = useMemo(() => problemasDeOrden(borrador), [borrador]);
  const listo = validacion.success && !conEjemplo.length && !conVacios.length && !sinGuia && !orden.length;

  // ---- Borrador en este navegador ----
  const claveBorrador = `kg-editor-${leccion.id}`;
  // Al abrir: ¿quedó un borrador sin guardar de una sesión anterior?
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const g = leerBorrador(claveBorrador);
    if (g && JSON.stringify(g.contenido) !== JSON.stringify(inicial)) setRecuperable(g);
  }, [claveBorrador, inicial]);
  /* eslint-enable react-hooks/set-state-in-effect */
  // Mientras haya cambios, se guarda (poco después de dejar de escribir).
  useEffect(() => {
    if (!cambios) return;
    const t = setTimeout(() => {
      try {
        localStorage.setItem(claveBorrador, JSON.stringify({ contenido: borrador, huellaBase, fecha: new Date().toISOString() } satisfies BorradorLocal));
      } catch {
        /* Sin almacenamiento: el aviso al salir sigue protegiendo. */
      }
    }, 600);
    return () => clearTimeout(t);
  }, [borrador, cambios, claveBorrador, huellaBase]);

  function recuperarBorrador() {
    if (!recuperable) return;
    setBorrador(recuperable.contenido);
    // Se conserva la base de ese borrador: si otra persona guardó después, al
    // guardar se avisa en vez de pisar su versión.
    setHuellaBase(recuperable.huellaBase);
    setSel(0);
    setRecuperable(null);
    setMsg({ ok: true, text: "Borrador recuperado. Revíselo y pulse «Guardar»." });
  }
  function descartarBorrador() {
    try {
      localStorage.removeItem(claveBorrador);
    } catch {
      /* Ignorado. */
    }
    setRecuperable(null);
  }

  // Aviso del navegador al cerrar o recargar con cambios sin guardar.
  useEffect(() => {
    if (!cambios) return;
    const avisar = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", avisar);
    return () => window.removeEventListener("beforeunload", avisar);
  }, [cambios]);

  // Y al salir por un enlace de la plataforma (menú, migas), que no dispara el aviso del navegador.
  useEffect(() => {
    if (!cambios) return;
    const alSalir = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a || a.target === "_blank" || a.origin !== window.location.origin || a.pathname === window.location.pathname) return;
      if (!confirm("Tiene cambios sin guardar. Quedan como borrador en este navegador y podrá recuperarlos al volver. ¿Salir de todos modos?")) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    document.addEventListener("click", alSalir, true);
    return () => document.removeEventListener("click", alSalir, true);
  }, [cambios]);

  const cambiarBloque = (i: number, b: Bloque) => setBorrador((d) => ({ ...d, bloques: d.bloques.map((x, j) => (j === i ? b : x)) }));

  function moverBloque(desde: number, hasta: number) {
    setBorrador((d) => ({ ...d, bloques: mover(d.bloques, desde, hasta) }));
    setSel(hasta);
  }
  function quitarBloque(i: number) {
    if (!confirm(`¿Quitar la pantalla ${i + 1} (${NOMBRE_TIPO[borrador.bloques[i].tipo]})?`)) return;
    setBorrador((d) => ({ ...d, bloques: d.bloques.filter((_, j) => j !== i) }));
    setSel(Math.max(0, i - 1));
  }
  function duplicarBloque(i: number) {
    setBorrador((d) => ({ ...d, bloques: [...d.bloques.slice(0, i + 1), structuredClone(d.bloques[i]), ...d.bloques.slice(i + 1)] }));
    setSel(i + 1);
  }
  function agregarBloque(tipo: TipoBloque) {
    // Después de la pantalla abierta; con todas cerradas, al final.
    const donde = sel >= 0 ? Math.min(sel + 1, borrador.bloques.length) : borrador.bloques.length;
    setBorrador((d) => ({ ...d, bloques: [...d.bloques.slice(0, donde), bloqueNuevo(tipo), ...d.bloques.slice(donde)] }));
    setSel(donde);
    setAgregando(false);
  }

  async function guardar(forzar = false) {
    if (!listo || guardando || (!cambios && !forzar)) return;
    setGuardando(true);
    setMsg(null);
    const { ok, status, data } = await pedirApi<{ huella?: string }>("/api/admin/leccion/interactiva", "PUT", {
      lessonId: leccion.id,
      contenido: borrador,
      huellaBase,
      forzar,
    });
    setGuardando(false);
    // Solo es éxito si el servidor confirma la versión guardada.
    if (!ok || typeof data.huella !== "string") {
      return setMsg({ ok: false, text: data.error ?? "No se pudo guardar.", conflicto: status === 409 });
    }
    setGuardadoJson(json);
    setHuellaBase(data.huella);
    descartarBorrador();
    setMsg({ ok: true, text: "Guardado. Los trabajadores verán esta versión la próxima vez que abran la lección." });
    router.refresh();
  }

  // Ctrl+S / Cmd+S guarda.
  const guardarRef = useRef(guardar);
  useEffect(() => {
    guardarRef.current = guardar;
  });
  useEffect(() => {
    const atajo = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        void guardarRef.current();
      }
    };
    window.addEventListener("keydown", atajo);
    return () => window.removeEventListener("keydown", atajo);
  }, []);

  function restaurar(v: VersionGuardada) {
    if (cambios && !confirm("Tiene cambios sin guardar que se perderán. ¿Cargar esa versión?")) return;
    setBorrador(v.contenido);
    setSel(0);
    setVerHistorial(false);
    setMsg({ ok: true, text: `Se cargó la versión guardada el ${v.fecha}: revísela y pulse «Guardar» para restaurarla.` });
  }

  // La vista previa se vuelve a dibujar poco después de dejar de escribir, no con cada tecla.
  const [previa, setPrevia] = useState(() => ({ contenido: validacion.success ? validacion.data : null, inicio: 0, clave: "inicial" }));
  useEffect(() => {
    const t = setTimeout(
      () =>
        setPrevia({
          contenido: validacion.success ? validacion.data : null,
          inicio: Math.max(sel, 0),
          clave: `${Math.max(sel, 0)}-${huellaContenido(json)}`,
        }),
      450
    );
    return () => clearTimeout(t);
  }, [validacion, sel, json]);

  const nada = useCallback(() => {}, []);
  const guia = borrador.guia;

  return (
    <div>
      {/* Barra de acciones */}
      <div className="sticky top-16 z-20 -mx-4 mb-5 border-b border-navy-100 bg-cloud/95 px-4 py-3 backdrop-blur lg:-mx-8 lg:px-8">
        <div className="flex flex-wrap items-center gap-3">
          <div className="min-w-0 basis-full sm:basis-auto sm:flex-1">
            <p className="truncate font-display text-base font-bold text-navy-700">{leccion.titulo}</p>
            <p className="truncate text-[11px] text-navy-400">
              {leccion.modulo} · {borrador.bloques.length} pantallas ·{" "}
              {cambios ? <span className="font-bold text-amber-700">cambios sin guardar</span> : <span className="text-lime-700">sin cambios pendientes</span>}
            </p>
          </div>
          <button type="button" onClick={() => setVerHistorial(!verHistorial)} className="btn-ghost btn-sm">
            Historial ({historial.length})
          </button>
          <Link href={`/aula/curso/${leccion.cursoSlug}?leccion=${leccion.id}`} target="_blank" className="btn-outline btn-sm">
            <IconEye width={14} height={14} /> Ver en el aula
          </Link>
          <button type="button" onClick={() => guardar()} disabled={!listo || !cambios || guardando} className="btn-lime btn-sm" title="Ctrl+S">
            {guardando ? "Guardando..." : "Guardar"}
          </button>
        </div>
        {!listo && (
          <p className="mt-2 flex flex-wrap items-center gap-1.5 text-xs font-semibold text-amber-800">
            <IconAlert width={14} height={14} />
            {!validacion.success && `Hay errores en ${errores.porPantalla.size || 1} pantalla(s). `}
            {conEjemplo.length > 0 && `Textos de ejemplo (✎) en la pantalla ${conEjemplo.join(", ")}. `}
            {conVacios.length > 0 && `Campos vacíos en la pantalla ${conVacios.join(", ")}. `}
            {sinGuia && "Falta el nombre o el rol del personaje guía. "}
            {orden.length > 0 && `${orden.join(" ")} `}
            Corríjalos para poder guardar.
          </p>
        )}
      </div>

      {aviso && (
        <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          <IconAlert width={18} height={18} className="mt-0.5 shrink-0" /> {aviso}
        </div>
      )}
      {recuperable && (
        <div className="mb-4 flex flex-wrap items-center gap-2.5 rounded-xl border border-sky-200 bg-sky-50 p-3 text-sm text-sky-900">
          <IconAlert width={18} height={18} />
          <span className="flex-1">
            Hay un borrador sin guardar de esta lección en este navegador ({new Date(recuperable.fecha).toLocaleString("es-CO")}).
          </span>
          <button type="button" onClick={recuperarBorrador} className="btn-outline btn-sm">
            Recuperar borrador
          </button>
          <button type="button" onClick={descartarBorrador} className="btn-ghost btn-sm">
            Descartar
          </button>
        </div>
      )}
      {msg && (
        <div className={`mb-4 flex flex-wrap items-center gap-2.5 rounded-xl border p-3 text-sm ${msg.ok ? "border-lime-200 bg-lime-50 text-lime-800" : "border-red-200 bg-red-50 text-red-700"}`}>
          {msg.ok ? <IconCheck width={18} height={18} strokeWidth={3} /> : <IconAlert width={18} height={18} />}
          <span className="flex-1">{msg.text}</span>
          {msg.conflicto && (
            <>
              <button
                type="button"
                onClick={() => {
                  if (confirm("Su versión reemplazará la que guardó la otra persona (esa queda en el historial). ¿Continuar?")) void guardar(true);
                }}
                className="btn-outline btn-sm"
              >
                Reemplazar con mi versión
              </button>
              <button type="button" onClick={() => window.location.reload()} className="btn-ghost btn-sm" title="Su borrador queda guardado en este navegador">
                Ver la versión actual
              </button>
            </>
          )}
        </div>
      )}

      {verHistorial && (
        <div className="card mb-5 p-5">
          <p className="font-display text-sm font-bold text-navy-700">Versiones guardadas</p>
          <p className="mb-3 text-xs text-navy-400">Cargue una versión anterior para revisarla; solo se restaura si la guarda.</p>
          {historial.length === 0 ? (
            <p className="text-xs text-navy-400">Todavía no hay versiones guardadas desde el editor.</p>
          ) : (
            <ul className="divide-y divide-navy-50">
              {historial.map((v) => (
                <li key={v.id} className="flex flex-wrap items-center gap-3 py-2.5 text-sm">
                  <span className="min-w-0 flex-1">
                    <span className="font-semibold text-navy-700">{v.fecha}</span>
                    <span className="ml-2 text-xs text-navy-400">
                      {v.autor} · {v.pantallas} pantallas
                    </span>
                  </span>
                  <button type="button" onClick={() => restaurar(v)} className="btn-outline btn-sm">
                    Cargar esta versión
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* En celular se alterna entre editar y ver */}
      <div className="mb-4 flex rounded-xl bg-navy-50 p-1 lg:hidden">
        {(["editar", "previa"] as const).map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => setVistaMovil(v)}
            className={`flex-1 rounded-lg py-2 text-sm font-semibold ${vistaMovil === v ? "bg-white text-navy-700 shadow" : "text-navy-400"}`}
          >
            {v === "editar" ? "Editar" : "Vista previa"}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        {/* ------------------------------ Edición ------------------------------ */}
        <div className={`space-y-4 ${vistaMovil === "previa" ? "hidden lg:block" : ""}`}>
          <div className="card p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-display text-sm font-bold text-navy-700">Guía de la lección</p>
              <label className="flex min-w-0 cursor-pointer items-center gap-2 text-xs font-semibold text-navy-600">
                <input
                  type="checkbox"
                  checked={!!guia}
                  onChange={(e) => setBorrador((d) => ({ ...d, guia: e.target.checked ? { nombre: "", rol: "", avatar: "brigadista" } : undefined }))}
                />
                Tiene un personaje que acompaña
              </label>
            </div>
            {guia && (
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <Texto etiqueta="Nombre" valor={guia.nombre} onChange={(v) => setBorrador((d) => ({ ...d, guia: { ...guia, nombre: v } }))} marcador="Ej.: Camila Rojas" />
                <Texto etiqueta="Rol" valor={guia.rol} onChange={(v) => setBorrador((d) => ({ ...d, guia: { ...guia, rol: v } }))} marcador="Ej.: Coordinadora de brigada" />
                <Seleccion
                  etiqueta="Personaje"
                  valor={guia.avatar}
                  opciones={AVATARES.map((a) => ({ valor: a, nombre: a === "brigadista" ? "Brigadista" : "Paramédico" }))}
                  vacio="Solo iniciales"
                  onChange={(v) => setBorrador((d) => ({ ...d, guia: { ...guia, avatar: v } }))}
                />
              </div>
            )}
            {errores.generales.length > 0 && (
              <ul className="mt-3 space-y-1 text-xs text-red-600">
                {errores.generales.map((e, i) => (
                  <li key={i}>{e}</li>
                ))}
              </ul>
            )}
          </div>

          {borrador.bloques.map((b, i) => {
            const abierto = i === sel;
            const problemas = errores.porPantalla.get(i) ?? [];
            const marcas = conEjemplo.includes(i + 1) || conVacios.includes(i + 1);
            return (
              <div key={i} className={`card overflow-hidden ${abierto ? "ring-2 ring-lime-400" : ""}`}>
                <div className="flex items-center gap-3 px-4 py-3">
                  <button type="button" onClick={() => setSel(abierto ? -1 : i)} className="flex min-w-0 flex-1 items-center gap-3 text-left">
                    <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-extrabold ${abierto ? "bg-lime-500 text-navy-900" : "bg-navy-700 text-lime-400"}`}>
                      {i + 1}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[11px] font-extrabold uppercase tracking-wide text-navy-400">{NOMBRE_TIPO[b.tipo]}</span>
                        {BLOQUES_CALIFICABLES.has(b.tipo) && <span className="rounded bg-lime-100 px-1.5 text-[10px] font-bold text-lime-700">califica</span>}
                        {problemas.length > 0 && <span className="rounded bg-red-100 px-1.5 text-[10px] font-bold text-red-600">{problemas.length} error(es)</span>}
                        {marcas && <span className="rounded bg-amber-100 px-1.5 text-[10px] font-bold text-amber-700">por completar</span>}
                      </span>
                      <span className="block truncate text-sm font-semibold text-navy-700">{resumen(b)}</span>
                    </span>
                  </button>
                  <Acciones i={i} total={borrador.bloques.length} min={2} onMover={moverBloque} onQuitar={quitarBloque} onDuplicar={duplicarBloque} />
                </div>
                {abierto && (
                  <div className="border-t border-navy-50 bg-navy-50/30 p-4">
                    {problemas.length > 0 && (
                      <ul className="mb-4 space-y-1 rounded-lg bg-red-50 p-3 text-xs text-red-700">
                        {problemas.map((p, k) => (
                          <li key={k}>• {p}</li>
                        ))}
                      </ul>
                    )}
                    <EditorBloque key={`${i}-${b.tipo}`} bloque={b} indice={i} onChange={(nb) => cambiarBloque(i, nb)} />
                  </div>
                )}
              </div>
            );
          })}

          {agregando ? (
            <div className="card p-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-bold text-navy-700">
                  Agregar pantalla {sel >= 0 ? `después de la ${sel + 1}` : "al final"}
                </p>
                <button type="button" onClick={() => setAgregando(false)} className="text-xs font-semibold text-navy-400 hover:text-navy-700">
                  Cancelar
                </button>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {TIPOS_BLOQUE.map((t) => (
                  <button
                    key={t.tipo}
                    type="button"
                    onClick={() => agregarBloque(t.tipo)}
                    className="rounded-xl border border-navy-100 p-3 text-left transition hover:border-lime-400 hover:bg-lime-50"
                  >
                    <span className="flex items-center gap-1.5 text-sm font-bold text-navy-700">
                      {t.nombre}
                      {t.califica && <span className="rounded bg-lime-100 px-1.5 text-[10px] font-bold text-lime-700">califica</span>}
                    </span>
                    <span className="mt-0.5 block text-[11px] leading-relaxed text-navy-400">{t.descripcion}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <button type="button" onClick={() => setAgregando(true)} className="btn-outline w-full border-dashed">
              + Agregar pantalla
            </button>
          )}
        </div>

        {/* ---------------------------- Vista previa ---------------------------- */}
        <div className={vistaMovil === "editar" ? "hidden lg:block" : ""}>
          <div className="lg:sticky lg:top-44">
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-navy-400">
              Vista previa{sel >= 0 ? ` · pantalla ${sel + 1}` : ""} · así la verá el trabajador
            </p>
            {previa.contenido ? (
              <VistaPrevia
                key={previa.clave}
                leccionId={`previa-${leccion.id}`}
                contenido={previa.contenido}
                completada={false}
                guardando={false}
                onTerminar={nada}
                onCompletar={nada}
                vistaPrevia
                inicio={previa.inicio}
              />
            ) : (
              <div className="rounded-2xl border-2 border-dashed border-navy-200 p-8 text-center text-sm text-navy-400">
                Corrija los errores marcados para ver la vista previa.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
