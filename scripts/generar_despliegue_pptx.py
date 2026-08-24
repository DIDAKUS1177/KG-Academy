# -*- coding: utf-8 -*-
"""
KG ACADEMY - Analisis de alternativas de despliegue
Compara donde alojar la plataforma, con costos, riesgos y una recomendacion.

Uso:  python scripts/generar_despliegue_pptx.py
Salida: docs/KG_Academy_Analisis_de_Despliegue.pptx

Autor del desarrollo: Diego Alejandro Hernandez Blanco
"""
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE

from kg_ppt import (
    Deck, rect, text, shape_text, table, bullet_card, step_row, note,
    NAVY, NAVY_L, NAVY_D, LIME, LIME_L, WHITE, GREY, CLOUD, LINE, INK, AMBER, RED, W, H,
)

deck = Deck()

# =====================================================================
deck.cover(
    "ANÁLISIS TÉCNICO  ·  VERSIÓN 1.0",
    "DONDE DESPLEGAR",
    "KG Academy en producción",
    "Comparacion de seis alternativas de alojamiento con costos, riesgos y esfuerzo de "
    "administración, una recomendación argumentada y el plan de puesta en producción "
    "paso a paso.",
)

# =====================================================================
s = deck.page("Punto de partida", "Que necesita esta aplicación para funcionar",
           "Antes de comparar proveedores hay que fijar los requisitos reales. Estos cinco son innegociables.")
req = [
    ("Proceso Node.js permanente", "KG Academy renderiza en el servidor. Necesita un proceso Node encendido 24/7, "
     "no solo archivos HTML servidos por Apache.", NAVY),
    ("Base de datos PostgreSQL", "Relacional, con 44 tablas e integridad referencial. MySQL también serviria, "
     "pero PostgreSQL es la eleccion recomendada.", NAVY_L),
    ("HTTPS con dominio propio", "Las cookies de sesión y los códigos QR de los certificados dependen del dominio "
     "definitivo. Sin SSL no hay plataforma.", LIME),
    ("Almacenamiento de video externo", "El video NO debe servirse desde el servidor de la aplicación: consume todo "
     "el ancho de banda y degrada la plataforma.", AMBER),
    ("Respaldos automáticos", "La base contiene la evidencia de capacitación. Perderla es perder los certificados "
     "y la trazabilidad ante una auditoría.", RED),
]
y = 1.8
for i, (t, dsc, c) in enumerate(req):
    bullet_card(s, Inches(0.62), Inches(y), Inches(8.4), Inches(0.92), t, dsc, c, 12, 9.2)
    y += 1.0

rect(s, Inches(9.3), Inches(1.8), Inches(3.42), Inches(4.6), fill=NAVY)
text(s, Inches(9.55), Inches(2.0), Inches(2.95), Inches(4.2),
     [("DIMENSIONAMIENTO", 11, True, LIME, 10),
      ("Usuarios esperados", 9, False, GREY, 2),
      ("100 a 1.000", 15, True, WHITE, 10),
      ("Concurrencia realista", 9, False, GREY, 2),
      ("20 a 50 simultaneos", 15, True, WHITE, 10),
      ("Recursos suficientes", 9, False, GREY, 2),
      ("2 vCPU · 8 GB RAM", 14, True, LIME, 10),
      ("Con ese tamaño sobra holgadamente para el primer año.", 8.5, False, GREY, 0)], spacing=1.15)

note(s, Inches(0.62), Inches(6.65), Inches(12.1),
     "El documento funcional de KG indica 'despliegue por medio de Hostinger'. Ese requisito se respeta en la "
     "recomendación, pero conviene saber que plan de Hostinger sirve y cuál no.", h=0.55)

# =====================================================================
s = deck.page("Advertencia", "Por que el hosting compartido NO sirve",
           "Es el error más comun y el más caro de descubrir tarde. Aplica a Hostinger y a cualquier proveedor.")

