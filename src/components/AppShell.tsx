"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { Logo } from "./Logo";
import { CreditoDesarrollo } from "./Contacto";
import { Avatar } from "./ui";
import { IconLogout, IconMenu, IconX, IconBell } from "./Icons";
import { cn } from "@/lib/utils";

export type NavItem = { href: string; label: string; icon: ReactNode; exact?: boolean };
export type NavGroup = { title?: string; items: NavItem[] };

export function AppShell({
  groups,
  user,
  area,
  notifications = 0,
  children,
}: {
  groups: NavGroup[];
  user: { firstName: string; lastName: string; email: string; roleLabel: string };
  area: string;
  notifications?: number;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (it: NavItem) =>
    it.exact ? pathname === it.href : pathname === it.href || pathname.startsWith(it.href + "/");

  const sidebar = (
    <div className="flex h-full flex-col bg-kg-gradient">
      <div className="pointer-events-none absolute inset-0 bg-kg-mesh opacity-70" />
      <div className="relative flex items-center justify-between px-5 py-5">
        <Logo href="/" dark compact />
        <button className="text-white/70 lg:hidden" onClick={() => setOpen(false)} aria-label="Cerrar menu">
          <IconX />
        </button>
      </div>

      <div className="relative mx-4 mb-4 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-lime-400">{area}</p>
      </div>

      <nav className="relative flex-1 space-y-6 overflow-y-auto px-3 pb-6">
        {groups.map((g, gi) => (
          <div key={gi}>
            {g.title && (
              <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-white/35">
                {g.title}
              </p>
            )}
            <ul className="space-y-1">
              {g.items.map((it) => {
                const active = isActive(it);
                return (
                  <li key={it.href}>
                    <Link
                      href={it.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                        active
                          ? "bg-white text-navy-700 shadow-kg"
                          : "text-white/70 hover:bg-white/10 hover:text-white"
                      )}
                    >
                      <span className={cn("transition-colors", active ? "text-lime-600" : "text-white/50 group-hover:text-lime-400")}>
                        {it.icon}
                      </span>
                      {it.label}
                      {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-lime-500" />}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="relative border-t border-white/10 p-4">
        <div className="flex items-center gap-3">
          <Avatar first={user.firstName} last={user.lastName} size={38} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">
              {user.firstName} {user.lastName}
            </p>
            <p className="truncate text-[11px] text-white/50">{user.roleLabel}</p>
          </div>
          <form action="/api/auth/logout" method="post">
            <button className="rounded-lg p-2 text-white/50 transition hover:bg-white/10 hover:text-white" title="Cerrar sesión">
              <IconLogout width={18} height={18} />
            </button>
          </form>
        </div>
        <p className="mt-3 text-center text-[9px] leading-relaxed text-white/25">
          Desarrollado por <CreditoDesarrollo tone="dark" className="text-lime-400/70 hover:text-lime-400" />
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-cloud">
      {/* Sidebar escritorio */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[268px] overflow-hidden lg:block">{sidebar}</aside>

      {/* Sidebar movil */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-navy-900/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-[280px] overflow-hidden animate-fade-in">{sidebar}</aside>
        </div>
      )}

      <div className="lg:pl-[268px]">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-navy-100 bg-white/85 px-4 backdrop-blur-xl lg:px-8">
          <button className="rounded-lg p-2 text-navy-600 hover:bg-navy-50 lg:hidden" onClick={() => setOpen(true)} aria-label="Abrir menu">
            <IconMenu />
          </button>
          <div className="flex-1" />
          <Link href="/catalogo" className="hidden text-sm font-semibold text-navy-500 hover:text-lime-600 sm:block">
            Catálogo
          </Link>
          <Link
            href="/aula/notificaciones"
            className="relative rounded-lg p-2 text-navy-500 transition hover:bg-navy-50 hover:text-navy-700"
            title="Notificaciones"
          >
            <IconBell />
            {notifications > 0 && (
              <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-lime-500 px-1 text-[9px] font-bold text-navy-900">
                {notifications}
              </span>
            )}
          </Link>
          <div className="h-8 w-px bg-navy-100" />
          <Avatar first={user.firstName} last={user.lastName} size={34} />
        </header>

        <main className="mx-auto max-w-[1400px] px-4 py-8 lg:px-8">{children}</main>

        <footer className="border-t border-navy-100 px-4 py-6 text-center text-[11px] text-navy-300 lg:px-8">
          KG Academy &middot; KG Gestión Integral S.A.S. &middot; Desarrollado por{" "}
          <CreditoDesarrollo />
        </footer>
      </div>
    </div>
  );
}
