import Link from "next/link";
import { LogoFull, Logo } from "@/components/Logo";
import { CreditoDesarrollo } from "@/components/Contacto";
import { IconShield, IconGraduation, IconChart, IconCheck } from "@/components/Icons";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1fr_1.05fr]">
      {/* Panel de marca */}
      <aside className="relative hidden overflow-hidden bg-kg-gradient p-12 text-white lg:flex lg:flex-col">
        <div className="pointer-events-none absolute inset-0 bg-kg-mesh" />
        <div className="pointer-events-none absolute inset-0 bg-grid bg-[size:44px_44px] opacity-40" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-lime-500/15 blur-3xl" />

        <div className="relative">
          <Logo href="/" dark />
        </div>

        <div className="relative my-auto">
          <div className="mx-auto w-fit rounded-[2rem] bg-white p-7 shadow-kg-lg">
            <LogoFull width={300} />
          </div>

          <h2 className="mt-10 max-w-md font-display text-3xl font-extrabold leading-tight">
            Formación que <span className="text-lime-400">protege vidas</span>
          </h2>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-white/60">
            Aula virtual, evaluaciones y certificados verificables para el Sistema de Gestión de
            Seguridad y Salud en el Trabajo.
          </p>

          <ul className="mt-8 space-y-3">
            {[
              { i: <IconShield width={16} height={16} />, t: "Gestión SST con evidencia auditable" },
              { i: <IconGraduation width={16} height={16} />, t: "E-Learning con progreso trazable" },
              { i: <IconChart width={16} height={16} />, t: "Indicadores por área, cargo y sede" },
            ].map((f) => (
              <li key={f.t} className="flex items-center gap-3 text-sm text-white/75">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 text-lime-400">
                  {f.i}
                </span>
                {f.t}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-[11px] text-white/30">
          KG Gestión Integral S.A.S. &middot; Desarrollado por{" "}
          <CreditoDesarrollo tone="dark" className="text-white/50 hover:text-lime-400" />
        </p>
      </aside>

      {/* Formulario */}
      <main className="flex flex-col bg-cloud">
        <div className="flex items-center justify-between px-6 py-6 lg:px-12">
          <div className="lg:hidden">
            <Logo href="/" compact />
          </div>
          <Link href="/" className="ml-auto text-xs font-semibold text-navy-400 hover:text-lime-600">
            Volver al inicio
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center px-6 pb-14 lg:px-12">
          <div className="w-full max-w-md animate-fade-up">{children}</div>
        </div>
      </main>
    </div>
  );
}
