# ==========================================================================
# KG ACADEMY - Carga inicial de producción (Neon)
# --------------------------------------------------------------------------
# Crea los catálogos (roles, permisos, parámetros, plantillas, categorías y
# planes) y el primer superadministrador. No borra nada y se puede repetir.
#
# La contraseña se escribe aquí, oculta, y no queda guardada en ningún lado:
# ni en el historial de la terminal ni en archivos.
#
#   powershell -ExecutionPolicy Bypass -File scripts\sembrar-produccion.ps1
#
# Para otro correo o cargo:
#   ... -File scripts\sembrar-produccion.ps1 -Correo otro@correo.com -Cargo "Directora General"
# ==========================================================================
param(
  [string]$Correo = "diealeherbla.dh@gmail.com",
  [string]$Nombre = "Diego Alejandro Hernández Blanco",
  [string]$Cargo = "Administrador de la plataforma",
  [string]$Proyecto = "broad-lake-83564230"
)

Set-Location (Split-Path $PSScriptRoot -Parent)

Write-Host ""
Write-Host "KG Academy - carga inicial de producción" -ForegroundColor Cyan
Write-Host "Superadministrador: $Nombre <$Correo>"
Write-Host ""

$url = (npx --yes neonctl@latest connection-string --project-id $Proyecto 2>$null) -join ""
if (-not $url.StartsWith("postgresql://")) {
  Write-Host "No se pudo obtener la conexión de Neon. Corra 'npx neonctl auth' y reintente." -ForegroundColor Red
  exit 1
}

do {
  $s1 = Read-Host "Contraseña (12 caracteres o más)" -AsSecureString
  $s2 = Read-Host "Repítala" -AsSecureString
  $b1 = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($s1)
  $b2 = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($s2)
  $c1 = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($b1)
  $c2 = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($b2)
  [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($b1)
  [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($b2)
  if ($c1 -ne $c2) { Write-Host "No coinciden. Intente de nuevo." -ForegroundColor Yellow }
  elseif ($c1.Length -lt 12) { Write-Host "Debe tener al menos 12 caracteres." -ForegroundColor Yellow }
} while ($c1 -ne $c2 -or $c1.Length -lt 12)

$env:DATABASE_URL = $url
$env:SEED_ADMIN_EMAIL = $Correo
$env:SEED_ADMIN_PASSWORD = $c1
$env:SEED_ADMIN_NOMBRE = $Nombre
$env:SEED_ADMIN_CARGO = $Cargo
$c1 = $null; $c2 = $null

$codigo = 1
try {
  node scripts/proveedor-bd.mjs postgresql | Out-Null
  npx prisma generate | Out-Null
  npx tsx prisma/seed-produccion.ts
  $codigo = $LASTEXITCODE
}
finally {
  # Pase lo que pase: se borran los secretos y el proyecto vuelve a SQLite.
  Remove-Item Env:SEED_ADMIN_PASSWORD, Env:DATABASE_URL -ErrorAction SilentlyContinue
  node scripts/proveedor-bd.mjs sqlite | Out-Null
  npx prisma generate | Out-Null
}

Write-Host ""
if ($codigo -eq 0) {
  Write-Host "Listo. Ya puede ingresar con $Correo." -ForegroundColor Green
} else {
  Write-Host "La carga no terminó. Revise el mensaje de arriba." -ForegroundColor Red
}
exit $codigo
