import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { IconQr, IconShield } from "@/components/Icons";

export const metadata: Metadata = { title: "Verificar certificado" };

export default function VerificarPage({ searchParams }: { searchParams: { codigo?: string } }) {
  const codigo = searchParams.codigo?.trim();
  if (codigo) redirect(`/verificar/${encodeURIComponent(codigo.toUpperCase())}`);

  return (
    <section className="relative -mt-[72px] flex min-h-[80vh] items-center overflow-hidden bg-kg-gradient pt-[72px] text-white">
      <div className="pointer-events-none absolute inset-0 bg-kg-mesh" />
      <div className="pointer-events-none absolute inset-0 bg-grid bg-[size:44px_44px] opacity-40" />

      <div className="relative mx-auto w-full max-w-2xl px-4 py-20 text-center lg:px-8">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-lime-500 text-navy-900">
          <IconQr width={32} height={32} />
        </span>
        <h1 className="mt-7 font-display text-4xl font-extrabold tracking-tight">
          Verificacion de certificados
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-white/60">
          Ingrese el codigo unico impreso en el certificado o escanee su codigo QR para confirmar su
          autenticidad, el estado de vigencia y los datos del titular.
        </p>

        <form className="mx-auto mt-9 flex max-w-md flex-col gap-3 sm:flex-row">
          <input
            name="codigo"
            required
            placeholder="KG-2026-XXXXXX"
            className="input flex-1 border-white/20 bg-white/10 text-center font-mono uppercase tracking-widest text-white placeholder:text-white/35 focus:border-lime-500 sm:text-left"
          />
          <button className="btn-lime shrink-0 px-7 py-3">Verificar</button>
        </form>

        <p className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/45">
          <IconShield width={14} height={14} className="text-lime-400" />
          Consulta publica &middot; no requiere iniciar sesion
        </p>
      </div>
    </section>
  );
}
