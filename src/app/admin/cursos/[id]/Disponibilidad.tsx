"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Aviso, llamar, type Mensaje } from "@/components/admin/Formulario";
import { IconBuilding } from "@/components/Icons";

type Empresa = { id: string; nombre: string; catalogo: string };

/**
 * Para quién es el curso: general (todas las empresas y el público) o
 * exclusivo (solo las empresas que se marquen).
 */
export function Disponibilidad({
  courseId,
  visibilidad,
  habilitadas,
  empresas,
}: {
  courseId: string;
  visibilidad: string;
  habilitadas: string[];
  empresas: Empresa[];
}) {
  const router = useRouter();
  const [modo, setModo] = useState(visibilidad === "exclusivo" ? "exclusivo" : "general");
  const [elegidas, setElegidas] = useState<string[]>(habilitadas.filter((id) => empresas.some((e) => e.id === id)));
  const [msg, setMsg] = useState<Mensaje>(null);
  const [guardando, setGuardando] = useState(false);
  const [abierto, setAbierto] = useState(false);

  // En un curso general, las de catálogo completo ya lo ven: solo se eligen las restringidas.
  const lista = modo === "exclusivo" ? empresas : empresas.filter((e) => e.catalogo === "seleccion");
  const resumen =
    visibilidad === "exclusivo"
      ? `Exclusivo para ${habilitadas.length} empresa(s)`
      : "General: todas las empresas con catálogo completo y el catálogo público";

  async function guardar() {
    setGuardando(true);
    setMsg(null);
    const ids = elegidas.filter((id) => lista.some((e) => e.id === id));
    const { ok, data } = await llamar("/api/admin/curso/empresas", "PUT", { courseId, visibilidad: modo, companyIds: ids });
    setGuardando(false);
    if (!ok) return setMsg({ ok: false, text: data.error ?? "No se pudo guardar" });
    setMsg({ ok: true, text: "Disponibilidad guardada" });
    router.refresh();
  }

  return (
    <div className="card mb-6 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy-50 text-navy-600">
            <IconBuilding width={18} height={18} />
          </span>
          <div>
            <p className="font-display text-sm font-bold text-navy-700">Disponibilidad por empresa</p>
            <p className="text-xs text-navy-400">{resumen}</p>
          </div>
        </div>
        <button type="button" onClick={() => setAbierto(!abierto)} className="btn-outline btn-sm">
          {abierto ? "Cerrar" : "Cambiar"}
        </button>
      </div>

      {abierto && (
        <div className="mt-5 space-y-4 border-t border-navy-50 pt-5">
          <Aviso msg={msg} />
          <div className="grid gap-2 sm:grid-cols-2">
            {[
              ["general", "General", "Para todas las empresas con catálogo completo y el catálogo público."],
              ["exclusivo", "Exclusivo", "Solo para las empresas que marque. No sale en el catálogo público."],
            ].map(([valor, titulo, ayuda]) => (
              <label
                key={valor}
                className={`cursor-pointer rounded-xl border p-3 transition ${modo === valor ? "border-lime-500 bg-lime-50" : "border-navy-100 hover:border-navy-300"}`}
              >
                <span className="flex items-center gap-2 text-sm font-semibold text-navy-700">
                  <input type="radio" name="visibilidad" checked={modo === valor} onChange={() => setModo(valor)} />
                  {titulo}
                </span>
                <span className="mt-1 block text-[11px] leading-relaxed text-navy-400">{ayuda}</span>
              </label>
            ))}
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold text-navy-600">
              {modo === "exclusivo"
                ? "Empresas que lo ven"
                : "Empresas con catálogo restringido que también lo ven (las demás ya lo ven)"}
            </p>
            {lista.length === 0 ? (
              <p className="rounded-xl bg-navy-50/70 p-3 text-xs text-navy-400">
                {modo === "exclusivo" ? "Aún no hay empresas registradas." : "Ninguna empresa tiene catálogo restringido."}
              </p>
            ) : (
              <div className="max-h-64 space-y-1 overflow-auto rounded-xl border border-navy-100 p-2">
                {lista.map((e) => (
                  <label key={e.id} className="flex cursor-pointer items-center gap-3 rounded-lg p-2 text-sm text-navy-700 hover:bg-navy-50">
                    <input
                      type="checkbox"
                      checked={elegidas.includes(e.id)}
                      onChange={(ev) => setElegidas(ev.target.checked ? [...elegidas, e.id] : elegidas.filter((x) => x !== e.id))}
                    />
                    <span className="flex-1">{e.nombre}</span>
                    {e.catalogo === "seleccion" && <span className="text-[10px] font-semibold text-navy-400">catálogo restringido</span>}
                  </label>
                ))}
              </div>
            )}
            {modo === "exclusivo" && elegidas.filter((id) => lista.some((e) => e.id === id)).length === 0 && (
              <p className="mt-2 text-xs font-semibold text-amber-700">Sin empresas marcadas, solo el equipo de KG podrá ver el curso.</p>
            )}
          </div>

          <p className="text-[11px] leading-relaxed text-navy-400">
            Quitarle el curso a una empresa no afecta a quien ya lo tiene asignado o empezado.
          </p>
          <div className="flex justify-end">
            <button type="button" onClick={guardar} disabled={guardando} className="btn-lime btn-sm">
              {guardando ? "Guardando..." : "Guardar disponibilidad"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
