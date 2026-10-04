"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { IconUsers, IconAlert, IconCheck, IconUpload, IconDownload } from "@/components/Icons";
import { esCorreoValido, normalizarDocumento } from "@/lib/identidad";
import { pedirApi } from "@/lib/api-cliente";
import { cantidad } from "@/lib/utils";

type Opt = { id: string; name: string };
type Curso = { id: string; code: string; title: string };
type Credencial = { nombre?: string; usuario?: string; email: string; clave: string };
type Mensaje = { ok: boolean; text: string } | null;
/** Respuesta de /api/empresa/trabajadores (de a uno o por lote). */
type RespuestaAlta = {
  creados?: number;
  vinculados?: number;
  omitidos?: number;
  sinCupo?: number;
  asignadas?: number;
  vinculado?: boolean;
  reincorporado?: boolean;
  claveElegida?: boolean;
  usuario?: string;
  aviso?: string;
  errores?: { fila: number; motivo: string }[];
  credenciales?: Credencial[];
};

/* ----------------------------- Lectura del lote ----------------------------- */

/** Columnas que se reconocen en la primera fila, en cualquier orden. */
const ENCABEZADOS: Record<string, string[]> = {
  firstName: ["nombres", "nombre", "nombre s", "primer nombre", "nombres completos"],
  lastName: ["apellidos", "apellido", "apellido s"],
  documentNumber: [
    "documento", "cedula", "cc", "c c", "numero de documento", "numero documento", "no documento", "no de documento",
    "n documento", "nro documento", "documento de identidad", "documento identidad", "cedula de ciudadania", "cedula ciudadania",
    "identificacion", "numero de identificacion",
  ],
  email: ["correo", "email", "e mail", "correo electronico", "mail"],
  employeeCode: ["codigo", "codigo de empleado", "codigo empleado", "cod empleado", "codigo interno"],
  area: ["area", "departamento", "dependencia"],
  cargo: ["cargo", "puesto", "ocupacion"],
  sede: ["sede", "ubicacion", "centro de trabajo"],
  rol: ["rol", "perfil", "tipo"],
};
/** Sin encabezado, las columnas se toman en este orden (el de la plantilla). */
const ORDEN = ["firstName", "lastName", "documentNumber", "email", "employeeCode", "area", "cargo", "sede", "rol"];
/** Filas por petición: cada lote es corto y nunca llega al tiempo máximo del servidor. */
const BLOQUE = 25;

const sinTildes = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
/** "N° de Documento", "Nombre(s)", "Correo  electrónico" → texto comparable. */
const titulo = (s: string) => sinTildes(s).replace(/[^a-z0-9]+/g, " ").trim();
/** Palabras de relleno en los títulos: "N° de documento" y "Documento" son lo mismo. */
const RELLENO = new Set(["n", "no", "nro", "num", "numero", "de", "del", "la", "el"]);
const esencia = (t: string) => t.split(" ").filter((w) => !RELLENO.has(w)).join(" ");
function columnaDe(h: string) {
  const t = titulo(h);
  return Object.entries(ENCABEZADOS).find(([, alias]) => alias.includes(t) || alias.includes(esencia(t)))?.[0] ?? "";
}

/** Divide una línea respetando comillas al inicio de la celda ("Gómez, Ana"). */
function partir(linea: string, sep: string) {
  const out: string[] = [];
  let actual = "";
  let comillas = false;
  for (let i = 0; i < linea.length; i++) {
    const c = linea[i];
    if (comillas) {
      if (c === '"' && linea[i + 1] === '"') {
        actual += '"';
        i++;
      } else if (c === '"') comillas = false;
      else actual += c;
    } else if (c === '"' && actual.trim() === "") {
      comillas = true;
      actual = "";
    } else if (c === sep) {
      out.push(actual.trim());
      actual = "";
    } else actual += c;
  }
  out.push(actual.trim());
  return out;
}

type FilaLote = { linea: number; datos: Record<string, string>; error: string | null };
type Lote = { filas: FilaLote[]; ignoradas: string[] };

