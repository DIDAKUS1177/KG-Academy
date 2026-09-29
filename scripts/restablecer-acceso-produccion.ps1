# ==========================================================================
# KG ACADEMY - Restablecer el acceso a cuentas de producción (Neon)
# --------------------------------------------------------------------------
# Deja las cuentas indicadas con UNA contraseña temporal que usted escribe
# aquí, oculta; no queda guardada en ningún lado. Al iniciar sesión, la
# plataforma obliga a cada cuenta a cambiarla.
#
# Sin parámetros restablece las 3 cuentas de prueba y la de Diego:
#   powershell -ExecutionPolicy Bypass -File scripts\restablecer-acceso-produccion.ps1
#
# Para otras cuentas:
#   ... -File scripts\restablecer-acceso-produccion.ps1 -Correos "correo1@x.com,correo2@y.com"
# ==========================================================================
param(
  [string]$Correos = "diealeherbla.dh@gmail.com,admin.prueba@kgacademy.test,empresa.prueba@kgacademy.test,estudiante.prueba@kgacademy.test",
  [string]$Proyecto = "broad-lake-83564230"
)

Set-Location (Split-Path $PSScriptRoot -Parent)

Write-Host ""
Write-Host "KG Academy - restablecer acceso en producción" -ForegroundColor Cyan
Write-Host "Cuentas:"
$Correos.Split(",") | ForEach-Object { Write-Host "  - $($_.Trim())" }
Write-Host ""

$url = (npx --yes neonctl@latest connection-string --project-id $Proyecto 2>$null) -join ""
if (-not $url.StartsWith("postgresql://")) {
  Write-Host "No se pudo obtener la conexión de Neon. Corra 'npx neonctl auth' y reintente." -ForegroundColor Red
  exit 1
}

do {
  $s1 = Read-Host "Contraseña temporal (10 caracteres o más)" -AsSecureString
  $s2 = Read-Host "Repítala" -AsSecureString
  $b1 = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($s1)
  $b2 = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($s2)
  $c1 = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($b1)
  $c2 = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($b2)
  [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($b1)
  [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($b2)
  if ($c1 -ne $c2) { Write-Host "No coinciden. Intente de nuevo." -ForegroundColor Yellow }
  elseif ($c1.Length -lt 10) { Write-Host "Debe tener al menos 10 caracteres." -ForegroundColor Yellow }
} while ($c1 -ne $c2 -or $c1.Length -lt 10)

$env:DATABASE_URL = $url
$env:RESTABLECER_CLAVE = $c1
$env:RESTABLECER_CORREOS = $Correos
$url = $null; $c1 = $null; $c2 = $null

$codigo = 1
try {
  node scripts/proveedor-bd.mjs postgresql | Out-Null
  npx prisma generate | Out-Null
  npx tsx prisma/restablecer-acceso-produccion.ts
  $codigo = $LASTEXITCODE
}
finally {
  # Pase lo que pase: se borran los secretos y el proyecto vuelve a SQLite.
  Remove-Item Env:RESTABLECER_CLAVE, Env:DATABASE_URL -ErrorAction SilentlyContinue
  node scripts/proveedor-bd.mjs sqlite | Out-Null
  npx prisma generate | Out-Null
}

Write-Host ""
if ($codigo -eq 0) {
  Write-Host "Listo. Ingrese en https://kg-academy.vercel.app/ingresar con cada correo." -ForegroundColor Green
} else {
  Write-Host "No terminó. Revise el mensaje de arriba." -ForegroundColor Red
}
exit $codigo
