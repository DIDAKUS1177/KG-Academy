import { ETIQUETA_SEMAFORO, mostrarMeta, mostrarValor, semaforo, type Indicador, type Semaforo } from "@/lib/indicadores";

const COLOR: Record<Semaforo, { punto: string; texto: string; fondo: string }> = {
  cumple: { punto: "bg-lime-500", texto: "text-lime-700", fondo: "bg-lime-50" },
  alerta: { punto: "bg-amber-500", texto: "text-amber-700", fondo: "bg-amber-50" },
  no_cumple: { punto: "bg-red-500", texto: "text-red-600", fondo: "bg-red-50" },
  sin_meta: { punto: "bg-navy-300", texto: "text-navy-500", fondo: "bg-navy-50" },
  sin_datos: { punto: "bg-navy-200", texto: "text-navy-400", fondo: "bg-navy-50" },
};

/** Semáforo con su etiqueta: Cumple, Alerta, No cumple... */
export function EtiquetaSemaforo({ indicador }: { indicador: Indicador }) {
  const s = semaforo(indicador);
  const c = COLOR[s];
  return (
    // print-color-adjust: el navegador no imprime colores de fondo si no se le pide.
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-bold ${c.fondo} ${c.texto}`}
      style={{ printColorAdjust: "exact", WebkitPrintColorAdjust: "exact" }}
    >
      <span className={`h-2 w-2 rounded-full ${c.punto}`} aria-hidden />
      {ETIQUETA_SEMAFORO[s]}
    </span>
  );
}

/** Tarjetas de indicadores agrupadas (Cobertura, Cumplimiento, Aprendizaje...). */
export function TableroIndicadores({ indicadores }: { indicadores: Indicador[] }) {
  const grupos = [...new Set(indicadores.map((i) => i.grupo))];
  return (
    <div className="space-y-6">
      {grupos.map((g) => (
        <div key={g}>
          <p className="mb-3 text-[11px] font-extrabold uppercase tracking-[0.18em] text-navy-400">{g}</p>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {indicadores
              .filter((i) => i.grupo === g)
              .map((i) => (
                <div key={i.clave} className="card flex flex-col p-5">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-semibold leading-snug text-navy-700">{i.nombre}</p>
                    <EtiquetaSemaforo indicador={i} />
                  </div>
                  <p className="mt-3 font-display text-3xl font-extrabold text-navy-700">{mostrarValor(i)}</p>
                  <p className="mt-1 text-xs text-navy-400">
                    {i.detalle}
                    {i.meta ? ` · Meta ${mostrarMeta(i)}` : ""}
                  </p>
                  <p className="mt-3 border-t border-navy-50 pt-3 text-[11px] leading-relaxed text-navy-400">{i.formula}</p>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
