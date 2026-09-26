/**
 * Ilustraciones de las lecciones interactivas.
 *
 * Son SVG en línea con la paleta de KG: pesan unos pocos KB, se ven nítidas en
 * cualquier pantalla y el texto que llevan sigue siendo texto (legible por
 * lectores de pantalla y traducible). Cada una lleva <title> y <desc>.
 */
import type { ReactElement } from "react";
import type { IlustracionId } from "@/lib/leccion-interactiva";

const NAVY = "#0A2D4D";
const NAVY_CLARO = "#1B4A73";
const LIMA = "#8FBF16";
const ROJO = "#E5484D";
const NARANJA = "#F59E0B";
const TEXTO = { fontFamily: "inherit", fontWeight: 700 } as const;

function TrianguloFuego() {
  return (
    <svg viewBox="0 0 420 300" role="img" aria-labelledby="t-tri d-tri" className="h-auto w-full">
      <title id="t-tri">Triángulo del fuego</title>
      <desc id="d-tri">Un triángulo cuyos tres lados son calor, oxígeno y combustible, con una llama en el centro.</desc>
      <polygon points="210,28 380,262 40,262" fill="#EDF3F9" stroke={NAVY} strokeWidth="6" strokeLinejoin="round" />
      {/* Llama */}
      <path d="M210 118c26 30 40 52 40 78a40 40 0 0 1-80 0c0-14 6-26 14-36 2 14 10 22 18 24-6-22 0-44 8-66z" fill={NARANJA} />
      <path d="M210 168c12 14 18 24 18 36a18 18 0 0 1-36 0c0-8 4-15 8-20 2 7 6 10 10 11-2-9 0-18 0-27z" fill={ROJO} />
      {/* Etiquetas de los lados */}
      <g transform="rotate(-54 110 140)">
        <rect x="52" y="122" width="116" height="34" rx="17" fill={ROJO} />
        <text x="110" y="145" textAnchor="middle" fill="#fff" fontSize="16" style={TEXTO}>CALOR</text>
      </g>
      <g transform="rotate(54 310 140)">
        <rect x="244" y="122" width="132" height="34" rx="17" fill={NAVY_CLARO} />
        <text x="310" y="145" textAnchor="middle" fill="#fff" fontSize="16" style={TEXTO}>OXÍGENO</text>
      </g>
      <rect x="130" y="270" width="160" height="28" rx="14" fill={LIMA} />
      <text x="210" y="289" textAnchor="middle" fill={NAVY} fontSize="15" style={TEXTO}>COMBUSTIBLE</text>
    </svg>
  );
}

function Paso({ n, x, y, texto }: { n: number; x: number; y: number; texto: string }) {
  return (
    <g>
      <circle cx={x} cy={y} r="15" fill={LIMA} />
      <text x={x} y={y + 5} textAnchor="middle" fill={NAVY} fontSize="15" style={TEXTO}>{n}</text>
      <text x={x + 22} y={y + 5} fill={NAVY} fontSize="14" style={TEXTO}>{texto}</text>
    </g>
  );
}

function ExtintorHaab() {
  return (
    <svg viewBox="0 0 460 300" role="img" aria-labelledby="t-ext d-ext" className="h-auto w-full">
      <title id="t-ext">Técnica HAAB con el extintor</title>
      <desc id="d-ext">Extintor con cuatro pasos numerados: halar el pasador, apuntar a la base del fuego, apretar la manija y barrer de lado a lado.</desc>
      {/* Cilindro */}
      <rect x="70" y="92" width="78" height="176" rx="30" fill={ROJO} />
      <rect x="82" y="150" width="54" height="56" rx="6" fill="#fff" opacity="0.92" />
      <text x="109" y="176" textAnchor="middle" fill={NAVY} fontSize="13" style={TEXTO}>PQS</text>
      <text x="109" y="194" textAnchor="middle" fill={NAVY} fontSize="11" style={TEXTO}>ABC</text>
      {/* Válvula y manijas */}
      <rect x="96" y="66" width="26" height="30" rx="4" fill={NAVY} />
      <path d="M96 70 L52 58 L52 66 L96 80 Z" fill={NAVY_CLARO} />
      <path d="M122 70 L166 50 L168 58 L122 80 Z" fill={NAVY} />
      {/* Pasador */}
      <circle cx="140" cy="84" r="9" fill="none" stroke={NARANJA} strokeWidth="4" />
      {/* Manguera y boquilla */}
      <path d="M100 96 C 30 120, 30 230, 200 238" fill="none" stroke={NAVY} strokeWidth="8" strokeLinecap="round" />
      <rect x="196" y="230" width="34" height="16" rx="4" fill={NAVY} />
      {/* Chorro barriendo la base */}
      <path d="M232 238 Q 300 250 350 262" fill="none" stroke="#CBD5E1" strokeWidth="14" strokeLinecap="round" opacity="0.8" />
      <path d="M318 276 q 30 -12 60 0" fill="none" stroke={LIMA} strokeWidth="4" strokeDasharray="6 6" markerEnd="url(#flecha-haab)" />
      <defs>
        <marker id="flecha-haab" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0 0 L10 5 L0 10 z" fill={LIMA} />
        </marker>
      </defs>
      {/* Fuego */}
      <path d="M350 262c10-30 30-40 26-70 16 18 26 40 22 70z" fill={NARANJA} />
      <path d="M372 262c6-16 18-22 16-40 10 12 14 24 10 40z" fill={ROJO} />
      {/* Distancia */}
      <line x1="230" y1="206" x2="350" y2="206" stroke={NAVY_CLARO} strokeWidth="2" strokeDasharray="4 4" />
      <text x="290" y="200" textAnchor="middle" fill={NAVY_CLARO} fontSize="12" style={TEXTO}>2 a 3 metros</text>
      {/* Pasos */}
      <Paso n={1} x={196} y={34} texto="Halar el pasador" />
      <Paso n={2} x={250} y={78} texto="Apuntar a la base" />
      <Paso n={3} x={250} y={118} texto="Apretar la manija" />
      <Paso n={4} x={250} y={158} texto="Barrer de lado a lado" />
    </svg>
  );
}

