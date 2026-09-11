"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Aviso, Campo, Ventana, llamar, type Mensaje } from "@/components/admin/Formulario";

/**
 * Revocar o restituir un certificado desde la tabla. La revocación exige
 * motivo, que queda en el registro y en la verificación pública.
 */
export function AccionesCertificado({ id, code, status, titular }: {
  id: string;
  code: string;
  status: string;
  titular: string;
}) {
  const router = useRouter();
  const [abierto, setAbierto] = useState(false);
  const [motivo, setMotivo] = useState("");
  const [msg, setMsg] = useState<Mensaje>(null);
  const [cargando, setCargando] = useState(false);

  async function ejecutar(accion: "revocar" | "restituir") {
    setCargando(true);
    setMsg(null);
    const { ok, data } = await llamar("/api/admin/certificado", "PATCH", { certificateId: id, accion, motivo });
    setCargando(false);
    if (!ok) return setMsg({ ok: false, text: data.error ?? "No se pudo completar" });
    setAbierto(false);
    setMotivo("");
    router.refresh();
  }

  if (status === "revocado") {
    return (
      <button onClick={() => { if (confirm(`¿Restituir el certificado ${code}?`)) ejecutar("restituir"); }} disabled={cargando} className="btn-outline btn-sm">
        Restituir
      </button>
    );
  }

  return (
    <>
      <button onClick={() => { setAbierto(true); setMsg(null); }} className="btn-danger btn-sm">
        Revocar
      </button>
      {abierto && (
        <Ventana titulo={`Revocar ${code}`} descripcion={`Titular: ${titular}. El código seguirá resolviendo en la verificación pública, marcado como revocado.`} onCerrar={() => setAbierto(false)} ancho="max-w-lg">
          <div className="space-y-4">
            <Aviso msg={msg} />
            <Campo label="Motivo" ayuda="Queda registrado en auditoría y visible para quien verifique el código.">
              <textarea value={motivo} onChange={(e) => setMotivo(e.target.value)} rows={3} className="input" placeholder="Ej.: suplantación de identidad comprobada en la evaluación final" />
            </Campo>
            <div className="flex justify-end gap-2 border-t border-navy-50 pt-4">
              <button type="button" onClick={() => setAbierto(false)} className="btn-ghost">Cancelar</button>
              <button onClick={() => ejecutar("revocar")} disabled={cargando || motivo.trim().length < 5} className="btn-danger">
                {cargando ? "Revocando..." : "Revocar certificado"}
              </button>
            </div>
          </div>
        </Ventana>
      )}
    </>
  );
}