rect(s, Inches(0.62), Inches(1.8), Inches(5.9), Inches(3.5), fill=WHITE, line=RED)
shape_text(rect(s, Inches(0.62), Inches(1.8), Inches(5.9), Inches(0.55), fill=RED),
           "HOSTING COMPARTIDO  ·  NO VIABLE", 11.5, True, WHITE)
malo = [
    "Esta pensado para PHP y WordPress, no para procesos Node permanentes.",
    "Normalmente solo ofrece MySQL; no hay PostgreSQL gestionado.",
    "El proceso se reinicia o se suspende por límites de CPU y memoria.",
    "No hay acceso de consola para PM2, migraciones ni tareas programadas.",
    "Si se sube la aplicación como sitio estático, dejan de funcionar el login, la base de datos y los certificados.",
]
y = 2.55
for m in malo:
    x = rect(s, Inches(0.85), Inches(y + 0.04), Inches(0.16), Inches(0.16), fill=RED, shape=MSO_SHAPE.OVAL)
    text(s, Inches(1.15), Inches(y - 0.03), Inches(5.15), Inches(0.6), [(m, 9.3, False, INK, 0)], spacing=1.15)
    y += 0.53

rect(s, Inches(6.82), Inches(1.8), Inches(5.9), Inches(3.5), fill=WHITE, line=LIME)
shape_text(rect(s, Inches(6.82), Inches(1.8), Inches(5.9), Inches(0.55), fill=LIME),
           "LO QUE SI SIRVE", 11.5, True, NAVY)
bueno = [
    "Un VPS (servidor virtual) con acceso root: Hostinger VPS, DigitalOcean, Hetzner.",
    "Una plataforma gestionada para Node: Vercel, Railway, Render.",
    "PostgreSQL propio en el VPS o gestionado: Neon, Supabase, el del proveedor.",
    "Cualquiera de las dos rutas cumple; cambian el costo y quién administra.",
]
y = 2.55
for m in bueno:
    x = rect(s, Inches(7.05), Inches(y + 0.04), Inches(0.16), Inches(0.16), fill=LIME, shape=MSO_SHAPE.OVAL)
    text(s, Inches(7.35), Inches(y - 0.03), Inches(5.15), Inches(0.65), [(m, 9.3, False, INK, 0)], spacing=1.15)
    y += 0.66

note(s, Inches(0.62), Inches(5.6), Inches(12.1),
     "Si KG ya contrato un plan de hosting compartido en Hostinger, ese plan puede seguir usandose para el sitio "
     "corporativo y el correo, pero la plataforma necesita además un VPS.", tono=LIME_L, h=0.6)

note(s, Inches(0.62), Inches(6.4), Inches(12.1),
     "Un servidor propio dentro de las oficinas de KG tampoco se recomienda: exige IP fija, UPS, certificados, "
     "actualizaciones de seguridad y disponibilidad 24/7 que una PYME no puede sostener.",
     tono=CLOUD, borde=LINE, h=0.6, size=9.5)

# =====================================================================
s = deck.page("Comparacion", "Las seis alternativas evaluadas",
           "Costos aproximados en dolares por mes. Verificar el precio vigente al momento de contratar.")
opciones = [
    ("Hostinger  ·  Hosting compartido", "US$ 3 - 10", "No aplica", "Muy bajo", "NO VIABLE",
     "No ejecuta Next.js con renderizado en servidor"),
    ("Hostinger  ·  VPS KVM 2", "US$ 8 - 18", "Medio", "Alto", "RECOMENDADO",
     "Cumple el requisito del documento, costo bajo y control total"),
    ("Vercel + Neon", "US$ 20 - 40", "Muy bajo", "Medio", "ALTERNATIVA",
     "Cero administración, ideal para Next.js, costo recurrente mayor"),
    ("Railway o Render", "US$ 14 - 30", "Bajo", "Medio", "ALTERNATIVA",
     "App y base de datos en el mismo proveedor, despliegue simple"),
    ("DigitalOcean o Hetzner VPS", "US$ 6 - 15", "Medio", "Alto", "EQUIVALENTE",
     "Mismo esquema que el VPS de Hostinger, a veces más potencia por el precio"),
    ("Servidor propio en KG", "Variable", "Muy alto", "Total", "NO RECOMENDADO",
     "Requiere IP fija, UPS, seguridad física y soporte 24/7"),
]
table(s, Inches(0.62), Inches(1.78), Inches(12.1),
      ["Alternativa", "Costo / mes", "Esfuerzo de administración", "Control", "Veredicto", "Comentario"],
      opciones, [3.0, 1.5, 2.1, 1.1, 1.7, 4.4], row_h=0.62, size=9)

