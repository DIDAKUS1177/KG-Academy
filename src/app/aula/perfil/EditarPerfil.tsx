"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Aviso, llamar, type Mensaje } from "@/components/admin/Formulario";

type Datos = {
  firstName: string;
  lastName: string;
  documentType: string | null;
  documentNumber: string | null;
  phone: string | null;
  city: string | null;
  jobTitle: string | null;
};

/**
 * Datos del perfil. Nombre y documento identifican a la persona en sus
 * certificados, así que los corrige KG o su empresa; el resto lo edita el
 * propio usuario.
 */
export function EditarPerfil({ datos }: { datos: Datos }) {
  const router = useRouter();
  const [msg, setMsg] = useState<Mensaje>(null);
  const [guardando, setGuardando] = useState(false);

  async function guardar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.currentTarget).entries()) as Record<string, string>;
    setGuardando(true);
    setMsg(null);
    const r = await llamar("/api/aula/perfil", "PATCH", { phone: f.phone, city: f.city, jobTitle: f.jobTitle });
    setGuardando(false);
    if (!r.ok) return setMsg({ ok: false, text: r.data.error ?? "No se pudieron guardar los datos" });
    setMsg({ ok: true, text: "Datos actualizados." });
    router.refresh();
  }

  const fijo = (label: string, valor: string | null) => (
    <div>
      <label className="label">{label}</label>
      <input className="input bg-navy-50/60 text-navy-500" defaultValue={valor ?? "—"} readOnly tabIndex={-1} />
    </div>
  );

  return (
    <form onSubmit={guardar} className="mt-8 grid gap-5 sm:grid-cols-2">
      {fijo("Nombres", datos.firstName)}
      {fijo("Apellidos", datos.lastName)}
      {fijo("Tipo de documento", datos.documentType)}
      {fijo("Número de documento", datos.documentNumber)}
      <div>
        <label className="label" htmlFor="perfil-telefono">Teléfono</label>
        <input id="perfil-telefono" name="phone" type="tel" maxLength={30} defaultValue={datos.phone ?? ""} className="input" />
      </div>
      <div>
        <label className="label" htmlFor="perfil-ciudad">Ciudad</label>
        <input id="perfil-ciudad" name="city" maxLength={80} defaultValue={datos.city ?? ""} className="input" />
      </div>
      <div className="sm:col-span-2">
        <label className="label" htmlFor="perfil-cargo">Cargo</label>
        <input id="perfil-cargo" name="jobTitle" maxLength={120} defaultValue={datos.jobTitle ?? ""} className="input" />
      </div>
      <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
        <button className="btn-lime" disabled={guardando}>
          {guardando ? "Guardando..." : "Guardar cambios"}
        </button>
        <p className="text-xs text-navy-400">
          Nombre y documento aparecen en sus certificados: para corregirlos, pídaselo a su empresa o a KG.
        </p>
      </div>
      <div className="sm:col-span-2">
        <Aviso msg={msg} />
      </div>
    </form>
  );
}
