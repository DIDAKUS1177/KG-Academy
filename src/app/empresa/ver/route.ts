import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { ROLES } from "@/lib/constants";
import { COOKIE_EMPRESA } from "@/lib/empresa";

const STAFF: string[] = [ROLES.SUPERADMIN, ROLES.ADMIN_KG];

/**
 * "Abrir panel" desde Administración → Empresas: el equipo de KG elige qué
 * empresa ver, y la elección se recuerda mientras navega por el panel (sin
 * esto, al cambiar de página caía en la primera empresa creada).
 */
export async function GET(req: Request) {
  const user = await requireUser();
  const url = new URL(req.url);
  const id = url.searchParams.get("empresa");
  if (STAFF.includes(user.role.code) && id && (await prisma.company.findUnique({ where: { id }, select: { id: true } }))) {
    (await cookies()).set(COOKIE_EMPRESA, id, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 8,
    });
  }
  return NextResponse.redirect(new URL("/empresa", url));
}
