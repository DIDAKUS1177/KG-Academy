"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IconUsers, IconAlert, IconCheck, IconUpload } from "@/components/Icons";

type Opt = { id: string; name: string };

export function NuevoTrabajador({
  companyId,
  areas,
  positions,
  locations,
}: {
  companyId: string;
  areas: Opt[];
  positions: Opt[];
  locations: Opt[];
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"individual" | "masivo">("individual");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [bulk, setBulk] = useState("");

  async function crearIndividual(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/empresa/trabajadores", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        companyId,
        modo: "individual",
        trabajador: Object.fromEntries(fd.entries()),
      }),
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) return setMsg({ ok: false, text: data.error ?? "No fue posible crear el trabajador" });
    setMsg({ ok: true, text: "Trabajador creado correctamente" });
    (e.target as HTMLFormElement).reset();
    router.refresh();
  }

  async function crearMasivo() {
    setLoading(true);
    setMsg(null);
    const res = await fetch("/api/empresa/trabajadores", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ companyId, modo: "masivo", csv: bulk }),
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) return setMsg({ ok: false, text: data.error ?? "No fue posible procesar el archivo" });
    setMsg({
      ok: true,
      text: `${data.creados} trabajador(es) creado(s), ${data.omitidos} omitido(s) por duplicado.`,
    });
    setBulk("");
    router.refresh();
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="btn-lime">
        <IconUsers width={16} height={16} /> Agregar trabajadores
      </button>
    );
  }

  return (
    <div className="card overflow-hidden">
      <div className="flex items-center gap-1 border-b border-navy-50 bg-navy-50/50 px-4">
        {(["individual", "masivo"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`border-b-2 px-4 py-3 text-sm font-semibold transition ${
              tab === t ? "border-lime-500 text-navy-700" : "border-transparent text-navy-400 hover:text-navy-600"
            }`}
          >
            {t === "individual" ? "Registro individual" : "Carga masiva"}
          </button>
        ))}
        <button onClick={() => setOpen(false)} className="ml-auto text-xs font-semibold text-navy-400 hover:text-navy-700">
          Cerrar
        </button>
      </div>

      <div className="p-6">
        {msg && (
          <div
            className={`mb-5 flex items-start gap-2.5 rounded-xl border p-3 text-sm ${
              msg.ok ? "border-lime-200 bg-lime-50 text-lime-800" : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            {msg.ok ? <IconCheck width={18} height={18} strokeWidth={3} /> : <IconAlert width={18} height={18} />}
            {msg.text}
          </div>
        )}

        {tab === "individual" ? (
          <form onSubmit={crearIndividual} className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Nombres</label>
              <input name="firstName" required className="input" />
            </div>
            <div>
              <label className="label">Apellidos</label>
              <input name="lastName" required className="input" />
            </div>
            <div>
              <label className="label">Documento</label>
              <input name="documentNumber" required className="input" />
            </div>
            <div>
              <label className="label">Correo</label>
              <input name="email" type="email" required className="input" />
            </div>
            <div>
              <label className="label">Codigo de empleado</label>
              <input name="employeeCode" className="input" />
            </div>
            <div>
              <label className="label">Area</label>
              <select name="areaId" className="select">
                <option value="">Sin area</option>
                {areas.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Cargo</label>
              <select name="positionId" className="select">
                <option value="">Sin cargo</option>
                {positions.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Sede</label>
              <select name="locationId" className="select">
                <option value="">Sin sede</option>
                {locations.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <button className="btn-lime" disabled={loading}>
                {loading ? "Creando..." : "Crear trabajador"}
              </button>
              <p className="mt-2 text-xs text-navy-400">
                Se crea con la contrasena temporal <strong>KgAcademy2026*</strong> y estado
                &quot;pendiente de activacion&quot;.
              </p>
            </div>
          </form>
        ) : (
          <div>
            <label className="label">
              Pegue las filas (una por trabajador) en formato:
              <span className="ml-1 font-mono normal-case text-navy-600">
                nombres;apellidos;documento;correo;codigo
              </span>
            </label>
            <textarea
              value={bulk}
              onChange={(e) => setBulk(e.target.value)}
              rows={8}
              className="input font-mono text-xs"
              placeholder={"Pedro;Gomez Lara;1098765432;pedro.gomez@empresa.com;OPE-201\nMaria;Diaz Rojas;1098765433;maria.diaz@empresa.com;ADM-202"}
            />
            <button onClick={crearMasivo} disabled={loading || !bulk.trim()} className="btn-lime mt-4">
              <IconUpload width={16} height={16} />
              {loading ? "Procesando..." : "Cargar trabajadores"}
            </button>
            <p className="mt-2 text-xs text-navy-400">
              Los correos duplicados se omiten automaticamente. La carga desde archivo .xlsx queda
              prevista para la Fase 2 del backlog.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
