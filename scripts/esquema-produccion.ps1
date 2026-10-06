# ==========================================================================
# KG ACADEMY - Aplicar el esquema a producción (Neon)
# --------------------------------------------------------------------------
# Corre `prisma db push` contra la base de producción con prisma/schema.prisma
# tal como está. Sirve para cambios que SOLO AGREGAN (tablas, columnas,
# índices): si el cambio borrara datos, Prisma se detiene y no aplica nada
# (no se usa --accept-data-loss).
#
#   powershell -ExecutionPolicy Bypass -File scripts\esquema-produccion.ps1
#
# Antes: detener `npm run dev` (Windows bloquea el motor de Prisma).
# La conexión no se muestra ni queda guardada.
# ==========================================================================
param(
  [string]$Proyecto = "broad-lake-83564230"
)

Set-Location (Split-Path $PSScriptRoot -Parent)

Write-Host ""
Write-Host "KG Academy - aplicar el esquema en producción" -ForegroundColor Cyan
Write-Host ""

$url = (npx --yes neonctl@latest connection-string --project-id $Proyecto 2>$null) -join ""
if (-not $url.StartsWith("postgresql://")) {
  Write-Host "No se pudo obtener la conexión de Neon. Corra 'npx neonctl auth' y reintente." -ForegroundColor Red
  exit 1
}

$env:DATABASE_URL = $url
$url = $null

$codigo = 1
try {
  node scripts/proveedor-bd.mjs postgresql | Out-Null
  npx prisma db push --skip-generate
  $codigo = $LASTEXITCODE
}
finally {
  # Pase lo que pase: se borra la conexión y el proyecto vuelve a SQLite.
  Remove-Item Env:DATABASE_URL -ErrorAction SilentlyContinue
  node scripts/proveedor-bd.mjs sqlite | Out-Null
  npx prisma generate | Out-Null
}

Write-Host ""
if ($codigo -eq 0) {
  Write-Host "Listo: la base de producción quedó al día con el esquema." -ForegroundColor Green
} else {
  Write-Host "No se aplicó. Revise el mensaje de arriba." -ForegroundColor Red
}
exit $codigo
