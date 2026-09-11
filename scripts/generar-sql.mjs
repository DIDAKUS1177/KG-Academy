/**
 * Genera el SQL de creación de las 44 tablas a partir del esquema de Prisma,
 * para cada motor soportado:
 *
 *   docs/sql/kg_academy_postgresql.sql   producción
 *   docs/sql/kg_academy_sqlite.sql       desarrollo
 *
 *   node scripts/generar-sql.mjs
 *
 * Sirve para quien quiera crear la base a mano, revisar el DDL antes de
 * aplicarlo, o entregárselo a un administrador de base de datos. El camino
 * normal sigue siendo `prisma db push`, que hace exactamente esto por dentro.
 *
 * Prisma exige que `provider` sea un literal en el esquema, así que el script
 * lo cambia, genera, y lo devuelve a como estaba, pase lo que pase.
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const raiz = dirname(dirname(fileURLToPath(import.meta.url)));
const esquema = join(raiz, "prisma", "schema.prisma");
const salida = join(raiz, "docs", "sql");
const original = readFileSync(esquema, "utf8");
const proveedorOriginal = original.match(/provider\s*=\s*"(sqlite|postgresql)"/)?.[1];

if (!proveedorOriginal) {
  console.error("No se encontró el provider en prisma/schema.prisma");
  process.exit(1);
}

const CABECERA = (motor) => `-- ============================================================================
-- KG ACADEMY - Creación de la base de datos (${motor})
-- ----------------------------------------------------------------------------
-- Generado desde prisma/schema.prisma con \`node scripts/generar-sql.mjs\`.
-- NO editar a mano: cualquier cambio va en el esquema de Prisma y se regenera.
--
-- 44 tablas en 11 dominios: identidad y acceso, empresas, planes, catálogo,
-- matrícula y progreso, evaluaciones, certificados, asignación empresarial,
-- comercial, notificaciones y gamificación, sistema.
--
-- Desarrollado por Diego Alejandro Hernández Blanco para KG Gestión Integral S.A.S.
-- ============================================================================

`;

function generar(proveedor, archivo) {
  writeFileSync(
    esquema,
    original.replace(/provider\s*=\s*"(sqlite|postgresql)"/, `provider = "${proveedor}"`),
    "utf8"
  );
  // Se invoca el ejecutable de Prisma directamente con node, sin pasar por
  // npx ni por el intérprete de comandos: la ruta del proyecto tiene espacios
  // ("1. Carpetas...") y el shell de Windows la partía en varios argumentos.
  const sql = execFileSync(
    process.execPath,
    [
      join(raiz, "node_modules", "prisma", "build", "index.js"),
      "migrate", "diff", "--from-empty",
      "--to-schema-datamodel", "prisma/schema.prisma",
      "--script",
    ],
    { cwd: raiz, encoding: "utf8", stdio: ["ignore", "pipe", "inherit"] }
  );
  mkdirSync(salida, { recursive: true });
  const destino = join(salida, archivo);
  writeFileSync(destino, CABECERA(proveedor) + sql, "utf8");
  const tablas = (sql.match(/CREATE TABLE/g) ?? []).length;
  console.log(`${proveedor.padEnd(11)} -> docs/sql/${archivo}  (${tablas} tablas)`);
}

try {
  generar("postgresql", "kg_academy_postgresql.sql");
  generar("sqlite", "kg_academy_sqlite.sql");
} finally {
  // Pase lo que pase, el esquema vuelve a su proveedor original.
  writeFileSync(esquema, original, "utf8");
}
