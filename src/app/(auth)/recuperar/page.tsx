import type { Metadata } from "next";
import Link from "next/link";
import { CONTACTO } from "@/lib/constants";
import { IconBuilding, IconWhatsApp } from "@/components/Icons";

export const metadata: Metadata = { title: "Recuperar contraseña" };

const MENSAJE = encodeURIComponent("Hola, necesito restablecer mi contraseña de KG Academy. Mi correo de acceso es: ");

/**
 * Recuperación de contraseña. La plataforma todavía no envía correos, así
 * que el restablecimiento lo hace una persona: el administrador de la
 * empresa (para sus trabajadores) o KG (para todos). En ambos casos se genera
 * una contraseña temporal que obliga a definir una nueva al entrar.
 */
export default function RecuperarPage() {
  return (
    <div>
      <p className="eyebrow">Acceso</p>
      <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-navy-700">
        Recuperar contraseña
      </h1>
      <p className="mt-2 text-sm text-navy-400">
        Le entregarán una contraseña temporal; al ingresar con ella, la plataforma le pedirá definir una nueva.
      </p>

      <div className="mt-8 space-y-4">
        <div className="card flex gap-4 p-6">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-navy-50 text-navy-600">
            <IconBuilding width={20} height={20} />
          </span>
          <div>
            <p className="font-display text-base font-bold text-navy-700">Si su empresa le dio el acceso</p>
            <p className="mt-1 text-sm leading-relaxed text-navy-500">
              Pídale al área de talento humano o al responsable de SST de su empresa que restablezca su
              contraseña desde el panel empresarial.
            </p>
          </div>
        </div>

        <div className="card flex gap-4 p-6">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-lime-50 text-lime-600">
            <IconWhatsApp width={20} height={20} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-display text-base font-bold text-navy-700">En cualquier otro caso</p>
            <p className="mt-1 text-sm leading-relaxed text-navy-500">
              Escríbale a KG Gestión Integral con el correo con el que ingresa.
            </p>
            <a
              href={`${CONTACTO.whatsapp}?text=${MENSAJE}`}
              target="_blank"
              rel="noreferrer"
              className="btn-lime mt-4"
            >
              <IconWhatsApp width={16} height={16} /> Escribir por WhatsApp
            </a>
          </div>
        </div>
      </div>

      <p className="mt-8 text-center text-sm text-navy-400">
        <Link href="/ingresar" className="link-kg">
          Volver a iniciar sesión
        </Link>
      </p>
    </div>
  );
}
