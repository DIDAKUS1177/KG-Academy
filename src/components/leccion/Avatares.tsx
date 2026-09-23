/** Personajes guía de las lecciones interactivas (dibujos propios, 64 x 64). */

export type AvatarId = "brigadista" | "paramedico";

export function Avatar({ id, className = "h-12 w-12" }: { id: AvatarId; className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <circle cx="32" cy="32" r="32" fill={id === "brigadista" ? "#0A2D4D" : "#12395E"} />
      {/* Cuerpo */}
      <path d="M10 64 C 12 48, 22 44, 32 44 C 42 44, 52 48, 54 64 Z" fill={id === "brigadista" ? "#E4572E" : "#F4F7FA"} />
      {id === "brigadista" ? (
        <>
          <rect x="14" y="54" width="36" height="4" fill="#F2F2F2" />
          <rect x="29" y="44" width="6" height="20" fill="#F2F2F2" opacity=".35" />
        </>
      ) : (
        <>
          <rect x="29" y="50" width="6" height="12" fill="#D7263D" />
          <rect x="26" y="53" width="12" height="6" fill="#D7263D" />
        </>
      )}
      {/* Cara */}
      <rect x="28" y="36" width="8" height="9" fill="#C9956A" />
      <circle cx="32" cy="28" r="12" fill="#E0B48A" />
      <circle cx="27.5" cy="29" r="1.6" fill="#1F2A33" />
      <circle cx="36.5" cy="29" r="1.6" fill="#1F2A33" />
      <path d="M27.5 34 q 4.5 3.5 9 0" stroke="#8A4B2B" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      {id === "brigadista" ? (
        <>
          {/* Casco de brigada */}
          <path d="M18 25 C 18 12, 46 12, 46 25 Z" fill="#F2C230" />
          <rect x="15" y="23" width="34" height="4" rx="2" fill="#E0A800" />
          <rect x="30" y="12" width="4" height="12" rx="2" fill="#E0A800" />
        </>
      ) : (
        <>
          {/* Gorra de paramédico */}
          <path d="M20 24 C 20 13, 44 13, 44 24 Z" fill="#D7263D" />
          <path d="M40 23 h 10 a 2 2 0 0 1 0 4 h -12 z" fill="#A81D2E" />
          <rect x="30" y="15" width="4" height="8" fill="#fff" />
          <rect x="28" y="17" width="8" height="4" fill="#fff" />
        </>
      )}
    </svg>
  );
}
