import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { audit } from "@/lib/auth";
import { huellaContenido, leccionInteractivaSchema, problemasDeContenido } from "@/lib/leccion-interactiva";
import { ROLES_CURSOS, exigirRol, leerCuerpo, respuestaError, respuestaOk } from "@/lib/admin-api";
import { guiaIncompleta, pantallasConEjemplo, pantallasConVacios, problemasDeOrden } from "@/lib/plantillas-leccion";

/**
 * Guarda el contenido de una lección interactiva desde el editor visual
 * (Administración → Cursos → Constructor → Editar contenido).
 *
 *   PUT { lessonId, contenido, huellaBase, forzar? }
 *
 * - El contenido se valida con el mismo esquema que usa el aula, más las reglas
 *   del editor (sin textos de ejemplo ni campos vacíos, Portada al inicio y
 *   Resumen al final): lo que se guarda siempre se puede abrir y practicar.
 * - huellaBase es la huella del contenido que se abrió en el editor. Si otra
 *   persona guardó otro contenido después, se responde 409 (código
 *   "conflicto") para no pisar su trabajo; con forzar se reemplaza a propósito.
 *   Renombrar o mover la lección no cuenta como conflicto.
 * - Cada versión queda en la auditoría (afterJson): es el historial desde el
 *   que el editor permite restaurar. La anterior, con su enlace si lo tenía,
 *   queda en beforeJson.
 * - Si la lección era de otro tipo (o estaba pendiente), pasa a ser interactiva.
 */
const schema = z.object({
  lessonId: z.string().min(1),
  contenido: z.unknown(),
  huellaBase: z.string().min(1),
  forzar: z.boolean().optional(),
});

export async function PUT(req: Request) {
  const auth = await exigirRol(ROLES_CURSOS);
  if (auth.error) return auth.error;

  const cuerpo = await leerCuerpo(req, schema);
  if (cuerpo.error) return cuerpo.error;
  const { lessonId, huellaBase, forzar } = cuerpo.data;

  const valido = leccionInteractivaSchema.safeParse(cuerpo.data.contenido);
  if (!valido.success) {
    return respuestaError(`El contenido tiene errores. ${problemasDeContenido(valido.error.issues).join(" · ")}`, 400);
  }
  // Ni textos de ejemplo ni campos vacíos: es lo que leería el trabajador.
  const ejemplo = pantallasConEjemplo(valido.data);
  if (ejemplo.length) return respuestaError(`Reemplace los textos de ejemplo (✎) en la pantalla ${ejemplo.join(", ")}.`);
  const vacios = pantallasConVacios(valido.data);
  if (vacios.length) return respuestaError(`Complete los campos vacíos en la pantalla ${vacios.join(", ")}.`);
  if (guiaIncompleta(valido.data)) return respuestaError("Escriba el nombre y el rol del personaje guía, o quítelo.");
  const orden = problemasDeOrden(valido.data);
  if (orden.length) return respuestaError(orden.join(" "));

  const before = await prisma.lesson.findUnique({ where: { id: lessonId } });
  if (!before) return respuestaError("Lección no encontrada", 404);
  if (!forzar && huellaContenido(before.contentBody) !== huellaBase) {
    return Response.json(
      { error: "Alguien más guardó otro contenido en esta lección mientras usted editaba.", codigo: "conflicto" },
      { status: 409 }
    );
  }

  const contentBody = JSON.stringify(valido.data);
  // Solo si nadie la tocó entre la lectura y la escritura.
  const { count } = await prisma.lesson.updateMany({
    where: { id: lessonId, updatedAt: before.updatedAt },
    data: { contentType: "interactivo", contentUrl: null, contentBody, isPublished: true },
  });
  if (count === 0) {
    return Response.json({ error: "La lección cambió en este mismo momento. Vuelva a guardar.", codigo: "conflicto" }, { status: 409 });
  }

  await audit({
    userId: auth.user.id,
    actorEmail: auth.user.email,
    action: "editar",
    entity: "lessons",
    entityId: lessonId,
    summary: `Contenido interactivo de "${before.title}" guardado (${valido.data.bloques.length} pantallas)${forzar ? ", reemplazando otra versión" : ""}`,
    // El enlace anterior (Genially, video...) queda aquí por si hay que volver a él.
    before: { contentType: before.contentType, contentUrl: before.contentUrl, contentBody: before.contentBody },
    after: { contentType: "interactivo", contenido: valido.data },
  });

  return respuestaOk({ huella: huellaContenido(contentBody) });
}
