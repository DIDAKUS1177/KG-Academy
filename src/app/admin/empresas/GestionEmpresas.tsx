"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IconBuilding } from "@/components/Icons";
import { Aviso, Campo, ClaveGenerada, Ventana, llamar, leerFormulario, type Mensaje } from "@/components/admin/Formulario";

export type PlanOpcion = { code: string; name: string; maxUsers: number | null; pricePerMonth: number };
export type EmpresaFila = {
  id: string;
  nit: string;
  legalName: string;
  tradeName: string | null;
  economicSector: string | null;
  arl: string | null;
  riskLevel: string | null;
  contactName: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  address: string | null;
  city: string | null;
  status: string;
  planCode: string | null;
  seats: number;
};

const SECTORES = [
  "Sector Salud", "Sector Educativo", "Construcción", "Transporte",
  "Manufactura", "Comercio", "Sector Público", "Empresas de Servicios", "Otro",
];
const NIVELES = ["I", "II", "III", "IV", "V"];

function CamposEmpresa({ e, planes }: { e?: EmpresaFila; planes: PlanOpcion[] }) {
  return (
    <>
      <Campo label="NIT"><input name="nit" required defaultValue={e?.nit} className="input" placeholder="900123456-7" /></Campo>
      <Campo label="Razón social"><input name="legalName" required defaultValue={e?.legalName} className="input" /></Campo>
      <Campo label="Nombre comercial"><input name="tradeName" defaultValue={e?.tradeName ?? ""} className="input" /></Campo>
      <Campo label="Sector económico">
        <select name="economicSector" className="select" defaultValue={e?.economicSector ?? ""}>
          <option value="">Sin definir</option>
          {SECTORES.map((s) => <option key={s}>{s}</option>)}
        </select>
      </Campo>
      <Campo label="ARL"><input name="arl" defaultValue={e?.arl ?? ""} className="input" /></Campo>
      <Campo label="Nivel de riesgo">
        <select name="riskLevel" className="select" defaultValue={e?.riskLevel ?? ""}>
          <option value="">Sin definir</option>
          {NIVELES.map((n) => <option key={n}>{n}</option>)}
        </select>
      </Campo>
      <Campo label="Contacto"><input name="contactName" defaultValue={e?.contactName ?? ""} className="input" /></Campo>
      <Campo label="Correo de contacto"><input name="contactEmail" type="email" defaultValue={e?.contactEmail ?? ""} className="input" /></Campo>
      <Campo label="Teléfono"><input name="contactPhone" defaultValue={e?.contactPhone ?? ""} className="input" /></Campo>
      <Campo label="Ciudad"><input name="city" defaultValue={e?.city ?? ""} className="input" /></Campo>
      <Campo label="Dirección" ancho="sm:col-span-2"><input name="address" defaultValue={e?.address ?? ""} className="input" /></Campo>
      <Campo label="Plan">
        <select name="planCode" className="select" defaultValue={e?.planCode ?? ""}>
          <option value="">{e ? "Mantener el actual" : "Sin plan por ahora"}</option>
          {planes.map((p) => (
            <option key={p.code} value={p.code}>
              {p.name}{p.maxUsers ? ` · hasta ${p.maxUsers}` : ""}
            </option>
          ))}
        </select>
      </Campo>
      <Campo label="Cupos contratados" ayuda="Vacío = los del plan.">
        <input name="seats" type="number" min={0} defaultValue={e?.seats || ""} className="input" />
      </Campo>
    </>
  );
}

