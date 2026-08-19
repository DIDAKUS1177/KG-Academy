import type { Metadata } from "next";
import Link from "next/link";
import { IconAlert } from "@/components/Icons";

export const metadata: Metadata = { title: "Recuperar contraseña" };

export default function RecuperarPage() {
  return (
    <div>
      <p className="eyebrow">Acceso</p>
      <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-navy-700">
        Recuperar contraseña
      </h1>
      <p className="mt-2 text-sm text-navy-400">
        Indique su correo y le enviaremos un enlace para restablecer su contraseña.
      </p>

      <form className="card mt-8 p-7">
        <label className="label">Correo electronico</label>
        <input type="email" required className="input" placeholder="nombre@empresa.com" />
        <button type="button" className="btn-lime mt-5 w-full py-3">
          Enviar enlace de recuperación
        </button>

        <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-relaxed text-amber-800">
          <IconAlert width={16} height={16} className="mt-0.5 shrink-0" />
          <span>
            El envío de correo requiere configurar el proveedor SMTP en la fase de despliegue
            (punto 18 del esqueleto funcional). La tabla <code>password_reset_tokens</code> y el flujo
            ya están modelados en la base de datos.
          </span>
        </div>
      </form>

      <p className="mt-6 text-center text-sm text-navy-400">
        <Link href="/ingresar" className="link-kg">
          Volver a iniciar sesión
        </Link>
      </p>
    </div>
  );
}
