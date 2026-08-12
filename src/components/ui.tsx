import Link from "next/link";
import type { ReactNode } from "react";
import { cn, initials, pct } from "@/lib/utils";
import { STATUS_LABEL, STATUS_TONE } from "@/lib/constants";

/* ------------------------------- Estado ------------------------------- */
export function StatusBadge({ status, label }: { status: string; label?: string }) {
  const tone = STATUS_TONE[status] ?? "slate";
  const cls = {
    green: "badge-green",
    blue: "badge-blue",
    amber: "badge-amber",
    red: "badge-red",
    slate: "badge-slate",
  }[tone];
  const dot = {
    green: "bg-lime-500",
    blue: "bg-navy-500",
    amber: "bg-amber-500",
    red: "bg-red-500",
    slate: "bg-slate-400",
  }[tone];
  return (
    <span className={cls}>
      <span className={cn("h-1.5 w-1.5 rounded-full", dot)} />
      {label ?? STATUS_LABEL[status] ?? status}
    </span>
  );
}

/* ------------------------------ Progreso ------------------------------ */
export function ProgressBar({
  value,
  className,
  showLabel = false,
}: {
  value: number;
  className?: string;
  showLabel?: boolean;
}) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${v}%` }} />
      </div>
      {showLabel && (
        <span className="w-10 shrink-0 text-right text-xs font-bold text-navy-600">{pct(v)}</span>
      )}
    </div>
  );
}

export function ProgressRing({
  value,
  size = 120,
  stroke = 10,
  label,
  sub,
}: {
  value: number;
  size?: number;
  stroke?: number;
  label?: string;
  sub?: string;
}) {
  const v = Math.max(0, Math.min(100, value));
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke="#D6E4F0" strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="url(#kgring)"
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={c}
          strokeDashoffset={c - (v / 100) * c}
          style={{ transition: "stroke-dashoffset 900ms cubic-bezier(.16,1,.3,1)" }}
        />
        <defs>
          <linearGradient id="kgring" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#8FBF16" />
            <stop offset="100%" stopColor="#A5CE30" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-2xl font-extrabold text-navy-700">{label ?? pct(v)}</span>
        {sub && <span className="text-[10px] font-semibold uppercase tracking-wide text-navy-400">{sub}</span>}
      </div>
    </div>
  );
}

/* ------------------------------- KPIs -------------------------------- */
export function StatCard({
  label,
  value,
  hint,
  icon,
  tone = "navy",
}: {
  label: string;
  value: ReactNode;
  hint?: string;
  icon?: ReactNode;
  tone?: "navy" | "lime" | "amber" | "red";
}) {
  const toneCls = {
    navy: "bg-navy-50 text-navy-700",
    lime: "bg-lime-100 text-lime-700",
    amber: "bg-amber-50 text-amber-700",
    red: "bg-red-50 text-red-600",
  }[tone];
  return (
    <div className="card card-hover p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-navy-400">{label}</p>
          <p className="mt-2 font-display text-3xl font-extrabold text-navy-700">{value}</p>
          {hint && <p className="mt-1 text-xs text-navy-400">{hint}</p>}
        </div>
        {icon && <span className={cn("rounded-xl p-2.5", toneCls)}>{icon}</span>}
      </div>
    </div>
  );
}

/* ------------------------------ Secciones ----------------------------- */
export function SectionTitle({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow && <p className="eyebrow mb-1">{eyebrow}</p>}
        <h2 className="h-display text-2xl">{title}</h2>
        {description && <p className="mt-1 max-w-2xl text-sm text-navy-400">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-navy-200 bg-white/60 px-6 py-14 text-center">
      {icon && <div className="mb-4 rounded-2xl bg-navy-50 p-4 text-navy-400">{icon}</div>}
      <p className="font-display text-lg font-bold text-navy-700">{title}</p>
      {description && <p className="mt-1 max-w-md text-sm text-navy-400">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

/* ------------------------------- Avatar ------------------------------- */
export function Avatar({
  first,
  last,
  size = 40,
  className,
}: {
  first?: string | null;
  last?: string | null;
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full bg-kg-gradient font-display font-bold text-white ring-2 ring-lime-500/30",
        className
      )}
      style={{ width: size, height: size, fontSize: size * 0.36 }}
    >
      {initials(first, last)}
    </span>
  );
}

/* ------------------------- Aviso "contenido pendiente" ------------------ */
export function ContentPlaceholder({
  title = "Contenido en produccion",
  description = "Este espacio queda reservado para el material del curso (video, PDF o recurso interactivo de Genially). El equipo de KG podra cargarlo desde el panel administrativo sin tocar el codigo.",
  compact = false,
}: {
  title?: string;
  description?: string;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border-2 border-dashed border-navy-200 bg-navy-50/50 text-center",
        compact ? "p-6" : "p-12"
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-grid bg-[size:26px_26px] opacity-[0.5]" />
      <div className="relative">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-kg">
          <span className="font-display text-xl font-extrabold text-lime-500">KG</span>
        </div>
        <p className="font-display text-base font-bold text-navy-700">{title}</p>
        <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-navy-400">{description}</p>
      </div>
    </div>
  );
}

/* ----------------------------- Breadcrumb ----------------------------- */
export function Breadcrumb({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav className="mb-4 flex flex-wrap items-center gap-2 text-xs text-navy-400">
      {items.map((it, i) => (
        <span key={i} className="flex items-center gap-2">
          {it.href ? (
            <Link href={it.href} className="hover:text-lime-600">
              {it.label}
            </Link>
          ) : (
            <span className="font-semibold text-navy-600">{it.label}</span>
          )}
          {i < items.length - 1 && <span className="text-navy-200">/</span>}
        </span>
      ))}
    </nav>
  );
}
