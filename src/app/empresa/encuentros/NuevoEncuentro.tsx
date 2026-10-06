"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Aviso, Campo, llamar, type Mensaje } from "@/components/admin/Formulario";
import { cantidad } from "@/lib/utils";

type Opcion = { id: string; nombre: string };

/**
 * Formulario para compartir una clase en vivo (enlace de Meet, Zoom o Teams
 * con fecha y hora) o un material sin fecha (una grabación, un documento).
 */
export function NuevoEncuentro({ companyId, areas, cursos }: { companyId: string; areas: Opcion[]; cursos: Opcion[] }) {
  const router = useRouter();
  const [tipo, setTipo] = useState<"vivo" | "material">("vivo");
  const [audiencia, setAudiencia] = useState<"todos" | "area" | "curso">("todos");
  const [msg, setMsg] = useState<Mensaje>(null);
  const [enviando, setEnviando] = useState(false);

  async function enviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const d = Object.fromEntries(new FormData(form)) as Record<string, string>;
    setEnviando(true);
    setMsg(null);
    const r = await llamar<{ destinatarios: number }>("/api/empresa/encuentros", "POST", {
      companyId,
      titulo: d.titulo,
      descripcion: d.descripcion,
      url: d.url,
      ...(tipo === "vivo" ? { fecha: d.fecha, hora: d.hora, duracion: d.duracion || undefined } : {}),
      audiencia,
      ...(audiencia === "area" ? { areaId: d.areaId } : {}),
      ...(audiencia === "curso" ? { courseId: d.courseId } : {}),
    });
    setEnviando(false);
    if (!r.ok) return setMsg({ ok: false, text: r.data.error ?? "No se pudo compartir" });
    setMsg({ ok: true, text: `Listo: le llegó a ${cantidad(r.data.destinatarios, "persona", "personas")} en sus notificaciones y en su aula.` });
    form.reset();
    router.refresh();
  }

  const opcion = (valor: string, actual: string, texto: string, ayuda: string, elegir: () => void) => (
    <label
      className={`cursor-pointer rounded-xl border p-3 transition ${actual === valor ? "border-lime-500 bg-lime-50" : "border-navy-100 hover:border-navy-300"}`}
    >
      <span className="flex items-center gap-2 text-sm font-bold text-navy-700">
        <input type="radio" checked={actual === valor} onChange={elegir} /> {texto}
      </span>
      <span className="mt-1 block text-xs text-navy-400">{ayuda}</span>
    </label>
  );

  return (
    <form onSubmit={enviar} className="card grid gap-5 p-6">
      <div>
        <p className="font-display text-base font-bold text-navy-700">Compartir una clase o un material</p>
        <p className="text-sm text-navy-400">Pegue el enlace de Meet, Zoom o Teams. A cada persona le llega una notificación y lo ve en su aula.</p>
      </div>
      <Aviso msg={msg} />

      <div className="grid gap-3 sm:grid-cols-2">
        {opcion("vivo", tipo, "Clase o reunión en vivo", "Con fecha y hora. Se ve en el aula hasta que termina.", () => setTipo("vivo"))}
        {opcion("material", tipo, "Material sin fecha", "Una grabación o un documento. Se ve durante 30 días.", () => setTipo("material"))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Campo label="Título">
          <input id="encuentro-titulo" name="titulo" required minLength={3} maxLength={120} className="input" placeholder="Capacitación de brigada: uso de extintores" />
        </Campo>
        <Campo label="Enlace">
          <input id="encuentro-url" name="url" type="url" required className="input" placeholder="https://meet.google.com/abc-defg-hij" />
        </Campo>
        {tipo === "vivo" && (
          <>
            <Campo label="Fecha">
              <input id="encuentro-fecha" name="fecha" type="date" required className="input" />
            </Campo>
            <div className="grid grid-cols-2 gap-3">
              <Campo label="Hora (Colombia)">
                <input id="encuentro-hora" name="hora" type="time" required className="input" />
              </Campo>
              <Campo label="Duración (min)">
                <input id="encuentro-duracion" name="duracion" type="number" min={10} max={480} step={5} defaultValue={60} className="input" />
              </Campo>
            </div>
          </>
        )}
        <Campo label="Mensaje (opcional)" ancho="sm:col-span-2">
          <textarea id="encuentro-descripcion" name="descripcion" maxLength={1000} rows={2} className="input" placeholder="Tenga a mano el cuaderno de la brigada. Conéctese 5 minutos antes." />
        </Campo>
      </div>

      <div>
        <p className="label">¿A quién le llega?</p>
        <div className="grid gap-3 sm:grid-cols-3">
          {opcion("todos", audiencia, "Todo el personal", "Trabajadores y supervisores activos.", () => setAudiencia("todos"))}
          {opcion("area", audiencia, "Un área", "Solo las personas de esa área.", () => setAudiencia("area"))}
          {opcion("curso", audiencia, "Un curso", "Quienes tienen asignado ese curso.", () => setAudiencia("curso"))}
        </div>
        {audiencia === "area" && (
          <select id="encuentro-area" name="areaId" required className="select mt-3" defaultValue="">
            <option value="" disabled>Elija el área</option>
            {areas.map((a) => <option key={a.id} value={a.id}>{a.nombre}</option>)}
          </select>
        )}
        {audiencia === "curso" && (
          <select id="encuentro-curso" name="courseId" required className="select mt-3" defaultValue="">
            <option value="" disabled>Elija el curso</option>
            {cursos.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
          </select>
        )}
      </div>

      <div className="flex justify-end">
        <button className="btn-lime" disabled={enviando}>{enviando ? "Enviando..." : "Compartir y avisar"}</button>
      </div>
    </form>
  );
}

/** Cancela una clase y avisa a quienes la recibieron. */
export function CancelarEncuentro({ meetingId, titulo }: { meetingId: string; titulo: string }) {
  const router = useRouter();
  const [confirmar, setConfirmar] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function cancelar() {
    setEnviando(true);
    const r = await llamar("/api/empresa/encuentros", "PATCH", { meetingId, accion: "cancelar" });
    setEnviando(false);
    if (!r.ok) return setError(r.data.error ?? "No se pudo cancelar");
    router.refresh();
  }

  if (!confirmar) {
    return (
      <button type="button" onClick={() => setConfirmar(true)} className="btn-ghost btn-sm text-red-600" aria-label={`Cancelar ${titulo}`}>
        Cancelar
      </button>
    );
  }
  return (
    <span className="flex flex-wrap items-center gap-2 text-xs">
      <span className="text-navy-500">¿Cancelar y avisar a todos?</span>
      <button type="button" onClick={cancelar} disabled={enviando} className="btn btn-sm bg-red-600 text-white hover:bg-red-700">
        {enviando ? "Cancelando..." : "Sí, cancelar"}
      </button>
      <button type="button" onClick={() => setConfirmar(false)} className="btn-ghost btn-sm">No</button>
      {error && <span className="text-red-600">{error}</span>}
    </span>
  );
}
