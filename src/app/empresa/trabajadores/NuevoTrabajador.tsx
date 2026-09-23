"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IconUsers, IconAlert, IconCheck, IconUpload } from "@/components/Icons";

type Opt = { id: string; name: string };

type Credencial = { email: string; clave: string };

/**
 * Contraseñas temporales recién generadas. Se muestran una sola vez: el
 * servidor no las guarda en claro, así que si se pierden hay que pedirle a KG
 * que restablezca la cuenta.
 */
function Credenciales({ lista }: { lista: Credencial[] }) {
  const [copiado, setCopiado] = useState(false);
  if (!lista.length) return null;

  const texto = lista.map((c) => `${c.email}\t${c.clave}`).join("\n");

  async function copiar() {
    try {
      await navigator.clipboard.writeText(texto);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      /* Sin permiso de portapapeles: la tabla sigue visible. */
    }
  }

  function descargar() {
    // BOM para que Excel abra bien las tildes; punto y coma, como usa Excel en español.
    const csv = "﻿correo;contraseña_temporal\n" + lista.map((c) => `${c.email};${c.clave}`).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `contraseñas-temporales-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="mb-5 rounded-xl border border-lime-300 bg-lime-50 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-semibold text-lime-800">
          {lista.length === 1 ? "Contraseña temporal" : `${lista.length} contraseñas temporales`}
        </p>
        <div className="flex gap-2">
          <button type="button" onClick={copiar} className="btn-outline btn-sm">
            {copiado ? "Copiado" : "Copiar"}
          </button>
          <button type="button" onClick={descargar} className="btn-outline btn-sm">
            Descargar CSV
          </button>
        </div>
      </div>
      <div className="mt-3 max-h-64 overflow-auto rounded-lg bg-white">
        <table className="table-kg">
          <thead>
            <tr><th>Correo</th><th>Contraseña temporal</th></tr>
          </thead>
          <tbody>
            {lista.map((c) => (
              <tr key={c.email}>
                <td className="text-xs text-navy-600">{c.email}</td>
                <td className="font-mono text-sm font-bold text-navy-800">{c.clave}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-[11px] leading-relaxed text-lime-800/80">
        Cada trabajador tiene una distinta. Entréguelas por un canal privado: no vuelven a
        mostrarse. Al primer ingreso, el sistema le pide a cada uno definir la suya.
      </p>
    </div>
  );
}


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
  const [creds, setCreds] = useState<Credencial[]>([]);

  async function crearIndividual(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    setCreds([]);
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
    setMsg({
      ok: true,
      text: data.vinculado
        ? "Ese trabajador ya tenía cuenta: quedó vinculado a la empresa con su contraseña de siempre."
        : "Trabajador creado. Entréguele su contraseña temporal.",
    });
    setCreds(data.credenciales ?? []);
    (e.target as HTMLFormElement).reset();
    router.refresh();
  }

  async function crearMasivo() {
    setLoading(true);
    setMsg(null);
    setCreds([]);
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
    setCreds(data.credenciales ?? []);
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

        <Credenciales lista={creds} />

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
              <label className="label">Código de empleado</label>
              <input name="employeeCode" className="input" />
            </div>
            <div>
              <label className="label">Área</label>
              <select name="areaId" className="select">
                <option value="">Sin área</option>
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
                Se genera una contraseña temporal propia para el trabajador, que aparece aquí una
                sola vez. Al primer ingreso el sistema le pide cambiarla.
              </p>
            </div>
          </form>
        ) : (
          <div>
            <label className="label">
              Pegue las filas (una por trabajador) en formato:
              <span className="ml-1 font-mono normal-case text-navy-600">
                nombres;apellidos;documento;correo;código
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
              Hasta 200 trabajadores por carga. Los correos duplicados se omiten automáticamente
              y cada trabajador nuevo recibe su propia contraseña temporal.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
