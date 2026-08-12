# -*- coding: utf-8 -*-
"""
KG ACADEMY - Manual funcional de la plataforma
Explica modulo por modulo que hace el sistema, como funcionan los roles,
el motor de progreso, la calificacion, los certificados y la gamificacion.

Uso:  python scripts/generar_manual_pptx.py
Salida: docs/KG_Academy_Manual_Funcional.pptx

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
    "MANUAL FUNCIONAL  ·  VERSION 1.0",
    "KG ACADEMY",
    "Como funciona la plataforma",
    "Recorrido modulo por modulo: roles y permisos, aula virtual, motor de progreso, "
    "calificacion de evaluaciones, emision de certificados, panel empresarial, "
    "gamificacion, notificaciones y auditoria.",
)

# =====================================================================
s = deck.page("Como leer este manual", "Guia rapida",
           "Cada modulo se explica en tres capas: que hace, como lo hace el sistema y que debe hacer el usuario.")
capas = [
    ("QUE HACE", "El objetivo del modulo en una frase, en lenguaje de negocio.", LIME),
    ("COMO FUNCIONA", "La regla exacta que aplica el sistema, con la formula o el flujo cuando aplica.", NAVY_L),
    ("QUIEN LO USA", "El rol responsable y la pantalla concreta donde se opera.", NAVY),
]
for i, (t, dsc, c) in enumerate(capas):
    x = Inches(0.62 + i * 4.15)
    rect(s, x, Inches(1.8), Inches(3.85), Inches(1.55), fill=WHITE, line=LINE)
    rect(s, x, Inches(1.8), Inches(3.85), Inches(0.5), fill=c)
    text(s, x + Inches(0.22), Inches(1.93), Inches(3.4), Inches(0.3), [(t, 11.5, True, WHITE, 0)])
    text(s, x + Inches(0.22), Inches(2.48), Inches(3.4), Inches(0.8),
         [(dsc, 10, False, INK, 0)], spacing=1.2)

s2 = [
    ("12 modulos funcionales", "Desde el acceso hasta la auditoria."),
    ("6 roles", "Con permisos distintos y pantallas distintas."),
    ("2 sistemas de puntaje", "La NOTA de las evaluaciones y los PUNTOS de gamificacion. No son lo mismo."),
    ("1 regla de aprobacion", "Lecciones obligatorias completas + evaluacion final aprobada."),
]
for i, (t, dsc) in enumerate(s2):
    x = Inches(0.62 + (i % 2) * 6.3)
    y = Inches(3.75 + (i // 2) * 1.35)
    bullet_card(s, x, y, Inches(6.0), Inches(1.15), t, dsc, LIME if i % 2 == 0 else NAVY_L, 13, 10)

note(s, Inches(0.62), Inches(6.55), Inches(12.1),
     "Advertencia importante: en este manual, NOTA (0 a 100) decide si aprueba. PUNTOS (gamificacion) solo motivan; "
     "nunca afectan la aprobacion ni el certificado.", h=0.55)

# =====================================================================
s = deck.page("Mapa general", "Los 12 modulos de la plataforma",
           "Agrupados por el rol que los usa principalmente.")
grupos = [
    ("EL ESTUDIANTE / TRABAJADOR", LIME, [
        ("01  Acceso y cuenta", "Registro, ingreso, sesion y recuperacion de contrasena"),
        ("02  Catalogo", "Explorar cursos y ver la ficha completa antes de inscribirse"),
        ("03  Aula virtual", "Estudiar leccion a leccion con el avance guardado"),
        ("04  Evaluaciones", "Diagnostica, por modulo y final, con calificacion inmediata"),
        ("05  Certificados", "Descarga en PDF y verificacion publica con QR"),
        ("06  Gamificacion", "Puntos, niveles, insignias y racha de estudio"),
    ]),
    ("LA EMPRESA Y KG", NAVY_L, [
        ("07  Trabajadores", "Nomina por area, cargo y sede; alta individual o masiva"),
        ("08  Asignacion", "Entregar cursos con fecha limite y caracter obligatorio"),
        ("09  Seguimiento y reportes", "Estado de cada persona y exportacion a CSV"),
        ("10  Administracion KG", "Cursos, contenidos, usuarios, empresas y planes"),
        ("11  Notificaciones", "Avisos automaticos al trabajador"),
        ("12  Auditoria y seguridad", "Quien hizo que, cuando y sobre que registro"),
    ]),
]
for gi, (titulo, color, items) in enumerate(grupos):
    x = Inches(0.62 + gi * 6.3)
    shape_text(rect(s, x, Inches(1.78), Inches(6.0), Inches(0.5), fill=color), titulo, 11, True, WHITE)
    y = 2.42
    for t, dsc in items:
        rect(s, x, Inches(y), Inches(6.0), Inches(0.68), fill=CLOUD, line=LINE)
        text(s, x + Inches(0.22), Inches(y + 0.1), Inches(5.6), Inches(0.5),
             [(t, 10.5, True, NAVY, 1), (dsc, 8.7, False, GREY, 0)], spacing=1.1)
        y += 0.75

# =====================================================================
s = deck.page("Roles", "Los 6 roles y que puede hacer cada uno",
           "El rol se asigna al crear la cuenta y determina a que panel entra el usuario al iniciar sesion.")
roles = [
    ("SuperAdmin KG", "Plataforma", "Acceso total sin restriccion",
     "/admin", "Katerine / direccion de KG"),
    ("Administrador KG", "Plataforma", "Opera cursos, usuarios, empresas, certificados y reportes; no toca configuracion sensible",
     "/admin", "Equipo operativo de KG"),
    ("Instructor", "Plataforma", "Crea y edita SUS cursos, contenidos y evaluaciones; consulta resultados",
     "/admin/cursos", "Docente o experto tematico"),
    ("Administrador de empresa", "Su empresa", "Gestiona trabajadores, asigna cursos, consulta cumplimiento y descarga reportes",
     "/empresa", "Talento humano del cliente"),
    ("Supervisor", "Su empresa", "Solo consulta: ve trabajadores, avance e indicadores. No asigna ni edita",
     "/empresa/seguimiento", "Jefe de area o HSE"),
    ("Estudiante / Trabajador", "Propio", "Estudia, presenta evaluaciones y descarga sus certificados",
     "/aula", "Persona que se capacita"),
]
table(s, Inches(0.62), Inches(1.78), Inches(12.1),
      ["Rol", "Alcance", "Que puede hacer", "Entra a", "Quien lo usa"],
      roles, [2.1, 1.3, 5.6, 1.7, 2.3], row_h=0.66, size=9.5)

note(s, Inches(0.62), Inches(6.35), Inches(12.1),
     "Regla de aislamiento: un administrador de empresa NUNCA ve datos de otra empresa. El sistema lo valida en el "
     "servidor en cada consulta, no solo escondiendo botones en pantalla.", h=0.6)

# =====================================================================
s = deck.page("Roles", "Como se controla el permiso en la practica",
           "Tres barreras independientes. Si una falla, las otras siguen protegiendo la informacion.")
barreras = [
    ("1", "Barrera de navegacion",
     "El menu lateral solo muestra las secciones del rol. Un supervisor ni siquiera ve el boton 'Asignar cursos'."),
    ("2", "Barrera de pagina",
     "Al abrir una direccion, el servidor comprueba el rol antes de responder. Si no corresponde, redirige al panel del usuario."),
    ("3", "Barrera de dato",
     "Cada consulta filtra por la empresa del usuario. Aunque alguien adivine el identificador de otro trabajador, no obtiene la informacion."),
]
y = 1.85
for n, t, dsc in barreras:
    step_row(s, Inches(0.62), Inches(y), Inches(7.6), n, t, dsc, h=0.95)
    y += 1.08

rect(s, Inches(8.5), Inches(1.85), Inches(4.22), Inches(3.1), fill=NAVY)
text(s, Inches(8.78), Inches(2.05), Inches(3.7), Inches(2.8),
     [("EN NUMEROS", 11, True, LIME, 10),
      ("6 roles definidos", 12, True, WHITE, 6),
      ("72 permisos granulares", 12, True, WHITE, 6),
      ("9 modulos protegidos", 12, True, WHITE, 10),
      ("Los permisos se nombran modulo.accion, por ejemplo cursos.publicar o certificados.revocar.",
       9, False, GREY, 0)], spacing=1.15)

note(s, Inches(0.62), Inches(5.3), Inches(12.1),
     "La matriz completa rol por permiso se consulta en la plataforma: Administracion  →  Matriz de permisos.", h=0.5)

text(s, Inches(0.62), Inches(6.05), Inches(12.1), Inches(0.9),
     [("Estados posibles de una cuenta:", 11, True, NAVY, 4),
      ("activo  ·  puede entrar y estudiar          pendiente_activacion  ·  creado por la empresa, aun no ha entrado          "
       "inactivo  ·  se conserva el historico pero no puede entrar          bloqueado  ·  acceso denegado por decision administrativa",
       9.5, False, INK, 0)], spacing=1.3)

# =====================================================================
s = deck.page("Modulo 01", "Acceso y cuenta",
           "Como entra una persona a KG Academy y como se protege su sesion.")
vias = [
    ("Registro publico", "La persona se registra en /registro. Si escribe el NIT de una empresa ya creada, "
     "queda vinculada automaticamente a ella.", LIME),
    ("Alta por la empresa", "Talento humano crea al trabajador desde el panel. Nace con contrasena temporal "
     "KgAcademy2026* y estado 'pendiente de activacion'.", NAVY_L),
    ("Alta por KG", "La administracion crea cuentas de staff, instructores o administradores de empresa.", NAVY),
]
for i, (t, dsc, c) in enumerate(vias):
    x = Inches(0.62 + i * 4.15)
    rect(s, x, Inches(1.8), Inches(3.85), Inches(1.7), fill=WHITE, line=LINE)
    rect(s, x, Inches(1.8), Inches(3.85), Inches(0.48), fill=c)
    text(s, x + Inches(0.22), Inches(1.92), Inches(3.4), Inches(0.3), [(t, 11.5, True, WHITE, 0)])
    text(s, x + Inches(0.22), Inches(2.45), Inches(3.4), Inches(1.0),
         [(dsc, 9.5, False, INK, 0)], spacing=1.2)

text(s, Inches(0.62), Inches(3.75), Inches(12.1), Inches(0.3),
     [("QUE PASA CUANDO ALGUIEN INICIA SESION", 10.5, True, LIME, 0)])
flujo = [
    ("1", "Se valida la contrasena", "Se compara contra el hash bcrypt guardado. La contrasena real nunca se almacena."),
    ("2", "Se verifica el estado", "Una cuenta bloqueada o inactiva no puede entrar, aunque la contrasena sea correcta."),
    ("3", "Se crea la sesion", "Se firma un token JWT valido por 8 horas y se guarda en una cookie que el navegador no puede leer por script."),
    ("4", "Se registra el acceso", "Se actualiza la fecha de ultimo ingreso, se suma al contador y queda un renglon en auditoria."),
    ("5", "Se redirige segun el rol", "Estudiante al aula, empresa a su panel, KG a la administracion."),
]
y = 4.15
for n, t, dsc in flujo:
    step_row(s, Inches(0.62), Inches(y), Inches(12.1), n, t, dsc, h=0.5)
    y += 0.57

# =====================================================================
s = deck.page("Modulos 02 y 03", "Catalogo y estructura de un curso",
           "Como esta organizado el contenido academico dentro de la plataforma.")

# Jerarquia
text(s, Inches(0.62), Inches(1.78), Inches(6.0), Inches(0.3),
     [("JERARQUIA DEL CONTENIDO", 10.5, True, LIME, 0)])
jer = [
    ("CATEGORIA", "Primeros Auxilios, SST, Riesgo Psicosocial, Analytics", NAVY_D, 0.0),
    ("CURSO", "Ficha, reglas de aprobacion y certificado. Ej: KG-PA-001", NAVY, 0.35),
    ("MODULO", "Bloque tematico con un peso dentro del curso", NAVY_L, 0.7),
    ("LECCION", "Unidad minima. Aqui vive el contenido y aqui se mide el avance", LIME, 1.05),
    ("RECURSO", "Anexos descargables de la leccion (PDF, plantillas, normas)", LIME, 1.4),
]
y = 2.15
for t, dsc, c, ind in jer:
    x = Inches(0.62 + ind * 0.42)
    rect(s, x, Inches(y), Inches(6.0 - ind * 0.42), Inches(0.6), fill=c)
    text(s, x + Inches(0.2), Inches(y + 0.09), Inches(5.5 - ind * 0.42), Inches(0.45),
         [(t, 10.5, True, WHITE if c != LIME else NAVY, 1),
          (dsc, 8.2, False, WHITE if c != LIME else NAVY, 0)], spacing=1.1)
    y += 0.68

# Tipos de contenido
text(s, Inches(7.0), Inches(1.78), Inches(5.7), Inches(0.3),
     [("TIPOS DE CONTENIDO QUE ACEPTA UNA LECCION", 10.5, True, LIME, 0)])
tipos = [
    ("pendiente", "Sin material aun. Muestra el espacio reservado de KG"),
    ("video", "Se embebe el reproductor (Vimeo, YouTube, etc.)"),
    ("genially", "Recurso interactivo embebido a pantalla completa"),
    ("pdf", "Documento visible dentro del aula"),
    ("texto", "Contenido escrito directamente en la plataforma"),
    ("enlace", "Recurso externo que se abre en otra pestana"),
    ("scorm", "Paquete de e-learning estandar"),
]
y = 2.15
for t, dsc in tipos:
    rect(s, Inches(7.0), Inches(y), Inches(5.72), Inches(0.52), fill=CLOUD, line=LINE)
    text(s, Inches(7.22), Inches(y + 0.09), Inches(5.3), Inches(0.38),
         [(t, 9.5, True, NAVY, 0)])
    text(s, Inches(8.6), Inches(y + 0.12), Inches(4.0), Inches(0.38),
         [(dsc, 8.3, False, GREY, 0)])
    y += 0.59

note(s, Inches(0.62), Inches(6.3), Inches(12.1),
     "Estados de un curso:  borrador  →  revision  →  publicado  →  despublicado  →  archivado. "
     "Solo un curso publicado aparece en el catalogo publico.", h=0.55)

# =====================================================================
s = deck.page("Modulo 03", "Como carga KG el contenido de una leccion",
           "Procedimiento operativo. No requiere programador ni tocar el codigo.")
pasos = [
    ("1", "Entrar como SuperAdmin o Instructor", "Menu lateral  →  Cursos."),
    ("2", "Abrir el Constructor del curso", "Boton verde 'Constructor' en la tarjeta del curso."),
    ("3", "Elegir el tipo de contenido de la leccion", "Lista desplegable: video, genially, pdf, texto, enlace o scorm."),
    ("4", "Pegar la URL del recurso", "La direccion del video, del Genially o del documento. El material vive en el proveedor; la plataforma solo lo referencia."),
    ("5", "Guardar", "La leccion pasa de 'contenido pendiente' a 'contenido cargado' y se publica automaticamente."),
    ("6", "Publicar el curso cuando este completo", "Panel derecho del constructor: borrador, revision, publicado o despublicado."),
]
y = 1.82
for n, t, dsc in pasos:
    step_row(s, Inches(0.62), Inches(y), Inches(7.9), n, t, dsc, h=0.72)
    y += 0.8

rect(s, Inches(8.8), Inches(1.82), Inches(3.92), Inches(3.4), fill=NAVY)
text(s, Inches(9.05), Inches(2.02), Inches(3.4), Inches(3.0),
     [("QUEDA REGISTRADO", 11, True, LIME, 8),
      ("Cada cambio de contenido se guarda en auditoria con:", 9.5, False, WHITE, 8),
      ("·  Quien lo hizo", 9.5, True, WHITE, 4),
      ("·  Fecha y hora", 9.5, True, WHITE, 4),
      ("·  Que tenia antes", 9.5, True, WHITE, 4),
      ("·  Que quedo despues", 9.5, True, WHITE, 0)], spacing=1.2)

note(s, Inches(8.8), Inches(5.4), Inches(3.92),
     "El indicador 'contenido cargado' del panel muestra cuantas lecciones ya tienen material.",
     h=0.8, size=9)

note(s, Inches(0.62), Inches(6.6), Inches(7.9),
     "Mientras una leccion este en 'pendiente', el estudiante ve un espacio reservado con la marca KG, no un error.",
     h=0.5, size=9)

# =====================================================================
s = deck.page("Modulo 04", "El aula virtual",
           "Lo que ve y hace el trabajador cuando entra a estudiar.")
izq = [
    ("Indice permanente a la izquierda", "Modulos, lecciones, evaluaciones y certificado. Marca en verde lo ya completado."),
    ("Continuar donde quedo", "El sistema abre por defecto la primera leccion pendiente; no hay que buscarla."),
    ("Cronometro de permanencia", "Mide el tiempo real dedicado a cada leccion y lo acumula en el historico."),
    ("Marcar como completada", "Boton explicito. Al pulsarlo avanza el porcentaje y salta a la leccion siguiente."),
    ("Evaluacion final bloqueada", "Aparece con candado hasta terminar todas las lecciones obligatorias."),
    ("Certificado en el mismo indice", "Cuando se cumple la regla, el boton se activa solo."),
]
for i, (t, dsc) in enumerate(izq):
    x = Inches(0.62 + (i % 2) * 6.3)
    y = Inches(1.8 + (i // 2) * 1.2)
    bullet_card(s, x, y, Inches(6.0), Inches(1.05), t, dsc, LIME if i % 2 == 0 else NAVY_L, 11, 9)

text(s, Inches(0.62), Inches(5.5), Inches(12.1), Inches(0.3),
     [("LO QUE EL SISTEMA GUARDA DE CADA LECCION", 10.5, True, LIME, 0)])
guarda = [
    ("Estado", "no iniciado / en progreso / completado"),
    ("Porcentaje", "avance dentro de la leccion"),
    ("Tiempo", "segundos acumulados de permanencia"),
    ("Posicion", "segundo exacto del video para retomar"),
    ("Vistas", "cuantas veces la abrio"),
    ("Fechas", "inicio y finalizacion"),
]
for i, (t, dsc) in enumerate(guarda):
    x = Inches(0.62 + i * 2.03)
    rect(s, x, Inches(5.88), Inches(1.93), Inches(0.8), fill=CLOUD, line=LINE)
    text(s, x + Inches(0.15), Inches(5.99), Inches(1.65), Inches(0.6),
         [(t, 9.5, True, NAVY, 2), (dsc, 7.6, False, GREY, 0)], spacing=1.1)

# =====================================================================
s = deck.page("Motor de progreso", "Como se calcula el porcentaje de avance",
           "Esta es la regla mas importante de la plataforma y es configurable curso por curso.")

text(s, Inches(0.62), Inches(1.75), Inches(12.1), Inches(0.3),
     [("LAS TRES FORMAS DE CALCULARLO  ·  campo courses.progressRule", 10.5, True, LIME, 0)])
reglas = [
    ("obligatorios", "POR DEFECTO",
     "% = lecciones obligatorias completadas / total de lecciones obligatorias",
     "Todas las lecciones pesan igual. Es la mas facil de explicar al auditor.", LIME),
    ("peso_lecciones", "AVANZADA",
     "% = suma del peso de las lecciones completadas / suma total de pesos",
     "Permite que una leccion larga valga mas que una corta.", NAVY_L),
    ("peso_modulos", "AVANZADA",
     "% = suma ponderada del avance de cada modulo segun su peso",
     "Util cuando un modulo completo debe pesar mas que otro.", NAVY),
]
y = 2.12
for code, tag, formula, cuando, color in reglas:
    rect(s, Inches(0.62), Inches(y), Inches(12.1), Inches(1.0), fill=WHITE, line=LINE)
    rect(s, Inches(0.62), Inches(y), Inches(0.09), Inches(1.0), fill=color, shape=MSO_SHAPE.RECTANGLE)
    text(s, Inches(0.88), Inches(y + 0.14), Inches(2.5), Inches(0.7),
         [(code, 12, True, NAVY, 2), (tag, 8, True, color if color != LIME else AMBER, 0)])
    text(s, Inches(3.5), Inches(y + 0.14), Inches(5.4), Inches(0.7),
         [(formula, 9.5, True, INK, 3), (cuando, 8.5, False, GREY, 0)], spacing=1.15)
    y += 1.1

# Ejemplo numerico
rect(s, Inches(0.62), Inches(5.5), Inches(12.1), Inches(1.35), fill=NAVY)
text(s, Inches(0.95), Inches(5.65), Inches(3.4), Inches(1.1),
     [("EJEMPLO REAL", 11, True, LIME, 6),
      ("Primeros Auxilios Basicos", 10, True, WHITE, 2),
      ("17 lecciones obligatorias", 9, False, GREY, 0)])
ejemplo = [
    ("Completa 6 lecciones", "6 / 17", "35,3 %"),
    ("Completa 12 lecciones", "12 / 17", "70,6 %"),
    ("Completa 17 lecciones", "17 / 17", "100 %  pero aun NO aprobado"),
]
for i, (a, b, c) in enumerate(ejemplo):
    x = Inches(4.5 + i * 2.75)
    rect(s, x, Inches(5.68), Inches(2.6), Inches(0.98), fill=NAVY_L)
    text(s, x + Inches(0.18), Inches(5.78), Inches(2.3), Inches(0.8),
         [(a, 9, False, WHITE, 2), (b, 8.5, False, LIME, 2), (c, 11, True, LIME, 0)], spacing=1.1)

note(s, Inches(0.62), Inches(6.95), Inches(12.1),
     "Llegar al 100 % de lecciones NO aprueba el curso por si solo: falta la evaluacion final. Ver la lamina siguiente.",
     tono=LIME_L, h=0.42, size=9)

# =====================================================================
s = deck.page("Motor de progreso", "Cuando se considera un curso APROBADO",
           "El sistema evalua dos condiciones. Las dos deben cumplirse.")

rect(s, Inches(1.4), Inches(1.85), Inches(4.6), Inches(1.5), fill=WHITE, line=LINE)
rect(s, Inches(1.4), Inches(1.85), Inches(4.6), Inches(0.45), fill=NAVY)
text(s, Inches(1.62), Inches(1.95), Inches(4.2), Inches(0.3), [("CONDICION 1", 10.5, True, WHITE, 0)])
text(s, Inches(1.62), Inches(2.45), Inches(4.2), Inches(0.8),
     [("Lecciones obligatorias al 100 %", 12, True, NAVY, 3),
      ("Si el curso tiene requiresAllLessons activo (asi estan los tres cursos de KG).", 8.5, False, GREY, 0)], spacing=1.15)

shape_text(rect(s, Inches(6.25), Inches(2.28), Inches(0.75), Inches(0.65), fill=LIME, shape=MSO_SHAPE.OVAL),
           "Y", 16, True, NAVY)

rect(s, Inches(7.3), Inches(1.85), Inches(4.6), Inches(1.5), fill=WHITE, line=LINE)
rect(s, Inches(7.3), Inches(1.85), Inches(4.6), Inches(0.45), fill=NAVY)
text(s, Inches(7.52), Inches(1.95), Inches(4.2), Inches(0.3), [("CONDICION 2", 10.5, True, WHITE, 0)])
text(s, Inches(7.52), Inches(2.45), Inches(4.2), Inches(0.8),
     [("Evaluacion final aprobada", 12, True, NAVY, 3),
      ("Nota igual o superior al minimo del curso (80 sobre 100 por defecto).", 8.5, False, GREY, 0)], spacing=1.15)

# Flecha hacia resultado
shape_text(rect(s, Inches(4.6), Inches(3.6), Inches(4.1), Inches(0.55), fill=LIME),
           "CURSO COMPLETADO", 13, True, NAVY)

text(s, Inches(0.62), Inches(4.4), Inches(12.1), Inches(0.3),
     [("Y ENTONCES EL SISTEMA HACE ESTO, SOLO, EN EL MISMO INSTANTE", 10.5, True, LIME, 0)])
consec = [
    ("Emite el certificado", "Con codigo unico, QR y los datos congelados"),
    ("Suma 100 puntos", "Al marcador de gamificacion del trabajador"),
    ("Notifica al trabajador", "Aviso interno con el enlace de descarga"),
    ("Cierra la asignacion", "La empresa ve el estado en 'completado'"),
    ("Actualiza los indicadores", "Cumplimiento por area, cargo y sede"),
]
for i, (t, dsc) in enumerate(consec):
    x = Inches(0.62 + i * 2.45)
    rect(s, x, Inches(4.78), Inches(2.3), Inches(1.0), fill=CLOUD, line=LINE)
    c = rect(s, x + Inches(0.15), Inches(4.9), Inches(0.34), Inches(0.34), fill=LIME, shape=MSO_SHAPE.OVAL)
    shape_text(c, str(i + 1), 10, True, NAVY)
    text(s, x + Inches(0.15), Inches(5.32), Inches(2.0), Inches(0.6),
         [(t, 9.5, True, NAVY, 2), (dsc, 7.8, False, GREY, 0)], spacing=1.1)

note(s, Inches(0.62), Inches(6.05), Inches(12.1),
     "Si el curso se configura con requiresFinalExam desactivado, basta la condicion 1. Si se configura con "
     "requiresAllLessons desactivado, basta con haber iniciado y aprobar la final. Ambos interruptores son por curso.",
     h=0.62, size=9.5)

note(s, Inches(0.62), Inches(6.82), Inches(12.1),
     "El historico nunca se borra: una edicion administrativa del curso no elimina el avance ya registrado.",
     tono=CLOUD, borde=LINE, color=NAVY, h=0.42, size=9)

# =====================================================================
s = deck.page("Modulo 05", "Evaluaciones: tipos y configuracion",
           "Cada curso puede tener evaluacion diagnostica, evaluaciones por modulo y evaluacion final.")
tipos_ev = [
    ("Diagnostica", "Antes de empezar", "Mide el conocimiento previo", "NO afecta la aprobacion. Siempre se registra como presentada", LIME),
    ("Por modulo", "Al cerrar un bloque", "Refuerza lo aprendido", "Configurable como obligatoria u opcional", NAVY_L),
    ("Final", "Al terminar el curso", "Decide la aprobacion", "Debe superarse para obtener el certificado", NAVY),
]
for i, (t, cuando, obj, regla, c) in enumerate(tipos_ev):
    x = Inches(0.62 + i * 4.15)
    rect(s, x, Inches(1.8), Inches(3.85), Inches(2.0), fill=WHITE, line=LINE)
    rect(s, x, Inches(1.8), Inches(3.85), Inches(0.5), fill=c)
    text(s, x + Inches(0.22), Inches(1.92), Inches(3.4), Inches(0.3), [(t.upper(), 11.5, True, WHITE, 0)])
    text(s, x + Inches(0.22), Inches(2.45), Inches(3.4), Inches(1.25),
         [(cuando, 9, True, LIME if c != LIME else NAVY, 4),
          (obj, 10.5, True, NAVY, 4),
          (regla, 8.8, False, GREY, 0)], spacing=1.2)

text(s, Inches(0.62), Inches(4.05), Inches(12.1), Inches(0.3),
     [("PARAMETROS QUE SE CONFIGURAN EN CADA EVALUACION", 10.5, True, LIME, 0)])
params = [
    ("Nota minima", "80 sobre 100", "Debajo de ese valor no aprueba"),
    ("Intentos maximos", "3", "Al agotarlos debe intervenir KG"),
    ("Tiempo limite", "30 minutos", "Al llegar a cero se envia automaticamente"),
    ("Barajar preguntas", "Activado", "Cada intento presenta otro orden"),
    ("Barajar opciones", "Activado", "Dificulta copiar respuestas entre companeros"),
    ("Mostrar retroalimentacion", "Activado", "Explica por que la respuesta era correcta"),
    ("Mostrar respuesta correcta", "Solo en la final", "Se decide por evaluacion"),
    ("Banco de preguntas", "Por curso", "Se reutiliza en varias evaluaciones"),
]
for i, (t, val, dsc) in enumerate(params):
    x = Inches(0.62 + (i % 4) * 3.06)
    y = Inches(4.45 + (i // 4) * 1.15)
    rect(s, x, y, Inches(2.9), Inches(1.02), fill=CLOUD, line=LINE)
    text(s, x + Inches(0.18), y + Inches(0.11), Inches(2.55), Inches(0.85),
         [(t, 9.5, True, NAVY, 2), (val, 11, True, NAVY_L, 3), (dsc, 7.8, False, GREY, 0)], spacing=1.1)

note(s, Inches(0.62), Inches(6.82), Inches(12.1),
     "El banco cargado hoy es de EJEMPLO (6 preguntas). KG debe reemplazarlo por el banco oficial de cada curso.",
     tono=LIME_L, h=0.45, size=9.5)

# =====================================================================
s = deck.page("Modulo 05", "Como se calcula la NOTA de una evaluacion",
           "Calificacion automatica en el servidor. El estudiante ve el resultado de inmediato.")

rect(s, Inches(0.62), Inches(1.78), Inches(12.1), Inches(0.9), fill=NAVY)
text(s, Inches(0.95), Inches(1.92), Inches(11.5), Inches(0.65),
     [("FORMULA", 10, True, LIME, 4),
      ("NOTA  =  ( puntos obtenidos  /  puntos posibles )  ×  100          "
       "APRUEBA si  NOTA  ≥  nota minima del curso", 14, True, WHITE, 0)], spacing=1.2)

text(s, Inches(0.62), Inches(2.95), Inches(6.0), Inches(0.3),
     [("EJEMPLO CON LA EVALUACION FINAL DE KG-PA-001", 10.5, True, LIME, 0)])
calc = [
    ("Preguntas de la evaluacion", "6"),
    ("Valor de cada pregunta", "1 punto"),
    ("Puntos posibles", "6"),
    ("Respuestas correctas", "5"),
    ("Puntos obtenidos", "5"),
    ("Nota  =  (5 / 6) × 100", "83,3"),
    ("Nota minima del curso", "80"),
    ("Resultado", "APROBADO"),
]
y = 3.32
for i, (t, v) in enumerate(calc):
    ultimo = i == len(calc) - 1
    rect(s, Inches(0.62), Inches(y), Inches(6.0), Inches(0.4),
         fill=LIME if ultimo else (WHITE if i % 2 == 0 else CLOUD), line=LINE)
    text(s, Inches(0.85), Inches(y + 0.09), Inches(4.0), Inches(0.3),
         [(t, 9.5, ultimo, NAVY, 0)])
    text(s, Inches(4.9), Inches(y + 0.08), Inches(1.5), Inches(0.3),
         [(v, 10 if not ultimo else 10.5, True, NAVY, 0)], align=PP_ALIGN.RIGHT)
    y += 0.44

text(s, Inches(7.0), Inches(2.95), Inches(5.72), Inches(0.3),
     [("REGLAS QUE APLICA EL SISTEMA", 10.5, True, LIME, 0)])
reglas_nota = [
    ("Pregunta sin responder", "Se califica como incorrecta. No penaliza doble."),
    ("Redondeo", "La nota se guarda con un decimal (por ejemplo 83,3)."),
    ("Diagnostica", "Se registra la nota pero siempre queda como 'presentada'; no bloquea nada."),
    ("Intentos", "Se cuentan aunque se abandone. Al llegar al maximo sin aprobar, se bloquea."),
    ("Si ya aprobo", "No se exige mas; puede repasar sin afectar la nota obtenida."),
    ("Historico", "Cada intento queda guardado con fecha, duracion y respuesta a cada pregunta."),
]
y = 3.32
for t, dsc in reglas_nota:
    rect(s, Inches(7.0), Inches(y), Inches(5.72), Inches(0.55), fill=CLOUD, line=LINE)
    text(s, Inches(7.22), Inches(y + 0.08), Inches(5.3), Inches(0.42),
         [(t, 9.5, True, NAVY, 1), (dsc, 8.2, False, GREY, 0)], spacing=1.1)
    y += 0.62

note(s, Inches(0.62), Inches(6.98), Inches(12.1),
     "Al terminar, el estudiante ve pregunta por pregunta que respondio, si acerto y la explicacion pedagogica.",
     h=0.42, size=9)

# =====================================================================
s = deck.page("Modulo 06", "Certificados",
           "Se emiten solos cuando se cumple la regla de aprobacion. Nadie tiene que generarlos a mano.")
contenido = [
    ("Nombre del titular", "Congelado en el momento de la emision"),
    ("Numero de documento", "Para identificar sin ambiguedad"),
    ("Nombre del curso", "Tal como estaba al aprobar"),
    ("Intensidad horaria", "Las horas certificadas del curso"),
    ("Calificacion final", "La nota con la que aprobo"),
    ("Fecha de expedicion", "Dia de cumplimiento de la regla"),
    ("Vigencia", "24 meses en los cursos de KG"),
    ("Codigo unico", "Formato KG-AAAA-XXXXXX"),
    ("Codigo QR", "Lleva a la pagina publica de verificacion"),
    ("Firma autorizada", "Katerine Guanarita, Directora"),
]
text(s, Inches(0.62), Inches(1.78), Inches(6.0), Inches(0.3),
     [("QUE LLEVA IMPRESO EL CERTIFICADO", 10.5, True, LIME, 0)])
y = 2.15
for i, (t, dsc) in enumerate(contenido):
    x = Inches(0.62 + (i % 2) * 3.06)
    yy = Inches(2.15 + (i // 2) * 0.62)
    rect(s, x, yy, Inches(2.9), Inches(0.54), fill=CLOUD, line=LINE)
    text(s, x + Inches(0.16), yy + Inches(0.07), Inches(2.6), Inches(0.42),
         [(t, 9, True, NAVY, 1), (dsc, 7.6, False, GREY, 0)], spacing=1.08)

text(s, Inches(7.0), Inches(1.78), Inches(5.72), Inches(0.3),
     [("CICLO DE VIDA DEL CERTIFICADO", 10.5, True, LIME, 0)])
ciclo = [
    ("1", "Emision automatica", "Al cumplirse la regla de aprobacion."),
    ("2", "Descarga", "El titular lo imprime o lo guarda como PDF en A4 horizontal."),
    ("3", "Verificacion publica", "Cualquiera valida el codigo en /verificar sin iniciar sesion."),
    ("4", "Vencimiento", "A los 24 meses cambia a 'vencido' automaticamente."),
    ("5", "Revocacion", "KG puede anularlo dejando el motivo registrado."),
]
y = 2.15
for n, t, dsc in ciclo:
    step_row(s, Inches(7.0), Inches(y), Inches(5.72), n, t, dsc, h=0.72)
    y += 0.8

note(s, Inches(0.62), Inches(6.5), Inches(12.1),
     "'Datos congelados' significa que si manana se edita el curso o cambia el nombre del trabajador, el certificado "
     "ya emitido conserva la informacion con la que fue expedido. Es lo que exige una auditoria.", h=0.62)

# =====================================================================
s = deck.page("Modulos 07 a 09", "El panel empresarial",
           "Lo que usa talento humano del cliente para gestionar y demostrar la capacitacion.")
bloques = [
    ("Estructura organizacional", "La empresa se organiza en areas, cargos y sedes. Cada trabajador se ubica en las tres "
     "dimensiones, y eso permite despues medir por area, por cargo o por sede.", LIME),
    ("Alta de trabajadores", "Individual con un formulario, o masiva pegando una fila por persona con el formato "
     "nombres;apellidos;documento;correo;codigo. Los correos repetidos se omiten solos.", NAVY_L),
    ("Asignacion de cursos", "Se elige el curso, se filtra por area, se seleccionan las personas, se fija la fecha limite "
     "y si es obligatorio. Todo el lote queda agrupado para auditoria.", NAVY),
    ("Seguimiento", "Tabla filtrable por curso, area y estado. Responde en un clic quien no ha iniciado, quien va en "
     "progreso, quien termino y a quien se le vencio el plazo.", LIME),
    ("Reportes", "Tres exportaciones a CSV listas para Excel: seguimiento, trabajadores y certificados.", NAVY_L),
    ("Indicadores", "Cumplimiento general, avance promedio, y desglose por sede y por cargo.", NAVY),
]
for i, (t, dsc, c) in enumerate(bloques):
    x = Inches(0.62 + (i % 2) * 6.3)
    y = Inches(1.8 + (i // 2) * 1.62)
    bullet_card(s, x, y, Inches(6.0), Inches(1.45), t, dsc, c, 12, 9.3)

note(s, Inches(0.62), Inches(6.62), Inches(12.1),
     "Estados de una asignacion:  asignado  →  en progreso  →  completado.  Si pasa la fecha limite sin completarse, "
     "se muestra como vencido en rojo con los dias de atraso.", h=0.5, size=9.5)

# =====================================================================
s = deck.page("Modulo 09", "Los reportes que puede descargar la empresa",
           "Todos en CSV separado por punto y coma, listos para abrir en Excel.")
reportes = [
    ("Seguimiento", "Una fila por asignacion",
     "Documento · Trabajador · Correo · Area · Cargo · Sede · Curso · Codigo · Obligatorio · Estado · "
     "Avance % · Nota final · Fecha limite · Inicio · Finalizacion",
     "Es el reporte que pide un auditor o la ARL."),
    ("Trabajadores", "Una fila por persona",
     "Codigo · Nombres · Apellidos · Documento · Correo · Area · Cargo · Sede · Estado · Cursos asignados · "
     "Cursos completados · Avance promedio · Certificados · Ultimo acceso",
     "Sirve para conciliar la nomina con la plataforma."),
    ("Certificados", "Una fila por certificado",
     "Codigo · Trabajador · Documento · Curso · Horas · Nota · Emitido · Vence · Estado · URL de verificacion",
     "Evidencia formal de la formacion impartida."),
]
y = 1.8
for t, granularidad, cols, uso in reportes:
    rect(s, Inches(0.62), Inches(y), Inches(12.1), Inches(1.42), fill=WHITE, line=LINE)
    rect(s, Inches(0.62), Inches(y), Inches(0.09), Inches(1.42), fill=LIME, shape=MSO_SHAPE.RECTANGLE)
    text(s, Inches(0.9), Inches(y + 0.14), Inches(2.6), Inches(1.1),
         [(t, 13, True, NAVY, 3), (granularidad, 8.5, True, NAVY_L, 0)])
    text(s, Inches(3.7), Inches(y + 0.14), Inches(8.8), Inches(1.15),
         [("Columnas:", 8.5, True, NAVY_L, 2),
          (cols, 8.8, False, INK, 5),
          (uso, 9, True, NAVY, 0)], spacing=1.18)
    y += 1.55

note(s, Inches(0.62), Inches(6.5), Inches(12.1),
     "La exportacion a PDF con imagen corporativa y el envio programado por correo quedaron previstos para la Fase 2.",
     tono=CLOUD, borde=LINE, h=0.5, size=9.5)

# =====================================================================
s = deck.page("Modulo 10", "Gamificacion: como funcionan los puntos",
           "Sistema motivacional. Es independiente de la nota y NUNCA afecta la aprobacion ni el certificado.")

rect(s, Inches(0.62), Inches(1.75), Inches(5.9), Inches(2.5), fill=WHITE, line=LINE)
rect(s, Inches(0.62), Inches(1.75), Inches(5.9), Inches(0.5), fill=LIME)
text(s, Inches(0.85), Inches(1.86), Inches(5.4), Inches(0.3), [("COMO SE GANAN PUNTOS", 11, True, NAVY, 0)])
puntos = [
    ("Completar una leccion", "+10 puntos"),
    ("Aprobar una evaluacion", "+50 puntos"),
    ("Completar un curso", "+100 puntos"),
]
y = 2.42
for t, v in puntos:
    rect(s, Inches(0.9), Inches(y), Inches(5.34), Inches(0.52), fill=CLOUD, line=LINE)
    text(s, Inches(1.1), Inches(y + 0.13), Inches(3.4), Inches(0.32), [(t, 10, False, INK, 0)])
    text(s, Inches(4.6), Inches(y + 0.1), Inches(1.5), Inches(0.35),
         [(v, 12, True, NAVY_L, 0)], align=PP_ALIGN.RIGHT)
    y += 0.6

# Ejemplo de acumulacion
rect(s, Inches(6.82), Inches(1.75), Inches(5.9), Inches(2.5), fill=NAVY)
text(s, Inches(7.05), Inches(1.9), Inches(5.4), Inches(0.3), [("EJEMPLO: UN CURSO COMPLETO", 11, True, LIME, 0)])
acum = [
    ("17 lecciones × 10", "170"),
    ("1 evaluacion final aprobada × 50", "50"),
    ("1 curso completado × 100", "100"),
    ("TOTAL DEL CURSO", "320 puntos"),
]
y = 2.42
for i, (t, v) in enumerate(acum):
    ultimo = i == len(acum) - 1
    if ultimo:
        rect(s, Inches(7.05), Inches(y + 0.06), Inches(5.44), Inches(0.5), fill=LIME)
    text(s, Inches(7.25), Inches(y + 0.14), Inches(3.9), Inches(0.32),
         [(t, 10, ultimo, NAVY if ultimo else WHITE, 0)])
    text(s, Inches(10.9), Inches(y + 0.11), Inches(1.4), Inches(0.35),
         [(v, 12, True, NAVY if ultimo else LIME, 0)], align=PP_ALIGN.RIGHT)
    y += 0.6

# Niveles / racha / insignias / ranking
otros = [
    ("Niveles", "Cada 250 puntos se sube de nivel.  Nivel = (puntos ÷ 250) + 1.  Con 320 puntos el trabajador esta "
     "en nivel 2 y le faltan 180 para el nivel 3.", LIME),
    ("Racha de estudio", "Cuenta los dias seguidos en que completo al menos una leccion. Si deja pasar un dia, la racha "
     "vuelve a 1, pero se conserva el registro de la racha mas larga.", NAVY_L),
    ("Ranking", "Tabla con los cinco usuarios de mas puntos de la plataforma. El propio usuario se resalta como 'Usted'.", NAVY),
    ("Insignias", "Hay 5 insignias definidas (Primer paso, Constante, Certificado obtenido, Brigadista KG, Nota perfecta). "
     "La entrega automatica queda para la Fase 2; hoy el catalogo esta creado y la insignia se puede otorgar.", AMBER),
]
for i, (t, dsc, c) in enumerate(otros):
    x = Inches(0.62 + (i % 2) * 6.3)
    y = Inches(4.45 + (i // 2) * 1.32)
    bullet_card(s, x, y, Inches(6.0), Inches(1.18), t, dsc, c, 11.5, 9)

note(s, Inches(0.62), Inches(7.08), Inches(12.1),
     "Los puntos no se restan nunca y no influyen en el certificado.", tono=CLOUD, borde=LINE, h=0.34, size=9)

# =====================================================================
s = deck.page("Modulos 11 y 12", "Notificaciones, auditoria y seguridad",
           "Los dos modulos que sostienen la operacion y la confianza en los datos.")

text(s, Inches(0.62), Inches(1.78), Inches(6.0), Inches(0.3),
     [("NOTIFICACIONES AUTOMATICAS", 10.5, True, LIME, 0)])
notifs = [
    ("Bienvenida", "Al crearse la cuenta"),
    ("Curso asignado", "Cuando la empresa entrega un curso"),
    ("Recordatorio", "Curso pendiente sin iniciar"),
    ("Proximo a vencer", "Se acerca la fecha limite"),
    ("Curso completado", "Felicitacion al terminar"),
    ("Certificado disponible", "Con el enlace de descarga"),
    ("Recuperar contrasena", "Enlace de restablecimiento"),
]
y = 2.15
for t, dsc in notifs:
    rect(s, Inches(0.62), Inches(y), Inches(6.0), Inches(0.5), fill=CLOUD, line=LINE)
    text(s, Inches(0.85), Inches(y + 0.13), Inches(2.6), Inches(0.3), [(t, 9.5, True, NAVY, 0)])
    text(s, Inches(3.5), Inches(y + 0.14), Inches(3.0), Inches(0.3), [(dsc, 8.5, False, GREY, 0)])
    y += 0.57

note(s, Inches(0.62), Inches(6.2), Inches(6.0),
     "Hoy llegan a la campana dentro de la plataforma. El envio por correo se activa al configurar el proveedor SMTP.",
     tono=LIME_L, h=0.62, size=8.8)

text(s, Inches(7.0), Inches(1.78), Inches(5.72), Inches(0.3),
     [("AUDITORIA Y SEGURIDAD", 10.5, True, LIME, 0)])
seg = [
    ("Que se audita", "Ingresos, creacion, edicion, publicacion, asignacion, revocacion y exportacion."),
    ("Que guarda cada renglon", "Actor, correo, accion, entidad, resumen, fecha, y el estado antes y despues."),
    ("Contrasenas", "Cifradas con bcrypt. Nunca se guardan ni se envian en texto plano."),
    ("Sesion", "Token firmado en cookie que el navegador no expone a scripts. Caduca a las 8 horas."),
    ("Datos personales", "Se registra la fecha en que la persona autorizo el tratamiento (Ley 1581 de 2012)."),
    ("Trazabilidad academica", "El avance y los intentos no se borran por una edicion administrativa."),
]
y = 2.15
for t, dsc in seg:
    rect(s, Inches(7.0), Inches(y), Inches(5.72), Inches(0.72), fill=WHITE, line=LINE)
    rect(s, Inches(7.0), Inches(y), Inches(0.08), Inches(0.72), fill=NAVY_L, shape=MSO_SHAPE.RECTANGLE)
    text(s, Inches(7.24), Inches(y + 0.1), Inches(5.3), Inches(0.55),
         [(t, 9.5, True, NAVY, 1), (dsc, 8.2, False, GREY, 0)], spacing=1.1)
    y += 0.8

# =====================================================================
s = deck.page("Vision de conjunto", "Recorrido completo de una capacitacion",
           "Desde que la empresa decide capacitar hasta que puede demostrarlo ante un auditor.")
recorrido = [
    ("KG", "Crea y publica el curso", "Estructura, contenidos, evaluaciones y reglas."),
    ("EMPRESA", "Registra a sus trabajadores", "Por area, cargo y sede."),
    ("EMPRESA", "Asigna el curso", "Con fecha limite y caracter obligatorio."),
    ("SISTEMA", "Notifica al trabajador", "Aviso interno con el enlace directo."),
    ("TRABAJADOR", "Estudia en el aula", "El avance se guarda leccion a leccion."),
    ("TRABAJADOR", "Presenta la evaluacion final", "Calificacion automatica e inmediata."),
    ("SISTEMA", "Emite el certificado", "Codigo unico y QR verificable."),
    ("EMPRESA", "Descarga la evidencia", "Reporte CSV y certificados."),
    ("AUDITOR", "Verifica el certificado", "Escanea el QR sin necesidad de cuenta."),
]
COLORES = {"KG": NAVY, "EMPRESA": NAVY_L, "TRABAJADOR": LIME, "SISTEMA": AMBER, "AUDITOR": RED}
for i, (actor, t, dsc) in enumerate(recorrido):
    col, row = i % 3, i // 3
    x = Inches(0.62 + col * 4.08)
    y = Inches(1.82 + row * 1.55)
    rect(s, x, y, Inches(3.85), Inches(1.38), fill=WHITE, line=LINE)
    tag = rect(s, x + Inches(0.16), y + Inches(0.14), Inches(1.55), Inches(0.32), fill=COLORES[actor])
    shape_text(tag, actor, 8, True, NAVY if actor == "TRABAJADOR" else WHITE)
    num = rect(s, x + Inches(3.25), y + Inches(0.12), Inches(0.42), Inches(0.36), fill=CLOUD)
    shape_text(num, str(i + 1), 10, True, NAVY)
    text(s, x + Inches(0.16), y + Inches(0.58), Inches(3.5), Inches(0.7),
         [(t, 11, True, NAVY, 2), (dsc, 8.5, False, GREY, 0)], spacing=1.12)

note(s, Inches(0.62), Inches(6.72), Inches(12.1),
     "Todo el recorrido queda registrado: cada paso deja fecha, responsable y evidencia descargable.",
     h=0.45, size=9.5)

# =====================================================================
s = deck.page("Referencia", "Glosario y estados del sistema",
           "Vocabulario comun para hablar todos de lo mismo.")
glos = [
    ("Matricula (enrollment)", "El vinculo entre una persona y un curso. Guarda el avance, la nota y las fechas."),
    ("Asignacion", "La orden de la empresa para que un trabajador tome un curso. Tiene fecha limite."),
    ("Lote de asignacion", "El grupo de asignaciones creadas de una sola vez. Sirve para auditar."),
    ("Intento", "Cada vez que alguien envia una evaluacion. Se guardan todos, no solo el mejor."),
    ("Nota", "Calificacion de 0 a 100 de una evaluacion. Decide la aprobacion."),
    ("Puntos", "Marcador de gamificacion. No decide nada academico."),
    ("Codigo de verificacion", "Identificador unico del certificado, formato KG-AAAA-XXXXXX."),
    ("Datos congelados", "La informacion que queda fija en el certificado al emitirlo."),
]
table(s, Inches(0.62), Inches(1.78), Inches(6.0),
      ["Termino", "Significado"], glos, [2.4, 5.0], row_h=0.52, size=9)

estados = [
    ("Curso", "borrador · revision · publicado · despublicado · archivado"),
    ("Matricula", "no iniciado · en progreso · completado · vencido · anulado"),
    ("Asignacion", "asignado · en progreso · completado · vencido · cancelado"),
    ("Leccion", "no iniciado · en progreso · completado"),
    ("Intento", "en curso · finalizado · anulado"),
    ("Certificado", "vigente · vencido · revocado"),
    ("Usuario", "activo · pendiente de activacion · inactivo · bloqueado"),
    ("Empresa", "activa · suspendida · inactiva"),
]
table(s, Inches(6.92), Inches(1.78), Inches(5.8),
      ["Entidad", "Estados posibles"], estados, [1.6, 4.4], row_h=0.52, size=9)

# =====================================================================
s = deck.page("Referencia", "Que esta listo y que falta definir",
           "Transparencia sobre el alcance entregado.")
listo = [
    "Modelo de datos completo (44 tablas)",
    "Acceso, roles, permisos y aislamiento por empresa",
    "Catalogo, ficha de curso y matricula",
    "Aula virtual con progreso leccion a leccion",
    "Constructor de cursos para cargar contenido sin programar",
    "Evaluaciones con calificacion automatica y retroalimentacion",
    "Certificados automaticos con QR y verificacion publica",
    "Panel empresarial con asignacion masiva y seguimiento",
    "Reportes CSV y panel de administracion KG",
    "Gamificacion de puntos, niveles y rachas",
    "Auditoria de acciones relevantes",
]
falta = [
    ("Banco oficial de preguntas", "Las 6 preguntas cargadas son de ejemplo; KG debe entregar las definitivas."),
    ("Contenido audiovisual", "Videos, PDF y recursos de Genially de los tres cursos."),
    ("Pasarela de pagos", "Marcada POR DEFINIR en el esqueleto. Las tablas ya existen."),
    ("Proveedor de correo", "Configurar SMTP para que las notificaciones salgan por email."),
    ("Entrega automatica de insignias", "El catalogo existe; falta la regla que las otorga sola."),
    ("Edicion de usuarios desde la interfaz", "Hoy se administran por base de datos o seed."),
]
text(s, Inches(0.62), Inches(1.78), Inches(6.0), Inches(0.3),
     [("ENTREGADO Y FUNCIONANDO", 10.5, True, LIME, 0)])
y = 2.15
for it in listo:
    c = rect(s, Inches(0.68), Inches(y + 0.05), Inches(0.16), Inches(0.16), fill=LIME, shape=MSO_SHAPE.OVAL)
    text(s, Inches(1.0), Inches(y), Inches(5.6), Inches(0.3), [(it, 9.8, False, INK, 0)])
    y += 0.4

text(s, Inches(7.0), Inches(1.78), Inches(5.72), Inches(0.3),
     [("PENDIENTE DE KG O DE FASE 2", 10.5, True, AMBER, 0)])
y = 2.15
for t, dsc in falta:
    rect(s, Inches(7.0), Inches(y), Inches(5.72), Inches(0.66), fill=CLOUD, line=LINE)
    text(s, Inches(7.22), Inches(y + 0.09), Inches(5.3), Inches(0.5),
         [(t, 9.5, True, NAVY, 1), (dsc, 8.2, False, GREY, 0)], spacing=1.1)
    y += 0.74

# =====================================================================
deck.closing("Un manual para operar la plataforma sin depender del desarrollador.")

out = deck.save("KG_Academy_Manual_Funcional.pptx")
print("OK ->", out)
