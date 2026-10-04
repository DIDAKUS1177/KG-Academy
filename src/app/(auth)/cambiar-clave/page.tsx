import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { ROLE_HOME } from "@/lib/constants";
import { CambiarClave } from "@/app/aula/perfil/CambiarClave";
import { minimoClave } from "@/lib/claves";

export const metadata: Metadata = { title: "Defina su contraseña" };
export const dynamic = "force-dynamic";

/**
 * Primer ingreso con contraseña temporal. Mientras la cuenta esté
 * "pendiente_activacion", requireUser envía aquí desde cualquier página: no
 * se puede usar la plataforma sin definir una contraseña propia.
 */
export default async function CambiarClavePage() {
  const user = await requireUser({ permitirPendiente: true });
  if (user.status !== "pendiente_activacion") redirect(ROLE_HOME[user.role.code] ?? "/aula");

  return (
    <div>
      <p className="eyebrow">Primer ingreso</p>
      <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-navy-700">
        Defina su contraseña
      </h1>
      <p className="mt-2 text-sm text-navy-400">
        Hola, {user.firstName}. Elija una contraseña que solo usted conozca: es la que usará de ahora en adelante para
        entrar.
      </p>

      <div className="mt-8">
        <CambiarClave temporal obligatorio minimo={await minimoClave()} />
      </div>

      <form action="/api/auth/logout" method="post" className="mt-6 text-center">
        <button className="text-xs font-semibold text-navy-400 underline hover:text-navy-600">
          Cerrar sesión y cambiarla después
        </button>
      </form>
    </div>
  );
}
