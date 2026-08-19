import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { formatDateTime } from "@/lib/utils";
import { EmptyState, SectionTitle } from "@/components/ui";
import { IconBell, IconCheck, IconAlert, IconSpark } from "@/components/Icons";

export const metadata: Metadata = { title: "Notificaciones" };
export const dynamic = "force-dynamic";

const ICON: Record<string, JSX.Element> = {
  exito: <IconCheck width={18} height={18} strokeWidth={3} />,
  alerta: <IconAlert width={18} height={18} />,
  error: <IconAlert width={18} height={18} />,
  info: <IconSpark width={18} height={18} />,
};
const TONE: Record<string, string> = {
  exito: "bg-lime-100 text-lime-700",
  alerta: "bg-amber-100 text-amber-700",
  error: "bg-red-100 text-red-600",
  info: "bg-navy-50 text-navy-600",
};

export default async function NotificacionesPage() {
  const user = await requireUser();
  const items = await prisma.notification.findMany({
    where: { userId: user.id },
    orderBy: { sentAt: "desc" },
    take: 60,
  });

  // Se marcan como leidas al abrir la bandeja
  await prisma.notification.updateMany({
    where: { userId: user.id, isRead: false },
    data: { isRead: true, readAt: new Date() },
  });

  return (
    <div className="mx-auto max-w-3xl">
      <SectionTitle
        eyebrow="Cuenta"
        title="Notificaciones"
        description="Avisos de cursos asignados, recordatorios, resultados y certificados."
      />

      {items.length === 0 ? (
        <EmptyState
          icon={<IconBell width={30} height={30} />}
          title="Sin notificaciones"
          description="Aquí apareceran los avisos de su empresa y de KG Academy."
        />
      ) : (
        <div className="card divide-y divide-navy-50 overflow-hidden">
          {items.map((n) => {
            const body = (
              <div className="flex items-start gap-4 p-5 transition hover:bg-navy-50/50">
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                    TONE[n.type] ?? TONE.info
                  }`}
                >
                  {ICON[n.type] ?? ICON.info}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="font-display text-sm font-bold text-navy-700">{n.title}</p>
                    <span className="text-[11px] text-navy-300">{formatDateTime(n.sentAt)}</span>
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-navy-500">{n.message}</p>
                </div>
                {!n.isRead && <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-lime-500" />}
              </div>
            );
            return n.linkUrl ? (
              <Link key={n.id} href={n.linkUrl} className="block">
                {body}
              </Link>
            ) : (
              <div key={n.id}>{body}</div>
            );
          })}
        </div>
      )}
    </div>
  );
}
