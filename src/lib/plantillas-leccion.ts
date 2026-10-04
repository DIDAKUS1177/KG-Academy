/**
 * Plantillas del editor de lecciones interactivas: nombre y descripción de
 * cada tipo de pantalla, y su contenido inicial.
 *
 * Los textos iniciales empiezan con "✎": el editor avisa y el servidor no deja
 * guardar mientras quede alguno sin reemplazar, para que nunca llegue a un
 * estudiante una pantalla con texto de ejemplo.
 */
import type { Bloque, LeccionInteractiva, IlustracionId, EscenaId } from "@/lib/leccion-interactiva";

export const MARCA_EJEMPLO = "✎";
const ej = (texto: string) => `${MARCA_EJEMPLO} ${texto}`;

export type TipoBloque = Bloque["tipo"];

export const TIPOS_BLOQUE: { tipo: TipoBloque; nombre: string; descripcion: string; califica: boolean }[] = [
  { tipo: "portada", nombre: "Portada", descripcion: "Título, objetivos y duración de la lección.", califica: false },
  { tipo: "explicacion", nombre: "Explicación", descripcion: "Texto con ideas clave y un dato destacado.", califica: false },
  { tipo: "tarjetas", nombre: "Tarjetas para voltear", descripcion: "Mitos y realidades, conceptos o preguntas rápidas.", califica: false },
  { tipo: "decision", nombre: "Decisión", descripcion: "Una situación y varias opciones, cada una con su consecuencia.", califica: true },
  { tipo: "contrarreloj", nombre: "Contrarreloj", descripcion: "Decidir antes de que se acabe el tiempo.", califica: true },
  { tipo: "ordenar", nombre: "Ordenar pasos", descripcion: "Poner un procedimiento en el orden correcto.", califica: true },
  { tipo: "clasificar", nombre: "Clasificar", descripcion: "Llevar cada elemento a su grupo.", califica: true },
  { tipo: "mision", nombre: "Misión contra el tiempo", descripcion: "Varios pasos seguidos con un medidor que se agota.", califica: true },
  { tipo: "buscar", nombre: "Cacería de riesgos", descripcion: "Encontrar los peligros en una escena ilustrada.", califica: true },
  { tipo: "resumen", nombre: "Resumen", descripcion: "Ideas para recordar e insignia final.", califica: false },
];

export const NOMBRE_TIPO: Record<TipoBloque, string> = Object.fromEntries(TIPOS_BLOQUE.map((t) => [t.tipo, t.nombre])) as Record<
  TipoBloque,
  string
>;

export const NOMBRE_ILUSTRACION: Record<IlustracionId, string> = {
  "triangulo-fuego": "Triángulo del fuego",
  "extintor-haab": "Extintor: técnica HAAB",
  "ruta-evacuacion": "Ruta de evacuación",
  "presion-directa": "Presión directa sobre una herida",
  torniquete: "Torniquete",
};

export const NOMBRE_ESCENA: Record<EscenaId, string> = {
  oficina: "Oficina administrativa",
  taller: "Taller de mantenimiento",
};

const opcionesNuevas = () => [
  { texto: ej("Opción correcta"), correcta: true, retro: ej("Por qué es lo indicado") },
  { texto: ej("Opción incorrecta"), retro: ej("Qué pasaría si se elige") },
];