note(s, Inches(0.62), Inches(6.1), Inches(12.1),
     "Los precios son ordenes de magnitud a 2026 y varian con promociones y plazo de contratacion. "
     "El costo del dominio (.co, aproximadamente US$ 25 al año) es aparte en todas las opciones.",
     tono=CLOUD, borde=LINE, h=0.6, size=9.5)

# =====================================================================
s = deck.page("Criterios", "Como se tomo la decision",
           "Cinco criterios, ponderados según la realidad de KG: una PYME que lanza su primer producto digital.")
criterios = [
    ("Costo recurrente", "30 %", "Debe caber en el presupuesto de una PYME sin comprometer el proyecto.", LIME),
    ("Esfuerzo de administración", "25 %", "KG no tiene un área de sistemas dedicada al mantenimiento del servidor.", NAVY_L),
    ("Cumplir el requisito del cliente", "20 %", "El documento funcional pide explicitamente Hostinger.", NAVY),
    ("Control y portabilidad", "15 %", "Poder migrar sin reescribir la aplicación ni quedar atado al proveedor.", AMBER),
    ("Latencia desde Colombia", "10 %", "Elegir el centro de datos más cercano disponible marca la diferencia.", RED),
]
y = 1.82
for t, peso, dsc, c in criterios:
    rect(s, Inches(0.62), Inches(y), Inches(7.6), Inches(0.86), fill=WHITE, line=LINE)
    rect(s, Inches(0.62), Inches(y), Inches(0.09), Inches(0.86), fill=c, shape=MSO_SHAPE.RECTANGLE)
    text(s, Inches(0.9), Inches(y + 0.13), Inches(4.6), Inches(0.65),
         [(t, 11.5, True, NAVY, 2), (dsc, 8.8, False, GREY, 0)], spacing=1.15)
    shape_text(rect(s, Inches(7.2), Inches(y + 0.22), Inches(0.85), Inches(0.42), fill=c),
               peso, 12, True, NAVY if c == LIME else WHITE)
    y += 0.96

rect(s, Inches(8.5), Inches(1.82), Inches(4.22), Inches(4.1), fill=NAVY)
text(s, Inches(8.78), Inches(2.02), Inches(3.7), Inches(3.7),
     [("CONCLUSION", 11, True, LIME, 10),
      ("El VPS de Hostinger gana porque es el único que satisface a la vez los tres criterios de mayor peso: "
       "es el más economico de los viables, respeta el requisito del documento y no ata la plataforma a un proveedor.",
       10, False, WHITE, 12),
      ("Su única debilidad es el esfuerzo de administración, y se compensa dejando el servidor configurado, "
       "documentado y con respaldos automáticos desde el primer día.", 9.5, False, GREY, 0)], spacing=1.2)

note(s, Inches(0.62), Inches(6.7), Inches(12.1),
     "Si KG prefiere no administrar ningún servidor, la segunda opcion es Vercel + Neon: cuesta aproximadamente el "
     "doble al mes pero elimina por completo el mantenimiento.", h=0.5)

# =====================================================================
s = deck.page("Recomendación", "Arquitectura recomendada para el lanzamiento",
           "Hostinger VPS KVM 2, centro de datos más cercano disponible (EE.UU. este o Sao Paulo).")

