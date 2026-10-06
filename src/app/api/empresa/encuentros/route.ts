import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { audit } from "@/lib/auth";
import { ROLES } from "@/lib/constants";
import { formatDateTime } from "@/lib/utils";
import { destinatarios, type Audiencia } from "@/lib/encuentros";
import { exigirRol, leerCuerpo, limpiar, respuestaError, respuestaOk } from "@/lib/admin-api";

/**
 * Clases y reuniones de la empresa (Panel empresarial → Clases y reuniones).
 *
 *   POST   comparte un enlace (Meet, Zoom, Teams o una grabación) con todos, un
 *          área o quienes tienen asignado un curso; cada persona recibe una
 *          notificación y lo ve en su aula.
 *   PATCH  { meetingId, accion: "cancelar" }: lo retira y avisa a quienes lo recibieron.
 *
 * Lo hace el administrador de la empresa (o KG); el supervisor solo consulta.
 */
const PERMITIDOS: string[] = [ROLES.ADMIN_EMPRESA, ROLES.SUPERADMIN, ROLES.ADMIN_KG];

const crearSchema = z.object({
  companyId: z.string().min(1),
  titulo: z.string().trim().min(3, "Escriba el título").max(120, "El título es muy largo"),
  descripcion: z.string().trim().max(1000, "El mensaje es muy largo").optional(),
  url: z
    .string()
    .trim()
    .max(500, "El enlace es muy largo")
    .refine((u) => /^https:\/\/[^\s]+\.[^\s]+/i.test(u), "Pegue el enlace completo, que empiece por https://"),
  /** Fecha (AAAA-MM-DD) y hora (HH:MM) en hora de Colombia; sin ellas es un material sin fecha. */
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().or(z.literal("")),
  hora: z.string().regex(/^\d{2}:\d{2}$/).optional().or(z.literal("")),
  duracion: z.coerce.number().int().min(10, "La duración mínima es de 10 minutos").max(480, "Máximo 8 horas").optional(),
  audiencia: z.enum(["todos", "area", "curso"]),
  areaId: z.string().optional(),
  courseId: z.string().optional(),
});

const cancelarSchema = z.object({ meetingId: z.string().min(1), accion: z.literal("cancelar") });

export async function POST(req: Request) {
  const auth = await exigirRol(PERMITIDOS);
  if (auth.error) return auth.error;
  const actor = auth.user;
  const cuerpo = await leerCuerpo(req, crearSchema);
  if (cuerpo.error) return cuerpo.error;
  const d = cuerpo.data;

  if (actor.role.code === ROLES.ADMIN_EMPRESA && actor.companyId !== d.companyId) {
    return respuestaError("No autorizado sobre esta empresa", 403);
  }
  const empresa = await prisma.company.findUnique({ where: { id: d.companyId }, select: { id: true, tradeName: true, legalName: true } });
  if (!empresa) return respuestaError("Empresa no encontrada", 404);

  // Fecha y hora van juntas: una sin la otra no dice cuándo es.
  if (!!d.fecha !== !!d.hora) return respuestaError("Indique la fecha y la hora, o deje las dos vacías si es un material sin fecha");
  const startsAt = d.fecha && d.hora ? new Date(`${d.fecha}T${d.hora}:00-05:00`) : null;
  if (startsAt && (Number.isNaN(startsAt.getTime()) || startsAt.getTime() < Date.now() - 10 * 60_000)) {
    return respuestaError("La fecha y la hora deben ser futuras");
  }

  const audiencia = d.audiencia as Audiencia;
  let grupo = "todo el personal";
  if (audiencia === "area") {
    const area = d.areaId ? await prisma.area.findFirst({ where: { id: d.areaId, companyId: empresa.id } }) : null;
    if (!area) return respuestaError("Elija un área de la empresa");
    grupo = `el área ${area.name}`;
  }
  if (audiencia === "curso") {
    const curso = d.courseId ? await prisma.course.findFirst({ where: { id: d.courseId, assignments: { some: { companyId: empresa.id } } } }) : null;
    if (!curso) return respuestaError("Elija un curso que la empresa haya asignado");
    grupo = `quienes tienen asignado «${curso.title}»`;
  }

  const ids = await destinatarios(empresa.id, audiencia, d.areaId, d.courseId);
  if (!ids.length) return respuestaError("Ese grupo no tiene personas activas: no hay a quién enviarlo");

  const nombreEmpresa = empresa.tradeName ?? empresa.legalName;
  const encuentro = await prisma.companyMeeting.create({
    data: {
      companyId: empresa.id,
      title: d.titulo,
      description: limpiar(d.descripcion),
      url: d.url,
      startsAt,
      durationMin: startsAt ? (d.duracion ?? null) : null,
      audience: audiencia,
      areaId: audiencia === "area" ? d.areaId : null,
      courseId: audiencia === "curso" ? d.courseId : null,
      recipients: ids.length,
      createdById: actor.id,
    },
  });
  await prisma.notification.createMany({
    data: ids.map((userId) => ({
      userId,
      title: startsAt ? `Clase en vivo: ${d.titulo}` : `Nuevo material: ${d.titulo}`,
      message: `${nombreEmpresa}${startsAt ? ` · ${formatDateTime(startsAt)}` : ""}. ${limpiar(d.descripcion) ?? "Abra el aula para ver el enlace."}`.slice(0, 500),
      linkUrl: "/aula/encuentros",
      type: "info",
    })),
  });
  await audit({
    userId: actor.id,
    actorEmail: actor.email,
    action: "crear",
    entity: "company_meetings",
    entityId: encuentro.id,
    summary: `${startsAt ? "Clase en vivo" : "Material"} «${d.titulo}» compartido con ${grupo} (${ids.length} personas)`,
  });
  return respuestaOk({ meetingId: encuentro.id, destinatarios: ids.length });
}

export async function PATCH(req: Request) {
  const auth = await exigirRol(PERMITIDOS);
  if (auth.error) return auth.error;
  const actor = auth.user;
  const cuerpo = await leerCuerpo(req, cancelarSchema);
  if (cuerpo.error) return cuerpo.error;

  const encuentro = await prisma.companyMeeting.findUnique({ where: { id: cuerpo.data.meetingId } });
  if (!encuentro) return respuestaError("No se encontró la clase", 404);
  if (actor.role.code === ROLES.ADMIN_EMPRESA && actor.companyId !== encuentro.companyId) {
    return respuestaError("No autorizado sobre esta empresa", 403);
  }
  if (encuentro.canceledAt) return respuestaError("Ya estaba cancelada");

  await prisma.companyMeeting.update({ where: { id: encuentro.id }, data: { canceledAt: new Date() } });
  // Se avisa a quienes lo recibirían hoy (mismo grupo).
  const ids = await destinatarios(encuentro.companyId, encuentro.audience as Audiencia, encuentro.areaId, encuentro.courseId);
  if (ids.length) {
    await prisma.notification.createMany({
      data: ids.map((userId) => ({
        userId,
        title: `Cancelada: ${encuentro.title}`,
        message: encuentro.startsAt ? `La clase del ${formatDateTime(encuentro.startsAt)} se canceló.` : "El material ya no está disponible.",
        type: "alerta",
      })),
    });
  }
  await audit({
    userId: actor.id,
    actorEmail: actor.email,
    action: "editar",
    entity: "company_meetings",
    entityId: encuentro.id,
    summary: `«${encuentro.title}» cancelado`,
  });
  return respuestaOk();
}
