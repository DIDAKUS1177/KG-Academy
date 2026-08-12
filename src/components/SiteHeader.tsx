"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { IconMenu, IconX, IconArrowRight } from "./Icons";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/catalogo", label: "Cursos" },
  { href: "/#empresas", label: "Para empresas" },
  { href: "/#como-funciona", label: "Como funciona" },
  { href: "/verificar", label: "Verificar certificado" },
];

export function SiteHeader({ session }: { session: { name: string; home: string } | null }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled ? "border-b border-navy-100 bg-white/90 backdrop-blur-xl shadow-sm" : "bg-transparent"
      )}
    >
      <div className="mx-auto flex h-[72px] max-w-7xl items-center gap-6 px-4 lg:px-8">
        {/* Sobre el hero oscuro el lockup va en blanco; al hacer scroll pasa a navy */}
        <Logo dark={!scrolled} />
        <nav className="ml-4 hidden items-center gap-1 lg:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "rounded-lg px-3.5 py-2 text-sm font-semibold transition",
                scrolled
                  ? "text-navy-500 hover:bg-navy-50 hover:text-navy-700"
                  : "text-white/75 hover:bg-white/10 hover:text-white"
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto hidden items-center gap-3 lg:flex">
          {session ? (
            <Link href={session.home} className="btn-lime">
              Ir a mi panel <IconArrowRight width={16} height={16} />
            </Link>
          ) : (
            <>
              <Link
                href="/ingresar"
                className={cn(
                  "btn",
                  scrolled
                    ? "text-navy-700 hover:bg-navy-50"
                    : "text-white hover:bg-white/10"
                )}
              >
                Iniciar sesion
              </Link>
              <Link href="/registro" className="btn-lime">
                Crear cuenta
              </Link>
            </>
          )}
        </div>
        <button
          className={cn(
            "ml-auto rounded-lg p-2 lg:hidden",
            scrolled ? "text-navy-700" : "text-white"
          )}
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          {open ? <IconX /> : <IconMenu />}
        </button>
      </div>

      {open && (
        <div className="border-t border-navy-100 bg-white px-4 py-4 lg:hidden">
          <div className="flex flex-col gap-1">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-semibold text-navy-600 hover:bg-navy-50"
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-3 flex gap-2">
              {session ? (
                <Link href={session.home} className="btn-lime flex-1">
                  Mi panel
                </Link>
              ) : (
                <>
                  <Link href="/ingresar" className="btn-outline flex-1">
                    Ingresar
                  </Link>
                  <Link href="/registro" className="btn-lime flex-1">
                    Registrarme
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
