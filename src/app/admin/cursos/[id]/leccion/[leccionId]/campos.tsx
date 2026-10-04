"use client";

import type { ReactNode } from "react";
import { MARCA_EJEMPLO } from "@/lib/plantillas-leccion";

/**
 * Piezas de formulario del editor de lecciones interactivas. Todas son
 * controladas: reciben el valor y avisan el cambio, sin estado propio.
 */

const marcaEjemplo = (v: string | undefined) => !!v && v.includes(MARCA_EJEMPLO);

/** Un texto que, vacío, se guarda como ausente (para los campos opcionales). */
export const opcional = (v: string) => (v.trim() ? v : undefined);

export function Etiqueta({ texto, ayuda, children }: { texto: string; ayuda?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-bold text-navy-600">{texto}</span>
      {children}
      {ayuda && <span className="mt-1 block text-[11px] leading-relaxed text-navy-400">{ayuda}</span>}
    </label>
  );
}

export function Texto({
  etiqueta,
  valor,
  onChange,
  ayuda,
  largo = false,
  filas = 3,
  marcador,
}: {
  etiqueta: string;
  valor: string | undefined;
  onChange: (v: string) => void;
  ayuda?: string;
  /** Varias líneas (párrafos, retroalimentación). */
  largo?: boolean;
  filas?: number;
  marcador?: string;
}) {
  const clase = `input text-sm ${marcaEjemplo(valor) ? "border-amber-400 bg-amber-50" : ""}`;
  return (
    <Etiqueta texto={etiqueta} ayuda={ayuda}>
      {largo ? (
        <textarea value={valor ?? ""} onChange={(e) => onChange(e.target.value)} rows={filas} className={clase} placeholder={marcador} />
      ) : (
        <input value={valor ?? ""} onChange={(e) => onChange(e.target.value)} className={clase} placeholder={marcador} />
      )}
    </Etiqueta>
  );
}

export function Numero({
  etiqueta,
  valor,
  onChange,
  min,
  max,
  paso = 1,
  ayuda,
}: {
  etiqueta: string;
  valor: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  paso?: number;
  ayuda?: string;
}) {
  return (
    <Etiqueta texto={etiqueta} ayuda={ayuda}>
      <input
        type="number"
        value={Number.isFinite(valor) ? valor : ""}
        min={min}
        max={max}
        step={paso}
        onChange={(e) => onChange(e.target.value === "" ? NaN : Number(e.target.value))}
        className="input text-sm"
      />
    </Etiqueta>
  );
}

export function Seleccion<T extends string>({
  etiqueta,
  valor,
  opciones,
  onChange,
  vacio,
  ayuda,
}: {
  etiqueta: string;
  valor: T | undefined;
  opciones: { valor: T; nombre: string }[];
  onChange: (v: T | undefined) => void;
  /** Texto de la opción "ninguna"; si no se da, elegir es obligatorio. */
  vacio?: string;
  ayuda?: string;
}) {
  return (
    <Etiqueta texto={etiqueta} ayuda={ayuda}>
      <select value={valor ?? ""} onChange={(e) => onChange((e.target.value || undefined) as T | undefined)} className="select text-sm">
        {vacio !== undefined && <option value="">{vacio}</option>}
        {opciones.map((o) => (
          <option key={o.valor} value={o.valor}>
            {o.nombre}
          </option>
        ))}
      </select>
    </Etiqueta>
  );
}

/** Botones pequeños para mover, duplicar o quitar un elemento de una lista. */
export function Acciones({
  i,
  total,
  min,
  onMover,
  onQuitar,
  onDuplicar,
}: {
  i: number;
  total: number;
  min: number;
  onMover: (desde: number, hasta: number) => void;
  onQuitar: (i: number) => void;
  onDuplicar?: (i: number) => void;
}) {
  const boton = "flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold text-navy-400 transition hover:bg-navy-100 hover:text-navy-700 disabled:opacity-30";
  return (
    <span className="flex shrink-0 items-center gap-0.5">
      <button type="button" title="Subir" aria-label="Subir" disabled={i === 0} onClick={() => onMover(i, i - 1)} className={boton}>
        ↑
      </button>
      <button type="button" title="Bajar" aria-label="Bajar" disabled={i === total - 1} onClick={() => onMover(i, i + 1)} className={boton}>
        ↓
      </button>
      {onDuplicar && (
        <button type="button" title="Duplicar" aria-label="Duplicar" onClick={() => onDuplicar(i)} className={boton}>
          ⧉
        </button>
      )}
      <button
        type="button"
        title={total <= min ? `Debe haber al menos ${min}` : "Quitar"}
        aria-label="Quitar"
        disabled={total <= min}
        onClick={() => onQuitar(i)}
        className={`${boton} hover:bg-red-50 hover:text-red-600`}
      >
        ✕
      </button>
    </span>
  );
}

/** Mueve un elemento de una posición a otra sin mutar la lista. */
export function mover<T>(lista: T[], desde: number, hasta: number) {
  if (hasta < 0 || hasta >= lista.length) return lista;
  const copia = [...lista];
  const [x] = copia.splice(desde, 1);
  copia.splice(hasta, 0, x);
  return copia;
}