function leerLote(texto: string): Lote {
  // La fila de cada línea es la de Excel, contando también las vacías.
  const lineas = texto
    .replace(/^﻿/, "")
    .split(/\r\n|\r|\n/)
    .map((l, i) => ({ l, n: i + 1 }))
    .filter(({ l }) => l.replace(/[;,\t\s"]/g, "") !== "");
  if (!lineas.length) return { filas: [], ignoradas: [] };
  // Separador: tabulador (pegado desde Excel), punto y coma (Excel en español) o coma.
  const primera = lineas[0].l;
  const sep = primera.includes("\t") ? "\t" : (primera.match(/;/g)?.length ?? 0) >= (primera.match(/,/g)?.length ?? 0) ? ";" : ",";

  let columnas = ORDEN;
  let ignoradas: string[] = [];
  let datosDesde = 0;
  const cabecera = partir(primera, sep);
  const reconocidas = cabecera.map(columnaDe);
  if (reconocidas.filter(Boolean).length >= 2) {
    columnas = reconocidas;
    ignoradas = cabecera.filter((h, k) => h && !reconocidas[k]);
    datosDesde = 1;
  }

  const vistos = new Set<string>();
  const filas = lineas.slice(datosDesde).map(({ l, n }) => {
    const celdas = partir(l, sep);
    const datos: Record<string, string> = {};
    columnas.forEach((col, k) => {
      if (col && celdas[k]) datos[col] = celdas[k];
    });
    let error: string | null = null;
    const correo = (datos.email ?? "").toLowerCase();
    const doc = normalizarDocumento(datos.documentNumber ?? "");
    if (!datos.firstName || !datos.lastName) error = "Faltan nombres o apellidos";
    else if (correo && !esCorreoValido(correo)) error = "Correo no válido";
    else if (!correo && !doc) error = "Sin correo, el documento es obligatorio";
    else if ((correo && vistos.has(correo)) || (doc && vistos.has(doc))) error = "Repetido en el archivo";
    if (!error) {
      if (correo) vistos.add(correo);
      if (doc) vistos.add(doc);
    }
    return { linea: n, datos, error };
  });
  return { filas, ignoradas };
}

/**
 * Lee un CSV o texto de Excel: UTF-16 ("Texto Unicode"), UTF-8 o, si trae
 * tildes de Windows, ANSI (windows-1252).
 */
async function leerArchivo(archivo: File) {
  const bytes = new Uint8Array(await archivo.arrayBuffer());
  if (bytes[0] === 0xff && bytes[1] === 0xfe) return new TextDecoder("utf-16le").decode(bytes);
  if (bytes[0] === 0xfe && bytes[1] === 0xff) return new TextDecoder("utf-16be").decode(bytes);
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
  // Liberar enseguida puede cancelar la descarga en Firefox o Safari.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
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
  const [claveInicial, setClaveInicial] = useState("");
  const [verClave, setVerClave] = useState(false);
  const [pedirCambio, setPedirCambio] = useState(true);

  const [progreso, setProgreso] = useState<string | null>(null);
  const { filas: lote, ignoradas } = useMemo(() => leerLote(texto), [texto]);
  const validas = lote.filter((f) => !f.error);

  const asignacion = { cursos: elegidos, dueDate: fecha || null };
  const textoAsignadas = (n?: number) => (n ? ` ${n === 1 ? "Se asignó 1 curso" : `Se asignaron ${n} cursos`}.` : "");

  async function enviar(cuerpo: Record<string, unknown>) {
    return pedirApi<RespuestaAlta>("/api/empresa/trabajadores", "POST", { companyId, ...asignacion, ...cuerpo });
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
    setErroresServidor([]);
    const { ok, data } = await enviar({ modo: "individual", trabajador: datos });
    setLoading(false);
    if (!ok) return setMsg({ ok: false, text: data.error ?? "No fue posible crear el trabajador" });
    setMsg({
      ok: true,
      text:
        (data.reincorporado
          ? "Esa persona vuelve a la empresa con su historial. Entra con su contraseña de siempre y el sistema le pedirá cambiarla; si no la recuerda, cámbiesela desde su ficha (botón «Ver» en la lista)."
          : data.vinculado
          ? "Esa persona ya tenía cuenta: quedó vinculada a la empresa con su contraseña de siempre. Si no la recuerda, cámbiesela desde su ficha (botón «Ver» en la lista)."
          : data.creados
            ? data.claveElegida
              ? `Cuenta creada. Entra con «${data.usuario}» y la contraseña que usted escribió${pedirCambio ? "; al entrar se le pedirá cambiarla" : ""}.`
              : "Cuenta creada. Entregue la contraseña temporal."
            : "Esa persona ya estaba en la empresa.") + textoAsignadas(data.asignadas),
    });
    setCreds(data.credenciales ?? []);
    form.reset();
    setClaveInicial("");
    router.refresh();
  }

  async function crearMasivo() {
    setLoading(true);
    setMsg(null);
    setCreds([]);
    setErroresServidor([]);
    // Se envía por bloques: un lote de 170 personas en una sola petición podía
    // pasar el tiempo máximo del servidor y perder las contraseñas temporales.
    const total = { creados: 0, vinculados: 0, omitidos: 0, sinCupo: 0, asignadas: 0 };
    const errores: { linea: number; motivo: string }[] = [];
    const nuevas: Credencial[] = [];
    let aviso = "";
    let cortado: string | null = null;
    for (let k = 0; k < validas.length; k += BLOQUE) {
      const bloque = validas.slice(k, k + BLOQUE);
      setProgreso(`Cargando ${Math.min(k + BLOQUE, validas.length)} de ${validas.length}...`);
      const { ok, data } = await enviar({ modo: "masivo", filas: bloque.map((f) => f.datos) });
      if (!ok) {
        cortado = `${data.error ?? "Se interrumpió la carga"}. Quedaron sin procesar ${validas.length - k} fila(s) desde la fila ${bloque[0].linea}.`;
        break;
      }
      for (const c of Object.keys(total) as (keyof typeof total)[]) total[c] += data[c] ?? 0;
      nuevas.push(...(data.credenciales ?? []));
      errores.push(
        ...(data.errores ?? []).map((er: { fila: number; motivo: string }) => ({ linea: bloque[er.fila - 1]?.linea ?? er.fila, motivo: er.motivo }))
      );
      if (data.aviso) aviso = data.aviso;
    }
    setProgreso(null);
    setLoading(false);

    const partes = [`${total.creados} cuenta(s) creada(s)`];
    if (total.vinculados) partes.push(`${total.vinculados} vinculada(s)`);
    if (total.omitidos) partes.push(`${total.omitidos} ya estaban o con error`);
    const conErrores = lote.length - validas.length;
    setMsg({
      ok: !cortado && !errores.length && !conErrores,
      text: `${partes.join(", ")}.${textoAsignadas(total.asignadas)}${aviso ? ` ${aviso}` : ""}${
        conErrores ? ` ${conErrores} fila(s) con errores no se enviaron: corríjalas en la vista previa.` : ""
      }${cortado ? ` ${cortado}` : ""}`,
    });
    setErroresServidor(errores);
    setCreds(nuevas);
    // Si todo entró, se limpia; si no, se deja el texto para corregir y volver a
    // cargar (quien ya quedó en la empresa se omite solo).
    if (!cortado && !errores.length && !conErrores) {
      setTexto("");
      setArchivo(null);
    }
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
            {t === "individual" ? "Registro individual" : "Carga masiva (Excel o CSV)"}
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
                <option value="trabajador">Trabajador (toma cursos)</option>
                <option value="supervisor">Supervisor (toma cursos y consulta el avance de la empresa)</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="label">Contraseña (opcional)</label>
              <div className="flex gap-2">
                <input
                  name="clave"
                  type={verClave ? "text" : "password"}
                  value={claveInicial}
                  onChange={(e) => setClaveInicial(e.target.value)}
                  autoComplete="new-password"
                  className="input"
                  placeholder="Déjela vacía y el sistema genera una temporal"
                />
                <button type="button" onClick={() => setVerClave(!verClave)} className="btn-ghost btn-sm shrink-0">
                  {verClave ? "Ocultar" : "Mostrar"}
                </button>
              </div>
              {claveInicial && (
                <label className="mt-2 flex cursor-pointer items-center gap-2 text-xs font-semibold text-navy-600">
                  <input type="checkbox" checked={pedirCambio} onChange={(e) => setPedirCambio(e.target.checked)} />
                  Pedir que la cambie al entrar (recomendado)
                  <input type="hidden" name="pedirCambio" value={pedirCambio ? "si" : "no"} />
                </label>
              )}
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
              <label className="btn-outline btn-sm cursor-pointer focus-within:ring-2 focus-within:ring-lime-400">
                <IconUpload width={14} height={14} /> Subir archivo CSV
                <input type="file" accept=".csv,.txt,text/csv,text/plain" onChange={elegirArchivo} className="sr-only" />
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
                  <span className={validas.length > disponibles ? "font-bold text-amber-700" : "text-navy-500"}>
                    {disponibles} cupos disponibles
                    {validas.length > disponibles ? " · quienes no alcancen quedarán por fuera" : ""}
                  </span>
                  {lote.length > 200 && <span className="text-navy-500">Se muestran las primeras 200 filas; se cargan todas.</span>}
                </div>
                {ignoradas.length > 0 && (
                  <p className="mb-2 text-xs text-amber-700">
                    Columnas que no se reconocieron y se ignoran: {ignoradas.join(", ")}. Use los títulos de la plantilla si
                    las necesita.
                  </p>
                )}
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
                {loading ? progreso ?? "Procesando..." : `Cargar ${cantidad(validas.length, "persona", "personas")}`}
              </button>
              <p className="mt-2 text-xs text-navy-400">
                Se cargan por bloques de {BLOQUE}, sin límite de filas más allá de los cupos. Quien ya está en la empresa se
                omite; cada cuenta nueva recibe su propia contraseña temporal.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
