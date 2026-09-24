import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { audit, requireUser } from "@/lib/auth";
import { leerCuerpo, limpiar, respuestaOk } from "@/lib/admin-api";

/**
 * El usuario edita sus datos de contacto. Nombre y documento no: aparecen en
 * los certificados y los corrige KG o la empresa.
 */
const schema = z.object({
  phone: z.string().trim().max(30, "El teléfono es muy largo").optional(),
  city: z.string().trim().max(80, "La ciudad es muy larga").optional(),
  jobTitle: z.string().trim().max(120, "El cargo es muy largo").optional(),
});

export async function PATCH(req: Request) {
  const user = await requireUser();
  const cuerpo = await leerCuerpo(req, schema);
  if (cuerpo.error) return cuerpo.error;
  const d = cuerpo.data;

  await prisma.user.update({
    where: { id: user.id },
    data: {
      ...(d.phone !== undefined ? { phone: limpiar(d.phone) } : {}),
      ...(d.city !== undefined ? { city: limpiar(d.city) } : {}),
      ...(d.jobTitle !== undefined ? { jobTitle: limpiar(d.jobTitle) } : {}),
    },
  });
  await audit({
    userId: user.id,
    actorEmail: user.email,
    action: "editar",
    entity: "users",
    entityId: user.id,
    summary: "Actualización de datos de contacto",
    before: { phone: user.phone, city: user.city, jobTitle: user.jobTitle },
    after: d,
  });
  return respuestaOk();
}
