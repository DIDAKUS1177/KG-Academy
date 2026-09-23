/**
 * ESCENAS PARA LA CACERÍA DE RIESGOS
 *
 * Dibujos propios en un plano de 800 x 450. Cada escena esconde peligros que
 * la lección declara por coordenadas (ver prisma/cursos-interactivos.ts), así
 * que si se mueve un objeto aquí hay que mover también su objetivo allá.
 *
 * Oficina: cable de la cafetera (100,318) · multitomas en cadena (300,388) ·
 *   calentador junto al papel (525,372) · extintor tapado (622,232) ·
 *   salida bloqueada (730,292).
 * Taller: carga suspendida (640,140) · máquina encendida (390,215) ·
 *   aceite derramado (230,395) · extensión pelada (118,418) ·
 *   láminas sueltas (505,412).
 */
import type { EscenaId } from "@/lib/leccion-interactiva";

export function Escena({ id }: { id: EscenaId }) {
  return id === "oficina" ? <Oficina /> : <Taller />;
}

export const TITULO_ESCENA: Record<EscenaId, string> = {
  oficina: "Oficina administrativa, segundo piso",
  taller: "Taller de mantenimiento, zona de corte",
};

function Chispa({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g className="kg-chispa" transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 -12 L3 -3 L12 0 L3 3 L0 12 L-3 3 L-12 0 L-3 -3 Z" fill="#FFD23F" />
      <circle r="3" fill="#fff" />
    </g>
  );
}

function Caja({ x, y, w, h, tono = "#C8955A" }: { x: number; y: number; w: number; h: number; tono?: string }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="2" fill={tono} stroke="#8A6236" strokeWidth="1.5" />
      <rect x={x + w / 2 - 6} y={y} width="12" height={h} fill="#E2C08F" opacity=".7" />
      <line x1={x} y1={y + 8} x2={x + w} y2={y + 8} stroke="#8A6236" strokeWidth="1" opacity=".5" />
    </g>
  );
}

/* ================================ OFICINA ================================ */

