import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Iniciar sesión" };

export default async function IngresarPage(props: { searchParams: Promise<{ clave?: string }> }) {
  const searchParams = await props.searchParams;
  return (
    <div>
      <p className="eyebrow">Bienvenido de nuevo</p>
      <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-navy-700">
        Iniciar sesión
      </h1>
      <p className="mt-2 text-sm text-navy-400">
        Acceda a su aula virtual, su panel empresarial o la administración de KG Academy.
      </p>

      {searchParams.clave === "restablecida" && (
        <div role="status" className="mt-6 rounded-xl border border-lime-200 bg-lime-50 p-3 text-sm text-lime-800">
          Su contraseña quedó actualizada. Ingrese con la nueva.
        </div>
      )}

      <div className="mt-8">
        <LoginForm />
      </div>

      <p className="mt-6 text-center text-sm text-navy-400">
        ¿No tiene cuenta?{" "}
        <Link href="/registro" className="link-kg">
          Regístrese aquí
        </Link>
      </p>
    </div>
  );
}