# Capas del despliegue
capas = [
    ("USUARIOS", "Trabajadores, empresas y KG  ·  navegador web  ·  HTTPS", LIME, NAVY),
    ("DOMINIO Y SSL", "kgacademy.co  ·  certificado Let's Encrypt con renovacion automática", NAVY_L, WHITE),
    ("NGINX", "Proxy inverso en los puertos 80 y 443  ·  compresion  ·  cabeceras de seguridad", NAVY, WHITE),
    ("APLICACIÓN", "Next.js en producción  ·  proceso Node gestionado por PM2  ·  reinicio automático", NAVY_D, WHITE),
    ("BASE DE DATOS", "PostgreSQL 16 en el mismo VPS  ·  solo accesible desde localhost", NAVY, WHITE),
    ("RESPALDOS", "pg_dump diario por cron  ·  retencion 30 días  ·  copia fuera del servidor", NAVY_L, WHITE),
]
y = 1.78
for t, dsc, c, tc in capas:
    rect(s, Inches(0.62), Inches(1.78) + Inches(0), Inches(0), Inches(0))  # no-op para claridad
    rect(s, Inches(0.62), Inches(y), Inches(8.3), Inches(0.72), fill=c)
    text(s, Inches(0.9), Inches(y + 0.12), Inches(2.4), Inches(0.5), [(t, 11, True, LIME if tc == WHITE else NAVY, 0)])
    text(s, Inches(3.3), Inches(y + 0.16), Inches(5.4), Inches(0.45),
         [(dsc, 9, False, tc, 0)], spacing=1.1)
    y += 0.8

# Servicios externos
rect(s, Inches(9.2), Inches(1.78), Inches(3.52), Inches(4.72), fill=WHITE, line=LINE)
shape_text(rect(s, Inches(9.2), Inches(1.78), Inches(3.52), Inches(0.5), fill=AMBER),
           "SERVICIOS EXTERNOS", 10.5, True, WHITE)
ext = [
    ("Video", "Vimeo o Bunny Stream. Nunca desde el VPS."),
    ("Interactivos", "Genially, embebido por URL."),
    ("Correo", "Brevo o Resend, capa gratuita suficiente al inicio."),
    ("Monitoreo", "UptimeRobot, avisa si el sitio cae."),
    ("Copia externa", "Backblaze B2 o Google Drive."),
]
y = 2.45
for t, dsc in ext:
    rect(s, Inches(9.42), Inches(y), Inches(3.1), Inches(0.74), fill=CLOUD, line=LINE)
    text(s, Inches(9.62), Inches(y + 0.1), Inches(2.75), Inches(0.58),
         [(t, 9.5, True, NAVY, 1), (dsc, 8, False, GREY, 0)], spacing=1.1)
    y += 0.82

note(s, Inches(0.62), Inches(6.7), Inches(12.1),
     "PostgreSQL escuchando solo en localhost es una decision de seguridad deliberada: la base nunca queda expuesta "
     "a internet, solo la alcanza la aplicación que corre en el mismo servidor.", h=0.5, size=9.5)

# =====================================================================
s = deck.page("Costos", "Cuanto cuesta sostener la plataforma",
           "Comparacion de las dos rutas recomendadas. Valores aproximados; confirmar al contratar.")
costos = [
    ("VPS Hostinger KVM 2 (2 vCPU / 8 GB)", "US$ 8 - 18", "Incluido en Vercel + Neon", "Servidor de aplicación y base de datos"),
    ("Plataforma gestionada (Vercel Pro)", "No aplica", "US$ 20", "Alojamiento de la aplicación sin administración"),
    ("PostgreSQL gestionado (Neon)", "No aplica", "US$ 0 - 19", "Base de datos con respaldos automáticos"),
    ("Dominio .co", "US$ 2 (25 al año)", "US$ 2 (25 al año)", "Direccion definitiva de la plataforma"),
    ("Certificado SSL", "US$ 0", "US$ 0", "Let's Encrypt o incluido en la plataforma"),
    ("Alojamiento de video", "US$ 0 - 12", "US$ 0 - 12", "Vimeo o Bunny Stream según consumo"),
    ("Correo transaccional", "US$ 0", "US$ 0", "Capa gratuita de Brevo o Resend"),
    ("Monitoreo y respaldo externo", "US$ 0 - 2", "US$ 0", "UptimeRobot y almacenamiento de copias"),
    ("TOTAL MENSUAL APROXIMADO", "US$ 10 - 34", "US$ 22 - 53", "Equivale a $45.000 - $150.000 COP / mes"),
]
table(s, Inches(0.62), Inches(1.78), Inches(12.1),
      ["Concepto", "Ruta A  ·  VPS Hostinger", "Ruta B  ·  Vercel + Neon", "Para que sirve"],
      costos, [3.6, 2.4, 2.4, 4.0], row_h=0.5, size=9.5)