/** Lista de textos (objetivos, párrafos, pasos...). */
export function ListaTextos({
  etiqueta,
  valores,
  onChange,
  min = 1,
  largo = false,
  nuevo = "",
  ayuda,
  numerada = false,
}: {
  etiqueta: string;
  valores: string[];
  onChange: (v: string[]) => void;
  min?: number;
  largo?: boolean;
  nuevo?: string;
  ayuda?: string;
  /** Muestra el número de cada elemento (útil para pasos en orden). */
  numerada?: boolean;
}) {
  return (
    <div>
      <p className="mb-1 text-xs font-bold text-navy-600">{etiqueta}</p>
      {ayuda && <p className="mb-2 text-[11px] leading-relaxed text-navy-400">{ayuda}</p>}
      <div className="space-y-2">
        {valores.map((v, i) => (
          <div key={i} className="flex items-start gap-2">
            {numerada && <span className="mt-2 w-5 shrink-0 text-right text-xs font-bold text-navy-400">{i + 1}.</span>}
            <div className="min-w-0 flex-1">
              {largo ? (
                <textarea
                  value={v}
                  rows={3}
                  onChange={(e) => onChange(valores.map((x, j) => (j === i ? e.target.value : x)))}
                  className={`input text-sm ${marcaEjemplo(v) ? "border-amber-400 bg-amber-50" : ""}`}
                />
              ) : (
                <input
                  value={v}
                  onChange={(e) => onChange(valores.map((x, j) => (j === i ? e.target.value : x)))}
                  className={`input text-sm ${marcaEjemplo(v) ? "border-amber-400 bg-amber-50" : ""}`}
                />
              )}
            </div>
            <Acciones
              i={i}
              total={valores.length}
              min={min}
              onMover={(a, b) => onChange(mover(valores, a, b))}
              onQuitar={(j) => onChange(valores.filter((_, k) => k !== j))}
            />
          </div>
        ))}
      </div>
      <button type="button" onClick={() => onChange([...valores, nuevo])} className="mt-2 text-xs font-bold text-lime-700 hover:underline">
        + Agregar
      </button>
    </div>
  );
}

/** Lista de objetos con su propio formulario (tarjetas, puntos clave, pasos de misión...). */
export function ListaItems<T>({
  etiqueta,
  items,
  onChange,
  nuevo,
  min = 0,
  titulo,
  render,
  ayuda,
  alDuplicar = (x) => structuredClone(x),
}: {
  etiqueta: string;
  /** El tipo de los elementos sale de aquí (no del elemento nuevo, que puede omitir opcionales). */
  items: T[];
  onChange: (v: NoInfer<T>[]) => void;
  nuevo: () => NoInfer<T>;
  min?: number;
  titulo: (item: NoInfer<T>, i: number) => string;
  render: (item: NoInfer<T>, cambiar: (v: NoInfer<T>) => void, i: number) => ReactNode;
  ayuda?: string;
  /** Cómo nace la copia de un elemento (por defecto, idéntica). */
  alDuplicar?: (item: NoInfer<T>) => NoInfer<T>;
}) {
  return (
    <div>
      <p className="mb-1 text-xs font-bold text-navy-600">{etiqueta}</p>
      {ayuda && <p className="mb-2 text-[11px] leading-relaxed text-navy-400">{ayuda}</p>}
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="rounded-xl border border-navy-100 bg-white p-3">
            <div className="mb-2 flex items-center gap-2">
              <span className="min-w-0 flex-1 truncate text-xs font-bold text-navy-500">{titulo(item, i)}</span>
              <Acciones
                i={i}
                total={items.length}
                min={min}
                onMover={(a, b) => onChange(mover(items, a, b))}
                onQuitar={(j) => onChange(items.filter((_, k) => k !== j))}
                onDuplicar={(j) => onChange([...items.slice(0, j + 1), alDuplicar(items[j]), ...items.slice(j + 1)])}
              />
            </div>
            <div className="space-y-3">{render(item, (v) => onChange(items.map((x, j) => (j === i ? v : x))), i)}</div>
          </div>
        ))}
      </div>
      <button type="button" onClick={() => onChange([...items, nuevo()])} className="mt-2 text-xs font-bold text-lime-700 hover:underline">
        + Agregar
      </button>
    </div>
  );
}

type Opcion = { texto: string; correcta?: boolean; retro: string };

/** Opciones de respuesta con su retroalimentación; exactamente una es la correcta. */
export function Opciones({ opciones, onChange, nombre }: { opciones: Opcion[]; onChange: (v: Opcion[]) => void; nombre: string }) {
  return (
    <ListaItems
      etiqueta="Opciones de respuesta"
      ayuda="Marque la correcta. En cada opción escriba lo que pasa si el trabajador la elige: es lo que aprende."
      items={opciones}
      onChange={onChange}
      min={2}
      nuevo={() => ({ texto: "", retro: "" })}
      // Solo una opción es la correcta: la copia nace sin marcar.
      alDuplicar={(o) => ({ ...o, correcta: undefined })}
      titulo={(o, i) => `Opción ${i + 1}${o.correcta ? " · correcta" : ""}`}
      render={(o, cambiar, i) => (
        <>
          <Texto etiqueta="Texto de la opción" valor={o.texto} onChange={(v) => cambiar({ ...o, texto: v })} />
          <label className="flex cursor-pointer items-center gap-2 text-xs font-semibold text-navy-600">
            <input
              type="radio"
              name={nombre}
              checked={!!o.correcta}
              onChange={() => onChange(opciones.map((x, j) => ({ ...x, correcta: j === i ? true : undefined })))}
            />
            Esta es la respuesta correcta
          </label>
          <Texto etiqueta="Qué pasa si la elige" valor={o.retro} onChange={(v) => cambiar({ ...o, retro: v })} largo filas={2} />
        </>
      )}
    />
  );
}
