"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Aviso, llamar, type Mensaje } from "@/components/admin/Formulario";

/** Elimina la cuenta de un trabajador sin historial y vuelve a la lista. */
export function EliminarTrabajador({ userId, nombre, volver }: { userId: string; nombre: string; volver: string }) {
  const router = useRouter();
  const [msg, setMsg] = useState<Mensaje>(null);
  const [enviando, setEnviando] = useState(false);

  async function eliminar() {
    if (!window.confirm(`¿Eliminar la cuenta de ${nombre}? Esta acción no se puede deshacer.`)) return;
    setEnviando(true);
    setMsg(null);
    const r = await llamar("/api/empresa/trabajadores/cuenta", "DELETE", { userId });
    setEnviando(false);
    if (!r.ok) return setMsg({ ok: false, text: r.data.error ?? "No se pudo eliminar la cuenta" });
    router.push(volver);
    router.refresh();
  }

  return (
    <div className="space-y-3">
      <button type="button" onClick={eliminar} disabled={enviando} className="btn btn-sm bg-transparent text-red-600 hover:bg-red-50">
        {enviando ? "Eliminando..." : "Eliminar cuenta"}
      </button>
      <Aviso msg={msg} />
    </div>
  );
}
