# ==========================================================================
# KG ACADEMY - Completar los cursos de primeros auxilios en producción (Neon)
# --------------------------------------------------------------------------
# Agrega los módulos 4 a 7 y sus preguntas al Curso Básico (KG-PA-001) y
# carga completos Pediátricos (KG-PA-002) y Psicológicos (KG-PA-003) con su
# evaluación final. No duplica nada y se puede repetir.
#
#   powershell -ExecutionPolicy Bypass -File scripts\completar-cursos-produccion.ps1
#
# Con -Publicar, KG-PA-002 y KG-PA-003 quedan publicados; sin él, en borrador.
# ==========================================================================
param(
  [switch]$Publicar,
  [string]$Proyecto = "broad-lake-83564230"
)

Set-Location (Split-Path $PSScriptRoot -Parent)

Write-Host ""
Write-Host "KG Academy - completar cursos en producción" -ForegroundColor Cyan
Write-Host ""

$url = (npx --yes neonctl@latest connection-string --project-id $Proyecto 2>$null) -join ""
if (-not $url.StartsWith("postgresql://")) {
  Write-Host "No se pudo obtener la conexión de Neon. Corra 'npx neonctl auth' y reintente." -ForegroundColor Red
  exit 1
}

$env:DATABASE_URL = $url
$env:COMPLETAR_PUBLICAR = if ($Publicar) { "1" } else { "0" }
$url = $null

$codigo = 1
try {
  node scripts/proveedor-bd.mjs postgresql | Out-Null
  npx prisma generate | Out-Null
  npx tsx prisma/completar-cursos-produccion.ts
  $codigo = $LASTEXITCODE
}
finally {
  # Pase lo que pase: se borra la conexión y el proyecto vuelve a SQLite.
  Remove-Item Env:DATABASE_URL, Env:COMPLETAR_PUBLICAR -ErrorAction SilentlyContinue
  node scripts/proveedor-bd.mjs sqlite | Out-Null
  npx prisma generate | Out-Null
}

Write-Host ""
if ($codigo -eq 0) {
  Write-Host "Listo. Revise los cursos en https://kg-academy.vercel.app/admin/cursos" -ForegroundColor Green
} else {
  Write-Host "La carga no terminó. Revise el mensaje de arriba." -ForegroundColor Red
}
exit $codigo
