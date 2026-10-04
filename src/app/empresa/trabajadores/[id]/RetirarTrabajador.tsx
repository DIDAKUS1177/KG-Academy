"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Aviso, llamar, type Mensaje } from "@/components/admin/Formulario";

/**
 * Retira a la persona de la empresa (renunció o terminó su contrato): libera
 * su cupo y conserva su historial. Si vuelve, se crea otra vez con su documento.
 */
export function RetirarTrabajador({ userId, companyId, nombre }: { userId: string; companyId: string; nombre: string }) {
  const router = useRouter();
  const [msg, setMsg] = useState<Mensaje>(null);
  const [enviando, setEnviando] = useState(false);

  async function retirar() {
    const aviso =
      `¿Retirar a ${nombre} de la empresa?\n\n` +
      "• Deja de ocupar cupo y ya no podrá entrar a la plataforma.\n" +
      "• Su avance, evaluaciones y certificados se conservan como evidencia.\n" +
      "• Si vuelve, créelo otra vez con su documento y recupera su historial.";
    if (!window.confirm(aviso)) return;
    setEnviando(true);
    setMsg(null);
    const r = await llamar("/api/empresa/trabajadores/retirar", "POST", { userId, companyId });
    setEnviando(false);
    if (!r.ok) return setMsg({ ok: false, text: r.data.error ?? "No se pudo retirar a la persona" });
    router.refresh();
  }

  return (
    <div className="space-y-3">
      <button type="button" onClick={retirar} disabled={enviando} className="btn-outline btn-sm">
        {enviando ? "Retirando..." : "Retirar de la empresa"}
      </button>
      <Aviso msg={msg} />
    </div>
  );
}
