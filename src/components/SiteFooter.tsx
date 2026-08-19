import Link from "next/link";
import { LogoMark } from "./Logo";
import { CreditoDesarrollo, EnlacesContacto } from "./Contacto";
import { IconShield, IconGraduation, IconChart } from "./Icons";

const SERVICIOS = [
  { icon: <IconShield width={18} height={18} />, label: "Gestión SST" },
  { icon: <IconGraduation width={18} height={18} />, label: "E-Learning" },
  { icon: <IconChart width={18} height={18} />, label: "Business Analytics" },
];

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-kg-gradient text-white">
      <div className="pointer-events-none absolute inset-0 bg-kg-mesh opacity-80" />
      <div className="pointer-events-none absolute inset-0 bg-grid bg-[size:44px_44px] opacity-40" />

      <div className="relative mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3">
              <LogoMark size={54} />
              <div>
                <p className="font-display text-lg font-extrabold">
                  KG <span className="text-lime-400">Academy</span>
                </p>
                <p className="text-xs text-white/55">KATERINE GUAÑARITA &middot; KG Gestión Integral S.A.S.</p>
              </div>
            </div>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-white/60">
              Plataforma de formación virtual con trazabilidad corporativa. Capacitamos, medimos y
              certificamos el cumplimiento en Seguridad y Salud en el Trabajo.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {SERVICIOS.map((s) => (
                <span
                  key={s.label}
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/80"
                >
                  <span className="text-lime-400">{s.icon}</span>
                  {s.label}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.16em] text-lime-400">Plataforma</p>
            <ul className="space-y-2.5 text-sm text-white/60">
              <li><Link href="/catalogo" className="hover:text-lime-400">Catálogo de cursos</Link></li>
              <li><Link href="/registro" className="hover:text-lime-400">Crear cuenta</Link></li>
              <li><Link href="/ingresar" className="hover:text-lime-400">Iniciar sesión</Link></li>
              <li><Link href="/verificar" className="hover:text-lime-400">Verificar certificado</Link></li>
            </ul>
          </div>

          <div>
            <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.16em] text-lime-400">Empresas</p>
            <ul className="space-y-2.5 text-sm text-white/60">
              <li><Link href="/#empresas" className="hover:text-lime-400">Planes corporativos</Link></li>
              <li><Link href="/empresa" className="hover:text-lime-400">Panel empresarial</Link></li>
              <li><Link href="/#como-funciona" className="hover:text-lime-400">Cómo funciona</Link></li>
            </ul>
          </div>

          <div>
            <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.16em] text-lime-400">Contacto</p>
            <EnlacesContacto tone="dark" />
            <p className="mt-4 text-xs leading-relaxed text-white/40">
              Escríbanos y le contamos como activar KG Academy en su empresa.
            </p>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-white/40 md:flex-row">
          <p>&copy; {new Date().getFullYear()} KG Gestión Integral S.A.S. Todos los derechos reservados.</p>
          <p className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5">
            Desarrollado por <CreditoDesarrollo tone="dark" />
          </p>
        </div>
      </div>
    </footer>
  );
}
