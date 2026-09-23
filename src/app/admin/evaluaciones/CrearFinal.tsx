"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { llamar } from "@/components/admin/Formulario";

/** Crea la evaluación final de un curso y abre su editor. */
export function CrearFinal({ courseId }: { courseId: string }) {
  const router = useRouter();
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function crear() {
    setEnviando(true);
    setError(null);
    const r = await llamar<{ assessmentId: string }>("/api/admin/evaluacion", "PUT", { courseId });
    if (r.ok) {
      router.push(`/admin/evaluaciones/${r.data.assessmentId}`);
      return;
    }
    setEnviando(false);
    setError(r.data.error ?? "No se pudo crear");
  }

  return (
    <div className="flex items-center justify-end gap-2">
      {error && <span className="text-[11px] text-red-600">{error}</span>}
      <button type="button" onClick={crear} disabled={enviando} className="btn-lime btn-sm">
        {enviando ? "Creando..." : "Crear evaluación final"}
      </button>
    </div>
  );
}
