import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { audit } from "@/lib/auth";
import { ROLES_KG, exigirRol, leerCuerpo, respuestaError, respuestaOk } from "@/lib/admin-api";

/**
 * Revocación y restitución de certificados.
 *
 * Un certificado revocado sigue existiendo y su código sigue resolviendo en la
 * verificación pública, pero marcado como revocado y con el motivo. Eso es lo
 * que necesita quien lo consulta: saber que existió y que ya no vale.
 */

const schema = z.object({
  certificateId: z.string().min(1),
  accion: z.enum(["revocar", "restituir"]),
  motivo: z.string().trim().optional(),
});

export async function PATCH(req: Request) {
  const auth = await exigirRol(ROLES_KG);
  if (auth.error) return auth.error;
  const actor = auth.user;

  const cuerpo = await leerCuerpo(req, schema);
  if (cuerpo.error) return cuerpo.error;
  const d = cuerpo.data;

  const before = await prisma.certificate.findUnique({ where: { id: d.certificateId } });
  if (!before) return respuestaError("Certificado no encontrado", 404);

  if (d.accion === "revocar") {
    if (before.status === "revocado") return respuestaError("El certificado ya está revocado");
    if (!d.motivo || d.motivo.length < 5) {
      return respuestaError("Indique el motivo de la revocación (mínimo 5 caracteres)");
    }
    await prisma.certificate.update({
      where: { id: before.id },
      data: {
        status: "revocado",
        revokedAt: new Date(),
        revokedReason: d.motivo,
        revokedById: actor.id,
      },
    });
    await prisma.notification.create({
      data: {
        userId: before.userId,
        title: "Certificado revocado",
        message: `Su certificado ${before.code} fue revocado. Motivo: ${d.motivo}`,
        linkUrl: "/aula/certificados",
        type: "alerta",
      },
    });
    await audit({
      userId: actor.id,
      actorEmail: actor.email,
      action: "revocar",
      entity: "certificates",
      entityId: before.id,
      summary: `Certificado ${before.code} revocado: ${d.motivo}`,
      before: { status: before.status },
      after: { status: "revocado", motivo: d.motivo },
    });
    return respuestaOk();
  }

  // Restituir: solo tiene sentido sobre uno revocado. Si venció por fecha, la
  // vigencia se recalcula sola en la verificación y aquí no se toca.
  if (before.status !== "revocado") return respuestaError("Solo se restituye un certificado revocado");
  await prisma.certificate.update({
    where: { id: before.id },
    data: { status: "vigente", revokedAt: null, revokedReason: null, revokedById: null },
  });
  await audit({
    userId: actor.id,
    actorEmail: actor.email,
    action: "editar",
    entity: "certificates",
    entityId: before.id,
    summary: `Certificado ${before.code} restituido`,
    before: { status: "revocado", motivo: before.revokedReason },
    after: { status: "vigente" },
  });
  return respuestaOk();
}
