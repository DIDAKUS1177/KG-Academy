"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { llamar } from "@/components/admin/Formulario";

/**
 * Edición en línea de un parámetro del sistema. Clic en el valor, se vuelve
 * un campo; Enter guarda, Escape cancela.
 */
export function EditarParametro({ clave, valor, tipo }: { clave: string; valor: string; tipo: string }) {
  const router = useRouter();
  const [editando, setEditando] = useState(false);
  const [v, setV] = useState(valor);
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  async function guardar() {
    if (v === valor) return setEditando(false);
    setCargando(true);
    setError(null);
    const { ok, data } = await llamar("/api/admin/configuracion", "PATCH", { key: clave, value: v });
    setCargando(false);
    if (!ok) return setError(data.error ?? "No se pudo guardar");
    setEditando(false);
    router.refresh();
  }

  if (!editando) {
    return (
      <button
        onClick={() => setEditando(true)}
        title="Clic para editar"
        className="max-w-[260px] truncate rounded-lg px-2 py-1 text-right text-xs font-bold text-navy-700 transition hover:bg-lime-50 hover:text-lime-800"
      >
        {valor}
      </button>
    );
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex items-center gap-1.5">
        {tipo === "boolean" ? (
          <select value={v} onChange={(e) => setV(e.target.value)} className="select py-1 text-xs" autoFocus>
            <option value="true">Sí</option>
            <option value="false">No</option>
          </select>
        ) : (
          <input
            value={v}
            onChange={(e) => setV(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") guardar();
              if (e.key === "Escape") { setV(valor); setEditando(false); }
            }}
            type={tipo === "number" ? "number" : "text"}
            className="input w-56 py-1 text-xs"
            autoFocus
          />
        )}
        <button onClick={guardar} disabled={cargando} className="btn-lime btn-sm">{cargando ? "..." : "Guardar"}</button>
        <button onClick={() => { setV(valor); setEditando(false); }} className="btn-ghost btn-sm">Cancelar</button>
      </div>
      {error && <p className="text-[11px] text-red-600">{error}</p>}
    </div>
  );
}