note(s, Inches(0.62), Inches(6.5), Inches(12.1),
     "La diferencia real entre las dos rutas no es el dinero, es el tiempo: la ruta A exige unas 2 horas al mes de "
     "mantenimiento (actualizaciones y revisión de respaldos); la ruta B, practicamente ninguna.", h=0.6)

# =====================================================================
s = deck.page("Decision aparte", "Donde alojar el video de los cursos",
           "Es la decision técnica que más impacta el costo y la experiencia. Merece análisis propio.")
video = [
    ("En el mismo VPS", "NO", "Un video de 200 MB visto por 50 personas consume 10 GB de trafico. Satura el servidor "
     "y deja la plataforma lenta para todos.", RED),
    ("YouTube no listado", "Viable", "Gratis e ilimitado. Contras: muestra recomendaciones al final, la marca de "
     "YouTube y no impide que alguien comparta el enlace.", AMBER),
    ("Vimeo", "Recomendado", "Reproductor limpio y personalizable con la marca KG, control de dominio desde el que "
     "se puede reproducir, estadisticas. Desde unos US$ 12 al mes.", LIME),
    ("Bunny Stream", "Recomendado", "Muy economico, se paga por consumo real, red de distribución rápida en "
     "Latinoamerica y reproductor propio.", LIME),
    ("Genially", "Complementario", "Para los recursos interactivos, no para el video pesado. Ya esta contemplado "
     "en la plataforma como tipo de contenido.", NAVY_L),
]
y = 1.8
for t, veredicto, dsc, c in video:
    rect(s, Inches(0.62), Inches(y), Inches(12.1), Inches(0.9), fill=WHITE, line=LINE)
    rect(s, Inches(0.62), Inches(y), Inches(0.09), Inches(0.9), fill=c, shape=MSO_SHAPE.RECTANGLE)
    text(s, Inches(0.9), Inches(y + 0.16), Inches(2.6), Inches(0.6),
         [(t, 12, True, NAVY, 0)])
    shape_text(rect(s, Inches(3.6), Inches(y + 0.24), Inches(1.5), Inches(0.4), fill=c),
               veredicto.upper(), 8.5, True, NAVY if c == LIME else WHITE)
    text(s, Inches(5.35), Inches(y + 0.16), Inches(7.1), Inches(0.65),
         [(dsc, 9.2, False, INK, 0)], spacing=1.18)
    y += 1.0

note(s, Inches(0.62), Inches(6.85), Inches(12.1),
     "La plataforma ya soporta las cuatro opciones: en el constructor se elige el tipo de contenido y se pega la URL. "
     "Cambiar de proveedor de video más adelante no exige tocar el código.", h=0.5, size=9.5)

# =====================================================================
s = deck.page("Cumplimiento", "Datos personales y respaldos",
           "Dos temas que suelen olvidarse hasta que hay una auditoría o una perdida de información.")

rect(s, Inches(0.62), Inches(1.8), Inches(5.9), Inches(3.9), fill=WHITE, line=LINE)
shape_text(rect(s, Inches(0.62), Inches(1.8), Inches(5.9), Inches(0.55), fill=NAVY),
           "PROTECCIÓN DE DATOS  ·  LEY 1581 DE 2012", 10.5, True, WHITE)
