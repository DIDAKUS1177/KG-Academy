import type { ReactElement, SVGProps } from "react";

/**
 * Símbolo de cada curso: lo identifica de un vistazo en el panel, el catálogo
 * y el aula. Se elige por código; un curso nuevo sin símbolo propio toma el
 * de su familia (PA = primeros auxilios, EM = emergencias, CA = calidad) o el
 * genérico.
 */
type P = SVGProps<SVGSVGElement>;

const base = (p: P) => ({
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  ...p,
});

/** Botiquín con la cruz de primeros auxilios. */
const Botiquin = (p: P) => (
  <svg {...base(p)}>
    <rect x="3" y="7" width="18" height="13" rx="2.5" />
    <path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7" />
    <path d="M12 10.5v6M9 13.5h6" />
  </svg>
);

/** Niño con un corazón: atención pediátrica. */
const Nino = (p: P) => (
  <svg {...base(p)}>
    <circle cx="9" cy="6" r="2.5" />
    <path d="M5 21v-5.5a4 4 0 0 1 8 0V21" />
    <path d="M18 18.5s-3.5-2.1-3.5-4.5a1.9 1.9 0 0 1 3.5-1 1.9 1.9 0 0 1 3.5 1c0 2.4-3.5 4.5-3.5 4.5" />
  </svg>
);

/** Cabeza con un corazón dentro: contención emocional. */
const Mente = (p: P) => (
  <svg {...base(p)}>
    <path d="M17.5 19.5V17h1.8a1 1 0 0 0 1-1.1l-.3-2.4 1.3-1.6a.8.8 0 0 0 0-1l-1.6-2C18.8 5.6 16.2 3 12.5 3 8.4 3 5 6.2 5 10.3c0 2.2.9 4.1 2.4 5.5V21" />
    <path d="M12.5 13.8s-3-1.8-3-3.8a1.6 1.6 0 0 1 3-.8 1.6 1.6 0 0 1 3 .8c0 2-3 3.8-3 3.8" />
  </svg>
);

/** Gota con presión de la mano: control de hemorragias. */
const Gota = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11" />
    <path d="M9.5 14.5a2.5 2.5 0 0 0 2.5 2.5" />
  </svg>
);

/** Llama: prevención y control de incendios. */
const Llama = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 22c4 0 6.5-2.7 6.5-6.2 0-4.6-4.3-6.3-4-11.3-2.6 1.4-4 3.6-4 6-1 0-2-1-2.3-2.6C6.6 9.5 5.5 12 5.5 15.8 5.5 19.3 8 22 12 22" />
    <path d="M12 22c-1.7 0-3-1.2-3-2.9 0-2 2-2.9 3-4.6 1 1.7 3 2.6 3 4.6 0 1.7-1.3 2.9-3 2.9" />
  </svg>
);

/** Edificio de salud con la cruz: habilitación de servicios de salud. */
const Habilitacion = (p: P) => (
  <svg {...base(p)}>
    <path d="M4 21V8l8-5 8 5v13" />
    <path d="M12 8.5v5M9.5 11h5" />
    <path d="M9.5 21v-3.5h5V21" />
    <path d="M2.5 21h19" />
  </svg>
);

/** Sello con el visto bueno: sistema de gestión de la calidad. */
const Calidad = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="9" r="6" />
    <path d="m9.3 9 1.8 1.8L14.8 7" />
    <path d="M8.5 14 7 21l5-2.5 5 2.5-1.5-7" />
  </svg>
);

/** Birrete: cualquier otro curso. */
const Birrete = (p: P) => (
  <svg {...base(p)}>
    <path d="m2 9 10-5 10 5-10 5z" />
    <path d="M6 11.5V17c0 1.7 2.7 3 6 3s6-1.3 6-3v-5.5" />
  </svg>
);

const POR_CODIGO: Record<string, (p: P) => ReactElement> = {
  "KG-PA-001": Botiquin,
  "KG-PA-002": Nino,
  "KG-PA-003": Mente,
  "KG-PA-004": Gota,
  "KG-EM-001": Llama,
  "KG-CA-001": Habilitacion,
  "KG-CA-002": Calidad,
};

const POR_FAMILIA: Record<string, (p: P) => ReactElement> = {
  PA: Botiquin,
  EM: Llama,
  CA: Calidad,
};

export function SimboloCurso({ code, ...p }: { code: string } & P) {
  const familia = code.split("-")[1] ?? "";
  const Simbolo = POR_CODIGO[code] ?? POR_FAMILIA[familia] ?? Birrete;
  return <Simbolo {...p} />;
}

/** Número corto del curso (KG-PA-001 → 001), para marcarlo bajo el símbolo. */
export const numeroCurso = (code: string) => code.split("-").pop() ?? code;