/** Contenido inicial válido de cada tipo de pantalla. */
export function bloqueNuevo(tipo: TipoBloque): Bloque {
  switch (tipo) {
    case "portada":
      return { tipo, titulo: ej("Título de la lección"), objetivos: [ej("Qué logrará el trabajador")], minutos: 15 };
    case "explicacion":
      return { tipo, titulo: ej("Título de la explicación"), parrafos: [ej("Explique la idea con palabras sencillas.")] };
    case "tarjetas":
      return {
        tipo,
        titulo: ej("¿Mito o realidad?"),
        tarjetas: [
          { frente: ej("Frente de la tarjeta"), reverso: ej("Lo que aparece al voltearla") },
          { frente: ej("Frente de la tarjeta"), reverso: ej("Lo que aparece al voltearla") },
        ],
      };
    case "decision":
      return { tipo, situacion: ej("Describa la situación"), pregunta: ej("¿Qué hace primero?"), opciones: opcionesNuevas() };
    case "contrarreloj":
      return {
        tipo,
        segundos: 15,
        situacion: ej("Describa la situación urgente"),
        pregunta: ej("¿Qué hace?"),
        opciones: opcionesNuevas(),
        alAgotar: ej("Qué pasa si no decide a tiempo"),
      };
    case "ordenar":
      return {
        tipo,
        titulo: ej("Ordene los pasos"),
        instruccion: ej("Arrastre los pasos hasta dejarlos en orden."),
        pasos: [ej("Primer paso"), ej("Segundo paso"), ej("Tercer paso")],
        explicacion: ej("Por qué este es el orden correcto"),
      };
    case "clasificar":
      return {
        tipo,
        titulo: ej("Clasifique"),
        instruccion: ej("Lleve cada elemento a su grupo."),
        categorias: [
          { id: "a", nombre: ej("Grupo A") },
          { id: "b", nombre: ej("Grupo B") },
        ],
        elementos: [
          { texto: ej("Elemento del grupo A"), categoria: "a" },
          { texto: ej("Elemento del grupo B"), categoria: "b" },
          { texto: ej("Otro elemento del grupo A"), categoria: "a" },
        ],
      };
    case "buscar":
      return {
        tipo,
        titulo: ej("Encuentre los riesgos"),
        instruccion: ej("Toque los peligros que vea en la escena."),
        escena: "oficina",
        objetivos: [
          { x: 250, y: 250, nombre: ej("Primer peligro"), explicacion: ej("Por qué es un peligro") },
          { x: 550, y: 250, nombre: ej("Segundo peligro"), explicacion: ej("Por qué es un peligro") },
        ],
      };
    case "mision":
      return {
        tipo,
        titulo: ej("Misión"),
        intro: ej("Presente la emergencia"),
        medidor: { etiqueta: ej("Estado de la persona"), tipo: "vida" },
        velocidad: 2,
        penalizacion: 15,
        pasos: [
          { situacion: ej("Lo que está pasando"), pregunta: ej("¿Qué hace?"), opciones: opcionesNuevas() },
          { situacion: ej("Lo que pasa después"), pregunta: ej("¿Y ahora?"), opciones: opcionesNuevas() },
        ],
        exito: ej("Mensaje si lo logra"),
        fracaso: ej("Mensaje si no lo logra"),
      };
    case "resumen":
      return { tipo, titulo: ej("Lo que debe recordar"), puntos: [ej("Idea clave")], insignia: ej("Nombre de la insignia") };
  }
}

/** Lección nueva: portada, explicación, una decisión y resumen. */
export function leccionNueva(titulo: string): LeccionInteractiva {
  const portada = bloqueNuevo("portada");
  return {
    version: 1,
    bloques: [
      portada.tipo === "portada" ? { ...portada, titulo } : portada,
      bloqueNuevo("explicacion"),
      bloqueNuevo("decision"),
      bloqueNuevo("resumen"),
    ],
  };
}

/** ¿Algún texto del valor cumple la condición? Recorre listas y objetos. */
function algunTexto(v: unknown, cumple: (s: string) => boolean): boolean {
  if (typeof v === "string") return cumple(v);
  if (Array.isArray(v)) return v.some((x) => algunTexto(x, cumple));
  return !!v && typeof v === "object" && Object.values(v).some((x) => algunTexto(x, cumple));
}

/** Pantallas (1, 2...) con algún texto de ejemplo "✎" sin reemplazar. */
export function pantallasConEjemplo(leccion: LeccionInteractiva) {
  return leccion.bloques.flatMap((b, i) => (algunTexto(b, (s) => s.includes(MARCA_EJEMPLO)) ? [i + 1] : []));
}

/**
 * Orden de las pantallas: la Portada abre y el Resumen cierra. Con un Resumen
 * en medio, o una pantalla calificable al final, se podía completar la lección
 * sin hacer la práctica.
 */
export function problemasDeOrden(leccion: LeccionInteractiva) {
  const b = leccion.bloques;
  const p: string[] = [];
  if (b[0]?.tipo !== "portada") p.push("La primera pantalla debe ser la Portada.");
  if (b.filter((x) => x.tipo === "portada").length > 1) p.push("Solo puede haber una Portada.");
  if (b.at(-1)?.tipo !== "resumen") p.push("La última pantalla debe ser el Resumen: es la que cierra la lección.");
  if (b.filter((x) => x.tipo === "resumen").length > 1) p.push("Solo puede haber un Resumen, al final.");
  return p;
}

/** Si la lección tiene personaje guía, su nombre y su rol son obligatorios. */
export const guiaIncompleta = (leccion: LeccionInteractiva) =>
  !!leccion.guia && (!leccion.guia.nombre.trim() || !leccion.guia.rol.trim());

/**
 * Pantallas (1, 2...) con algún campo obligatorio vacío. Los opcionales vacíos
 * el editor los quita, así que cualquier texto vacío que quede es obligatorio.
 */
export function pantallasConVacios(leccion: LeccionInteractiva) {
  return leccion.bloques.flatMap((b, i) => (algunTexto(b, (s) => s.trim() === "") ? [i + 1] : []));
}
