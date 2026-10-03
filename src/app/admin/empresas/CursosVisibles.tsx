"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Aviso, Ventana, llamar, type Mensaje } from "@/components/admin/Formulario";
import { SimboloCurso, numeroCurso } from "@/components/SimboloCurso";

export type CursoCatalogo = { id: string; code: string; title: string; status: string; visibilidad: string };

/**
 * Ventana para elegir qué cursos ve una empresa: todos los cursos generales
 * (más los exclusivos que se le activen) o solo una selección. Lo que la
 * empresa ya asignó no se pierde al ocultarlo.
 */
export function CursosVisibles({
  empresa,
  cursos,
  onCerrar,
}: {
  empresa: { id: string; nombre: string; catalogo: string; habilitados: string[] };
  cursos: CursoCatalogo[];
  onCerrar: () => void;
}) {
  const router = useRouter();
  const [modo, setModo] = useState(empresa.catalogo === "seleccion" ? "seleccion" : "todos");
  // Solo ids de cursos que siguen en la lista (un curso archivado no cuenta).
  const [elegidos, setElegidos] = useState<string[]>(empresa.habilitados.filter((id) => cursos.some((c) => c.id === id)));
  const [msg, setMsg] = useState<Mensaje>(null);
  const [guardando, setGuardando] = useState(false);

  const generales = cursos.filter((c) => c.visibilidad !== "exclusivo");
  const exclusivos = cursos.filter((c) => c.visibilidad === "exclusivo");
  const publicados = cursos.filter((c) => c.status === "publicado");
  const lista = modo === "seleccion" ? cursos : exclusivos;
  const elegidosEnLista = elegidos.filter((id) => lista.some((c) => c.id === id));
  const publicadosElegidos = publicados.filter((c) => elegidosEnLista.includes(c.id)).length;
  const generalesPublicados = generales.filter((c) => c.status === "publicado").length;

  async function guardar() {
    setGuardando(true);
    setMsg(null);
    const { ok, data } = await llamar("/api/admin/empresa/cursos", "PUT", {
      companyId: empresa.id,
      catalogo: modo,
      courseIds: elegidosEnLista,
    });
    setGuardando(false);
    if (!ok) return setMsg({ ok: false, text: data.error ?? "No se pudo guardar" });
    setMsg({ ok: true, text: "Cursos visibles guardados" });
    router.refresh();
  }

  return (
    <Ventana
      titulo={`Cursos visibles · ${empresa.nombre}`}
      descripcion="Lo que esta empresa puede asignar y lo que sus trabajadores ven en el aula."
      onCerrar={onCerrar}
    >
      <div className="space-y-4">
        <Aviso msg={msg} />

        <div className="grid gap-2 sm:grid-cols-2">
          {[
            ["todos", "Catálogo completo", `Todos los cursos generales publicados (${generalesPublicados} hoy) y los que KG publique después.`],
            ["seleccion", "Solo los cursos que elija", "Para planes por curso o empresas con un programa específico."],
          ].map(([valor, titulo, ayuda]) => (
            <label
              key={valor}
              className={`cursor-pointer rounded-xl border p-3 transition ${modo === valor ? "border-lime-500 bg-lime-50" : "border-navy-100 hover:border-navy-300"}`}
            >
              <span className="flex items-center gap-2 text-sm font-semibold text-navy-700">
                <input type="radio" name="modo" checked={modo === valor} onChange={() => setModo(valor)} />
                {titulo}
              </span>
              <span className="mt-1 block text-[11px] leading-relaxed text-navy-400">{ayuda}</span>
            </label>
          ))}
        </div>

        <div>
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="font-semibold text-navy-600">
              {modo === "seleccion"
                ? `${publicadosElegidos} de ${publicados.length} cursos publicados elegidos`
                : "Además, cursos exclusivos para esta empresa"}
            </span>
            {modo === "seleccion" && (
              <span className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setElegidos([...new Set([...elegidos, ...publicados.map((c) => c.id)])])}
                  className="font-semibold text-lime-700 hover:underline"
                >
                  Todos los publicados
                </button>
                <button type="button" onClick={() => setElegidos([])} className="font-semibold text-navy-400 hover:underline">
                  Ninguno
                </button>
              </span>
            )}
          </div>
          {lista.length === 0 ? (
            <p className="rounded-xl bg-navy-50/70 p-3 text-xs text-navy-400">
              No hay cursos exclusivos. Un curso se marca como exclusivo en Cursos → Constructor → Disponibilidad.
            </p>
          ) : (
            <div className="max-h-80 space-y-1.5 overflow-auto rounded-xl border border-navy-100 p-2">
              {lista.map((c) => (
                <label key={c.id} className="flex cursor-pointer items-center gap-3 rounded-lg p-2 hover:bg-navy-50">
                  <input
                    type="checkbox"
                    checked={elegidos.includes(c.id)}
                    onChange={(e) => setElegidos(e.target.checked ? [...elegidos, c.id] : elegidos.filter((x) => x !== c.id))}
                  />
                  <span className="flex h-9 w-9 shrink-0 flex-col items-center justify-center rounded-lg bg-kg-gradient text-lime-400">
                    <SimboloCurso code={c.code} width={16} height={16} />
                    <span className="text-[8px] font-extrabold leading-none">{numeroCurso(c.code)}</span>
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-navy-700">{c.title}</span>
                    <span className="text-[11px] text-navy-400">
                      {c.code}
                      {c.visibilidad === "exclusivo" ? " · exclusivo" : ""}
                      {c.status !== "publicado" ? " · en borrador: se verá cuando KG lo publique" : ""}
                    </span>
                  </span>
                </label>
              ))}
            </div>
          )}
          {modo === "seleccion" && publicadosElegidos === 0 && (
            <p className="mt-2 text-xs font-semibold text-amber-700">
              Sin cursos publicados elegidos, la empresa no podrá asignar ninguno y sus trabajadores no verán cursos nuevos.
            </p>
          )}
        </div>

        <p className="text-[11px] leading-relaxed text-navy-400">
          Ocultar un curso no le quita nada a quien ya lo tiene asignado o empezado: solo deja de aparecer para asignarlo
          o empezarlo.
        </p>

        <div className="flex justify-end gap-2 border-t border-navy-50 pt-4">
          <button type="button" onClick={onCerrar} className="btn-ghost">Cerrar</button>
          <button type="button" onClick={guardar} disabled={guardando} className="btn-lime">
            {guardando ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>
    </Ventana>
  );
}
