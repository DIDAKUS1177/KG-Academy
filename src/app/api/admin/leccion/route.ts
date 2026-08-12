import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser, audit } from "@/lib/auth";
import { ROLES } from "@/lib/constants";

const schema = z.object({
  lessonId: z.string(),
  contentType: z.string(),
  contentUrl: z.string().optional(),
  contentBody: z.string().optional(),
});

const PERMITIDOS: string[] = [ROLES.SUPERADMIN, ROLES.ADMIN_KG, ROLES.INSTRUCTOR];

/** Carga de contenido de una leccion desde el constructor de cursos. */
export async function POST(req: Request) {
  const user = await requireUser();
  if (!PERMITIDOS.includes(user.role.code)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const parsed = schema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: "Datos invalidos" }, { status: 400 });

  const before = await prisma.lesson.findUnique({ where: { id: parsed.data.lessonId } });
  if (!before) return NextResponse.json({ error: "Leccion no encontrada" }, { status: 404 });

  const url = parsed.data.contentUrl?.trim() || null;
  if (parsed.data.contentType !== "pendiente" && parsed.data.contentType !== "texto" && !url) {
    return NextResponse.json({ error: "Indique la URL del recurso" }, { status: 400 });
  }

  const after = await prisma.lesson.update({
    where: { id: parsed.data.lessonId },
    data: {
      contentType: parsed.data.contentType,
      contentUrl: parsed.data.contentType === "pendiente" ? null : url,
      contentBody: parsed.data.contentBody ?? before.contentBody,
      isPublished: parsed.data.contentType !== "pendiente",
    },
  });

  await audit({
    userId: user.id,
    actorEmail: user.email,
    action: "editar",
    entity: "lessons",
    entityId: after.id,
    summary: `Contenido de "${after.title}" -> ${after.contentType}`,
    before: { contentType: before.contentType, contentUrl: before.contentUrl },
    after: { contentType: after.contentType, contentUrl: after.contentUrl },
  });

  return NextResponse.json({ ok: true });
}
