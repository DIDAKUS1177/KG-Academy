import type { Metadata } from "next";
import Link from "next/link";
import { RegisterForm } from "./RegisterForm";

export const metadata: Metadata = { title: "Crear cuenta" };

export default function RegistroPage() {
  return (
    <div>
      <p className="eyebrow">Es su primera vez</p>
      <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-navy-700">
        Crear cuenta
      </h1>
      <p className="mt-2 text-sm text-navy-400">
        Registrese para acceder a los cursos. Si su empresa ya esta en KG Academy, indique el NIT y
        quedara vinculado automaticamente.
      </p>

      <div className="mt-8">
        <RegisterForm />
      </div>

      <p className="mt-6 text-center text-sm text-navy-400">
        Ya tiene cuenta?{" "}
        <Link href="/ingresar" className="link-kg">
          Iniciar sesion
        </Link>
      </p>
    </div>
  );
}
