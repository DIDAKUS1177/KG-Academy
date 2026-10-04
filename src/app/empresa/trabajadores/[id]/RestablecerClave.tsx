"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Aviso, ClaveGenerada, llamar, type Mensaje } from "@/components/admin/Formulario";
import { IconEye, IconLock } from "@/components/Icons";

/**
 * La empresa cambia la contraseña de un trabajador sin depender de KG: genera
 * una temporal o escribe la que quiera, y decide si la persona debe cambiarla
 * al entrar.
 */
export function RestablecerClave({ userId, nombre, usuario }: { userId: string; nombre: string; usuario: string }) {
  const router = useRouter();
  const [abierto, setAbierto] = useState(false);
  const [modo, setModo] = useState<"generar" | "escribir">("generar");
  const [clave, setClave] = useState("");
  const [ver, setVer] = useState(false);
  const [pedirCambio, setPedirCambio] = useState(true);
  const [generada, setGenerada] = useState<string | null>(null);
  const [msg, setMsg] = useState<Mensaje>(null);
  const [enviando, setEnviando] = useState(false);

  async function guardar() {
    if (modo === "escribir" && !clave.trim()) return setMsg({ ok: false, text: "Escriba la contraseña nueva." });
    if (!window.confirm(`¿Cambiar la contraseña de ${nombre}? La que tiene ahora dejará de funcionar.`)) return;
    setEnviando(true);
    setMsg(null);
    const r = await llamar<{ claveTemporal: string | null }>("/api/empresa/trabajadores/clave", "POST", {
      userId,
      ...(modo === "escribir" ? { clave, pedirCambio } : {}),
    });
    setEnviando(false);
    if (!r.ok) return setMsg({ ok: false, text: r.data.error ?? "No se pudo cambiar la contraseña" });
    if (r.data.claveTemporal) setGenerada(r.data.claveTemporal);
    else
      setMsg({
        ok: true,
        text: pedirCambio
          ? `Listo. ${nombre} entra con «${usuario}» y la contraseña que usted escribió; el sistema le pedirá cambiarla.`
          : `Listo. ${nombre} entra con «${usuario}» y la contraseña que usted escribió.`,
      });
    setClave("");
    router.refresh();
  }

  if (!abierto) {
    return (
      <button type="button" onClick={() => { setAbierto(true); setGenerada(null); setMsg(null); }} className="btn-outline btn-sm">
        <IconLock width={14} height={14} /> Cambiar contraseña
      </button>
    );
  }

  return (
    <div id="clave" className="w-full max-w-md space-y-3 rounded-2xl border border-navy-100 bg-white p-4">
      <p className="text-sm font-bold text-navy-700">Cambiar la contraseña de {nombre}</p>
      <div className="grid gap-2 sm:grid-cols-2">
        {[
          ["generar", "Generar una temporal", "El sistema crea una; la persona la cambia al entrar."],
          ["escribir", "Escribir una", "Usted elige la contraseña."],
        ].map(([valor, titulo, ayuda]) => (
          <label key={valor} className={`cursor-pointer rounded-xl border p-3 transition ${modo === valor ? "border-lime-500 bg-lime-50" : "border-navy-100 hover:border-navy-300"}`}>
            <span className="flex items-center gap-2 text-xs font-bold text-navy-700">
              <input type="radio" name={`modo-${userId}`} checked={modo === valor} onChange={() => setModo(valor as "generar" | "escribir")} />
              {titulo}
            </span>
            <span className="mt-1 block text-[11px] leading-relaxed text-navy-400">{ayuda}</span>
          </label>
        ))}
      </div>

      {modo === "escribir" && (
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type={ver ? "text" : "password"}
              value={clave}
              onChange={(e) => setClave(e.target.value)}
              placeholder="Contraseña nueva"
              autoComplete="new-password"
              className="input text-sm"
            />
            <button type="button" onClick={() => setVer(!ver)} className="btn-ghost btn-sm shrink-0" aria-label={ver ? "Ocultar" : "Mostrar"}>
              <IconEye width={14} height={14} />
            </button>
          </div>
          <label className="flex cursor-pointer items-center gap-2 text-xs font-semibold text-navy-600">
            <input type="checkbox" checked={pedirCambio} onChange={(e) => setPedirCambio(e.target.checked)} />
            Pedir que la cambie al entrar (recomendado)
          </label>
        </div>
      )}

      <Aviso msg={msg} />
      {generada && <ClaveGenerada clave={generada} para={nombre} />}

      <div className="flex gap-2">
        <button type="button" onClick={guardar} disabled={enviando} className="btn-lime btn-sm">
          {enviando ? "Guardando..." : "Cambiar contraseña"}
        </button>
        <button type="button" onClick={() => setAbierto(false)} className="btn-ghost btn-sm">
          Cerrar
        </button>
      </div>
    </div>
  );
}
