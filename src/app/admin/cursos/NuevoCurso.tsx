"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IconBook } from "@/components/Icons";
import { Aviso, Campo, Ventana, llamar, leerFormulario, type Mensaje } from "@/components/admin/Formulario";

type Opcion = { id: string; nombre: string };

/**
 * Alta de un curso. Nace en borrador con su primer módulo y se abre de
 * inmediato el constructor para cargar estructura y contenido.
 */
export function NuevoCurso({ categorias, instructores }: { categorias: Opcion[]; instructores: Opcion[] }) {
  const router = useRouter();
  const [abierto, setAbierto] = useState(false);
  const [nuevaCat, setNuevaCat] = useState(false);
  const [msg, setMsg] = useState<Mensaje>(null);
  const [cargando, setCargando] = useState(false);

  async function crear(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setCargando(true);
    setMsg(null);
    const d = leerFormulario(e.currentTarget);
    if (!nuevaCat) delete d.nuevaCategoria;
    else delete d.categoryId;
    const { ok, data } = await llamar<{ courseId?: string }>("/api/admin/cursos", "POST", d);
    setCargando(false);
    if (!ok) return setMsg({ ok: false, text: data.error ?? "No se pudo crear el curso" });
    setMsg({ ok: true, text: "Curso creado. Abriendo el constructor..." });
    router.push(`/admin/cursos/${data.courseId}`);
    router.refresh();
  }

  return (
    <>
      <button onClick={() => { setAbierto(true); setMsg(null); }} className="btn-lime">
        <IconBook width={16} height={16} /> Nuevo curso
      </button>

      {abierto && (
        <Ventana
          titulo="Nuevo curso"
          descripcion="Se crea en borrador. La ficha completa y las reglas se editan en el constructor."
          onCerrar={() => setAbierto(false)}
        >
          <form onSubmit={crear} className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2"><Aviso msg={msg} /></div>
            <Campo label="Código" ayuda="Mayúsculas, números y guiones. Ej. KG-PA-004.">
              <input name="code" required pattern="[A-Z0-9-]+" className="input font-mono uppercase" placeholder="KG-PA-004" />
            </Campo>
            <Campo label="Horas certificadas">
              <input name="durationHours" type="number" min={0} step={0.5} defaultValue={0} className="input" />
            </Campo>
            <Campo label="Título" ancho="sm:col-span-2">
              <input name="title" required className="input" placeholder="Curso Avanzado de Primeros Auxilios" />
            </Campo>
            <Campo label="Subtítulo" ancho="sm:col-span-2">
              <input name="subtitle" className="input" placeholder="Para quién es y qué resuelve, en una línea" />
            </Campo>

            <Campo label="Categoría">
              {nuevaCat ? (
                <input name="nuevaCategoria" required className="input" placeholder="Nombre de la categoría nueva" />
              ) : (
                <select name="categoryId" required className="select">
                  <option value="">Elija una</option>
                  {categorias.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                </select>
              )}
              <button type="button" onClick={() => setNuevaCat((v) => !v)} className="mt-1 text-[11px] font-semibold text-lime-700 hover:underline">
                {nuevaCat ? "Elegir una existente" : "Crear una categoría nueva"}
              </button>
            </Campo>
            <Campo label="Instructor">
              <select name="instructorId" className="select">
                <option value="">Sin asignar</option>
                {instructores.map((i) => <option key={i.id} value={i.id}>{i.nombre}</option>)}
              </select>
            </Campo>
            <Campo label="Nivel">
              <select name="level" className="select" defaultValue="basico">
                <option value="basico">Básico</option>
                <option value="intermedio">Intermedio</option>
                <option value="avanzado">Avanzado</option>
              </select>
            </Campo>
            <Campo label="Modalidad">
              <select name="modality" className="select" defaultValue="virtual">
                <option value="virtual">Virtual</option>
                <option value="mixto">Mixta</option>
                <option value="presencial">Presencial</option>
              </select>
            </Campo>
            <Campo label="Título del primer módulo" ancho="sm:col-span-2" ayuda="Vacío = «Módulo 1». Los demás se agregan en el constructor.">
              <input name="primerModulo" className="input" />
            </Campo>
            <div className="sm:col-span-2 flex justify-end gap-2 border-t border-navy-50 pt-4">
              <button type="button" onClick={() => setAbierto(false)} className="btn-ghost">Cerrar</button>
              <button className="btn-lime" disabled={cargando}>{cargando ? "Creando..." : "Crear curso"}</button>
            </div>
          </form>
        </Ventana>
      )}
    </>
  );
}
