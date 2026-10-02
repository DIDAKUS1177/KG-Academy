"use client";

import { IconDownload } from "@/components/Icons";

/** Abre el diálogo de impresión del navegador, desde donde se guarda como PDF. */
export function PrintButton({ texto = "Descargar / Imprimir PDF" }: { texto?: string }) {
  return (
    <button onClick={() => window.print()} className="btn-lime">
      <IconDownload width={16} height={16} /> {texto}
    </button>
  );
}
