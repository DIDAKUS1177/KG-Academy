import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Logotipo oficial de KATERINE GUANARITA - KG GESTION INTEGRAL S.A.S.
 * Archivo: /public/brand/kg-logo.png
 */
export function LogoMark({
  size = 44,
  className,
  rounded = true,
}: {
  size?: number;
  className?: string;
  rounded?: boolean;
}) {
  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden bg-white",
        rounded && "rounded-xl ring-1 ring-navy-100",
        className
      )}
      style={{ width: size, height: size }}
    >
      <Image
        src="/brand/kg-logo.png"
        alt="Logo KG Gestion Integral S.A.S."
        width={size * 2}
        height={size * 2}
        className="h-full w-full object-cover"
        style={{ objectPosition: "50% 32%", transform: "scale(1.55)" }}
        priority
      />
    </span>
  );
}

/** Logotipo completo (imagen oficial sin recortar). */
export function LogoFull({ width = 220, className }: { width?: number; className?: string }) {
  return (
    <Image
      src="/brand/kg-logo.png"
      alt="KATERINE GUANARITA - KG Gestion Integral S.A.S."
      width={width}
      height={width}
      className={cn("h-auto w-auto", className)}
      style={{ width }}
      priority
    />
  );
}

/** Lockup: marca + nombre del producto. */
export function Logo({
  href = "/",
  dark = false,
  compact = false,
}: {
  href?: string;
  dark?: boolean;
  compact?: boolean;
}) {
  return (
    <Link href={href} className="group inline-flex items-center gap-3">
      <LogoMark size={compact ? 38 : 46} className="transition-transform group-hover:scale-105" />
      <span className="leading-none">
        <span
          className={cn(
            "block font-display text-[17px] font-extrabold tracking-tight",
            dark ? "text-white" : "text-navy-700"
          )}
        >
          KG <span className="text-lime-500">Academy</span>
        </span>
        {!compact && (
          <span
            className={cn(
              "mt-1 block text-[10px] font-semibold uppercase tracking-[0.14em]",
              dark ? "text-white/60" : "text-navy-400"
            )}
          >
            KG Gestion Integral S.A.S.
          </span>
        )}
      </span>
    </Link>
  );
}
