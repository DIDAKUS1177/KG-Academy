/**
 * Cambia el motor de base de datos en prisma/schema.prisma.
 *
 *   node scripts/proveedor-bd.mjs postgresql   -> para desplegar
 *   node scripts/proveedor-bd.mjs sqlite       -> para volver a local
 *
 * Prisma no admite una variable de entorno en `provider`: tiene que ser un
 * valor literal. Por eso se cambia con un script en vez de con configuración.
 *
 * El modelo es portable entre los dos motores: no usa enum nativo, arrays ni
 * tipos propios de PostgreSQL, así que el mismo esquema vale para ambos.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const VALIDOS = ["sqlite", "postgresql"];
const destino = process.argv[2];

if (!VALIDOS.includes(destino)) {
  console.error(`Uso: node scripts/proveedor-bd.mjs <${VALIDOS.join("|")}>`);
  process.exit(1);
}

const raiz = dirname(dirname(fileURLToPath(import.meta.url)));
const ruta = join(raiz, "prisma", "schema.prisma");
const original = readFileSync(ruta, "utf8");

const actual = original.match(/provider\s*=\s*"(sqlite|postgresql)"/)?.[1];
if (!actual) {
  console.error("No se encontró el provider en prisma/schema.prisma");
  process.exit(1);
}

if (actual === destino) {
  console.log(`Sin cambios: el proveedor ya es "${destino}".`);
  process.exit(0);
}

writeFileSync(
  ruta,
  original.replace(/provider\s*=\s*"(sqlite|postgresql)"/, `provider = "${destino}"`),
  "utf8"
);

console.log(`Proveedor cambiado: ${actual} -> ${destino}`);
console.log(
  destino === "postgresql"
    ? "Recuerde apuntar DATABASE_URL a PostgreSQL y ejecutar: npx prisma db push"
    : "DATABASE_URL vuelve a ser el archivo local: file:./kg_academy.db"
);