legal = [
    ("Los datos saldran del pais", "Ninguna de las alternativas viables tiene centro de datos en Colombia."),
    ("La ley lo permite", "Con autorizacion expresa del titular o con un contrato de transmision de datos con el proveedor."),
    ("Ya esta implementado", "El registro exige la autorizacion y guarda la fecha exacta en que se otorgo."),
    ("Falta formalizar", "Firmar el acuerdo de tratamiento de datos que ofrece el proveedor y publicar la politica de privacidad."),
    ("Validar con juridico", "La redaccion final de la politica debe revisarla el asesor juridico de KG."),
]
y = 2.55
for t, dsc in legal:
    rect(s, Inches(0.85), Inches(y), Inches(5.44), Inches(0.58), fill=CLOUD, line=LINE)
    text(s, Inches(1.05), Inches(y + 0.08), Inches(5.05), Inches(0.45),
         [(t, 9.5, True, NAVY, 1), (dsc, 8.2, False, GREY, 0)], spacing=1.1)
    y += 0.64

rect(s, Inches(6.82), Inches(1.8), Inches(5.9), Inches(3.9), fill=WHITE, line=LINE)
shape_text(rect(s, Inches(6.82), Inches(1.8), Inches(5.9), Inches(0.55), fill=LIME),
           "POLITICA DE RESPALDOS PROPUESTA", 10.5, True, NAVY)
backups = [
    ("Diario", "pg_dump automático a la 1:00 a.m., comprimido."),
    ("Retencion", "30 copias diarias en el servidor."),
    ("Fuera del servidor", "Copia semanal a Backblaze B2 o Google Drive."),
    ("Snapshot del VPS", "Semanal, para restaurar el servidor completo."),
    ("Prueba de restauracion", "Cada tres meses, restaurar en un ambiente de prueba."),
]
y = 2.55
for t, dsc in backups:
    rect(s, Inches(7.05), Inches(y), Inches(5.44), Inches(0.58), fill=CLOUD, line=LINE)
    text(s, Inches(7.25), Inches(y + 0.08), Inches(5.05), Inches(0.45),
         [(t, 9.5, True, NAVY, 1), (dsc, 8.2, False, GREY, 0)], spacing=1.1)
    y += 0.64

note(s, Inches(0.62), Inches(5.95), Inches(12.1),
     "Un respaldo que nunca se ha restaurado no es un respaldo: es una suposicion. Por eso la prueba trimestral.",
     h=0.5)

note(s, Inches(0.62), Inches(6.62), Inches(12.1),
     "Sin respaldos, perder la base significa perder los certificados emitidos y toda la trazabilidad de "
     "capacitación que la empresa debe demostrar ante la ARL.", tono=CLOUD, borde=LINE, h=0.55, size=9.5)

# =====================================================================
s = deck.page("Ejecucion", "Plan de puesta en producción",
           "Doce pasos. Un día de trabajo técnico si el dominio ya está disponible.")
plan = [
    ("1", "Contratar VPS y dominio", "Ubuntu 24.04. Apuntar los registros DNS al servidor."),
    ("2", "Asegurar el servidor", "Usuario sin privilegios de root, firewall abierto solo en 22, 80 y 443."),
    ("3", "Instalar el entorno", "Node.js 20, PostgreSQL 16, Nginx y PM2."),
    ("4", "Crear la base de datos", "Usuario y base dedicados, escuchando solo en localhost."),
    ("5", "Subir el código", "Clonar el repositorio en el servidor."),
    ("6", "Configurar el .env", "AUTH_SECRET nuevo y largo, DATABASE_URL y NEXT_PUBLIC_APP_URL con el dominio real."),
    ("7", "Cambiar el motor en Prisma", "provider = postgresql y ejecutar prisma migrate deploy."),
    ("8", "Cargar los catálogos", "Roles, permisos, plantillas y configuración. NO el seed de demostración."),
    ("9", "Compilar y levantar", "npm run build y arrancar con PM2 con reinicio automático."),
    ("10", "Publicar con Nginx y SSL", "Proxy inverso al puerto 3000 y certificado con Certbot."),
    ("11", "Activar respaldos y monitoreo", "Cron de pg_dump, copia externa y UptimeRobot."),
    ("12", "Pruebas de aceptacion", "Ingreso por cada rol, aula, evaluación, certificado y QR con el dominio real."),
]
for i, (n, t, dsc) in enumerate(plan):
    col, row = i % 2, i // 2
    x = Inches(0.62 + col * 6.3)
    y = Inches(1.8 + row * 0.83)
    step_row(s, x, y, Inches(6.0), n, t, dsc, h=0.74)

