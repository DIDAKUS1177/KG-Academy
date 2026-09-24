# ==========================================================================
# KG ACADEMY - Cursos interactivos (modo juego) en producción (Neon)
# --------------------------------------------------------------------------
# Carga los dos cursos interactivos de prueba EN BORRADOR, para que KG los
# revise: solo los abren los roles de KG. No borra ni modifica nada y se
# puede repetir.
#
#   powershell -ExecutionPolicy Bypass -File scripts\cursos-interactivos-produccion.ps1
# ==========================================================================
param(
  [string]$Proyecto = "broad-lake-83564230"
)

Set-Location (Split-Path $PSScriptRoot -Parent)

Write-Host ""
Write-Host "KG Academy - cursos interactivos en producción" -ForegroundColor Cyan
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
  npx prisma generate | Out-Null
  npx tsx prisma/cursos-interactivos-produccion.ts
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
  Write-Host "Listo. Los cursos quedan en borrador: solo los roles de KG pueden abrirlos." -ForegroundColor Green
} else {
  Write-Host "La carga no terminó. Revise el mensaje de arriba." -ForegroundColor Red
}
exit $codigo