export function GestionEmpresas({ planes, editar, onCerrarEdicion }: {
  planes: PlanOpcion[];
  editar: EmpresaFila | null;
  onCerrarEdicion: () => void;
}) {
  const router = useRouter();
  const [crear, setCrear] = useState(false);
  const [conAdmin, setConAdmin] = useState(true);
  const [msg, setMsg] = useState<Mensaje>(null);
  const [clave, setClave] = useState<{ clave: string; para: string } | null>(null);
  const [cargando, setCargando] = useState(false);

  async function crearEmpresa(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setCargando(true); setMsg(null); setClave(null);
    const d = leerFormulario(e.currentTarget);
    const cuerpo: Record<string, unknown> = { ...d };
    delete cuerpo.adminFirstName; delete cuerpo.adminLastName; delete cuerpo.adminEmail;
    if (!cuerpo.seats) delete cuerpo.seats;
    if (conAdmin && d.adminEmail) {
      cuerpo.admin = { firstName: d.adminFirstName, lastName: d.adminLastName, email: d.adminEmail };
    }
    const { ok, data } = await llamar<{ claveAdmin?: string | null }>("/api/admin/empresa", "POST", cuerpo);
    setCargando(false);
    if (!ok) return setMsg({ ok: false, text: data.error ?? "No se pudo crear la empresa" });
    setMsg({ ok: true, text: "Empresa creada correctamente" });
    if (data.claveAdmin) setClave({ clave: data.claveAdmin, para: String(d.adminEmail) });
    (e.target as HTMLFormElement).reset();
    router.refresh();
  }

  async function guardar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editar) return;
    setCargando(true); setMsg(null);
    const d = leerFormulario(e.currentTarget);
    if (!d.seats) delete d.seats;
    if (!d.planCode) delete d.planCode;
    const { ok, data } = await llamar("/api/admin/empresa", "PATCH", { companyId: editar.id, ...d });
    setCargando(false);
    if (!ok) return setMsg({ ok: false, text: data.error ?? "No se pudo guardar" });
    setMsg({ ok: true, text: "Cambios guardados" });
    router.refresh();
  }

  const cerrar = () => { onCerrarEdicion(); setMsg(null); };

  return (
    <>
      <button onClick={() => { setCrear(true); setMsg(null); setClave(null); }} className="btn-lime">
        <IconBuilding width={16} height={16} /> Nueva empresa
      </button>

      {crear && (
        <Ventana titulo="Nueva empresa cliente" descripcion="Se crea activa. Puede crear en el mismo paso la cuenta de su administrador." onCerrar={() => setCrear(false)} ancho="max-w-3xl">
          <form onSubmit={crearEmpresa} className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2 space-y-3">
              <Aviso msg={msg} />
              {clave && <ClaveGenerada clave={clave.clave} para={clave.para} />}
            </div>
            <CamposEmpresa planes={planes} />

            <div className="sm:col-span-2 rounded-xl border border-navy-100 bg-navy-50/40 p-4">
              <label className="flex items-center gap-2 text-sm font-semibold text-navy-700">
                <input type="checkbox" checked={conAdmin} onChange={(e) => setConAdmin(e.target.checked)} />
                Crear la cuenta del administrador de la empresa
              </label>
              {conAdmin && (
                <div className="mt-3 grid gap-3 sm:grid-cols-3">
                  <Campo label="Nombres"><input name="adminFirstName" required={conAdmin} className="input" /></Campo>
                  <Campo label="Apellidos"><input name="adminLastName" required={conAdmin} className="input" /></Campo>
                  <Campo label="Correo"><input name="adminEmail" type="email" required={conAdmin} className="input" /></Campo>
                </div>
              )}
            </div>

            <div className="sm:col-span-2 flex justify-end gap-2 border-t border-navy-50 pt-4">
              <button type="button" onClick={() => setCrear(false)} className="btn-ghost">Cerrar</button>
              <button className="btn-lime" disabled={cargando}>{cargando ? "Creando..." : "Crear empresa"}</button>
            </div>
          </form>
        </Ventana>
      )}

      {editar && (
        <Ventana titulo={editar.tradeName ?? editar.legalName} descripcion={`NIT ${editar.nit}`} onCerrar={cerrar} ancho="max-w-3xl">
          <form onSubmit={guardar} className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2"><Aviso msg={msg} /></div>
            <CamposEmpresa e={editar} planes={planes} />
            <Campo label="Estado" ayuda="Suspender o inactivar bloquea el ingreso de todas sus cuentas; reactivar lo devuelve." ancho="sm:col-span-2">
              <select name="status" className="select" defaultValue={editar.status}>
                <option value="activa">Activa</option>
                <option value="suspendida">Suspendida</option>
                <option value="inactiva">Inactiva</option>
              </select>
            </Campo>
            <div className="sm:col-span-2 flex justify-end gap-2 border-t border-navy-50 pt-4">
              <button type="button" onClick={cerrar} className="btn-ghost">Cerrar</button>
              <button className="btn-lime" disabled={cargando}>{cargando ? "Guardando..." : "Guardar cambios"}</button>
            </div>
          </form>
        </Ventana>
      )}
    </>
  );
}

