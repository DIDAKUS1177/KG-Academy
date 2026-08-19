import { NextResponse } from "next/server";
import { destroySession, getSession, audit } from "@/lib/auth";

export async function POST(req: Request) {
  const s = await getSession();
  if (s) {
    await audit({
      userId: s.sub,
      actorEmail: s.email,
      action: "logout",
      entity: "users",
      entityId: s.sub,
      summary: "Cierre de sesión",
    });
  }
  await destroySession();
  return NextResponse.redirect(new URL("/", req.url), { status: 303 });
}
