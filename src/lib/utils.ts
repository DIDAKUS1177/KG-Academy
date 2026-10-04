export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function initials(first?: string | null, last?: string | null) {
  return `${(first ?? "").charAt(0)}${(last ?? "").charAt(0)}`.toUpperCase() || "KG";
}

export function fullName(u: { firstName: string; lastName: string }) {
  return `${u.firstName} ${u.lastName}`.trim();
}

/**
 * Las fechas se muestran en hora de Colombia. El servidor (Vercel) corre en
 * UTC: sin la zona horaria, un certificado emitido a las 8 p. m. salía con la
 * fecha del día siguiente.
 */
const ZONA = "America/Bogota";

export function formatDate(d?: Date | string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: ZONA,
  });
}

/** Fecha dd/mm/aaaa (hora de Colombia), la que Excel reconoce como fecha en los CSV. */
export function fechaCorta(d?: Date | string | null) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("es-CO", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: ZONA });
}

export function formatDateTime(d?: Date | string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleString("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: ZONA,
  });
}

export function formatCOP(value: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value);
}

export function pct(n: number) {
  return `${Math.round(n)}%`;
}

export function daysBetween(a: Date, b: Date) {
  return Math.ceil((a.getTime() - b.getTime()) / 86_400_000);
}

export function slugify(text: string) {
  return text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** Genera un código único de verificación de certificado: KG-2026-A7F3C9 */
export function certificateCode(year = new Date().getFullYear()) {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 6; i++) out += alphabet[Math.floor(Math.random() * alphabet.length)];
  return `KG-${year}-${out}`;
}

/**
 * CSV con punto y coma (Excel en español). Excel ejecuta como fórmula un texto
 * que empieza con = + - @: a esos se les antepone un apóstrofo, para que un
 * nombre malicioso cargado en la nómina no se ejecute al abrir el archivo.
 */
export function toCsv(rows: Record<string, unknown>[]): string {
  if (!rows.length) return "Mensaje\nSin registros a la fecha";
  const headers = Object.keys(rows[0]);
  const escape = (v: unknown) => {
    let s = v === null || v === undefined ? "" : String(v);
    if (typeof v === "string" && /^[=+\-@\t\r]/.test(s)) s = `'${s}`;
    return /[",;\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [
    headers.join(";"),
    ...rows.map((r) => headers.map((h) => escape(r[h])).join(";")),
  ].join("\n");
}

/**
 * Fecha límite elegida en un calendario ("2026-10-15"): vale hasta el final de
 * ese día en Colombia. new Date("2026-10-15") sería la medianoche UTC, que en
 * Colombia es el día anterior a las 7 p. m.
 */
export function finDelDia(fecha: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(fecha) ? new Date(`${fecha}T23:59:59.999-05:00`) : new Date(fecha);
}

/** "1 módulo", "3 módulos": número con la palabra en singular o plural. */
export function cantidad(n: number, singular: string, plural: string) {
  return `${n} ${n === 1 ? singular : plural}`;
}