/* ====================================================================== */
/*  Planes                                                                 */
/* ====================================================================== */

export type PlanFila = PlanOpcion & {
  id: string;
  description: string | null;
  maxCourses: number | null;
  pricePerUser: number;
  features: string[];
  isActive: boolean;
};

export function GestionPlanes({
  editar,
  onCerrarEdicion,
}: {
  /** Plan a editar; null = solo se muestra el botón de crear. */
  editar: PlanFila | null;
  onCerrarEdicion: () => void;
}) {
  const router = useRouter();
  const [crear, setCrear] = useState(false);
  const [msg, setMsg] = useState<Mensaje>(null);
  const [cargando, setCargando] = useState(false);

  const p = editar ?? undefined;
  const abierto = crear || !!editar;

  function cerrar() {
    setCrear(false);
    onCerrarEdicion();
    setMsg(null);
  }

  async function enviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setCargando(true);
    setMsg(null);
    const d = leerFormulario(e.currentTarget);
    for (const k of ["maxUsers", "maxCourses"]) if (d[k] === "") d[k] = null;
    const { ok, data } = await llamar(
      "/api/admin/plan",
      p ? "PATCH" : "POST",
      p ? { planId: p.id, ...d } : d
    );
    setCargando(false);
    if (!ok) return setMsg({ ok: false, text: data.error ?? "No se pudo guardar el plan" });
    setMsg({ ok: true, text: p ? "Plan actualizado" : "Plan creado" });
    router.refresh();
    if (!p) (e.target as HTMLFormElement).reset();
  }

  return (
    <>
      <button onClick={() => { setCrear(true); setMsg(null); }} className="btn-outline btn-sm">
        Nuevo plan
      </button>

      {abierto && (
        <Ventana titulo={p ? `Plan ${p.name}` : "Nuevo plan"} onCerrar={cerrar}>
          <form onSubmit={enviar} className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2"><Aviso msg={msg} /></div>
            {!p && (
              <Campo label="Código" ayuda="Minúsculas, números y guion bajo. No se puede cambiar después.">
                <input name="code" required pattern="[a-z0-9_]+" className="input" placeholder="empresarial_plus" />
              </Campo>
            )}
            <Campo label="Nombre" ancho={p ? "sm:col-span-2" : undefined}><input name="name" required defaultValue={p?.name} className="input" /></Campo>
            <Campo label="Descripción" ancho="sm:col-span-2"><input name="description" defaultValue={p?.description ?? ""} className="input" /></Campo>
            <Campo label="Máximo de usuarios" ayuda="Vacío = ilimitado."><input name="maxUsers" type="number" min={1} defaultValue={p?.maxUsers ?? ""} className="input" /></Campo>
            <Campo label="Máximo de cursos" ayuda="Vacío = todo el catálogo."><input name="maxCourses" type="number" min={1} defaultValue={p?.maxCourses ?? ""} className="input" /></Campo>
            <Campo label="Valor mensual (COP)" ayuda="0 = a cotizar."><input name="pricePerMonth" type="number" min={0} defaultValue={p?.pricePerMonth ?? 0} className="input" /></Campo>
            <Campo label="Valor por usuario (COP)"><input name="pricePerUser" type="number" min={0} defaultValue={p?.pricePerUser ?? 0} className="input" /></Campo>
            <Campo label="Beneficios" ayuda="Uno por línea." ancho="sm:col-span-2">
              <textarea name="features" rows={4} defaultValue={p?.features.join("\n") ?? ""} className="input" />
            </Campo>
            {p && (
              <label className="flex items-center gap-2 text-sm text-navy-700 sm:col-span-2">
                <input type="checkbox" name="isActive" defaultChecked={p.isActive} /> Plan activo (se ofrece a nuevas empresas)
              </label>
            )}
            <div className="sm:col-span-2 flex justify-end gap-2 border-t border-navy-50 pt-4">
              <button type="button" onClick={cerrar} className="btn-ghost">Cerrar</button>
              <button className="btn-lime" disabled={cargando}>{cargando ? "Guardando..." : p ? "Guardar" : "Crear plan"}</button>
            </div>
          </form>
        </Ventana>
      )}
    </>
  );
}
