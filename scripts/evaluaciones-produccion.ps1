# ==========================================================================
# KG ACADEMY - Evaluaciones finales en producción (Neon)
# --------------------------------------------------------------------------
# Carga las evaluaciones finales de prisma/evaluaciones.ts en los cursos que
# no tienen una. No modifica evaluaciones existentes y se puede repetir.
# Para publicar además un curso: -Publicar KG-PA-001
#
#   powershell -ExecutionPolicy Bypass -File scripts\evaluaciones-produccion.ps1
# ==========================================================================
param(
  [string]$Proyecto = "broad-lake-83564230",
  [string]$Publicar = ""
)

Set-Location (Split-Path $PSScriptRoot -Parent)

Write-Host ""
Write-Host "KG Academy - evaluaciones finales en producción" -ForegroundColor Cyan
Write-Host ""

$url = (npx --yes neonctl@latest connection-string --project-id $Proyecto 2>$null) -join ""
if (-not $url.StartsWith("postgresql://")) {
  Write-Host "No se pudo obtener la conexión de Neon. Corra 'npx neonctl auth' y reintente." -ForegroundColor Red
  exit 1
}

$env:DATABASE_URL = $url
$env:PUBLICAR = $Publicar
$url = $null

$codigo = 1
try {
  node scripts/proveedor-bd.mjs postgresql | Out-Null
  npx prisma generate | Out-Null
  npx tsx prisma/evaluaciones-produccion.ts
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
  Write-Host "Listo. Revise las evaluaciones en Administración → Evaluaciones." -ForegroundColor Green
} else {
  Write-Host "La carga no terminó. Revise el mensaje de arriba." -ForegroundColor Red
}
exit $codigo
