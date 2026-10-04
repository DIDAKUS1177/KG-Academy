/**
 * LECCIONES INTERACTIVAS NATIVAS DE KG ACADEMY
 *
 * Una lección de tipo "interactivo" guarda en `lessons.contentBody` un JSON
 * con esta forma. La plataforma la dibuja como una secuencia de pantallas en
 * las que el trabajador no solo lee: decide, ordena, clasifica y responde
 * contra el reloj, con retroalimentación inmediata y puntos de práctica.
 *
 * A diferencia de un Genially embebido, el contenido vive en la base de datos:
 * se puede versionar, auditar, traducir y medir.
 *
 * El esquema se valida con Zod al leerlo. Un JSON mal formado no rompe el aula:
 * se muestra un aviso y el error queda en la consola del servidor.
 */
import { z } from "zod";

export const ILUSTRACIONES = [
  "triangulo-fuego",
  "extintor-haab",
  "ruta-evacuacion",
  "presion-directa",
  "torniquete",
] as const;
export type IlustracionId = (typeof ILUSTRACIONES)[number];

/** Escenas ilustradas para las cacerías de riesgos (plano de 800 x 450). */
export const ESCENAS = ["oficina", "taller"] as const;
export type EscenaId = (typeof ESCENAS)[number];

/** Personajes dibujados para el guía de la lección. */
export const AVATARES = ["brigadista", "paramedico"] as const;

const opcion = z.object({
  texto: z.string().min(1),
  correcta: z.boolean().optional(),
  /** Lo que pasa si se elige: consecuencia o explicación. */
  retro: z.string().min(1),
});

/** Frase del guía de la lección, en globo de diálogo. */
const dice = z.string().optional();

const bloque = z.discriminatedUnion("tipo", [
  z.object({
    tipo: z.literal("portada"),
    titulo: z.string(),
    subtitulo: z.string().optional(),
    objetivos: z.array(z.string()).min(1),
    minutos: z.number().int().positive(),
    dice,
  }),
  z.object({
    tipo: z.literal("explicacion"),
    titulo: z.string(),
    parrafos: z.array(z.string()).min(1),
    /** Tarjetas cortas de ideas clave, en rejilla. */
    puntos: z.array(z.object({ titulo: z.string(), texto: z.string() })).optional(),
    /** Recuadro destacado: el dato que no se puede olvidar. */
    clave: z.string().optional(),
    ilustracion: z.enum(ILUSTRACIONES).optional(),
    dice,
  }),
  z.object({
    tipo: z.literal("tarjetas"),
    titulo: z.string(),
    instruccion: z.string().optional(),
    tarjetas: z
      .array(z.object({ etiqueta: z.string().optional(), frente: z.string(), reverso: z.string() }))
      .min(2),
    dice,
  }),
  z.object({
    tipo: z.literal("decision"),
    titulo: z.string().optional(),
    situacion: z.string(),
    pregunta: z.string(),
    opciones: z.array(opcion).min(2),
    ilustracion: z.enum(ILUSTRACIONES).optional(),
    dice,
  }),
  z.object({
    tipo: z.literal("contrarreloj"),
    titulo: z.string().optional(),
    segundos: z.number().int().min(5).max(60),
    situacion: z.string(),
    pregunta: z.string(),
    opciones: z.array(opcion).min(2),
    /** Qué pasa si el tiempo se acaba sin decidir. */
    alAgotar: z.string(),
    dice,
  }),
  z.object({
    tipo: z.literal("ordenar"),
    titulo: z.string(),
    instruccion: z.string(),
    /** En el orden CORRECTO. La pantalla los baraja. */
    pasos: z.array(z.string()).min(3),
    explicacion: z.string(),
    dice,
  }),
  z.object({
    tipo: z.literal("clasificar"),
    titulo: z.string(),
    instruccion: z.string(),
    categorias: z.array(z.object({ id: z.string(), nombre: z.string(), pista: z.string().optional() })).min(2).max(5),
    elementos: z
      .array(z.object({ texto: z.string(), categoria: z.string(), porque: z.string().optional() }))
      .min(3),
    dice,
  }),
  /**
   * Cacería de riesgos: el trabajador toca en la escena los peligros ocultos.
   * Coordenadas en el plano de la escena (800 x 450).
   */
  z.object({
    tipo: z.literal("buscar"),
    titulo: z.string(),
    instruccion: z.string(),
    escena: z.enum(ESCENAS),
    objetivos: z
      .array(
        z.object({
          x: z.number().min(0).max(800),
          y: z.number().min(0).max(450),
          /** Radio de acierto; 42 por defecto. */
          r: z.number().min(15).max(120).optional(),
          nombre: z.string(),
          explicacion: z.string(),
        })
      )
      .min(2),
    dice,
  }),
  /**
   * Misión contra el tiempo: un medidor (vida del paciente o tamaño del
   * fuego) empeora cada segundo y con cada error. Hay que llegar al último
   * paso antes de que se llene.
   */
  z.object({
    tipo: z.literal("mision"),
    titulo: z.string(),
    intro: z.string(),
    medidor: z.object({
      etiqueta: z.string(),
      /** vida: baja de 100 a 0. amenaza: sube de 0 a 100. */
      tipo: z.enum(["vida", "amenaza"]),
    }),
    /** Puntos del medidor que se pierden por segundo. */
    velocidad: z.number().min(0.5).max(10),
    /** Puntos que cuesta cada decisión equivocada. */
    penalizacion: z.number().min(5).max(50),
    pasos: z.array(z.object({ situacion: z.string(), pregunta: z.string(), opciones: z.array(opcion).min(2) })).min(2),
    exito: z.string(),
    fracaso: z.string(),
    dice,
  }),
  z.object({
    tipo: z.literal("resumen"),
    titulo: z.string(),
    puntos: z.array(z.string()).min(1),
    insignia: z.string(),
    cierre: z.string().optional(),
    dice,
  }),
]);

