import { formatDateTime } from "@/lib/utils";
import { dominio, enCurso } from "@/lib/encuentros";
import { IconArrowRight, IconClock, IconPlay } from "@/components/Icons";

export type EncuentroVista = {
  id: string;
  title: string;
  description: string | null;
  url: string;
  startsAt: Date | null;
  durationMin: number | null;
  createdAt: Date;
  company: { tradeName: string | null; legalName: string };
};

/**
 * Una clase en vivo o un material que compartió la empresa, con el botón para
 * abrirlo. Muestra el sitio al que lleva el enlace: así la persona sabe que va
 * a Meet, Zoom o Teams y no a otro lado.
 */
export function TarjetaEncuentro({ e, ahora = new Date() }: { e: EncuentroVista; ahora?: Date }) {
  const vivo = enCurso(e, ahora);
  return (
    <div className={`flex flex-wrap items-center gap-4 rounded-2xl border p-4 ${vivo ? "border-lime-300 bg-lime-50" : "border-navy-100 bg-white"}`}>
      <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${vivo ? "bg-lime-500 text-white" : "bg-navy-50 text-navy-600"}`}>
        <IconPlay width={19} height={19} />
      </span>
      <div className="min-w-[200px] flex-1">
        <p className="font-display text-[15px] font-bold leading-snug text-navy-700">
          {e.title}
          {vivo && <span className="ml-2 rounded-full bg-lime-500 px-2 py-0.5 align-middle text-[10px] font-extrabold uppercase tracking-wide text-white">Ahora</span>}
        </p>
        <p className="mt-0.5 flex flex-wrap items-center gap-x-2 text-xs text-navy-400">
          <span className="inline-flex items-center gap-1">
            <IconClock width={12} height={12} />
            {e.startsAt ? `${formatDateTime(e.startsAt)}${e.durationMin ? ` · ${e.durationMin} min` : ""}` : "Material sin fecha"}
          </span>
          <span>· {e.company.tradeName ?? e.company.legalName}</span>
        </p>
        {e.description && <p className="mt-1 text-sm leading-relaxed text-navy-500">{e.description}</p>}
      </div>
      <a
        href={e.url}
        target="_blank"
        rel="noopener noreferrer"
        className={`${vivo ? "btn-lime" : "btn-outline"} btn-sm w-full justify-center sm:w-auto`}
        title={`Se abre en ${dominio(e.url)}`}
      >
        {e.startsAt ? "Unirse" : "Abrir"} <IconArrowRight width={14} height={14} />
        <span className="sr-only">(se abre en {dominio(e.url)})</span>
      </a>
      <p className="w-full text-[11px] text-navy-300 sm:hidden">Se abre en {dominio(e.url)}</p>
    </div>
  );
}
