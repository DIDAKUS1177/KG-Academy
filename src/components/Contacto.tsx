import { BRAND, CONTACTO, WHATSAPP_MSG } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { IconMail, IconPhone, IconWhatsApp } from "./Icons";

/**
 * Credito de desarrollo. Enlaza al perfil profesional del desarrollador.
 * Se usa en el pie publico, en los paneles y en la pantalla de acceso.
 */
export function CreditoDesarrollo({
  tone = "light",
  className,
}: {
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <a
      href={BRAND.developerUrl}
      target="_blank"
      rel="noreferrer"
      title={`Perfil profesional de ${BRAND.developer} en LinkedIn`}
      className={cn(
        "font-semibold underline decoration-transparent underline-offset-2 transition-colors hover:decoration-current",
        tone === "dark" ? "text-lime-400 hover:text-lime-300" : "text-navy-600 hover:text-lime-600",
        className
      )}
    >
      {BRAND.developer}
    </a>
  );
}

/** Enlaces de contacto de KG. `tone` adapta el color al fondo. */
export function EnlacesContacto({ tone = "dark" }: { tone?: "light" | "dark" }) {
  const base =
    tone === "dark"
      ? "text-white/60 hover:text-lime-400"
      : "text-navy-500 hover:text-lime-600";
  const icono = tone === "dark" ? "text-lime-400" : "text-lime-600";

  return (
    <ul className="space-y-3 text-sm">
      <li>
        <a
          href={`${CONTACTO.whatsapp}?text=${WHATSAPP_MSG}`}
          target="_blank"
          rel="noreferrer"
          className={cn("inline-flex items-center gap-2.5 transition-colors", base)}
        >
          <IconWhatsApp width={16} height={16} className={icono} />
          {CONTACTO.telefono}
          <span className={cn("text-[10px] font-bold uppercase tracking-wide", icono)}>WhatsApp</span>
        </a>
      </li>
      <li>
        <a
          href={`tel:${CONTACTO.telefonoE164}`}
          className={cn("inline-flex items-center gap-2.5 transition-colors", base)}
        >
          <IconPhone width={16} height={16} className={icono} />
          Llamar directamente
        </a>
      </li>
      <li>
        <a
          href={`mailto:${CONTACTO.email}?subject=${encodeURIComponent("Consulta sobre KG Academy")}`}
          className={cn("inline-flex items-center gap-2.5 break-all transition-colors", base)}
        >
          <IconMail width={16} height={16} className={cn("shrink-0", icono)} />
          {CONTACTO.email}
        </a>
      </li>
    </ul>
  );
}

/**
 * Boton flotante de WhatsApp para las paginas publicas.
 * Es la via de contacto mas directa para el modelo comercial de KG:
 * la plataforma se vende como servicio, no por autogestion de compra.
 */
export function BotonWhatsApp() {
  return (
    <a
      href={`${CONTACTO.whatsapp}?text=${WHATSAPP_MSG}`}
      target="_blank"
      rel="noreferrer"
      aria-label={`Escribir por WhatsApp al ${CONTACTO.telefono}`}
      className="group fixed bottom-5 right-5 z-40 inline-flex items-center gap-2.5 rounded-full bg-[#25D366] py-3 pl-3.5 pr-4 text-navy-900 shadow-kg-lg transition-transform hover:scale-105 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#25D366]/40 print:hidden"
    >
      <IconWhatsApp width={24} height={24} className="text-white" />
      <span className="hidden text-sm font-bold text-white sm:inline">Escribanos</span>
    </a>
  );
}
