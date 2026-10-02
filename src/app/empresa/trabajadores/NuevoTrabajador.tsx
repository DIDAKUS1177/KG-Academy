"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { IconUsers, IconAlert, IconCheck, IconUpload, IconDownload } from "@/components/Icons";

type Opt = { id: string; name: string };
type Curso = { id: string; code: string; title: string };
type Credencial = { nombre?: string; usuario?: string; email: string; clave: string };
type Mensaje = { ok: boolean; text: string } | null;

/* ----------------------------- Lectura del lote ----------------------------- */

/** Columnas que se reconocen en la primera fila, en cualquier orden. */
const ENCABEZADOS: Record<string, string[]> = {
  firstName: ["nombres", "nombre", "primer nombre"],
  lastName: ["apellidos", "apellido"],
  documentNumber: ["documento", "cedula", "cc", "numero de documento", "identificacion", "no documento"],
  email: ["correo", "email", "e-mail", "correo electronico"],
  employeeCode: ["codigo", "codigo de empleado", "cod empleado"],
  area: ["area", "departamento"],
  cargo: ["cargo", "puesto"],
  sede: ["sede", "ubicacion"],
  rol: ["rol", "perfil"],
};
/** Sin encabezado, las columnas se toman en este orden (el de la plantilla). */
const ORDEN = ["firstName", "lastName", "documentNumber", "email", "employeeCode", "area", "cargo", "sede", "rol"];

const sinTildes = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();

/** Divide una línea respetando comillas ("Gómez, Ana"). */
function partir(linea: string, sep: string) {
  const out: string[] = [];
  let actual = "";
  let comillas = false;
  for (let i = 0; i < linea.length; i++) {
    const c = linea[i];
    if (c === '"') {
      if (comillas && linea[i + 1] === '"') {
        actual += '"';
        i++;
      } else comillas = !comillas;
    } else if (c === sep && !comillas) {
      out.push(actual.trim());
      actual = "";
    } else actual += c;
  }
  out.push(actual.trim());
  return out;
}

type FilaLote = { linea: number; datos: Record<string, string>; error: string | null };

function leerLote(texto: string): FilaLote[] {
  const lineas = texto.replace(/^﻿/, "").split(/\r?\n/).filter((l) => l.trim());
  if (!lineas.length) return [];
  // Separador: tabulador (pegado desde Excel), punto y coma (Excel en español) o coma.
  const primera = lineas[0];
  const sep = primera.includes("\t") ? "\t" : (primera.match(/;/g)?.length ?? 0) >= (primera.match(/,/g)?.length ?? 0) ? ";" : ",";

  let columnas = ORDEN;
  let desde = 0;
  const cabecera = partir(primera, sep).map(sinTildes);
  const reconocidas = cabecera.map((h) => Object.entries(ENCABEZADOS).find(([, alias]) => alias.includes(h))?.[0] ?? "");
  if (reconocidas.filter(Boolean).length >= 2) {
    columnas = reconocidas;
    desde = 1;
  }

  const vistos = new Set<string>();
  return lineas.slice(desde).map((linea, i) => {
    const celdas = partir(linea, sep);
    const datos: Record<string, string> = {};
    columnas.forEach((col, j) => {
      if (col && celdas[j]) datos[col] = celdas[j];
    });
    let error: string | null = null;
    const correo = (datos.email ?? "").toLowerCase();
    const doc = (datos.documentNumber ?? "").replace(/[.\s-]/g, "");
    if (!datos.firstName || !datos.lastName) error = "Faltan nombres o apellidos";
    else if (correo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) error = "Correo no válido";
    else if (!correo && !doc) error = "Sin correo, el documento es obligatorio";
    else if ((correo && vistos.has(correo)) || (doc && vistos.has(doc))) error = "Repetido en el archivo";
    if (!error) {
      if (correo) vistos.add(correo);
      if (doc) vistos.add(doc);
    }
    return { linea: i + 1 + desde, datos, error };
  });
}

/** Lee un CSV de Excel: primero como UTF-8 y, si trae tildes de Windows, como ANSI. */
async function leerArchivo(archivo: File) {
  const bytes = await archivo.arrayBuffer();
  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch {
    return new TextDecoder("windows-1252").decode(bytes);
  }
}

