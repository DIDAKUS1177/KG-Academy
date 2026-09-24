# ==========================================================================
# KG ACADEMY - Cuentas de prueba en producción (Neon)
# --------------------------------------------------------------------------
# Crea tres cuentas (administrador KG, administrador de empresa y estudiante)
# con UNA contraseña temporal común. Al iniciar sesión, la plataforma obliga a
# cada una a cambiarla antes de usar cualquier otra cosa.
#
# La contraseña se escribe aquí, oculta, y no queda guardada en ningún lado:
# ni en el historial de la terminal ni en archivos.
#
#   powershell -ExecutionPolicy Bypass -File scripts\usuarios-prueba-produccion.ps1
#
# Para usar otro dominio en los correos (por defecto kgacademy.test):
#   ... -File scripts\usuarios-prueba-produccion.ps1 -Dominio kggestionintegral.com
# ==========================================================================
param(
  [string]$Dominio = "kgacademy.test",
  [string]$Proyecto = "broad-lake-83564230"
)

Set-Location (Split-Path $PSScriptRoot -Parent)

Write-Host ""
Write-Host "KG Academy - cuentas de prueba en producción" -ForegroundColor Cyan
Write-Host "Correos: admin.prueba@$Dominio, empresa.prueba@$Dominio, estudiante.prueba@$Dominio"
Write-Host ""

$url = (npx --yes neonctl@latest connection-string --project-id $Proyecto 2>$null) -join ""
if (-not $url.StartsWith("postgresql://")) {
  Write-Host "No se pudo obtener la conexión de Neon. Corra 'npx neonctl auth' y reintente." -ForegroundColor Red
  exit 1
}

do {
  $s1 = Read-Host "Contraseña temporal para las 3 cuentas (10 caracteres o más)" -AsSecureString
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
$env:SEED_PRUEBA_CLAVE = $c1
$env:SEED_PRUEBA_DOMINIO = $Dominio
$url = $null; $c1 = $null; $c2 = $null

$codigo = 1
try {
  node scripts/proveedor-bd.mjs postgresql | Out-Null
  npx prisma generate | Out-Null
  npx tsx prisma/usuarios-prueba-produccion.ts
  $codigo = $LASTEXITCODE
}
finally {
  # Pase lo que pase: se borran los secretos y el proyecto vuelve a SQLite.
  Remove-Item Env:SEED_PRUEBA_CLAVE, Env:DATABASE_URL -ErrorAction SilentlyContinue
  node scripts/proveedor-bd.mjs sqlite | Out-Null
  npx prisma generate | Out-Null
}

Write-Host ""
if ($codigo -eq 0) {
  Write-Host "Listo. Ingrese en https://kg-academy.vercel.app/ingresar con cada correo." -ForegroundColor Green
} else {
  Write-Host "La carga no terminó. Revise el mensaje de arriba." -ForegroundColor Red
}
exit $codigo