function Oficina() {
  return (
    <g>
      {/* Muro y piso */}
      <rect width="800" height="330" fill="#EAF1F8" />
      <rect y="330" width="800" height="120" fill="#C9D6E2" />
      {[380, 410, 440].map((y) => (
        <line key={y} x1="0" y1={y} x2="800" y2={y} stroke="#B6C5D3" strokeWidth="1.5" />
      ))}
      <rect y="322" width="800" height="10" fill="#D5E0EA" />

      {/* Ventana */}
      <rect x="196" y="46" width="148" height="128" rx="4" fill="#fff" />
      <rect x="204" y="54" width="132" height="112" fill="#BFE3F7" />
      <ellipse cx="250" cy="92" rx="26" ry="10" fill="#fff" opacity=".9" />
      <ellipse cx="300" cy="120" rx="20" ry="8" fill="#fff" opacity=".8" />
      <line x1="270" y1="54" x2="270" y2="166" stroke="#fff" strokeWidth="5" />

      {/* Afiche y reloj */}
      <rect x="52" y="58" width="96" height="116" rx="6" fill="#0A2D4D" />
      <text x="100" y="98" textAnchor="middle" fontSize="20" fontWeight="800" fill="#A5CE30" fontFamily="sans-serif">SST</text>
      <text x="100" y="122" textAnchor="middle" fontSize="10" fill="#fff" fontFamily="sans-serif">Prevenir</text>
      <text x="100" y="136" textAnchor="middle" fontSize="10" fill="#fff" fontFamily="sans-serif">es cuidar</text>
      <circle cx="450" cy="78" r="26" fill="#fff" stroke="#0A2D4D" strokeWidth="4" />
      <line x1="450" y1="78" x2="450" y2="62" stroke="#0A2D4D" strokeWidth="3" strokeLinecap="round" />
      <line x1="450" y1="78" x2="462" y2="84" stroke="#0A2D4D" strokeWidth="3" strokeLinecap="round" />

      {/* Mesita con cafetera y cable dañado */}
      <rect x="28" y="266" width="126" height="10" rx="2" fill="#8A6236" />
      <rect x="36" y="276" width="7" height="56" fill="#6E4C29" />
      <rect x="138" y="276" width="7" height="56" fill="#6E4C29" />
      <rect x="62" y="206" width="52" height="60" rx="6" fill="#2B3A4A" />
      <rect x="70" y="232" width="36" height="28" rx="4" fill="#9FC7E0" opacity=".8" />
      <rect x="70" y="248" width="36" height="12" rx="2" fill="#5A3A1E" />
      <circle cx="106" cy="216" r="3" fill="#E4572E" />
      <path d="M100 266 C 98 290, 104 300, 100 312" stroke="#222" strokeWidth="4" fill="none" />
      <path d="M100 324 C 96 340, 120 350, 150 356 L 176 356" stroke="#222" strokeWidth="4" fill="none" />
      <path d="M97 312 l -4 8 M100 312 l 1 10 M103 312 l 5 7" stroke="#D98B2B" strokeWidth="2" strokeLinecap="round" />
      <Chispa x={100} y={318} s={0.8} />
      <rect x="170" y="346" width="18" height="22" rx="3" fill="#fff" stroke="#9AA9B7" />

      {/* Planta */}
      <path d="M168 330 q -18 -40 4 -70 q 6 30 -4 70 M172 330 q 22 -30 10 -64 q -12 28 -10 64" fill="#5FA14A" />
      <rect x="152" y="330" width="40" height="44" rx="4" fill="#E4572E" opacity=".85" />

      {/* Escritorio, computador y papeles */}
      <rect x="196" y="248" width="262" height="14" rx="3" fill="#8A6236" />
      <rect x="206" y="262" width="10" height="72" fill="#6E4C29" />
      <rect x="438" y="262" width="10" height="72" fill="#6E4C29" />
      <rect x="268" y="166" width="104" height="70" rx="5" fill="#2B3A4A" />
      <rect x="275" y="173" width="90" height="54" rx="2" fill="#6FB7E6" />
      <rect x="312" y="236" width="16" height="12" fill="#2B3A4A" />
      <rect x="258" y="240" width="70" height="6" rx="2" fill="#9AA9B7" />
      <rect x="392" y="230" width="44" height="18" fill="#fff" stroke="#C9D6E2" />
      <rect x="396" y="224" width="40" height="8" fill="#F5F8FB" stroke="#C9D6E2" />

      {/* Multitomas en cadena bajo el escritorio */}
      <path d="M300 262 C 300 300, 280 330, 282 380" stroke="#333" strokeWidth="3" fill="none" />
      <path d="M318 262 C 322 300, 340 340, 336 380" stroke="#333" strokeWidth="3" fill="none" />
      <path d="M262 390 C 230 392, 230 372, 200 368" stroke="#333" strokeWidth="3" fill="none" />
      <rect x="250" y="380" width="70" height="16" rx="4" fill="#F4F4F4" stroke="#9AA9B7" />
      <rect x="322" y="382" width="58" height="14" rx="4" fill="#F4F4F4" stroke="#9AA9B7" />
      <path d="M320 388 L 322 388" stroke="#333" strokeWidth="3" />
      {[258, 272, 286, 300, 330, 344, 358].map((x) => (
        <rect key={x} x={x} y={x < 320 ? 370 : 372} width="9" height="12" rx="1.5" fill="#333" />
      ))}
      <Chispa x={300} y={378} s={0.7} />

      {/* Calentador junto a papelera y cartón */}
      <rect x="468" y="338" width="60" height="64" rx="8" fill="#D5DDE4" stroke="#8C9AA7" strokeWidth="2" />
      {[350, 362, 374, 386].map((y) => (
        <rect key={y} x="476" y={y} width="44" height="5" rx="2" fill="#FF7A2F" className="kg-brillo" />
      ))}
      <rect x="532" y="358" width="40" height="46" rx="3" fill="#9AA9B7" />
      <path d="M534 360 l 8 -16 l 8 12 l 7 -18 l 6 16 l 7 -8 v 14 z" fill="#fff" stroke="#C9D6E2" />
      <Caja x={576} y={366} w={40} h={38} />

      {/* Extintor tapado por cajas */}
      <rect x="608" y="190" width="30" height="74" rx="10" fill="#D7263D" />
      <rect x="612" y="180" width="22" height="12" rx="3" fill="#333" />
      <text x="623" y="232" textAnchor="middle" fontSize="8" fontWeight="800" fill="#fff" fontFamily="sans-serif">PQS</text>
      <Caja x={590} y={236} w={64} h={48} />
      <Caja x={594} y={284} w={58} h={46} tono="#B98249" />

      {/* Salida de emergencia bloqueada */}
      <rect x="676" y="118" width="108" height="214" fill="#fff" />
      <rect x="684" y="126" width="92" height="206" fill="#9FB4C7" />
      <circle cx="764" cy="232" r="5" fill="#0A2D4D" />
      <rect x="690" y="92" width="80" height="22" rx="3" fill="#1E9E4A" />
      <text x="730" y="108" textAnchor="middle" fontSize="12" fontWeight="800" fill="#fff" fontFamily="sans-serif">SALIDA</text>
      <Caja x={686} y={262} w={52} h={70} />
      <Caja x={732} y={286} w={46} h={46} tono="#B98249" />
      <rect x="700" y="236" width="70" height="8" rx="2" fill="#5A6C7D" />
      <rect x="708" y="244" width="6" height="18" fill="#5A6C7D" />
      <rect x="756" y="244" width="6" height="18" fill="#5A6C7D" />
    </g>
  );
}

