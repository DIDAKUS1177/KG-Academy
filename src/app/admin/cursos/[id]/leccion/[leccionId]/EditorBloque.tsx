"use client";

import { useRef, useState } from "react";
import { ESCENAS, ILUSTRACIONES, type Bloque } from "@/lib/leccion-interactiva";
import { NOMBRE_ESCENA, NOMBRE_ILUSTRACION } from "@/lib/plantillas-leccion";
import { Escena } from "@/components/leccion/Escenas";
import { ListaItems, ListaTextos, Numero, Opciones, Seleccion, Texto, opcional } from "./campos";

const ilustraciones = ILUSTRACIONES.map((v) => ({ valor: v, nombre: NOMBRE_ILUSTRACION[v] }));
const escenas = ESCENAS.map((v) => ({ valor: v, nombre: NOMBRE_ESCENA[v] }));

/** Lo que dice el guía en esta pantalla (opcional, en todas). */
function Dice({ valor, onChange }: { valor: string | undefined; onChange: (v: string | undefined) => void }) {
  return (
    <Texto
      etiqueta="Lo que dice el guía (opcional)"
      valor={valor}
      onChange={(v) => onChange(opcional(v))}
      largo
      filas={2}
      ayuda="Aparece en un globo de diálogo junto al personaje."
    />
  );
}

type Objetivo = Extract<Bloque, { tipo: "buscar" }>["objetivos"][number];

