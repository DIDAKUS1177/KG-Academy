"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IconCheck, IconEye, IconLock } from "@/components/Icons";
import { Aviso, Campo, llamar, type Mensaje } from "@/components/admin/Formulario";

/**
 * Formulario de cambio de contraseña del propio usuario.
 *
 * En el primer ingreso (obligatorio, con contraseña temporal) no se vuelve a
 * pedir la temporal: la persona acaba de entrar con ella. Los requisitos se ven
 * desde el principio y se marcan a medida que se cumplen.
 */
export function CambiarClave({ temporal, obligatorio = false, minimo = 8 }: { temporal: boolean; obligatorio?: boolean; minimo?: number }) {
  const router = useRouter();
  const [msg, setMsg] = useState<Mensaje>(null);
  const [cargando, setCargando] = useState(false);
  const [nueva, setNueva] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [ver, setVer] = useState(false);
  const pedirActual = !(obligatorio && temporal);

  const largoOk = nueva.length >= minimo;
  const coincide = nueva.length > 0 && nueva === confirmar;

  async function enviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const actual = String(new FormData(form).get("actual") ?? "");
    setMsg(null);
    if (!largoOk) return setMsg({ ok: false, text: `La contraseña nueva debe tener al menos ${minimo} caracteres` });
    if (!coincide) return setMsg({ ok: false, text: "La contraseña nueva y su confirmación no coinciden" });
    setCargando(true);
    const { ok, data } = await llamar<{ activada?: boolean; destino?: string }>("/api/auth/clave", "POST", {
      ...(pedirActual ? { actual } : {}),
      nueva,
    });
    setCargando(false);
    if (!ok) return setMsg({ ok: false, text: data.error ?? "No se pudo cambiar la contraseña" });
    form.reset();
    setNueva("");
    setConfirmar("");
    // Primer ingreso: con la cuenta ya activa, sigue a su panel.
    if (obligatorio && data.activada) {
      router.replace(data.destino ?? "/aula");
      router.refresh();
      return;
    }
    setMsg({ ok: true, text: data.activada ? "Contraseña actualizada. Su cuenta quedó activa." : "Contraseña actualizada." });
    router.refresh();
  }

  const tipo = ver ? "text" : "password";
  const requisito = (cumple: boolean, texto: string) => (
    <li className={`flex items-center gap-2 ${cumple ? "text-lime-700" : "text-navy-400"}`}>
      <span className={`flex h-4 w-4 items-center justify-center rounded-full ${cumple ? "bg-lime-500 text-white" : "border border-navy-200"}`}>
        {cumple && <IconCheck width={10} height={10} strokeWidth={4} />}
      </span>
      {texto}
    </li>
  );

  return (
    <div id="clave" className={obligatorio ? "" : "card mt-6 scroll-mt-24 p-7"}>
      <div className={obligatorio ? "hidden" : "flex items-center gap-3"}>
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy-50 text-navy-600">
          <IconLock width={20} height={20} />
        </span>
        <div>
          <p className="font-display text-base font-bold text-navy-700">Cambiar contraseña</p>
          <p className="text-xs text-navy-400">Use al menos {minimo} caracteres, sin datos personales ni secuencias.</p>
        </div>
      </div>

      {temporal && !obligatorio && (
        <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <strong>Está usando una contraseña temporal.</strong> Cámbiela ahora: su cuenta queda activa en cuanto defina la suya.
        </div>
      )}

      <form onSubmit={enviar} className={`mt-5 grid gap-4 ${obligatorio ? "" : "sm:grid-cols-3"}`}>
        <div className={obligatorio ? "" : "sm:col-span-3"}>
          <Aviso msg={msg} />
        </div>
        {pedirActual && (
          <Campo label={temporal ? "Contraseña temporal" : "Contraseña actual"}>
            <input name="actual" type={tipo} required autoComplete="current-password" className="input" />
          </Campo>
        )}
        <Campo label="Contraseña nueva">
          <input name="nueva" type={tipo} required autoComplete="new-password" className="input" value={nueva} onChange={(e) => setNueva(e.target.value)} />
        </Campo>
        <Campo label="Escríbala otra vez">
          <input name="confirmar" type={tipo} required autoComplete="new-password" className="input" value={confirmar} onChange={(e) => setConfirmar(e.target.value)} />
        </Campo>
        <div className={obligatorio ? "" : "sm:col-span-3"}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <ul className="space-y-1 text-xs font-semibold">
              {requisito(largoOk, `Al menos ${minimo} caracteres`)}
              {requisito(coincide, "Las dos coinciden")}
            </ul>
            <button type="button" onClick={() => setVer(!ver)} className="inline-flex items-center gap-1.5 text-xs font-bold text-navy-500 hover:text-navy-700">
              <IconEye width={14} height={14} /> {ver ? "Ocultar" : "Mostrar"} contraseña
            </button>
          </div>
        </div>
        <div className={obligatorio ? "" : "sm:col-span-3"}>
          <button className={`btn-lime ${obligatorio ? "w-full py-3" : ""}`} disabled={cargando}>
            {cargando ? "Guardando..." : obligatorio ? "Guardar y entrar" : "Cambiar contraseña"}
          </button>
        </div>
      </form>
    </div>
  );
}
