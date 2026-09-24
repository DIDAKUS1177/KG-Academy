"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { IconClipboard, IconFile, IconLayers, IconX } from "@/components/Icons";
import { ASSESSMENT_TYPE_LABEL, STATUS_LABEL } from "@/lib/constants";
import { Aviso, Campo, Ventana, llamar, leerFormulario, type Mensaje } from "@/components/admin/Formulario";
import { cantidad } from "@/lib/utils";

type Lesson = {
  id: string;
  title: string;
  description: string | null;
  contentType: string;
  contentUrl: string | null;
  durationMin: number;
  isRequired: boolean;
  isPreview: boolean;
  isPublished: boolean;
  conAvance: boolean;
};
type Module = { id: string; title: string; description: string | null; lessons: Lesson[] };
type Assessment = { id: string; title: string; type: string; minScore: number; maxAttempts: number; questions: number };
type Course = {
  id: string;
  status: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  objective: string | null;
  targetAudience: string | null;
  requirements: string | null;
  methodology: string | null;
  level: string;
  modality: string;
  durationHours: number;
  categoryId: string;
  instructorId: string | null;
  progressRule: string;
  minPassingScore: number;
  maxAttempts: number;
  requiresFinalExam: boolean;
  requiresAllLessons: boolean;
  certificateEnabled: boolean;
  certificateValidityMonths: number | null;
  allowRetake: boolean;
};
type Opcion = { id: string; nombre: string };

const TIPOS = [
  { v: "pendiente", l: "Pendiente (sin contenido)" },
  { v: "video", l: "Video (URL embebible)" },
  { v: "genially", l: "Genially / interactivo" },
  { v: "pdf", l: "PDF / documento" },
  { v: "texto", l: "Texto enriquecido" },
  { v: "enlace", l: "Enlace externo" },
  { v: "scorm", l: "Paquete SCORM" },
];

/**
 * Constructor del curso: estructura (módulos y lecciones), contenido de cada
 * lección, ficha pública, reglas de negocio y estado de publicación.
 *
 * Todo cambio pasa por /api/admin/* y se audita. Módulos y lecciones con
 * avance de estudiantes no se pueden borrar: el servidor lo rechaza y aquí el
 * botón ni se muestra.
 */