/** Escena con los peligros marcados: se elige uno y se toca el dibujo para ubicarlo. */
function UbicarPeligros({
  escena,
  objetivos,
  onChange,
}: {
  escena: Extract<Bloque, { tipo: "buscar" }>["escena"];
  objetivos: Objetivo[];
  onChange: (v: Objetivo[]) => void;
}) {
  const [elegido, setActivo] = useState(0);
  // Si se quitó el peligro elegido, se toma el primero.
  const activo = elegido < objetivos.length ? elegido : 0;
  const svg = useRef<SVGSVGElement>(null);

  function tocar(e: React.MouseEvent<SVGSVGElement>) {
    const r = svg.current?.getBoundingClientRect();
    if (!r || !objetivos[activo]) return;
    const x = Math.round(((e.clientX - r.left) / r.width) * 800);
    const y = Math.round(((e.clientY - r.top) / r.height) * 450);
    onChange(objetivos.map((o, i) => (i === activo ? { ...o, x, y } : o)));
  }

  return (
    <div>
      <p className="mb-1 text-xs font-bold text-navy-600">Ubicación de los peligros en la escena</p>
      <p className="mb-2 text-[11px] leading-relaxed text-navy-400">
        Elija un peligro y toque el dibujo donde está. El círculo es el área donde el trabajador debe tocar.
      </p>
      <div className="mb-2 flex flex-wrap gap-1.5">
        {objetivos.map((o, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActivo(i)}
            className={`rounded-full px-2.5 py-1 text-[11px] font-bold transition ${i === activo ? "bg-navy-700 text-white" : "bg-navy-50 text-navy-600 hover:bg-navy-100"}`}
          >
            {i + 1}. {o.nombre.slice(0, 24) || "Peligro"}
          </button>
        ))}
      </div>
      <div className="overflow-hidden rounded-xl ring-2 ring-navy-900">
        <svg ref={svg} viewBox="0 0 800 450" className="block w-full cursor-crosshair select-none" onClick={tocar} role="img" aria-label="Escena para ubicar los peligros">
          <Escena id={escena} />
          {objetivos.map((o, i) => (
            <g key={i} pointerEvents="none">
              <circle
                cx={o.x}
                cy={o.y}
                r={o.r ?? 42}
                fill={i === activo ? "rgba(143,191,22,.30)" : "rgba(10,45,77,.18)"}
                stroke={i === activo ? "#8FBF16" : "#0A2D4D"}
                strokeWidth="4"
                strokeDasharray={i === activo ? undefined : "8 6"}
              />
              <text x={o.x} y={o.y + 7} textAnchor="middle" fontSize="22" fontWeight="800" fill="#0A2D4D">
                {i + 1}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}

/** Formulario de una pantalla según su tipo. */
export function EditorBloque({ bloque, onChange, indice }: { bloque: Bloque; onChange: (b: Bloque) => void; indice: number }) {
  const b = bloque;
  switch (b.tipo) {
    case "portada": {
      const set = (c: Partial<typeof b>) => onChange({ ...b, ...c });
      return (
        <div className="space-y-4">
          <Texto etiqueta="Título" valor={b.titulo} onChange={(v) => set({ titulo: v })} />
          <Texto etiqueta="Subtítulo (opcional)" valor={b.subtitulo} onChange={(v) => set({ subtitulo: opcional(v) })} />
          <ListaTextos etiqueta="Objetivos de la lección" valores={b.objetivos} onChange={(v) => set({ objetivos: v })} />
          <Numero etiqueta="Minutos que toma" valor={b.minutos} onChange={(v) => set({ minutos: v })} min={1} max={240} />
          <Dice valor={b.dice} onChange={(v) => set({ dice: v })} />
        </div>
      );
    }
    case "explicacion": {
      const set = (c: Partial<typeof b>) => onChange({ ...b, ...c });
      return (
        <div className="space-y-4">
          <Texto etiqueta="Título" valor={b.titulo} onChange={(v) => set({ titulo: v })} />
          <ListaTextos etiqueta="Párrafos" valores={b.parrafos} onChange={(v) => set({ parrafos: v })} largo />
          <ListaItems
            etiqueta="Ideas clave en tarjetas (opcional)"
            items={b.puntos ?? []}
            onChange={(v) => set({ puntos: v.length ? v : undefined })}
            nuevo={() => ({ titulo: "", texto: "" })}
            titulo={(p, i) => p.titulo || `Idea ${i + 1}`}
            render={(p, cambiar) => (
              <>
                <Texto etiqueta="Título corto" valor={p.titulo} onChange={(v) => cambiar({ ...p, titulo: v })} />
                <Texto etiqueta="Texto" valor={p.texto} onChange={(v) => cambiar({ ...p, texto: v })} largo filas={2} />
              </>
            )}
          />
          <Texto
            etiqueta="Dato que no se puede olvidar (opcional)"
            valor={b.clave}
            onChange={(v) => set({ clave: opcional(v) })}
            largo
            filas={2}
            ayuda="Sale en un recuadro destacado."
          />
          <Seleccion etiqueta="Ilustración (opcional)" valor={b.ilustracion} opciones={ilustraciones} vacio="Sin ilustración" onChange={(v) => set({ ilustracion: v })} />
          <Dice valor={b.dice} onChange={(v) => set({ dice: v })} />
        </div>
      );
    }
    case "tarjetas": {
      const set = (c: Partial<typeof b>) => onChange({ ...b, ...c });
      return (
        <div className="space-y-4">
          <Texto etiqueta="Título" valor={b.titulo} onChange={(v) => set({ titulo: v })} />
          <Texto etiqueta="Instrucción (opcional)" valor={b.instruccion} onChange={(v) => set({ instruccion: opcional(v) })} />
          <ListaItems
            etiqueta="Tarjetas"
            ayuda="El trabajador ve el frente y la voltea para leer el reverso."
            items={b.tarjetas}
            onChange={(v) => set({ tarjetas: v })}
            min={2}
            nuevo={() => ({ frente: "", reverso: "" })}
            titulo={(t, i) => `Tarjeta ${i + 1}`}
            render={(t, cambiar) => (
              <>
                <Texto etiqueta="Etiqueta (opcional)" valor={t.etiqueta} onChange={(v) => cambiar({ ...t, etiqueta: opcional(v) })} marcador="Ej.: ¿Mito o realidad?" />
                <Texto etiqueta="Frente" valor={t.frente} onChange={(v) => cambiar({ ...t, frente: v })} largo filas={2} />
                <Texto etiqueta="Reverso" valor={t.reverso} onChange={(v) => cambiar({ ...t, reverso: v })} largo filas={2} />
              </>
            )}
          />
          <Dice valor={b.dice} onChange={(v) => set({ dice: v })} />
        </div>
      );
    }
    case "decision": {
      const set = (c: Partial<typeof b>) => onChange({ ...b, ...c });
      return (
        <div className="space-y-4">
          <Texto etiqueta="Título (opcional)" valor={b.titulo} onChange={(v) => set({ titulo: opcional(v) })} />
          <Texto etiqueta="Situación" valor={b.situacion} onChange={(v) => set({ situacion: v })} largo />
          <Texto etiqueta="Pregunta" valor={b.pregunta} onChange={(v) => set({ pregunta: v })} />
          <Opciones nombre={`correcta-${indice}`} opciones={b.opciones} onChange={(v) => set({ opciones: v })} />
          <Seleccion etiqueta="Ilustración (opcional)" valor={b.ilustracion} opciones={ilustraciones} vacio="Sin ilustración" onChange={(v) => set({ ilustracion: v })} />
          <Dice valor={b.dice} onChange={(v) => set({ dice: v })} />
        </div>
      );
    }
    case "contrarreloj": {
      const set = (c: Partial<typeof b>) => onChange({ ...b, ...c });
      return (
        <div className="space-y-4">
          <Texto etiqueta="Título (opcional)" valor={b.titulo} onChange={(v) => set({ titulo: opcional(v) })} />
          <Numero etiqueta="Segundos para decidir" valor={b.segundos} onChange={(v) => set({ segundos: v })} min={5} max={60} ayuda="Entre 5 y 60 segundos." />
          <Texto etiqueta="Situación" valor={b.situacion} onChange={(v) => set({ situacion: v })} largo />
          <Texto etiqueta="Pregunta" valor={b.pregunta} onChange={(v) => set({ pregunta: v })} />
          <Opciones nombre={`correcta-${indice}`} opciones={b.opciones} onChange={(v) => set({ opciones: v })} />
          <Texto etiqueta="Qué pasa si se acaba el tiempo" valor={b.alAgotar} onChange={(v) => set({ alAgotar: v })} largo filas={2} />
          <Dice valor={b.dice} onChange={(v) => set({ dice: v })} />
        </div>
      );
    }
    case "ordenar": {
      const set = (c: Partial<typeof b>) => onChange({ ...b, ...c });
      return (
        <div className="space-y-4">
          <Texto etiqueta="Título" valor={b.titulo} onChange={(v) => set({ titulo: v })} />
          <Texto etiqueta="Instrucción" valor={b.instruccion} onChange={(v) => set({ instruccion: v })} />
          <ListaTextos
            etiqueta="Pasos, en el orden CORRECTO"
            ayuda="Escríbalos en el orden correcto: la pantalla los baraja para el trabajador. Mínimo 3."
            valores={b.pasos}
            onChange={(v) => set({ pasos: v })}
            min={3}
            numerada
          />
          <Texto etiqueta="Explicación del orden" valor={b.explicacion} onChange={(v) => set({ explicacion: v })} largo filas={2} />
          <Dice valor={b.dice} onChange={(v) => set({ dice: v })} />
        </div>
      );
    }
    case "clasificar": {
      const set = (c: Partial<typeof b>) => onChange({ ...b, ...c });
      const grupos = b.categorias.map((c) => ({ valor: c.id, nombre: c.nombre || "(sin nombre)" }));
      return (
        <div className="space-y-4">
          <Texto etiqueta="Título" valor={b.titulo} onChange={(v) => set({ titulo: v })} />
          <Texto etiqueta="Instrucción" valor={b.instruccion} onChange={(v) => set({ instruccion: v })} />
          <ListaItems
            etiqueta="Grupos (entre 2 y 5)"
            items={b.categorias}
            onChange={(v) => {
              // Los elementos de un grupo que se quita pasan al primero que quede.
              const ids = new Set(v.map((c) => c.id));
              const primero = v[0]?.id ?? "";
              set({ categorias: v, elementos: b.elementos.map((e) => (ids.has(e.categoria) ? e : { ...e, categoria: primero })) });
            }}
            min={2}
            nuevo={() => ({ id: `g${Math.random().toString(36).slice(2, 8)}`, nombre: "" })}
            alDuplicar={(c) => ({ ...c, id: `g${Math.random().toString(36).slice(2, 8)}` })}
            titulo={(c, i) => c.nombre || `Grupo ${i + 1}`}
            render={(c, cambiar) => (
              <>
                <Texto etiqueta="Nombre del grupo" valor={c.nombre} onChange={(v) => cambiar({ ...c, nombre: v })} />
                <Texto etiqueta="Pista (opcional)" valor={c.pista} onChange={(v) => cambiar({ ...c, pista: opcional(v) })} />
              </>
            )}
          />
          <ListaItems
            etiqueta="Elementos para clasificar (mínimo 3)"
            items={b.elementos}
            onChange={(v) => set({ elementos: v })}
            min={3}
            nuevo={() => ({ texto: "", categoria: b.categorias[0]?.id ?? "" })}
            titulo={(e, i) => e.texto || `Elemento ${i + 1}`}
            render={(e, cambiar) => (
              <>
                <Texto etiqueta="Texto" valor={e.texto} onChange={(v) => cambiar({ ...e, texto: v })} />
                <Seleccion etiqueta="Grupo correcto" valor={e.categoria} opciones={grupos} onChange={(v) => cambiar({ ...e, categoria: v ?? "" })} />
                <Texto etiqueta="Por qué (opcional)" valor={e.porque} onChange={(v) => cambiar({ ...e, porque: opcional(v) })} largo filas={2} />
              </>
            )}
          />
          <Dice valor={b.dice} onChange={(v) => set({ dice: v })} />
        </div>
      );
    }
    case "buscar": {
      const set = (c: Partial<typeof b>) => onChange({ ...b, ...c });
      return (
        <div className="space-y-4">
          <Texto etiqueta="Título" valor={b.titulo} onChange={(v) => set({ titulo: v })} />
          <Texto etiqueta="Instrucción" valor={b.instruccion} onChange={(v) => set({ instruccion: v })} />
          <Seleccion etiqueta="Escena" valor={b.escena} opciones={escenas} onChange={(v) => v && set({ escena: v })} />
          <UbicarPeligros escena={b.escena} objetivos={b.objetivos} onChange={(v) => set({ objetivos: v })} />
          <ListaItems
            etiqueta="Peligros (mínimo 2)"
            items={b.objetivos}
            onChange={(v) => set({ objetivos: v })}
            min={2}
            nuevo={() => ({ x: 400, y: 225, nombre: "", explicacion: "" })}
            titulo={(o, i) => `${i + 1}. ${o.nombre || "Peligro"}`}
            render={(o, cambiar) => (
              <>
                <Texto etiqueta="Nombre del peligro" valor={o.nombre} onChange={(v) => cambiar({ ...o, nombre: v })} />
                <Texto etiqueta="Por qué es un peligro" valor={o.explicacion} onChange={(v) => cambiar({ ...o, explicacion: v })} largo filas={2} />
                <Numero
                  etiqueta="Tamaño del área para tocar"
                  valor={o.r ?? 42}
                  onChange={(v) => cambiar({ ...o, r: v === 42 ? undefined : v })}
                  min={15}
                  max={120}
                  ayuda="Entre 15 y 120. Lo normal es 42."
                />
              </>
            )}
          />
          <Dice valor={b.dice} onChange={(v) => set({ dice: v })} />
        </div>
      );
    }
    case "mision": {
      const set = (c: Partial<typeof b>) => onChange({ ...b, ...c });
      return (
        <div className="space-y-4">
          <Texto etiqueta="Título" valor={b.titulo} onChange={(v) => set({ titulo: v })} />
          <Texto etiqueta="Presentación de la emergencia" valor={b.intro} onChange={(v) => set({ intro: v })} largo />
          <div className="grid gap-3 sm:grid-cols-2">
            <Texto etiqueta="Nombre del medidor" valor={b.medidor.etiqueta} onChange={(v) => set({ medidor: { ...b.medidor, etiqueta: v } })} marcador="Ej.: Vida del paciente" />
            <Seleccion
              etiqueta="Tipo de medidor"
              valor={b.medidor.tipo}
              opciones={[
                { valor: "vida", nombre: "Baja de 100 a 0 (vida, calma)" },
                { valor: "amenaza", nombre: "Sube de 0 a 100 (fuego, peligro)" },
              ]}
              onChange={(v) => v && set({ medidor: { ...b.medidor, tipo: v } })}
            />
            <Numero etiqueta="Velocidad" valor={b.velocidad} onChange={(v) => set({ velocidad: v })} min={0.5} max={10} paso={0.5} ayuda="Puntos que pierde por segundo (0,5 a 10)." />
            <Numero etiqueta="Castigo por error" valor={b.penalizacion} onChange={(v) => set({ penalizacion: v })} min={5} max={50} ayuda="Puntos por decisión equivocada (5 a 50)." />
          </div>
          <ListaItems
            etiqueta="Pasos de la misión (mínimo 2)"
            items={b.pasos}
            onChange={(v) => set({ pasos: v })}
            min={2}
            nuevo={() => ({ situacion: "", pregunta: "", opciones: [{ texto: "", correcta: true, retro: "" }, { texto: "", retro: "" }] })}
            titulo={(p, i) => `Paso ${i + 1}`}
            render={(p, cambiar, i) => (
              <>
                <Texto etiqueta="Situación" valor={p.situacion} onChange={(v) => cambiar({ ...p, situacion: v })} largo filas={2} />
                <Texto etiqueta="Pregunta" valor={p.pregunta} onChange={(v) => cambiar({ ...p, pregunta: v })} />
                <Opciones nombre={`mision-${indice}-${i}`} opciones={p.opciones} onChange={(v) => cambiar({ ...p, opciones: v })} />
              </>
            )}
          />
          <Texto etiqueta="Mensaje si lo logra" valor={b.exito} onChange={(v) => set({ exito: v })} largo filas={2} />
          <Texto etiqueta="Mensaje si no lo logra" valor={b.fracaso} onChange={(v) => set({ fracaso: v })} largo filas={2} />
          <Dice valor={b.dice} onChange={(v) => set({ dice: v })} />
        </div>
      );
    }
    case "resumen": {
      const set = (c: Partial<typeof b>) => onChange({ ...b, ...c });
      return (
        <div className="space-y-4">
          <Texto etiqueta="Título" valor={b.titulo} onChange={(v) => set({ titulo: v })} />
          <ListaTextos etiqueta="Ideas para recordar" valores={b.puntos} onChange={(v) => set({ puntos: v })} />
          <Texto etiqueta="Nombre de la insignia" valor={b.insignia} onChange={(v) => set({ insignia: v })} marcador="Ej.: Guardián de la escena" />
          <Texto etiqueta="Cierre (opcional)" valor={b.cierre} onChange={(v) => set({ cierre: opcional(v) })} largo filas={2} />
          <Dice valor={b.dice} onChange={(v) => set({ dice: v })} />
        </div>
      );
    }
  }
}
