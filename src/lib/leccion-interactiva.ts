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
    guia: z.object({ nombre: z.string(), rol: z.string() }).optional(),
    bloques: z.array(bloque).min(2),
  })
  .superRefine((l, ctx) => {
    l.bloques.forEach((b, i) => {
      if ((b.tipo === "decision" || b.tipo === "contrarreloj") && !b.opciones.some((o) => o.correcta)) {
        ctx.addIssue({ code: "custom", path: ["bloques", i], message: "Debe tener una opción correcta" });
      }
      if (b.tipo === "clasificar") {
        const ids = new Set(b.categorias.map((c) => c.id));
        b.elementos.forEach((e, j) => {
          if (!ids.has(e.categoria)) {
            ctx.addIssue({ code: "custom", path: ["bloques", i, "elementos", j], message: `Categoría inexistente: ${e.categoria}` });
          }
        });
      }
    });
  });

export type LeccionInteractiva = z.infer<typeof leccionInteractivaSchema>;
export type Bloque = LeccionInteractiva["bloques"][number];

/** Bloques que se califican (dan puntos de práctica). */
export const BLOQUES_CALIFICABLES = new Set(["decision", "contrarreloj", "ordenar", "clasificar"]);

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
