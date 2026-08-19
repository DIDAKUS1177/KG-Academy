import Link from "next/link";
import { LogoMark } from "@/components/Logo";
import { IconArrowRight } from "@/components/Icons";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-kg-gradient px-6 text-center text-white">
      <div className="pointer-events-none absolute inset-0 bg-kg-mesh" />
      <div className="pointer-events-none absolute inset-0 bg-grid bg-[size:44px_44px] opacity-40" />
      <div className="relative">
        <LogoMark size={78} className="mx-auto" />
        <p className="mt-8 font-display text-7xl font-extrabold text-lime-400">404</p>
        <h1 className="mt-3 font-display text-2xl font-extrabold">Página no encontrada</h1>
        <p className="mx-auto mt-3 max-w-md text-sm text-white/60">
          El recurso que busca no existe o no tiene permisos para verlo.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn-lime">
            Ir al inicio <IconArrowRight width={16} height={16} />
          </Link>
          <Link href="/catalogo" className="btn border border-white/20 bg-white/5 text-white hover:bg-white/10">
            Ver cursos
          </Link>
        </div>
      </div>
    </div>
  );
}