note(s, Inches(0.62), Inches(6.85), Inches(12.1),
     "Paso 8, critico: el seed actual BORRA la base antes de sembrar. En producción debe ejecutarse solo la parte de "
     "catálogos, nunca el seed completo después del lanzamiento.", tono=LIME_L, h=0.5, size=9.5)

# =====================================================================
s = deck.page("Ejecucion", "Detalles que suelen costar caro",
           "Errores frecuentes en el paso a producción, y como evitarlos en este proyecto concreto.")
trampas = [
    ("El QR apunta a localhost", "Si NEXT_PUBLIC_APP_URL no tiene el dominio definitivo ANTES de emitir el primer "
     "certificado, los QR quedaran apuntando a localhost y habrá que reemitirlos.", RED),
    ("La clave de sesión por defecto", "AUTH_SECRET debe cambiarse por una cadena larga y aleatoria. Con la clave de "
     "ejemplo, cualquiera podria falsificar una sesión.", RED),
    ("Ejecutar el seed en producción", "Borraria usuarios, avances y certificados reales. Debe deshabilitarse el "
     "comando en el servidor productivo.", RED),
    ("No tener ambiente de pruebas", "Todo cambio deberia probarse en un subdominio de staging antes de tocar "
     "producción. Un segundo VPS pequeño o un subdominio en el mismo servidor.", AMBER),
    ("Olvidar la zona horaria", "Configurar el servidor en America/Bogotá para que las fechas de los certificados y "
     "los vencimientos coincidan con la realidad.", AMBER),
    ("No documentar los accesos", "Entregar a KG las credenciales del VPS, del dominio, de la base y del repositorio. "
     "El punto 25 del esqueleto lo exige explicitamente.", NAVY_L),
]
for i, (t, dsc, c) in enumerate(trampas):
    x = Inches(0.62 + (i % 2) * 6.3)
    y = Inches(1.8 + (i // 2) * 1.6)
    rect(s, x, y, Inches(6.0), Inches(1.42), fill=WHITE, line=LINE)
    rect(s, x, y, Inches(0.09), Inches(1.42), fill=c, shape=MSO_SHAPE.RECTANGLE)
    text(s, x + Inches(0.28), y + Inches(0.15), Inches(5.5), Inches(1.15),
         [(t, 11.5, True, NAVY, 3), (dsc, 9, False, GREY, 0)], spacing=1.18)

# =====================================================================
s = deck.page("Futuro", "Qué hacer cuando la plataforma crezca",
           "Señales concretas para saber cuando conviene cambiar de escalon, y a que escalon pasar.")
escalones = [
    ("HOY  ·  hasta 1.000 usuarios", LIME,
     ["Un VPS con la aplicación y PostgreSQL juntos", "Respaldos diarios", "Monitoreo básico",
      "Costo aproximado: US$ 10 - 34 al mes"]),
    ("SEÑAL DE CAMBIO", AMBER,
     ["El servidor supera el 70 % de CPU o memoria de forma sostenida", "Las páginas tardan más de 2 segundos",
      "Más de 100 usuarios simultaneos", "La base supera los 20 GB"]),
    ("SIGUIENTE ESCALON", NAVY_L,
     ["Separar la base de datos en su propio servidor gestionado", "Subir el VPS a 4 vCPU / 16 GB",
      "Agregar una CDN para los archivos estáticos", "Costo aproximado: US$ 40 - 80 al mes"]),
    ("ESCALON MAYOR", NAVY,
     ["Dos servidores de aplicación detras de un balanceador", "Replica de lectura de la base de datos",
      "Ambiente de staging permanente", "Costo aproximado: desde US$ 150 al mes"]),
]
for i, (titulo, color, items) in enumerate(escalones):
    x = Inches(0.62 + i * 3.11)
    rect(s, x, Inches(1.8), Inches(2.88), Inches(4.6), fill=WHITE, line=LINE)
    shape_text(rect(s, x, Inches(1.8), Inches(2.88), Inches(0.62), fill=color), titulo, 9.5, True,
               NAVY if color in (LIME, AMBER) else WHITE)
    y = 2.6
    for it in items:
        dot = rect(s, x + Inches(0.18), Inches(y + 0.07), Inches(0.09), Inches(0.09), fill=color, shape=MSO_SHAPE.OVAL)
        text(s, x + Inches(0.38), Inches(y), Inches(2.35), Inches(0.75),
             [(it, 9, False, INK, 0)], spacing=1.15)
        y += 0.78

note(s, Inches(0.62), Inches(6.65), Inches(12.1),
     "La arquitectura elegida permite subir de escalon sin reescribir nada: el mismo código funciona en un VPS "
     "pequeño y en una infraestructura con balanceador.", h=0.5)

# =====================================================================
s = deck.page("Resumen", "La recomendación en una lamina",
           "Lo que se propone contratar y por que.")

rect(s, Inches(0.62), Inches(1.8), Inches(12.1), Inches(1.5), fill=LIME)
text(s, Inches(1.0), Inches(2.0), Inches(11.4), Inches(1.2),
     [("RECOMENDACIÓN", 11, True, NAVY, 4),
      ("Hostinger VPS KVM 2  ·  Ubuntu 24.04  ·  PostgreSQL en el mismo servidor  ·  video en Vimeo o Bunny",
       17, True, NAVY, 4),
      ("Aproximadamente US$ 10 a 34 al mes, cumple el requisito del documento funcional y no ata la plataforma "
       "a ningún proveedor.", 10.5, False, NAVY, 0)], spacing=1.2)

razones = [
    ("Es viable", "Ejecuta Next.js con renderizado en servidor y PostgreSQL, que es lo que la aplicación necesita."),
    ("Es economico", "La opcion más barata entre las que realmente funcionan."),
    ("Respeta el requisito", "El esqueleto funcional pide despliegue en Hostinger."),
    ("Es portable", "Si mañana KG quiere migrar, el mismo código corre en cualquier otro VPS o en Vercel."),
    ("Es suficiente", "2 vCPU y 8 GB cubren de sobra el primer año de operacion."),
    ("Tiene plan B", "Si KG no quiere administrar servidor: Vercel + Neon, el doble de costo y cero mantenimiento."),
]
for i, (t, dsc) in enumerate(razones):
    x = Inches(0.62 + (i % 3) * 4.08)
    y = Inches(3.55 + (i // 3) * 1.35)
    rect(s, x, y, Inches(3.85), Inches(1.18), fill=WHITE, line=LINE)
    c = rect(s, x + Inches(0.18), y + Inches(0.16), Inches(0.34), Inches(0.34), fill=LIME, shape=MSO_SHAPE.OVAL)
    shape_text(c, str(i + 1), 10, True, NAVY)
    text(s, x + Inches(0.62), y + Inches(0.16), Inches(3.05), Inches(0.9),
         [(t, 11, True, NAVY, 2), (dsc, 8.5, False, GREY, 0)], spacing=1.15)

note(s, Inches(0.62), Inches(6.35), Inches(12.1),
     "Decision pendiente de KG: confirmar el dominio definitivo y el proveedor de video antes de iniciar el "
     "despliegue, porque ambos se necesitan en el paso 6 del plan.", tono=LIME_L, h=0.6)

# =====================================================================
deck.closing("Una infraestructura simple, economica y suficiente para empezar bien.")

out = deck.save("KG_Academy_Analisis_de_Despliegue.pptx")
print("OK ->", out)