export function CursoConstructor({
  course,
  modules,
  assessments,
  categorias,
  instructores,
  puedePublicar,
}: {
  course: Course;
  modules: Module[];
  assessments: Assessment[];
  categorias: Opcion[];
  instructores: Opcion[];
  puedePublicar: boolean;
}) {
  const router = useRouter();
  const [msg, setMsg] = useState<Mensaje>(null);
  const [saving, setSaving] = useState<string | null>(null);
  const [ventana, setVentana] = useState<
    | null
    | { tipo: "ficha" }
    | { tipo: "reglas" }
    | { tipo: "modulo"; modulo?: Module }
    | { tipo: "leccion"; moduleId: string; leccion?: Lesson }
  >(null);
  const [draft, setDraft] = useState<Record<string, { contentType: string; contentUrl: string }>>(
    Object.fromEntries(
      modules.flatMap((m) =>
        m.lessons.map((l) => [l.id, { contentType: l.contentType, contentUrl: l.contentUrl ?? "" }])
      )
    )
  );

  /** Envía, muestra el resultado y refresca. Devuelve true si salió bien. */
  async function ejecutar(
    clave: string,
    url: string,
    method: "POST" | "PUT" | "PATCH" | "DELETE",
    body: unknown,
    exito: string
  ) {
    setSaving(clave);
    setMsg(null);
    const { ok, data } = await llamar(url, method, body);
    setSaving(null);
    if (!ok) {
      setMsg({ ok: false, text: data.error ?? "No se pudo completar la acción" });
      return false;
    }
    setMsg({ ok: true, text: exito });
    router.refresh();
    return true;
  }

  const guardarContenido = (id: string) =>
    ejecutar(id, "/api/admin/leccion", "POST", { lessonId: id, ...draft[id] }, "Contenido de la lección actualizado");

  const cambiarEstado = (status: string) =>
    ejecutar("curso", "/api/admin/curso", "POST", { courseId: course.id, status }, `Curso marcado como "${STATUS_LABEL[status] ?? status}"`);

  const mover = (tipo: "modulo" | "leccion", id: string, dir: "arriba" | "abajo") =>
    ejecutar(
      id,
      tipo === "modulo" ? "/api/admin/modulo" : "/api/admin/leccion",
      "PATCH",
      tipo === "modulo" ? { moduleId: id, mover: dir } : { lessonId: id, mover: dir },
      "Orden actualizado"
    );

  async function eliminar(tipo: "modulo" | "leccion", id: string, nombre: string) {
    if (!confirm(`¿Eliminar "${nombre}"? Esta acción no se puede deshacer.`)) return;
    await ejecutar(
      id,
      tipo === "modulo" ? "/api/admin/modulo" : "/api/admin/leccion",
      "DELETE",
      tipo === "modulo" ? { moduleId: id } : { lessonId: id },
      `${tipo === "modulo" ? "Módulo" : "Lección"} eliminado`
    );
  }

  async function enviarVentana(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!ventana) return;
    const d = leerFormulario(e.currentTarget);
    let ok = false;
    if (ventana.tipo === "ficha" || ventana.tipo === "reglas") {
      if (d.certificateValidityMonths === "") d.certificateValidityMonths = null;
      if (d.instructorId === "") d.instructorId = null;
      ok = await ejecutar("ventana", "/api/admin/curso", "PUT", { courseId: course.id, ...d }, ventana.tipo === "ficha" ? "Ficha del curso guardada" : "Reglas del curso guardadas");
    } else if (ventana.tipo === "modulo") {
      ok = ventana.modulo
        ? await ejecutar("ventana", "/api/admin/modulo", "PATCH", { moduleId: ventana.modulo.id, ...d }, "Módulo actualizado")
        : await ejecutar("ventana", "/api/admin/modulo", "POST", { courseId: course.id, ...d }, "Módulo agregado");
    } else if (ventana.tipo === "leccion") {
      ok = ventana.leccion
        ? await ejecutar("ventana", "/api/admin/leccion", "PATCH", { lessonId: ventana.leccion.id, ...d }, "Lección actualizada")
        : await ejecutar("ventana", "/api/admin/leccion", "PUT", { moduleId: ventana.moduleId, ...d }, "Lección agregada");
    }
    if (ok) setVentana(null);
  }

  const totalLecciones = modules.reduce((s, m) => s + m.lessons.length, 0);
  const listas = Object.values(draft).filter((d) => d.contentType !== "pendiente").length;
  const ocupado = saving !== null;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_330px]">
      <div className="space-y-5">
        <Aviso msg={msg} />

        {/* ------------------------------ Módulos ------------------------------ */}
        {modules.map((m, mi) => (
          <div key={m.id} className="card overflow-hidden">
            <div className="flex items-center gap-3 border-b border-navy-50 bg-navy-50/50 px-5 py-4">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-navy-700 text-xs font-bold text-lime-400">
                {mi + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-display text-sm font-bold text-navy-700">{m.title}</p>
                <p className="truncate text-[11px] text-navy-400">{m.description}</p>
              </div>
              <span className="badge-slate shrink-0">{cantidad(m.lessons.length, "lección", "lecciones")}</span>
              <div className="flex shrink-0 items-center gap-1">
                <BotonIcono titulo="Subir" disabled={ocupado || mi === 0} onClick={() => mover("modulo", m.id, "arriba")}>↑</BotonIcono>
                <BotonIcono titulo="Bajar" disabled={ocupado || mi === modules.length - 1} onClick={() => mover("modulo", m.id, "abajo")}>↓</BotonIcono>
                <button onClick={() => setVentana({ tipo: "modulo", modulo: m })} className="btn-ghost btn-sm">Editar</button>
                {!m.lessons.some((l) => l.conAvance) && (
                  <BotonIcono titulo="Eliminar módulo" disabled={ocupado} onClick={() => eliminar("modulo", m.id, m.title)} peligro>
                    <IconX width={14} height={14} />
                  </BotonIcono>
                )}
              </div>
            </div>

            <div className="divide-y divide-navy-50">
              {m.lessons.map((l, li) => {
                const d = draft[l.id];
                const cambio = d.contentType !== l.contentType || d.contentUrl !== (l.contentUrl ?? "");
                return (
                  <div key={l.id} className="p-5">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="min-w-0 flex-1 text-sm font-semibold text-navy-700">
                        {l.title}
                        <span className="ml-2 text-[11px] font-normal text-navy-400">
                          {l.durationMin} min{!l.isRequired && " · opcional"}{l.isPreview && " · vista previa"}
                        </span>
                      </p>
                      {d.contentType === "pendiente" ? (
                        <span className="badge-amber">Contenido pendiente</span>
                      ) : (
                        <span className="badge-green">Contenido cargado</span>
                      )}
                      <div className="flex items-center gap-1">
                        <BotonIcono titulo="Subir" disabled={ocupado || li === 0} onClick={() => mover("leccion", l.id, "arriba")}>↑</BotonIcono>
                        <BotonIcono titulo="Bajar" disabled={ocupado || li === m.lessons.length - 1} onClick={() => mover("leccion", l.id, "abajo")}>↓</BotonIcono>
                        <button onClick={() => setVentana({ tipo: "leccion", moduleId: m.id, leccion: l })} className="btn-ghost btn-sm">Editar</button>
                        {!l.conAvance && (
                          <BotonIcono titulo="Eliminar lección" disabled={ocupado} onClick={() => eliminar("leccion", l.id, l.title)} peligro>
                            <IconX width={14} height={14} />
                          </BotonIcono>
                        )}
                      </div>
                    </div>

                    <div className="mt-3 grid gap-3 sm:grid-cols-[200px_1fr_auto]">
                      <select
                        value={d.contentType}
                        onChange={(e) => setDraft((s) => ({ ...s, [l.id]: { ...s[l.id], contentType: e.target.value } }))}
                        className="select py-2 text-sm"
                      >
                        {/* Una lección interactiva se arma con su guion (JSON), no desde este
                            selector: la opción aparece solo si la lección ya lo es. */}
                        {(l.contentType === "interactivo"
                          ? [{ v: "interactivo", l: "Lección interactiva (KG Academy)" }, ...TIPOS]
                          : TIPOS
                        ).map((t) => <option key={t.v} value={t.v}>{t.l}</option>)}
                      </select>
                      <input
                        value={d.contentUrl}
                        onChange={(e) => setDraft((s) => ({ ...s, [l.id]: { ...s[l.id], contentUrl: e.target.value } }))}
                        placeholder="https://... (URL del video, Genially, PDF o recurso)"
                        className="input py-2 text-sm"
                        disabled={d.contentType === "pendiente" || d.contentType === "interactivo"}
                      />
                      <button onClick={() => guardarContenido(l.id)} disabled={!cambio || saving === l.id} className="btn-lime btn-sm">
                        {saving === l.id ? "..." : "Guardar"}
                      </button>
                    </div>
                  </div>
                );
              })}

              <div className="bg-navy-50/30 px-5 py-3">
                <button onClick={() => setVentana({ tipo: "leccion", moduleId: m.id })} className="btn-outline btn-sm">
                  + Agregar lección
                </button>
              </div>
            </div>
          </div>
        ))}

        <button onClick={() => setVentana({ tipo: "modulo" })} className="btn-outline w-full border-dashed">
          + Agregar módulo
        </button>

        {/* ------------------------------ Evaluaciones ------------------------------ */}
        <div className="card overflow-hidden">
          <div className="flex items-center gap-3 border-b border-navy-50 bg-navy-50/50 px-5 py-4">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-lime-500 text-navy-900">
              <IconClipboard width={17} height={17} />
            </span>
            <p className="font-display text-sm font-bold text-navy-700">Evaluaciones del curso</p>
          </div>
          <table className="table-kg">
            <thead>
              <tr><th>Evaluación</th><th>Tipo</th><th>Preguntas</th><th>Nota mínima</th><th>Intentos</th></tr>
            </thead>
            <tbody>
              {assessments.map((a) => (
                <tr key={a.id}>
                  <td className="font-semibold text-navy-700"><Link href={`/admin/evaluaciones/${a.id}`} className="link-kg">{a.title}</Link></td>
                  <td className="text-xs text-navy-500">{ASSESSMENT_TYPE_LABEL[a.type] ?? a.type}</td>
                  <td className="font-bold">{a.questions}</td>
                  <td>{a.minScore}</td>
                  <td>{a.maxAttempts}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="border-t border-navy-50 px-5 py-3 text-[11px] text-navy-400">
            Toque una evaluación para cargar o editar sus preguntas. Si el curso aún no tiene evaluación
            final, créela desde <Link href="/admin/evaluaciones" className="link-kg">Evaluaciones</Link>.
          </p>
        </div>
      </div>

      {/* ------------------------------ Panel lateral ------------------------------ */}
      <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
        <div className="card p-6">
          <p className="font-display text-base font-bold text-navy-700">Publicación</p>
          <p className="mt-1 text-xs text-navy-400">
            {puedePublicar ? "Estado actual del curso en el catálogo." : "Solo la administración de KG publica."}
          </p>
          <div className="mt-4 space-y-2">
            {["borrador", "revision", "publicado", "despublicado"].map((s) => (
              <button
                key={s}
                onClick={() => cambiarEstado(s)}
                disabled={!puedePublicar || saving === "curso" || course.status === s}
                className={`w-full rounded-xl border px-4 py-2.5 text-left text-sm font-semibold transition disabled:cursor-default ${
                  course.status === s
                    ? "border-lime-500 bg-lime-50 text-navy-800"
                    : "border-navy-100 bg-white text-navy-500 hover:border-navy-300 disabled:opacity-50"
                }`}
              >
                {STATUS_LABEL[s] ?? s}
                {course.status === s && <span className="float-right text-lime-600">actual</span>}
              </button>
            ))}
          </div>
          <div className="mt-6 rounded-xl bg-kg-gradient p-4 text-center text-white">
            <p className="font-display text-3xl font-extrabold text-lime-400">{listas}/{totalLecciones}</p>
            <p className="text-[11px] text-white/60">lecciones con contenido cargado</p>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <IconFile width={17} height={17} className="text-navy-400" />
              <p className="font-display text-sm font-bold text-navy-700">Ficha pública</p>
            </div>
            <button onClick={() => setVentana({ tipo: "ficha" })} className="btn-ghost btn-sm">Editar</button>
          </div>
          <dl className="mt-3 space-y-2 text-xs">
            <Dato k="Horas certificadas" v={`${course.durationHours} h`} />
            <Dato k="Nivel" v={course.level} />
            <Dato k="Modalidad" v={course.modality} />
            <Dato k="Instructor" v={instructores.find((i) => i.id === course.instructorId)?.nombre ?? "Sin asignar"} />
          </dl>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <IconLayers width={17} height={17} className="text-navy-400" />
              <p className="font-display text-sm font-bold text-navy-700">Reglas del curso</p>
            </div>
            <button onClick={() => setVentana({ tipo: "reglas" })} className="btn-ghost btn-sm">Editar</button>
          </div>
          <dl className="mt-3 space-y-2 text-xs">
            <Dato k="Regla de progreso" v={course.progressRule.replace("_", " ")} />
            <Dato k="Nota mínima" v={`${course.minPassingScore}/100`} />
            <Dato k="Intentos" v={String(course.maxAttempts)} />
            <Dato k="Evaluación final" v={course.requiresFinalExam ? "Obligatoria" : "Opcional"} />
            <Dato k="Todas las lecciones" v={course.requiresAllLessons ? "Sí" : "No"} />
            <Dato k="Certificado" v={course.certificateEnabled ? "Automático" : "Desactivado"} />
            <Dato k="Vigencia" v={course.certificateValidityMonths ? `${course.certificateValidityMonths} meses` : "Indefinida"} />
          </dl>
        </div>
      </aside>

      {/* ------------------------------ Ventanas ------------------------------ */}
      {ventana?.tipo === "ficha" && (
        <Ventana titulo="Ficha pública del curso" descripcion="Lo que ve un visitante en el catálogo y en la página del curso." onCerrar={() => setVentana(null)} ancho="max-w-3xl">
          <form onSubmit={enviarVentana} className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2"><Aviso msg={msg} /></div>
            <Campo label="Título" ancho="sm:col-span-2"><input name="title" required defaultValue={course.title} className="input" /></Campo>
            <Campo label="Subtítulo" ancho="sm:col-span-2"><input name="subtitle" defaultValue={course.subtitle ?? ""} className="input" /></Campo>
            <Campo label="Descripción" ancho="sm:col-span-2"><textarea name="description" rows={3} defaultValue={course.description ?? ""} className="input" /></Campo>
            <Campo label="Objetivo" ancho="sm:col-span-2"><textarea name="objective" rows={3} defaultValue={course.objective ?? ""} className="input" /></Campo>
            <Campo label="Dirigido a"><textarea name="targetAudience" rows={2} defaultValue={course.targetAudience ?? ""} className="input" /></Campo>
            <Campo label="Requisitos"><textarea name="requirements" rows={2} defaultValue={course.requirements ?? ""} className="input" /></Campo>
            <Campo label="Metodología" ancho="sm:col-span-2"><textarea name="methodology" rows={2} defaultValue={course.methodology ?? ""} className="input" /></Campo>
            <Campo label="Horas certificadas"><input name="durationHours" type="number" min={0} step={0.5} defaultValue={course.durationHours} className="input" /></Campo>
            <Campo label="Categoría">
              <select name="categoryId" className="select" defaultValue={course.categoryId}>
                {categorias.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
              </select>
            </Campo>
            <Campo label="Nivel">
              <select name="level" className="select" defaultValue={course.level}>
                <option value="basico">Básico</option><option value="intermedio">Intermedio</option><option value="avanzado">Avanzado</option>
              </select>
            </Campo>
            <Campo label="Modalidad">
              <select name="modality" className="select" defaultValue={course.modality}>
                <option value="virtual">Virtual</option><option value="mixto">Mixta</option><option value="presencial">Presencial</option>
              </select>
            </Campo>
            <Campo label="Instructor" ancho="sm:col-span-2">
              <select name="instructorId" className="select" defaultValue={course.instructorId ?? ""}>
                <option value="">Sin asignar</option>
                {instructores.map((i) => <option key={i.id} value={i.id}>{i.nombre}</option>)}
              </select>
            </Campo>
            <PieVentana onCerrar={() => setVentana(null)} cargando={saving === "ventana"} />
          </form>
        </Ventana>
      )}

      {ventana?.tipo === "reglas" && (
        <Ventana titulo="Reglas del curso" descripcion="Cómo se aprueba, cuántos intentos hay y cómo se certifica." onCerrar={() => setVentana(null)}>
          <form onSubmit={enviarVentana} className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2"><Aviso msg={msg} /></div>
            <Campo label="Regla de progreso" ancho="sm:col-span-2" ayuda="«Obligatorios»: el curso se completa al ver todas las lecciones obligatorias. Las otras ponderan por peso.">
              <select name="progressRule" className="select" defaultValue={course.progressRule}>
                <option value="obligatorios">Lecciones obligatorias</option>
                <option value="peso_lecciones">Peso por lección</option>
                <option value="peso_modulos">Peso por módulo</option>
              </select>
            </Campo>
            <Campo label="Nota mínima (1 a 100)" ayuda="Se aplica también a la evaluación final."><input name="minPassingScore" type="number" min={1} max={100} defaultValue={course.minPassingScore} className="input" /></Campo>
            <Campo label="Intentos permitidos"><input name="maxAttempts" type="number" min={1} max={20} defaultValue={course.maxAttempts} className="input" /></Campo>
            <Campo label="Vigencia del certificado (meses)" ayuda="Vacío = indefinida." ancho="sm:col-span-2"><input name="certificateValidityMonths" type="number" min={1} defaultValue={course.certificateValidityMonths ?? ""} className="input" /></Campo>
            <div className="sm:col-span-2 grid gap-2 rounded-xl border border-navy-100 bg-navy-50/40 p-4 text-sm text-navy-700">
              <label className="flex items-center gap-2"><input type="checkbox" name="requiresFinalExam" defaultChecked={course.requiresFinalExam} /> La evaluación final es obligatoria para aprobar</label>
              <label className="flex items-center gap-2"><input type="checkbox" name="requiresAllLessons" defaultChecked={course.requiresAllLessons} /> Exigir todas las lecciones obligatorias</label>
              <label className="flex items-center gap-2"><input type="checkbox" name="certificateEnabled" defaultChecked={course.certificateEnabled} /> Emitir certificado automáticamente al aprobar</label>
              <label className="flex items-center gap-2"><input type="checkbox" name="allowRetake" defaultChecked={course.allowRetake} /> Permitir volver a cursar</label>
            </div>
            <PieVentana onCerrar={() => setVentana(null)} cargando={saving === "ventana"} />
          </form>
        </Ventana>
      )}

      {ventana?.tipo === "modulo" && (
        <Ventana titulo={ventana.modulo ? "Editar módulo" : "Nuevo módulo"} onCerrar={() => setVentana(null)} ancho="max-w-lg">
          <form onSubmit={enviarVentana} className="grid gap-4">
            <Aviso msg={msg} />
            <Campo label="Título"><input name="title" required defaultValue={ventana.modulo?.title} className="input" placeholder="Módulo 4. Manejo de la Vía Aérea y Obstrucción (OVACE)" /></Campo>
            <Campo label="Descripción"><textarea name="description" rows={3} defaultValue={ventana.modulo?.description ?? ""} className="input" /></Campo>
            <PieVentana onCerrar={() => setVentana(null)} cargando={saving === "ventana"} />
          </form>
        </Ventana>
      )}

      {ventana?.tipo === "leccion" && (
        <Ventana titulo={ventana.leccion ? "Editar lección" : "Nueva lección"} descripcion={ventana.leccion ? undefined : "Nace sin contenido; se carga después desde la lista."} onCerrar={() => setVentana(null)} ancho="max-w-lg">
          <form onSubmit={enviarVentana} className="grid gap-4">
            <Aviso msg={msg} />
            <Campo label="Título"><input name="title" required defaultValue={ventana.leccion?.title} className="input" /></Campo>
            <Campo label="Descripción"><textarea name="description" rows={3} defaultValue={ventana.leccion?.description ?? ""} className="input" /></Campo>
            <Campo label="Duración estimada (minutos)"><input name="durationMin" type="number" min={0} defaultValue={ventana.leccion?.durationMin ?? 60} className="input" /></Campo>
            <div className="grid gap-2 text-sm text-navy-700">
              <label className="flex items-center gap-2"><input type="checkbox" name="isRequired" defaultChecked={ventana.leccion?.isRequired ?? true} /> Obligatoria para completar el curso</label>
              {ventana.leccion && (
                <label className="flex items-center gap-2"><input type="checkbox" name="isPreview" defaultChecked={ventana.leccion.isPreview} /> Visible como vista previa sin matrícula</label>
              )}
            </div>
            <PieVentana onCerrar={() => setVentana(null)} cargando={saving === "ventana"} />
          </form>
        </Ventana>
      )}
    </div>
  );
}

function Dato({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-navy-400">{k}</dt>
      <dd className="text-right font-semibold capitalize text-navy-700">{v}</dd>
    </div>
  );
}

function PieVentana({ onCerrar, cargando }: { onCerrar: () => void; cargando: boolean }) {
  return (
    <div className="flex justify-end gap-2 border-t border-navy-50 pt-4 sm:col-span-2">
      <button type="button" onClick={onCerrar} className="btn-ghost">Cerrar</button>
      <button className="btn-lime" disabled={cargando}>{cargando ? "Guardando..." : "Guardar"}</button>
    </div>
  );
}

function BotonIcono({ children, titulo, onClick, disabled, peligro }: {
  children: React.ReactNode;
  titulo: string;
  onClick: () => void;
  disabled?: boolean;
  peligro?: boolean;
}) {
  return (
    <button
      type="button"
      title={titulo}
      aria-label={titulo}
      onClick={onClick}
      disabled={disabled}
      className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold transition disabled:opacity-30 ${
        peligro ? "text-red-500 hover:bg-red-50" : "text-navy-400 hover:bg-navy-100 hover:text-navy-700"
      }`}
    >
      {children}
    </button>
  );
}
