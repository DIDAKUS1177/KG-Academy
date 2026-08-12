"use client";

import { IconDownload } from "@/components/Icons";

export function PrintButton() {
  return (
    <button onClick={() => window.print()} className="btn-lime">
      <IconDownload width={16} height={16} /> Descargar / Imprimir PDF
    </button>
  );
}
