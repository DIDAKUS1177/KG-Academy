"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IconAlert, IconArrowRight } from "@/components/Icons";

export function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    const payload = {
      firstName: String(fd.get("firstName") ?? ""),
      lastName: String(fd.get("lastName") ?? ""),
      email: String(fd.get("email") ?? ""),
      documentType: String(fd.get("documentType") ?? ""),
      documentNumber: String(fd.get("documentNumber") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      companyNit: String(fd.get("companyNit") ?? ""),
      password: String(fd.get("password") ?? ""),
      acceptedTerms: fd.get("acceptedTerms") === "on",
    };

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.error ?? "No fue posible crear la cuenta");
      setLoading(false);
      return;
    }
    router.push(data.redirect ?? "/aula");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="card p-7">
      {error && (
        <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <IconAlert width={18} height={18} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label">Nombres</label>
          <input name="firstName" required className="input" placeholder="Laura Sofia" />
        </div>
        <div>
          <label className="label">Apellidos</label>
          <input name="lastName" required className="input" placeholder="Cardenas Rojas" />
        </div>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-[110px_1fr]">
        <div>
          <label className="label">Tipo doc.</label>
          <select name="documentType" className="select" defaultValue="CC">
            <option value="CC">CC</option>
            <option value="CE">CE</option>
            <option value="TI">TI</option>
            <option value="PAS">PAS</option>
          </select>
        </div>
        <div>
          <label className="label">Número de documento</label>
          <input name="documentNumber" className="input" placeholder="1023456789" />
        </div>
      </div>

      <div className="mt-4">
        <label className="label">Correo electronico</label>
        <input name="email" type="email" required className="input" placeholder="nombre@empresa.com" />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label">Teléfono</label>
          <input name="phone" className="input" placeholder="300 000 0000" />
        </div>
        <div>
          <label className="label">NIT de su empresa (opcional)</label>
          <input name="companyNit" className="input" placeholder="901234567-1" />
        </div>
      </div>

      <div className="mt-4">
        <label className="label">Contraseña</label>
        <input
          name="password"
          type="password"
          required
          minLength={8}
          className="input"
          placeholder="Mínimo 8 caracteres"
        />
      </div>

      <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-xl bg-navy-50/70 p-3 text-xs leading-relaxed text-navy-500">
        <input name="acceptedTerms" type="checkbox" required className="mt-0.5 h-4 w-4 accent-lime-500" />
        <span>
          Autorizo a KG Gestión Integral S.A.S. el tratamiento de mis datos personales conforme a la
          Ley 1581 de 2012 y acepto los terminos de uso de la plataforma.
        </span>
      </label>

      <button className="btn-lime mt-6 w-full py-3" disabled={loading}>
        {loading ? "Creando cuenta..." : "Crear mi cuenta"}
        {!loading && <IconArrowRight width={16} height={16} />}
      </button>
    </form>
  );
}