export const leccionInteractivaSchema = z
  .object({
    version: z.literal(1),
    guia: z.object({ nombre: z.string(), rol: z.string(), avatar: z.enum(AVATARES).optional() }).optional(),
    bloques: z.array(bloque).min(2),
  })
  .superRefine((l, ctx) => {
    l.bloques.forEach((b, i) => {
      if ((b.tipo === "decision" || b.tipo === "contrarreloj") && !b.opciones.some((o) => o.correcta)) {
        ctx.addIssue({ code: "custom", path: ["bloques", i], message: "Debe tener una opción correcta" });
      }
      if (b.tipo === "mision") {
        b.pasos.forEach((p, j) => {
          if (!p.opciones.some((o) => o.correcta)) {
            ctx.addIssue({ code: "custom", path: ["bloques", i, "pasos", j], message: "Cada paso debe tener una opción correcta" });
          }
        });
      }
      if (b.tipo === "clasificar") {
        const ids = new Set(b.categorias.map((c) => c.id));
        b.elementos.forEach((e, j) => {
          if (!ids.has(e.categoria)) {
            ctx.addIssue({ code: "custom", path: ["bloques", i, "elementos", j], message: "Un elemento quedó sin grupo: elija su grupo correcto" });
          }
        });
      }
    });
  });

export type LeccionInteractiva = z.infer<typeof leccionInteractivaSchema>;
export type Bloque = LeccionInteractiva["bloques"][number];

/** Bloques que se califican (dan puntos de práctica). */
export const BLOQUES_CALIFICABLES = new Set(["decision", "contrarreloj", "ordenar", "clasificar", "buscar", "mision"]);

/** Nombre en español de cada campo, para los mensajes de error del editor. */
const CAMPO: Record<string, string> = {
  titulo: "el título", subtitulo: "el subtítulo", objetivos: "los objetivos", minutos: "los minutos",
  parrafos: "los párrafos", puntos: "las ideas", clave: "el dato destacado", tarjetas: "las tarjetas",
  frente: "el frente", reverso: "el reverso", situacion: "la situación", pregunta: "la pregunta",
  opciones: "las opciones", texto: "el texto", retro: "la consecuencia", segundos: "los segundos",
  alAgotar: "el mensaje de tiempo agotado", instruccion: "la instrucción", pasos: "los pasos",
  explicacion: "la explicación", categorias: "los grupos", elementos: "los elementos", nombre: "el nombre",
  categoria: "el grupo", escena: "la escena", x: "la posición", y: "la posición", r: "el tamaño del área",
  intro: "la presentación", etiqueta: "el nombre del medidor", velocidad: "la velocidad",
  penalizacion: "el castigo por error", exito: "el mensaje de éxito", fracaso: "el mensaje de fracaso",
  insignia: "la insignia", ilustracion: "la ilustración", bloques: "las pantallas", rol: "el rol", avatar: "el personaje",
};

/** El mensaje de zod (en inglés) traducido a algo que entienda quien edita. */
export function mensajeEnEspanol(i: z.ZodIssue) {
  const clave = [...i.path].reverse().find((p) => typeof p === "string");
  const campo = CAMPO[String(clave ?? "")] ?? "este campo";
  switch (i.code) {
    case "invalid_type":
      if (i.received === "undefined" || i.received === "null") return `Falta ${campo}.`;
      return i.expected === "number" ? `Escriba un número en ${campo}.` : `Revise ${campo}.`;
    case "too_small":
      if (i.type === "array") return `Debe haber al menos ${String(i.minimum)} en ${campo}.`;
      return i.type === "number" ? `El valor de ${campo} debe ser al menos ${String(i.minimum)}.` : `Complete ${campo}.`;
    case "too_big":
      if (i.type === "array") return `Puede haber como máximo ${String(i.maximum)} en ${campo}.`;
      return i.type === "number" ? `El valor de ${campo} debe ser como máximo ${String(i.maximum)}.` : `Acorte ${campo}.`;
    case "invalid_enum_value":
      return `Elija una opción válida en ${campo}.`;
    case "custom":
      return i.message;
    default:
      return `Revise ${campo}.`;
  }
}

/** Resumen legible de lo que está mal, con la pantalla en la que ocurre. */
export function problemasDeContenido(issues: z.ZodIssue[]) {
  return issues.slice(0, 8).map((i) => {
    const [raiz, n] = i.path;
    const donde = raiz === "bloques" && typeof n === "number" ? `Pantalla ${n + 1}: ` : "";
    return `${donde}${mensajeEnEspanol(i)}`;
  });
}

/**
 * Huella corta del contenido (djb2). Cambia cuando KG edita la lección: el
 * avance guardado en el navegador se indexa por pantalla, así que una versión
 * nueva empieza de cero en vez de marcar como resueltas pantallas que se
 * movieron o cambiaron.
 */
export function huellaContenido(texto: string | null | undefined) {
  let h = 5381;
  for (const c of texto ?? "") h = ((h << 5) + h + c.charCodeAt(0)) | 0;
  return (h >>> 0).toString(36);
}

/** Lee y valida el contenido. Devuelve null si no es válido. */
export function leerLeccionInteractiva(json: string | null | undefined): LeccionInteractiva | null {
  if (!json) return null;
  try {
    const r = leccionInteractivaSchema.safeParse(JSON.parse(json));
    if (!r.success) {
      console.error("Lección interactiva inválida:", r.error.issues.slice(0, 3));
      return null;
    }
    return r.data;
  } catch (e) {
    console.error("Lección interactiva: JSON ilegible", e);
    return null;
  }
}