function RutaEvacuacion() {
  return (
    <svg viewBox="0 0 460 300" role="img" aria-labelledby="t-ruta d-ruta" className="h-auto w-full">
      <title id="t-ruta">Ruta de evacuación</title>
      <desc id="d-ruta">Plano de un piso con la ruta señalizada hacia la escalera, el ascensor tachado y el punto de encuentro afuera.</desc>
      <rect x="20" y="24" width="300" height="250" rx="12" fill="#F6F8FB" stroke={NAVY} strokeWidth="4" />
      {/* Oficinas */}
      <rect x="36" y="40" width="120" height="90" rx="6" fill="#fff" stroke="#A9C4DD" strokeWidth="2" />
      <rect x="176" y="40" width="128" height="90" rx="6" fill="#fff" stroke="#A9C4DD" strokeWidth="2" />
      <rect x="36" y="168" width="120" height="90" rx="6" fill="#fff" stroke="#A9C4DD" strokeWidth="2" />
      {/* Usted está aquí */}
      <circle cx="96" cy="86" r="10" fill={NAVY} />
      <text x="96" y="116" textAnchor="middle" fill={NAVY} fontSize="11" style={TEXTO}>Usted</text>
      {/* Ascensor tachado */}
      <rect x="190" y="176" width="46" height="60" rx="4" fill="#fff" stroke="#94A3B8" strokeWidth="2" />
      <text x="213" y="212" textAnchor="middle" fill="#94A3B8" fontSize="11" style={TEXTO}>ASC.</text>
      <line x1="184" y1="170" x2="242" y2="242" stroke={ROJO} strokeWidth="5" strokeLinecap="round" />
      {/* Escalera */}
      <rect x="252" y="176" width="52" height="82" rx="4" fill={LIMA} opacity="0.25" stroke={LIMA} strokeWidth="2" />
      {[0, 1, 2, 3, 4].map((i) => (
        <line key={i} x1="258" y1={188 + i * 14} x2="298" y2={188 + i * 14} stroke={NAVY} strokeWidth="2" />
      ))}
      {/* Ruta */}
      <path d="M96 96 V150 H278 V172" fill="none" stroke={LIMA} strokeWidth="6" strokeDasharray="12 8" strokeLinecap="round" />
      <path d="M270 162 l8 12 l8 -12" fill="none" stroke={LIMA} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      {/* Punto de encuentro */}
      <path d="M320 216 H372" stroke={LIMA} strokeWidth="6" strokeDasharray="12 8" strokeLinecap="round" />
      <rect x="376" y="160" width="66" height="104" rx="10" fill={LIMA} />
      <circle cx="398" cy="196" r="7" fill={NAVY} />
      <circle cx="420" cy="196" r="7" fill={NAVY} />
      <path d="M388 222 q10 -14 20 0 M410 222 q10 -14 20 0" fill="none" stroke={NAVY} strokeWidth="5" strokeLinecap="round" />
      <text x="409" y="246" textAnchor="middle" fill={NAVY} fontSize="10" style={TEXTO}>PUNTO DE</text>
      <text x="409" y="258" textAnchor="middle" fill={NAVY} fontSize="10" style={TEXTO}>ENCUENTRO</text>
    </svg>
  );
}

