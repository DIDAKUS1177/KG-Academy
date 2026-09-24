"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Aviso, ClaveGenerada, llamar, type Mensaje } from "@/components/admin/Formulario";
import { IconLock } from "@/components/Icons";

/** Genera una contraseña temporal para el trabajador (debe cambiarla al entrar). */
export function RestablecerClave({ userId, nombre }: { userId: string; nombre: string }) {
  const router = useRouter();
  const [clave, setClave] = useState<string | null>(null);
  const [msg, setMsg] = useState<Mensaje>(null);
  const [enviando, setEnviando] = useState(false);

  async function restablecer() {
    if (!window.confirm(`¿Generar una contraseña temporal para ${nombre}? La actual dejará de funcionar.`)) return;
    setEnviando(true);
    setMsg(null);
    const r = await llamar<{ claveTemporal: string }>("/api/empresa/trabajadores/clave", "POST", { userId });
    setEnviando(false);
    if (!r.ok) return setMsg({ ok: false, text: r.data.error ?? "No se pudo restablecer la contraseña" });
    setClave(r.data.claveTemporal);
    router.refresh();
  }

  return (
    <div className="space-y-3">
      {!clave && (
        <button type="button" onClick={restablecer} disabled={enviando} className="btn-outline btn-sm">
          <IconLock width={14} height={14} /> {enviando ? "Generando..." : "Restablecer contraseña"}
        </button>
      )}
      <Aviso msg={msg} />
      {clave && <ClaveGenerada clave={clave} para={nombre} />}
    </div>
  );
}
