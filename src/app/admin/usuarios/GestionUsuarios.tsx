"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ROLE_LABEL, ROLES, STATUS_LABEL, USER_STATUS } from "@/lib/constants";
import { IconUsers, IconLock } from "@/components/Icons";
import { Aviso, Campo, ClaveGenerada, Ventana, llamar, leerFormulario, type Mensaje } from "@/components/admin/Formulario";

type Opcion = { id: string; nombre: string };
export type UsuarioFila = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  roleCode: string;
  companyId: string | null;
  documentType: string | null;
  documentNumber: string | null;
  phone: string | null;
  jobTitle: string | null;
  city: string | null;
  status: string;
};

const TIPOS_DOC = ["CC", "CE", "TI", "PAS", "NIT"];

/**
 * Botón "Nuevo usuario" y ventana de edición de la tabla de usuarios.
 *
 * El componente es uno solo para que la tabla (que sigue siendo un componente
 * de servidor) solo tenga que pasarle la fila a editar.
 */
export function GestionUsuarios({
  roles,
  empresas,
  actorRole,
  actorId,
  editar,
  onCerrarEdicion,
}: {
  roles: Opcion[];
  empresas: Opcion[];
  actorRole: string;
  actorId: string;
  /** Fila a editar; null = solo se muestra el botón de crear. */
  editar: UsuarioFila | null;
  onCerrarEdicion: () => void;
}) {
  const router = useRouter();
  const [crear, setCrear] = useState(false);
  const [msg, setMsg] = useState<Mensaje>(null);
  const [clave, setClave] = useState<{ clave: string; para: string } | null>(null);
  const [cargando, setCargando] = useState(false);

  const rolesDisponibles = roles.filter(
    (r) => actorRole === ROLES.SUPERADMIN || r.id !== ROLES.SUPERADMIN
  );

  async function crearUsuario(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setCargando(true);
    setMsg(null);
    setClave(null);
    const datos = leerFormulario(e.currentTarget);
    if (!datos.password) delete datos.password;
    const { ok, data } = await llamar<{ claveTemporal?: string | null }>("/api/admin/usuario", "POST", datos);
    setCargando(false);
    if (!ok) return setMsg({ ok: false, text: data.error ?? "No se pudo crear el usuario" });
    setMsg({ ok: true, text: "Usuario creado correctamente" });
    if (data.claveTemporal) setClave({ clave: data.claveTemporal, para: String(datos.email) });
    (e.target as HTMLFormElement).reset();
    router.refresh();
  }

  async function guardarEdicion(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editar) return;
    setCargando(true);
    setMsg(null);
    const datos = leerFormulario(e.currentTarget);
    const { ok, data } = await llamar("/api/admin/usuario", "PATCH", {
      userId: editar.id,
      accion: "editar",
      ...datos,
      companyId: datos.companyId === "" ? null : datos.companyId,
    });
    setCargando(false);
    if (!ok) return setMsg({ ok: false, text: data.error ?? "No se pudo guardar" });
    setMsg({ ok: true, text: "Cambios guardados" });
    router.refresh();
  }

  async function restablecer() {
    if (!editar) return;
    if (!confirm(`¿Restablecer la contraseña de ${editar.email}? La actual dejará de funcionar.`)) return;
    setCargando(true);
    setMsg(null);
    const { ok, data } = await llamar<{ claveTemporal?: string }>("/api/admin/usuario", "PATCH", {
      userId: editar.id,
      accion: "restablecer_clave",
    });
    setCargando(false);
    if (!ok) return setMsg({ ok: false, text: data.error ?? "No se pudo restablecer" });
    setMsg({ ok: true, text: "Contraseña restablecida" });
    if (data.claveTemporal) setClave({ clave: data.claveTemporal, para: editar.email });
  }

  const esMismo = editar?.id === actorId;

  return (
    <>
      <button onClick={() => { setCrear(true); setMsg(null); setClave(null); }} className="btn-lime">
        <IconUsers width={16} height={16} /> Nuevo usuario
      </button>

      {/* ------------------------------ Crear ------------------------------ */}
      {crear && (
        <Ventana
          titulo="Nuevo usuario"
          descripcion="Cualquier rol de la plataforma. Si deja la contraseña vacía, se genera una temporal."
          onCerrar={() => setCrear(false)}
        >
          <form onSubmit={crearUsuario} className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2 space-y-3">
              <Aviso msg={msg} />
              {clave && <ClaveGenerada clave={clave.clave} para={clave.para} />}
            </div>
            <Campo label="Nombres"><input name="firstName" required className="input" /></Campo>
            <Campo label="Apellidos"><input name="lastName" required className="input" /></Campo>
            <Campo label="Correo"><input name="email" type="email" required className="input" /></Campo>
            <Campo label="Rol">
              <select name="roleCode" required className="select" defaultValue={ROLES.ESTUDIANTE}>
                {rolesDisponibles.map((r) => (
                  <option key={r.id} value={r.id}>{r.nombre}</option>
                ))}
              </select>
            </Campo>
            <Campo label="Empresa" ayuda="Obligatoria para administrador o supervisor de empresa.">
              <select name="companyId" className="select">
                <option value="">Sin empresa (particular o KG)</option>
                {empresas.map((c) => (
                  <option key={c.id} value={c.id}>{c.nombre}</option>
                ))}
              </select>
            </Campo>
            <div className="grid grid-cols-[100px_1fr] gap-2">
              <Campo label="Tipo doc.">
                <select name="documentType" className="select" defaultValue="CC">
                  {TIPOS_DOC.map((t) => <option key={t}>{t}</option>)}
                </select>
              </Campo>
              <Campo label="Documento"><input name="documentNumber" className="input" /></Campo>
            </div>
            <Campo label="Teléfono"><input name="phone" className="input" /></Campo>
            <Campo label="Cargo"><input name="jobTitle" className="input" /></Campo>
            <Campo label="Ciudad"><input name="city" className="input" /></Campo>
            <Campo label="Contraseña" ayuda="Vacía = temporal generada y cuenta pendiente de activación.">
              <input name="password" type="text" minLength={8} className="input" autoComplete="off" />
            </Campo>
            <div className="sm:col-span-2 flex justify-end gap-2 border-t border-navy-50 pt-4">
              <button type="button" onClick={() => setCrear(false)} className="btn-ghost">Cerrar</button>
              <button className="btn-lime" disabled={cargando}>{cargando ? "Creando..." : "Crear usuario"}</button>
            </div>
          </form>
        </Ventana>
      )}

      {/* ------------------------------ Editar ------------------------------ */}
      {editar && (
        <Ventana
          titulo={`${editar.firstName} ${editar.lastName}`}
          descripcion={editar.email}
          onCerrar={() => { onCerrarEdicion(); setMsg(null); setClave(null); }}
        >
          <form onSubmit={guardarEdicion} className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2 space-y-3">
              <Aviso msg={msg} />
              {clave && <ClaveGenerada clave={clave.clave} para={clave.para} />}
            </div>
            <Campo label="Nombres"><input name="firstName" required defaultValue={editar.firstName} className="input" /></Campo>
            <Campo label="Apellidos"><input name="lastName" required defaultValue={editar.lastName} className="input" /></Campo>
            <Campo label="Correo"><input name="email" type="email" required defaultValue={editar.email} className="input" /></Campo>
            <Campo label="Rol" ayuda={esMismo ? "No puede cambiar su propio rol." : undefined}>
              <select name="roleCode" className="select" defaultValue={editar.roleCode} disabled={esMismo}>
                {rolesDisponibles.map((r) => (
                  <option key={r.id} value={r.id}>{r.nombre}</option>
                ))}
              </select>
            </Campo>
            <Campo label="Empresa">
              <select name="companyId" className="select" defaultValue={editar.companyId ?? ""}>
                <option value="">Sin empresa</option>
                {empresas.map((c) => (
                  <option key={c.id} value={c.id}>{c.nombre}</option>
                ))}
              </select>
            </Campo>
            <Campo label="Estado" ayuda={esMismo ? "No puede desactivar su propia cuenta." : undefined}>
              <select name="status" className="select" defaultValue={editar.status} disabled={esMismo}>
                {USER_STATUS.map((s) => (
                  <option key={s} value={s}>{STATUS_LABEL[s] ?? s}</option>
                ))}
              </select>
            </Campo>
            <div className="grid grid-cols-[100px_1fr] gap-2">
              <Campo label="Tipo doc.">
                <select name="documentType" className="select" defaultValue={editar.documentType ?? "CC"}>
                  {TIPOS_DOC.map((t) => <option key={t}>{t}</option>)}
                </select>
              </Campo>
              <Campo label="Documento"><input name="documentNumber" defaultValue={editar.documentNumber ?? ""} className="input" /></Campo>
            </div>
            <Campo label="Teléfono"><input name="phone" defaultValue={editar.phone ?? ""} className="input" /></Campo>
            <Campo label="Cargo"><input name="jobTitle" defaultValue={editar.jobTitle ?? ""} className="input" /></Campo>
            <Campo label="Ciudad"><input name="city" defaultValue={editar.city ?? ""} className="input" /></Campo>

            <div className="sm:col-span-2 flex flex-wrap items-center justify-between gap-2 border-t border-navy-50 pt-4">
              <button type="button" onClick={restablecer} disabled={cargando} className="btn-outline btn-sm">
                <IconLock width={14} height={14} /> Restablecer contraseña
              </button>
              <div className="flex gap-2">
                <button type="button" onClick={() => { onCerrarEdicion(); setMsg(null); setClave(null); }} className="btn-ghost">Cerrar</button>
                <button className="btn-lime" disabled={cargando}>{cargando ? "Guardando..." : "Guardar cambios"}</button>
              </div>
            </div>
          </form>
        </Ventana>
      )}
    </>
  );
}

/** Etiqueta legible del rol, para reutilizar en la página de servidor. */
export const etiquetaRol = (code: string) => ROLE_LABEL[code] ?? code;
