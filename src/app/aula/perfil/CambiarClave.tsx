"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IconLock } from "@/components/Icons";
import { Aviso, Campo, llamar, type Mensaje } from "@/components/admin/Formulario";

/** Formulario de cambio de contraseña del propio usuario. */
export function CambiarClave({ temporal }: { temporal: boolean }) {
  const router = useRouter();
  const [msg, setMsg] = useState<Mensaje>(null);
  const [cargando, setCargando] = useState(false);

  async function enviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const d = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;
    setMsg(null);
    if (d.nueva !== d.confirmar) {
      return setMsg({ ok: false, text: "La contraseña nueva y su confirmación no coinciden" });
    }
    setCargando(true);
    const { ok, data } = await llamar<{ activada?: boolean }>("/api/auth/clave", "POST", {
      actual: d.actual,
      nueva: d.nueva,
    });
    setCargando(false);
    if (!ok) return setMsg({ ok: false, text: data.error ?? "No se pudo cambiar la contraseña" });
    form.reset();
    setMsg({
      ok: true,
      text: data.activada
        ? "Contraseña actualizada. Su cuenta quedó activa."
        : "Contraseña actualizada.",
    });
    router.refresh();
  }

  return (
    <div id="clave" className="card mt-6 scroll-mt-24 p-7">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy-50 text-navy-600">
          <IconLock width={20} height={20} />
        </span>
        <div>
          <p className="font-display text-base font-bold text-navy-700">Cambiar contraseña</p>
          <p className="text-xs text-navy-400">Use al menos 12 caracteres, sin datos personales ni secuencias.</p>
        </div>
      </div>

      {temporal && (
        <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <strong>Está usando una contraseña temporal.</strong> Cámbiela ahora: su cuenta queda
          activa en cuanto defina la suya.
        </div>
      )}

      <form onSubmit={enviar} className="mt-5 grid gap-4 sm:grid-cols-3">
        <div className="sm:col-span-3">
          <Aviso msg={msg} />
        </div>
        <Campo label={temporal ? "Contraseña temporal" : "Contraseña actual"}>
          <input name="actual" type="password" required autoComplete="current-password" className="input" />
        </Campo>
        <Campo label="Contraseña nueva">
          <input name="nueva" type="password" required minLength={8} autoComplete="new-password" className="input" />
        </Campo>
        <Campo label="Confirmar contraseña nueva">
          <input name="confirmar" type="password" required minLength={8} autoComplete="new-password" className="input" />
        </Campo>
        <div className="sm:col-span-3">
          <button className="btn-lime" disabled={cargando}>
            {cargando ? "Guardando..." : "Cambiar contraseña"}
          </button>
        </div>
      </form>
    </div>
  );
}