function descargarCsv(nombre: string, contenido: string) {
  // BOM para que Excel abra bien las tildes; punto y coma, como usa Excel en español.
  const url = URL.createObjectURL(new Blob(["﻿" + contenido], { type: "text/csv;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = nombre;
  a.click();
  URL.revokeObjectURL(url);
}

const PLANTILLA = [
  "nombres;apellidos;documento;correo;codigo;area;cargo;sede;rol",
  "Pedro;Gómez Lara;1098765432;pedro.gomez@empresa.com;OPE-201;Operaciones;Operario;Sede Principal;trabajador",
  "María;Díaz Rojas;1098765433;;OPE-202;Operaciones;Auxiliar de obra;Obra Norte;trabajador",
  "Andrés;Ruiz Peña;80123456;andres.ruiz@empresa.com;SUP-010;Operaciones;Supervisor de obra;Obra Norte;supervisor",
].join("\n");

/* ------------------------------- Componentes ------------------------------- */

/**
 * Contraseñas temporales recién generadas. Se muestran una sola vez: el
 * servidor no las guarda en claro, así que si se pierden hay que restablecerlas.
 */
function Credenciales({ lista }: { lista: Credencial[] }) {
  const [copiado, setCopiado] = useState(false);
  if (!lista.length) return null;
  const filas = lista.map((c) => ({ nombre: c.nombre ?? "", usuario: c.usuario ?? c.email, clave: c.clave }));

  async function copiar() {
    try {
      await navigator.clipboard.writeText(filas.map((c) => `${c.nombre}\t${c.usuario}\t${c.clave}`).join("\n"));
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      /* Sin permiso de portapapeles: la tabla sigue visible. */
    }
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
          <button
            type="button"
            onClick={() =>
              descargarCsv(
                `accesos-${new Date().toISOString().slice(0, 10)}.csv`,
                "nombre;usuario_de_ingreso;contraseña_temporal\n" + filas.map((c) => `${c.nombre};${c.usuario};${c.clave}`).join("\n")
              )
            }
            className="btn-outline btn-sm"
          >
            Descargar Excel (CSV)
          </button>
        </div>
      </div>
      <div className="mt-3 max-h-64 overflow-auto rounded-lg bg-white">
        <table className="table-kg">
          <thead>
            <tr><th>Nombre</th><th>Usuario de ingreso</th><th>Contraseña temporal</th></tr>
          </thead>
          <tbody>
            {filas.map((c) => (
              <tr key={c.usuario}>
                <td className="text-xs text-navy-700">{c.nombre}</td>
                <td className="text-xs text-navy-600">{c.usuario}</td>
                <td className="font-mono text-sm font-bold text-navy-800">{c.clave}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-[11px] leading-relaxed text-lime-800/80">
        Cada persona tiene una distinta. Entréguelas por un canal privado: no vuelven a mostrarse. Quien no tiene
        correo ingresa con su número de documento. Al primer ingreso, el sistema le pide definir su contraseña.
      </p>
    </div>
  );
}

/** Cursos que se asignan en el mismo paso (opcional). */
function AsignarEnElAlta({
  cursos,
  elegidos,
  setElegidos,
  fecha,
  setFecha,
}: {
  cursos: Curso[];
  elegidos: string[];
  setElegidos: (v: string[]) => void;
  fecha: string;
  setFecha: (v: string) => void;
}) {
  if (!cursos.length) return null;
  return (
    <fieldset className="rounded-xl border border-navy-100 p-4 sm:col-span-2">
      <legend className="px-1 text-xs font-bold uppercase tracking-wide text-navy-500">Asignar cursos ahora (opcional)</legend>
      <div className="grid gap-2 sm:grid-cols-2">
        {cursos.map((c) => (
          <label key={c.id} className="flex cursor-pointer items-start gap-2 text-sm text-navy-700">
            <input
              type="checkbox"
              className="mt-0.5"
              checked={elegidos.includes(c.id)}
              onChange={(e) => setElegidos(e.target.checked ? [...elegidos, c.id] : elegidos.filter((x) => x !== c.id))}
            />
            <span>
              {c.title} <span className="text-[11px] text-navy-400">{c.code}</span>
            </span>
          </label>
        ))}
      </div>
      {elegidos.length > 0 && (
        <div className="mt-3 max-w-xs">
          <label className="label">Fecha límite (opcional)</label>
          <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} className="input" />
        </div>
      )}
    </fieldset>
  );
}

export function NuevoTrabajador({
  companyId,
  disponibles,
  areas,
  positions,
  locations,
  cursos,
}: {
  companyId: string;
  /** Cupos libres del plan; sin cupo no se abre el formulario. */
  disponibles: number;
  areas: Opt[];
  positions: Opt[];
  locations: Opt[];
  /** Cursos publicados que se pueden asignar en el mismo paso. */
  cursos: Curso[];
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"individual" | "masivo">("individual");
  const [msg, setMsg] = useState<Mensaje>(null);
  const [loading, setLoading] = useState(false);
  const [texto, setTexto] = useState("");
  const [archivo, setArchivo] = useState<string | null>(null);
  const [creds, setCreds] = useState<Credencial[]>([]);
  const [erroresServidor, setErroresServidor] = useState<{ linea: number; motivo: string }[]>([]);
  const [elegidos, setElegidos] = useState<string[]>([]);
  const [fecha, setFecha] = useState("");

  const lote = useMemo(() => leerLote(texto), [texto]);
  const validas = lote.filter((f) => !f.error);
  const trabajadoresValidos = validas.filter((f) => sinTildes(f.datos.rol ?? "") !== "supervisor").length;

  const asignacion = { cursos: elegidos, dueDate: fecha || null };
  const textoAsignadas = (n?: number) => (n ? ` Se asignaron ${n} curso(s).` : "");

  async function enviar(cuerpo: Record<string, unknown>) {
    const res = await fetch("/api/empresa/trabajadores", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ companyId, ...asignacion, ...cuerpo }),
    });
    return { ok: res.ok, data: await res.json().catch(() => ({})) };
  }

  async function crearIndividual(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const datos = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;
    if (!datos.email?.trim() && !datos.documentNumber?.trim()) {
      return setMsg({ ok: false, text: "Escriba el correo o, si no tiene, el número de documento: con él ingresará." });
    }
    setLoading(true);
    setMsg(null);
    setCreds([]);
    const { ok, data } = await enviar({ modo: "individual", trabajador: datos });
    setLoading(false);
    if (!ok) return setMsg({ ok: false, text: data.error ?? "No fue posible crear el trabajador" });
    setMsg({
      ok: true,
      text:
        (data.vinculado
          ? "Esa persona ya tenía cuenta: quedó vinculada a la empresa con su contraseña de siempre."
          : data.creados
            ? "Cuenta creada. Entregue la contraseña temporal."
            : "Esa persona ya estaba en la empresa.") + textoAsignadas(data.asignadas),
    });
    setCreds(data.credenciales ?? []);
    form.reset();
    router.refresh();
  }

  async function crearMasivo() {
    setLoading(true);
    setMsg(null);
    setCreds([]);
    setErroresServidor([]);
    const { ok, data } = await enviar({ modo: "masivo", filas: validas.map((f) => f.datos) });
    setLoading(false);
    if (!ok) return setMsg({ ok: false, text: data.error ?? "No fue posible procesar el archivo" });
    const partes = [`${data.creados} cuenta(s) creada(s)`];
    if (data.vinculados) partes.push(`${data.vinculados} vinculada(s)`);
    if (data.omitidos) partes.push(`${data.omitidos} omitida(s)`);
    setMsg({
      ok: !data.sinCupo && !data.errores?.length,
      text: `${partes.join(", ")}.${textoAsignadas(data.asignadas)}${data.aviso ? ` ${data.aviso}` : ""}`,
    });
    setErroresServidor(
      (data.errores ?? []).map((er: { fila: number; motivo: string }) => ({ linea: validas[er.fila - 1]?.linea ?? er.fila, motivo: er.motivo }))
    );
    setCreds(data.credenciales ?? []);
    setTexto("");
    setArchivo(null);
    router.refresh();
  }

  async function elegirArchivo(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setTexto(await leerArchivo(f));
    setArchivo(f.name);
    setMsg(null);
    e.target.value = "";
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        disabled={disponibles <= 0}
        title={disponibles <= 0 ? "No quedan cupos en el plan" : undefined}
        className="btn-lime disabled:cursor-not-allowed disabled:opacity-50"
      >
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
            {t === "individual" ? "Registro individual" : "Carga masiva (Excel)"}
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
              msg.ok ? "border-lime-200 bg-lime-50 text-lime-800" : "border-amber-200 bg-amber-50 text-amber-800"
            }`}
          >
            {msg.ok ? <IconCheck width={18} height={18} strokeWidth={3} /> : <IconAlert width={18} height={18} />}
            {msg.text}
          </div>
        )}
        {erroresServidor.length > 0 && (
          <ul className="mb-5 space-y-1 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
            {erroresServidor.map((er) => (
              <li key={er.linea}>Fila {er.linea}: {er.motivo}</li>
            ))}
          </ul>
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
              <input name="documentNumber" className="input" inputMode="numeric" />
            </div>
            <div>
              <label className="label">Correo (opcional)</label>
              <input name="email" type="email" className="input" placeholder="Si no tiene, ingresará con su documento" />
            </div>
            <div>
              <label className="label">Rol</label>
              <select name="rol" className="select" defaultValue="trabajador">
                <option value="trabajador">Trabajador (toma cursos, ocupa cupo)</option>
                <option value="supervisor">Supervisor (consulta el avance, no ocupa cupo)</option>
              </select>
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
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Cargo</label>
              <select name="positionId" className="select">
                <option value="">Sin cargo</option>
                {positions.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Sede</label>
              <select name="locationId" className="select">
                <option value="">Sin sede</option>
                {locations.map((l) => (
                  <option key={l.id} value={l.id}>{l.name}</option>
                ))}
              </select>
            </div>
            <AsignarEnElAlta cursos={cursos} elegidos={elegidos} setElegidos={setElegidos} fecha={fecha} setFecha={setFecha} />
            <div className="sm:col-span-2">
              <button className="btn-lime" disabled={loading}>
                {loading ? "Creando..." : "Crear cuenta"}
              </button>
              <p className="mt-2 text-xs text-navy-400">
                Se genera una contraseña temporal propia, que aparece aquí una sola vez. Al primer ingreso el sistema
                le pide cambiarla.
              </p>
            </div>
          </form>
        ) : (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-3">
              <label className="btn-outline btn-sm cursor-pointer">
                <IconUpload width={14} height={14} /> Subir archivo CSV
                <input type="file" accept=".csv,.txt,text/csv,text/plain" onChange={elegirArchivo} className="hidden" />
              </label>
              <button type="button" onClick={() => descargarCsv("plantilla-trabajadores-kg-academy.csv", PLANTILLA)} className="btn-ghost btn-sm">
                <IconDownload width={14} height={14} /> Descargar plantilla
              </button>
              {archivo && <span className="text-xs text-navy-500">Archivo: {archivo}</span>}
            </div>

            <div>
              <label className="label">O pegue aquí las filas copiadas de Excel (con o sin la fila de títulos)</label>
              <textarea
                value={texto}
                onChange={(e) => {
                  setTexto(e.target.value);
                  setArchivo(null);
                }}
                rows={6}
                className="input font-mono text-xs"
                placeholder={"nombres;apellidos;documento;correo;codigo;area;cargo;sede;rol\nPedro;Gómez Lara;1098765432;pedro.gomez@empresa.com;OPE-201;Operaciones;Operario;Sede Principal;trabajador"}
              />
              <p className="mt-1.5 text-[11px] leading-relaxed text-navy-400">
                Columnas: nombres, apellidos, documento, correo, código, área, cargo, sede y rol (trabajador o
                supervisor). Con la fila de títulos el orden no importa. El correo es opcional si hay documento. Las
                áreas, cargos y sedes que no existan se crean. En Excel: Archivo → Guardar como → CSV.
              </p>
            </div>

            {lote.length > 0 && (
              <div>
                <div className="mb-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                  <span className="font-bold text-lime-700">{validas.length} filas listas</span>
                  {lote.length - validas.length > 0 && (
                    <span className="font-bold text-red-600">{lote.length - validas.length} con errores (no se cargan)</span>
                  )}
                  <span className={trabajadoresValidos > disponibles ? "font-bold text-amber-700" : "text-navy-500"}>
                    {trabajadoresValidos} ocupan cupo · {disponibles} disponibles
                    {trabajadoresValidos > disponibles ? " · los que no alcancen quedarán por fuera" : ""}
                  </span>
                </div>
                <div className="max-h-72 overflow-auto rounded-xl border border-navy-100">
                  <table className="table-kg">
                    <thead>
                      <tr>
                        <th>Fila</th><th>Nombre</th><th>Documento</th><th>Correo</th><th>Área</th><th>Cargo</th><th>Sede</th><th>Rol</th><th>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lote.slice(0, 200).map((f) => (
                        <tr key={f.linea} className={f.error ? "bg-red-50/60" : undefined}>
                          <td className="text-xs text-navy-400">{f.linea}</td>
                          <td className="text-xs font-semibold text-navy-700">{f.datos.firstName} {f.datos.lastName}</td>
                          <td className="text-xs">{f.datos.documentNumber ?? ""}</td>
                          <td className="text-xs">{f.datos.email || <span className="text-navy-300">Ingresa con documento</span>}</td>
                          <td className="text-xs">{f.datos.area ?? ""}</td>
                          <td className="text-xs">{f.datos.cargo ?? ""}</td>
                          <td className="text-xs">{f.datos.sede ?? ""}</td>
                          <td className="text-xs">{sinTildes(f.datos.rol ?? "") === "supervisor" ? "Supervisor" : "Trabajador"}</td>
                          <td className={`text-xs font-semibold ${f.error ? "text-red-600" : "text-lime-700"}`}>{f.error ?? "Lista"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="grid sm:grid-cols-2">
              <AsignarEnElAlta cursos={cursos} elegidos={elegidos} setElegidos={setElegidos} fecha={fecha} setFecha={setFecha} />
            </div>

            <div>
              <button onClick={crearMasivo} disabled={loading || validas.length === 0} className="btn-lime">
                <IconUpload width={16} height={16} />
                {loading ? "Procesando..." : `Cargar ${validas.length} persona(s)`}
              </button>
              <p className="mt-2 text-xs text-navy-400">
                Hasta 200 por carga. Quien ya está en la empresa se omite; cada cuenta nueva recibe su propia contraseña
                temporal.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
