# ==========================================================================
# KG ACADEMY - Publicar cursos en producción (Neon)
# --------------------------------------------------------------------------
# Publica los cursos indicados con la misma regla del constructor: exige la
# evaluación final publicada con preguntas (prisma/publicar-cursos.ts).
#
#   powershell -ExecutionPolicy Bypass -File scripts\publicar-cursos-produccion.ps1 -Codigos KG-CA-001,KG-CA-002
#
# Antes: detener `npm run dev` (Windows bloquea el motor de Prisma).
# La conexión no se muestra ni queda guardada.
# ==========================================================================
param(
  [Parameter(Mandatory = $true)][string]$Codigos,
  [string]$Proyecto = "broad-lake-83564230"
)

Set-Location (Split-Path $PSScriptRoot -Parent)

Write-Host ""
Write-Host "KG Academy - publicar cursos en producción: $Codigos" -ForegroundColor Cyan
Write-Host ""

$url = (npx --yes neonctl@latest connection-string --project-id $Proyecto 2>$null) -join ""
if (-not $url.StartsWith("postgresql://")) {
  Write-Host "No se pudo obtener la conexión de Neon. Corra 'npx neonctl auth' y reintente." -ForegroundColor Red
  exit 1
}

$env:DATABASE_URL = $url
$env:PUBLICAR_CODIGOS = $Codigos
$url = $null

$codigo = 1
try {
  node scripts/proveedor-bd.mjs postgresql | Out-Null
  npx prisma generate | Out-Null
  npx tsx prisma/publicar-cursos.ts
  $codigo = $LASTEXITCODE
}
finally {
  # Pase lo que pase: se borra la conexión y el proyecto vuelve a SQLite.
  Remove-Item Env:DATABASE_URL, Env:PUBLICAR_CODIGOS -ErrorAction SilentlyContinue
  node scripts/proveedor-bd.mjs sqlite | Out-Null
  npx prisma generate | Out-Null
}

Write-Host ""
if ($codigo -eq 0) {
  Write-Host "Listo. Revise los cursos en https://kg-academy.vercel.app/admin/cursos" -ForegroundColor Green
} else {
  Write-Host "No terminó. Revise el mensaje de arriba." -ForegroundColor Red
}
exit $codigo
