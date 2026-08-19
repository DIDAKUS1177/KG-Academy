import Link from "next/link";
import { cn } from "@/lib/utils";
import { IconClock, IconLayers, IconArrowRight, IconGraduation, IconCheck } from "./Icons";
import { ProgressBar, StatusBadge } from "./ui";

export type CourseCardData = {
  slug: string;
  code: string;
  title: string;
  subtitle?: string | null;
  level: string;
  durationHours: number;
  accessType: string;
  price: number;
  status?: string;
  modulesCount: number;
  lessonsCount: number;
  categoryName?: string;
  categoryColor?: string | null;
  progress?: number | null;
  enrollmentStatus?: string | null;
  ready?: boolean;
};

const LEVEL_LABEL: Record<string, string> = {
  basico: "Básico",
  intermedio: "Intermedio",
  avanzado: "Avanzado",
};

export function CourseCard({ course, href }: { course: CourseCardData; href?: string }) {
  const accent = course.categoryColor ?? "#8FBF16";
  const link = href ?? `/curso/${course.slug}`;

  return (
    <Link href={link} className="group card card-hover flex flex-col overflow-hidden">
      {/* Portada generada con la identidad de marca */}
      <div className="relative h-40 overflow-hidden bg-kg-gradient">
        <div className="absolute inset-0 bg-kg-mesh opacity-80" />
        <div className="absolute inset-0 bg-grid bg-[size:26px_26px] opacity-40" />
        <div
          className="absolute -right-10 -top-10 h-40 w-40 rounded-full blur-2xl transition-transform duration-500 group-hover:scale-125"
          style={{ background: accent, opacity: 0.35 }}
        />
        <div className="relative flex h-full flex-col justify-between p-5">
          <div className="flex items-start justify-between">
            <span className="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white/85 backdrop-blur">
              {course.categoryName ?? "Formación"}
            </span>
            <span className="font-mono text-[10px] font-bold text-white/50">{course.code}</span>
          </div>
          <div className="flex items-end gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-lime-500 text-navy-900 shadow-kg">
              <IconGraduation width={22} height={22} />
            </span>
            <p className="font-display text-[13px] font-bold uppercase tracking-wide text-white/70">
              {LEVEL_LABEL[course.level] ?? course.level} &middot; {course.durationHours} h
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-[17px] font-bold leading-snug text-navy-700 transition-colors group-hover:text-lime-600">
          {course.title}
        </h3>
        {course.subtitle && (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-navy-400">{course.subtitle}</p>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-navy-400">
          <span className="inline-flex items-center gap-1.5">
            <IconLayers width={14} height={14} /> {course.modulesCount} módulos
          </span>
          <span className="inline-flex items-center gap-1.5">
            <IconClock width={14} height={14} /> {course.lessonsCount} lecciones
          </span>
          {course.status && course.status !== "publicado" && <StatusBadge status={course.status} />}
        </div>

        {typeof course.progress === "number" && (
          <div className="mt-4">
            <div className="mb-1.5 flex items-center justify-between text-[11px] font-semibold text-navy-500">
              <span>Tu avance</span>
              <span>{Math.round(course.progress)}%</span>
            </div>
            <ProgressBar value={course.progress} />
          </div>
        )}

        <div className="mt-5 flex items-center justify-between border-t border-navy-50 pt-4">
          {/* El modelo comercial es el acceso a la plataforma, no la venta por curso */}
          <span className="inline-flex items-center gap-1.5 rounded-full bg-lime-100 px-2.5 py-1 text-[11px] font-bold text-lime-800">
            <IconCheck width={12} height={12} strokeWidth={3.5} />
            {course.accessType === "gratuito" ? "Acceso libre" : "Incluido en el plan"}
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-navy-500 transition-all group-hover:gap-2.5 group-hover:text-lime-600">
            Ver curso <IconArrowRight width={15} height={15} />
          </span>
        </div>
      </div>
    </Link>
  );
}
