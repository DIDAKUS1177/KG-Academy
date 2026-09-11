"use client";

/**
 * Piezas compartidas por los formularios del panel de administración:
 * el aviso de resultado, la ventana emergente y la caja que muestra una
 * contraseña temporal recién generada.
 *
 * Son deliberadamente simples: sin dependencias, con el mismo lenguaje visual
 * que el resto del panel (clases .card, .input, .btn-* de globals.css).
 */

import { useEffect, useState, type ReactNode } from "react";
import { IconAlert, IconCheck, IconX } from "@/components/Icons";

export type Mensaje = { ok: boolean; text: string } | null;

export function Aviso({ msg }: { msg: Mensaje }) {
  if (!msg) return null;
  return (
    <div
      role="status"
      className={`flex items-start gap-2.5 rounded-xl border p-3 text-sm ${
        msg.ok ? "border-lime-200 bg-lime-50 text-lime-800" : "border-red-200 bg-red-50 text-red-700"
      }`}
    >
      {msg.ok ? (
        <IconCheck width={18} height={18} strokeWidth={3} className="shrink-0" />
      ) : (
        <IconAlert width={18} height={18} className="shrink-0" />
      )}
      {msg.text}
    </div>
  );
}

/** Ventana emergente centrada. Se cierra con Escape, con el fondo o con la X. */
export function Ventana({
  titulo,
  descripcion,
  onCerrar,
  ancho = "max-w-2xl",
  children,
}: {
  titulo: string;
  descripcion?: string;
  onCerrar: () => void;
  ancho?: string;
  children: ReactNode;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onCerrar();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onCerrar]);

  return (
    <div
      className="fixed inset-0 z-[120] flex items-start justify-center overflow-y-auto bg-navy-900/60 p-4 backdrop-blur-sm sm:items-center"
      onMouseDown={(e) => e.target === e.currentTarget && onCerrar()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="ventana-titulo"
        className={`card my-6 w-full ${ancho} overflow-hidden shadow-kg-lg`}
      >
        <div className="flex items-start justify-between gap-4 border-b border-navy-50 bg-navy-50/50 px-6 py-4">
          <div>
            <p id="ventana-titulo" className="font-display text-base font-bold text-navy-700">
              {titulo}
            </p>
            {descripcion && <p className="mt-0.5 text-xs text-navy-400">{descripcion}</p>}
          </div>
          <button
            type="button"
            onClick={onCerrar}
            aria-label="Cerrar"
            className="rounded-lg p-1.5 text-navy-400 transition hover:bg-navy-100 hover:text-navy-700"
          >
            <IconX width={18} height={18} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

/** Muestra una contraseña temporal con botón de copiar. */
export function ClaveGenerada({ clave, para }: { clave: string; para: string }) {
  const [copiada, setCopiada] = useState(false);

  async function copiar() {
    try {
      await navigator.clipboard.writeText(clave);
      setCopiada(true);
      setTimeout(() => setCopiada(false), 2000);
    } catch {
      /* Sin permiso de portapapeles: la clave sigue visible para copiarla a mano. */
    }
  }

  return (
    <div className="rounded-xl border border-lime-300 bg-lime-50 p-4">
      <p className="text-xs font-semibold text-lime-800">Contraseña temporal para {para}</p>
      <div className="mt-2 flex flex-wrap items-center gap-3">
        <code className="rounded-lg bg-white px-3 py-2 font-mono text-base font-bold tracking-wide text-navy-800">
          {clave}
        </code>
        <button type="button" onClick={copiar} className="btn-outline btn-sm">
          {copiada ? "Copiada" : "Copiar"}
        </button>
      </div>
      <p className="mt-2 text-[11px] leading-relaxed text-lime-800/80">
        Entréguela por un canal seguro. No vuelve a mostrarse: si se pierde, restablezca la contraseña
        de nuevo.
      </p>
    </div>
  );
}

/** Campo con etiqueta, para no repetir el mismo bloque en cada formulario. */
export function Campo({
  label,
  children,
  ancho,
  ayuda,
}: {
  label: string;
  children: ReactNode;
  ancho?: string;
  ayuda?: string;
}) {
  return (
    <div className={ancho}>
      <label className="label">{label}</label>
      {children}
      {ayuda && <p className="mt-1 text-[11px] text-navy-400">{ayuda}</p>}
    </div>
  );
}

/** Envía JSON y devuelve {ok, data}. Centraliza el manejo de errores de red. */
export async function llamar<T = Record<string, unknown>>(
  url: string,
  method: "POST" | "PUT" | "PATCH" | "DELETE",
  body: unknown
): Promise<{ ok: boolean; data: T & { error?: string } }> {
  try {
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = (await res.json().catch(() => ({}))) as T & { error?: string };
    return { ok: res.ok, data };
  } catch {
    return { ok: false, data: { error: "Sin conexión con el servidor" } as T & { error?: string } };
  }
}

/** Lee un formulario y devuelve un objeto plano; las casillas van como booleanos. */
export function leerFormulario(form: HTMLFormElement) {
  const fd = new FormData(form);
  const out: Record<string, unknown> = {};
  for (const [k, v] of fd.entries()) out[k] = typeof v === "string" ? v : "";
  form.querySelectorAll<HTMLInputElement>('input[type="checkbox"]').forEach((c) => {
    out[c.name] = c.checked;
  });
  return out;
}