/* ================================= TALLER ================================ */

function Taller() {
  return (
    <g>
      {/* Muro, piso y demarcación */}
      <rect width="800" height="300" fill="#E4E9ED" />
      <rect y="300" width="800" height="150" fill="#B8C2C9" />
      <rect y="296" width="800" height="8" fill="#9AA6AF" />
      <path d="M0 440 L800 440" stroke="#F2C230" strokeWidth="8" strokeDasharray="30 18" />
      <rect x="236" y="120" width="10" height="176" fill="#CDD5DB" />

      {/* Ventana alta */}
      <rect x="40" y="30" width="170" height="60" rx="3" fill="#fff" />
      <rect x="46" y="36" width="158" height="48" fill="#C9E6F5" />
      <line x1="125" y1="36" x2="125" y2="84" stroke="#fff" strokeWidth="4" />

      {/* Botiquín */}
      <rect x="84" y="126" width="68" height="54" rx="6" fill="#fff" stroke="#C9D1D8" strokeWidth="2" />
      <rect x="112" y="136" width="12" height="34" fill="#D7263D" />
      <rect x="101" y="147" width="34" height="12" fill="#D7263D" />

      {/* Polipasto con carga suspendida */}
      <rect x="470" y="14" width="300" height="12" fill="#5A6C7D" />
      <rect x="626" y="26" width="28" height="18" rx="3" fill="#F2C230" />
      <line x1="640" y1="44" x2="640" y2="104" stroke="#555" strokeWidth="4" strokeDasharray="5 3" />
      <path d="M632 104 h 16 l -8 10 z" fill="#555" />
      <g className="kg-balanceo">
        <rect x="596" y="114" width="88" height="54" rx="3" fill="#7A8793" stroke="#4E5A64" strokeWidth="2" />
        <line x1="596" y1="132" x2="684" y2="132" stroke="#4E5A64" strokeWidth="2" />
        <line x1="596" y1="150" x2="684" y2="150" stroke="#4E5A64" strokeWidth="2" />
      </g>

      {/* Máquina de corte encendida */}
      <rect x="300" y="226" width="186" height="100" rx="6" fill="#4F6D7A" />
      <rect x="290" y="214" width="206" height="16" rx="3" fill="#6C8A97" />
      <g className="kg-girar" style={{ transformOrigin: "390px 206px" }}>
        <circle cx="390" cy="206" r="30" fill="#C9D1D8" stroke="#8C99A3" strokeWidth="3" />
        {Array.from({ length: 12 }, (_, i) => (
          <path key={i} d="M390 172 l5 8 h-10 z" fill="#8C99A3" transform={`rotate(${i * 30} 390 206)`} />
        ))}
        <circle cx="390" cy="206" r="6" fill="#4E5A64" />
      </g>
      <rect x="350" y="206" width="80" height="10" fill="#6C8A97" />
      <circle cx="462" cy="254" r="8" fill="#FF3B30" className="kg-brillo" />
      <text x="462" y="278" textAnchor="middle" fontSize="9" fontWeight="800" fill="#fff" fontFamily="sans-serif">ON</text>
      <rect x="316" y="246" width="60" height="30" rx="3" fill="#F2C230" />
      <text x="346" y="266" textAnchor="middle" fontSize="10" fontWeight="800" fill="#1F2A33" fontFamily="sans-serif">PELIGRO</text>
      <rect x="310" y="326" width="16" height="30" fill="#3B525C" />
      <rect x="460" y="326" width="16" height="30" fill="#3B525C" />

      {/* Aceite derramado y tarro volcado */}
      <ellipse cx="232" cy="396" rx="72" ry="18" fill="#3A2A12" opacity=".85" />
      <ellipse cx="210" cy="391" rx="22" ry="4" fill="#fff" opacity=".25" />
      <g transform="rotate(-72 168 380)">
        <rect x="150" y="364" width="34" height="42" rx="4" fill="#2F6F9F" />
        <rect x="160" y="358" width="14" height="8" fill="#1F4F73" />
      </g>

      {/* Extensión eléctrica pelada */}
      <rect x="20" y="266" width="18" height="24" rx="3" fill="#fff" stroke="#9AA6AF" />
      <path d="M29 290 C 30 340, 60 400, 108 416 M130 420 C 200 430, 300 432, 330 426" stroke="#E07A1F" strokeWidth="5" fill="none" />
      <path d="M108 416 l 8 -2 M110 420 l 9 2 M112 424 l 6 5" stroke="#D98B2B" strokeWidth="2.5" strokeLinecap="round" />
      <Chispa x={119} y={418} s={0.85} />

      {/* Trabajador herido (el paciente) */}
      <g>
        <ellipse cx="610" cy="384" rx="70" ry="10" fill="#000" opacity=".12" />
        <rect x="572" y="330" width="62" height="52" rx="16" fill="#2E5E8C" />
        <rect x="600" y="368" width="70" height="18" rx="9" fill="#2E5E8C" />
        <rect x="660" y="366" width="20" height="22" rx="6" fill="#1F2A33" />
        <circle cx="596" cy="312" r="18" fill="#E0B48A" />
        <path d="M576 306 a 20 18 0 0 1 40 0 z" fill="#F2C230" />
        <rect x="540" y="340" width="44" height="14" rx="7" fill="#2E5E8C" transform="rotate(20 562 347)" />
        <rect x="528" y="352" width="18" height="12" rx="6" fill="#E0B48A" />
        <rect x="546" y="347" width="16" height="12" rx="3" fill="#B3261E" transform="rotate(20 554 353)" />
      </g>

      {/* Láminas cortantes en el piso */}
      <path d="M470 404 l 30 -8 l 12 12 l -34 10 z" fill="#C9D1D8" stroke="#7D8A94" strokeWidth="1.5" />
      <path d="M506 414 l 28 -4 l 4 12 l -30 4 z" fill="#DDE3E8" stroke="#7D8A94" strokeWidth="1.5" />
      <path d="M492 424 l 20 2 l -6 10 l -18 -4 z" fill="#C9D1D8" stroke="#7D8A94" strokeWidth="1.5" />

      {/* Caja de herramientas */}
      <rect x="712" y="364" width="66" height="36" rx="4" fill="#D7263D" />
      <rect x="730" y="354" width="30" height="12" rx="4" fill="none" stroke="#8E1B2B" strokeWidth="4" />
      <rect x="712" y="378" width="66" height="4" fill="#8E1B2B" />
    </g>
  );
}
