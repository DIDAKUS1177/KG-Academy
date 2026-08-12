"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { IconAlert, IconArrowRight, IconLock } from "@/components/Icons";

const DEMO = [
  { rol: "SuperAdmin KG", email: "admin@kggestionintegral.com" },
  { rol: "Admin empresa", email: "rrhh@constructoraandina.com" },
  { rol: "Estudiante", email: "laura.cardenas@constructoraandina.com" },
];

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.error ?? "No fue posible iniciar sesion");
      setLoading(false);
      return;
    }
    router.push(data.redirect ?? "/aula");
    router.refresh();
  }

  return (
    <>
      <form onSubmit={submit} className="card p-7">
        {error && (
          <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            <IconAlert width={18} height={18} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="mb-4">
          <label className="label" htmlFor="email">
            Correo electronico
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            className="input"
            placeholder="nombre@empresa.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-5">
          <div className="flex items-center justify-between">
            <label className="label" htmlFor="password">
              Contrasena
            </label>
            <Link href="/recuperar" className="mb-1.5 text-[11px] font-semibold text-lime-600 hover:underline">
              Olvide mi contrasena
            </Link>
          </div>
          <input
            id="password"
            type="password"
            required
            autoComplete="current-password"
            className="input"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button className="btn-lime w-full py-3" disabled={loading}>
          {loading ? "Verificando..." : "Ingresar"}
          {!loading && <IconArrowRight width={16} height={16} />}
        </button>

        <p className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-navy-300">
          <IconLock width={12} height={12} /> Conexion protegida &middot; sesion de 8 horas
        </p>
      </form>

      {/* Accesos de demostracion para la revision local */}
      <div className="mt-5 rounded-2xl border border-dashed border-navy-200 bg-white/70 p-4">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-navy-400">
          Usuarios de prueba (clave: <span className="text-lime-600">KgAcademy2026*</span>)
        </p>
        <div className="space-y-1.5">
          {DEMO.map((d) => (
            <button
              key={d.email}
              type="button"
              onClick={() => {
                setEmail(d.email);
                setPassword("KgAcademy2026*");
              }}
              className="flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-left text-[11px] transition hover:bg-lime-50"
            >
              <span className="font-semibold text-navy-600">{d.rol}</span>
              <span className="truncate text-navy-400">{d.email}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