function PresionDirecta() {
  return (
    <svg viewBox="0 0 440 280" role="img" aria-labelledby="t-pres d-pres" className="h-auto w-full">
      <title id="t-pres">Presión directa sobre la herida</title>
      <desc id="d-pres">Un antebrazo con una herida cubierta por una gasa, y dos manos que presionan hacia abajo con fuerza.</desc>
      {/* Antebrazo */}
      <rect x="30" y="170" width="380" height="70" rx="35" fill="#F3C9A9" />
      <ellipse cx="220" cy="204" rx="34" ry="12" fill={ROJO} />
      {/* Gasa */}
      <rect x="160" y="150" width="120" height="44" rx="6" fill="#fff" stroke="#CBD5E1" strokeWidth="2" />
      {[0, 1, 2].map((i) => (
        <line key={i} x1="172" y1={162 + i * 11} x2="268" y2={162 + i * 11} stroke="#E2E8F0" strokeWidth="2" />
      ))}
      {/* Manos */}
      <rect x="172" y="104" width="96" height="44" rx="20" fill={NAVY_CLARO} />
      <rect x="182" y="72" width="76" height="40" rx="18" fill={NAVY} />
      {/* Flechas de presión */}
      {[150, 290].map((x) => (
        <g key={x}>
          <line x1={x} y1="54" x2={x} y2="124" stroke={LIMA} strokeWidth="6" strokeLinecap="round" />
          <path d={`M${x - 12} 112 l12 16 l12 -16`} fill="none" stroke={LIMA} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      ))}
      <text x="220" y="36" textAnchor="middle" fill={NAVY} fontSize="15" style={TEXTO}>Presión firme y continua</text>
      <text x="220" y="268" textAnchor="middle" fill={NAVY_CLARO} fontSize="13" style={TEXTO}>Si la gasa se empapa, ponga otra encima: no la retire</text>
    </svg>
  );
}

function Torniquete() {
  return (
    <svg viewBox="0 0 460 280" role="img" aria-labelledby="t-tor d-tor" className="h-auto w-full">
      <title id="t-tor">Ubicación del torniquete</title>
      <desc id="d-tor">Un brazo con una herida en el antebrazo. El torniquete va entre cinco y siete centímetros por encima de la herida, nunca sobre el codo.</desc>
      {/* Brazo: hombro a mano */}
      <path d="M20 120 H200 Q226 120 236 132 L256 150 Q264 158 276 158 H420 Q440 158 440 178 Q440 198 420 198 H276 Q262 198 252 188 L232 170 Q222 160 200 160 H20 Z" fill="#F3C9A9" />
      {/* Codo */}
      <circle cx="244" cy="160" r="22" fill="none" stroke={ROJO} strokeWidth="3" strokeDasharray="5 5" />
      <path d="M232 148 l24 24 M256 148 l-24 24" stroke={ROJO} strokeWidth="4" strokeLinecap="round" />
      <text x="244" y="228" textAnchor="middle" fill={ROJO} fontSize="12" style={TEXTO}>Nunca sobre</text>
      <text x="244" y="243" textAnchor="middle" fill={ROJO} fontSize="12" style={TEXTO}>la articulación</text>
      {/* Herida */}
      <ellipse cx="372" cy="178" rx="16" ry="8" fill={ROJO} />
      <text x="372" y="226" textAnchor="middle" fill={NAVY} fontSize="12" style={TEXTO}>Herida</text>
      {/* Torniquete */}
      <rect x="298" y="150" width="20" height="56" rx="4" fill={NAVY} />
      <rect x="302" y="140" width="12" height="18" rx="3" fill={LIMA} />
      {/* Medida */}
      <line x1="308" y1="112" x2="372" y2="112" stroke={LIMA} strokeWidth="3" />
      <line x1="308" y1="104" x2="308" y2="120" stroke={LIMA} strokeWidth="3" />
      <line x1="372" y1="104" x2="372" y2="120" stroke={LIMA} strokeWidth="3" />
      <text x="340" y="96" textAnchor="middle" fill={NAVY} fontSize="13" style={TEXTO}>5 a 7 cm</text>
      {/* Reloj */}
      <g transform="translate(92 44)">
        <circle r="26" fill="#fff" stroke={NAVY} strokeWidth="4" />
        <path d="M0 -14 V0 L10 8" fill="none" stroke={NAVY} strokeWidth="4" strokeLinecap="round" />
        <text x="40" y="-4" fill={NAVY} fontSize="14" style={TEXTO}>Anote la hora</text>
        <text x="40" y="14" fill={NAVY_CLARO} fontSize="12" style={TEXTO}>y no lo afloje</text>
      </g>
    </svg>
  );
}

const MAPA: Record<IlustracionId, () => ReactElement> = {
  "triangulo-fuego": TrianguloFuego,
  "extintor-haab": ExtintorHaab,
  "ruta-evacuacion": RutaEvacuacion,
  "presion-directa": PresionDirecta,
  torniquete: Torniquete,
};

export function Ilustracion({ id, className }: { id: IlustracionId; className?: string }) {
  const Dibujo = MAPA[id];
  return (
    <figure className={`overflow-hidden rounded-2xl border border-navy-100 bg-white p-4 ${className ?? ""}`}>
      <Dibujo />
    </figure>
  );
}
