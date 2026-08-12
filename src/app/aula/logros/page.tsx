import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { totalPoints } from "@/lib/progress";
import { formatDate } from "@/lib/utils";
import { SectionTitle, StatCard, ProgressBar } from "@/components/ui";
import { IconSpark, IconFire, IconAward, IconCheck } from "@/components/Icons";

export const metadata: Metadata = { title: "Logros y puntos" };
export const dynamic = "force-dynamic";

export default async function LogrosPage() {
  const user = await requireUser();

  const [points, streak, badges, earned, ledger, ranking] = await Promise.all([
    totalPoints(user.id),
    prisma.streak.findUnique({ where: { userId: user.id } }),
    prisma.badge.findMany({ where: { isActive: true } }),
    prisma.userBadge.findMany({ where: { userId: user.id } }),
    prisma.pointsLedger.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 12,
    }),
    prisma.pointsLedger.groupBy({
      by: ["userId"],
      _sum: { points: true },
      orderBy: { _sum: { points: "desc" } },
      take: 5,
    }),
  ]);

  const earnedIds = new Set(earned.map((e) => e.badgeId));
  const rankUsers = await prisma.user.findMany({
    where: { id: { in: ranking.map((r) => r.userId) } },
    select: { id: true, firstName: true, lastName: true },
  });
  const nameOf = (id: string) => {
    const u = rankUsers.find((x) => x.id === id);
    return u ? `${u.firstName.split(" ")[0]} ${u.lastName.split(" ")[0]}` : "Usuario";
  };

  const nivel = Math.floor(points / 250) + 1;
  const enNivel = points % 250;

  const REASON: Record<string, string> = {
    leccion_completada: "Leccion completada",
    curso_completado: "Curso completado",
    evaluacion_aprobada: "Evaluacion aprobada",
    racha: "Racha de estudio",
  };

  return (
    <div>
      <SectionTitle
        eyebrow="Gamificacion"
        title="Logros y puntos"
        description="Sus puntos, insignias y racha de estudio en KG Academy."
      />

      <div className="grid gap-5 sm:grid-cols-3">
        <StatCard label="Puntos acumulados" value={points} tone="lime" icon={<IconSpark width={20} height={20} />} />
        <StatCard
          label="Racha actual"
          value={`${streak?.currentDays ?? 0} dias`}
          hint={`Mejor racha: ${streak?.longestDays ?? 0} dias`}
          tone="amber"
          icon={<IconFire width={20} height={20} />}
        />
        <StatCard
          label="Insignias"
          value={`${earned.length}/${badges.length}`}
          icon={<IconAward width={20} height={20} />}
        />
      </div>

      <div className="card mt-6 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-display text-base font-bold text-navy-700">Nivel {nivel}</p>
            <p className="text-xs text-navy-400">{250 - enNivel} puntos para el siguiente nivel</p>
          </div>
          <span className="font-display text-2xl font-extrabold text-lime-600">{enNivel}/250</span>
        </div>
        <ProgressBar value={(enNivel / 250) * 100} className="mt-4" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <h3 className="mb-4 font-display text-lg font-bold text-navy-700">Insignias</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {badges.map((b) => {
              const got = earnedIds.has(b.id);
              return (
                <div
                  key={b.id}
                  className={`card flex items-start gap-4 p-5 ${got ? "border-lime-300" : "opacity-70"}`}
                >
                  <span
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
                      got ? "bg-lime-500 text-navy-900" : "bg-navy-50 text-navy-300"
                    }`}
                  >
                    {got ? <IconCheck width={22} height={22} strokeWidth={3} /> : <IconAward width={22} height={22} />}
                  </span>
                  <div className="min-w-0">
                    <p className="font-display text-sm font-bold text-navy-700">{b.name}</p>
                    <p className="mt-0.5 text-xs text-navy-400">{b.description}</p>
                    <p className="mt-2 text-[10px] font-bold uppercase tracking-wide text-lime-600">
                      +{b.points} puntos &middot; {b.criteria}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-6">
          <div className="card overflow-hidden">
            <p className="border-b border-navy-50 px-5 py-4 font-display text-sm font-bold text-navy-700">
              Ranking de la plataforma
            </p>
            <ol className="divide-y divide-navy-50">
              {ranking.map((r, i) => (
                <li key={r.userId} className="flex items-center gap-3 px-5 py-3">
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                      i === 0 ? "bg-lime-500 text-navy-900" : "bg-navy-50 text-navy-500"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span
                    className={`min-w-0 flex-1 truncate text-sm ${
                      r.userId === user.id ? "font-bold text-navy-700" : "text-navy-500"
                    }`}
                  >
                    {r.userId === user.id ? "Usted" : nameOf(r.userId)}
                  </span>
                  <span className="shrink-0 font-display text-sm font-extrabold text-lime-600">
                    {r._sum.points}
                  </span>
                </li>
              ))}
            </ol>
          </div>

          <div className="card overflow-hidden">
            <p className="border-b border-navy-50 px-5 py-4 font-display text-sm font-bold text-navy-700">
              Movimientos recientes
            </p>
            <ul className="divide-y divide-navy-50">
              {ledger.length === 0 && (
                <li className="px-5 py-6 text-center text-xs text-navy-300">Sin movimientos aun</li>
              )}
              {ledger.map((l) => (
                <li key={l.id} className="flex items-center gap-3 px-5 py-3 text-xs">
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold text-navy-600">
                      {REASON[l.reason] ?? l.reason}
                    </span>
                    <span className="text-navy-300">{formatDate(l.createdAt)}</span>
                  </span>
                  <span className="shrink-0 font-bold text-lime-600">+{l.points}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
