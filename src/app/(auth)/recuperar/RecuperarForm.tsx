"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Aviso, llamar, type Mensaje } from "@/components/admin/Formulario";

/** Dos pasos: pedir el código al correo y, con él, definir la contraseña nueva. */
export function RecuperarForm() {
  const router = useRouter();
  const [paso, setPaso] = useState<"correo" | "codigo">("correo");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState<Mensaje>(null);
  const [enviando, setEnviando] = useState(false);

  async function pedirCodigo(e?: React.FormEvent) {
    e?.preventDefault();
    setEnviando(true);
    setMsg(null);
    const r = await llamar<{ mensaje: string }>("/api/auth/recuperar", "POST", { email });
    setEnviando(false);
    if (!r.ok) return setMsg({ ok: false, text: r.data.error ?? "No se pudo enviar el código" });
    setPaso("codigo");
    setMsg({ ok: true, text: r.data.mensaje ?? "Revise su correo." });
  }

  async function confirmar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(e.currentTarget).entries()) as Record<string, string>;
    if (d.nueva !== d.confirmar) return setMsg({ ok: false, text: "La contraseña nueva y su confirmación no coinciden" });
    setEnviando(true);
    setMsg(null);
    const r = await llamar<{ redirect: string }>("/api/auth/recuperar/confirmar", "POST", { email, codigo: d.codigo, nueva: d.nueva });
    setEnviando(false);
    if (!r.ok) return setMsg({ ok: false, text: r.data.error ?? "No se pudo restablecer la contraseña" });
    router.push(r.data.redirect ?? "/ingresar");
  }

  if (paso === "correo") {
    return (
      <form onSubmit={pedirCodigo} className="card space-y-4 p-7">
        <div>
          <label className="label" htmlFor="rec-email">Correo con el que ingresa</label>
          <input
            id="rec-email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
            placeholder="nombre@empresa.com"
          />
        </div>
        <Aviso msg={msg} />
        <button className="btn-lime w-full py-3" disabled={enviando}>
          {enviando ? "Enviando..." : "Enviarme un código"}
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={confirmar} className="card space-y-4 p-7">
      <p className="text-sm text-navy-500">
        Enviamos un código de 6 dígitos a <strong className="text-navy-700">{email}</strong>. Vence en 15 minutos; si
        no lo ve, revise la carpeta de correo no deseado.
      </p>
      <div>
        <label className="label" htmlFor="rec-codigo">Código</label>
        <input
          id="rec-codigo"
          name="codigo"
          required
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern="\d{6}"
          maxLength={6}
          className="input text-center font-mono text-2xl tracking-[0.5em]"
          placeholder="000000"
        />
      </div>
      <div>
        <label className="label" htmlFor="rec-nueva">Contraseña nueva</label>
        <input id="rec-nueva" name="nueva" type="password" required minLength={8} autoComplete="new-password" className="input" />
      </div>
      <div>
        <label className="label" htmlFor="rec-confirmar">Confirmar contraseña nueva</label>
        <input id="rec-confirmar" name="confirmar" type="password" required minLength={8} autoComplete="new-password" className="input" />
      </div>
      <Aviso msg={msg} />
      <button className="btn-lime w-full py-3" disabled={enviando}>
        {enviando ? "Guardando..." : "Guardar contraseña nueva"}
      </button>
      <div className="flex justify-between text-xs">
        <button type="button" onClick={() => { setPaso("correo"); setMsg(null); }} className="font-semibold text-navy-400 hover:text-navy-600">
          Usar otro correo
        </button>
        <button type="button" onClick={() => pedirCodigo()} disabled={enviando} className="font-semibold text-navy-500 underline hover:text-navy-700">
          Enviar otro código
        </button>
      </div>
    </form>
  );
}
