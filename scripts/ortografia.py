# -*- coding: utf-8 -*-
"""
Corrige la ortografia del espanol (tildes y enes) en el texto visible.

Solo toca:
  - literales de cadena que NO son codigos, slugs ni rutas
  - texto JSX entre > y <
  - lineas de comentario

Nunca toca identificadores, por lo que `areaId`, `basico` (valor de nivel),
`no_iniciado` o los slugs quedan intactos.
"""
import io, re, glob, sys

# --------------------------------------------------------------------------
# 1. Frases que dependen del contexto (se aplican antes que el diccionario).
#    Se marcan con un testigo y se resuelven al final, para que el diccionario
#    no las vuelva a tocar.
# --------------------------------------------------------------------------
FRASES_CONTEXTO = [
    ("quien inicio", "quien INICIO_V"),
    ("Quien inicio", "Quien INICIO_V"),
    ("quien termino", "quien TERMINO_V"),
    ("Quien termino", "Quien TERMINO_V"),
    ("quien completo", "quien COMPLETO_V"),
    ("Quien completo", "Quien COMPLETO_V"),
    ("donde quedo", "donde QUEDO_V"),
    ("Curso y aprobo", "CURSO_V y aprobo"),
    ("curso y aprobo", "curso_v y aprobo"),
    ("Completo su primera leccion", "COMPLETO_V su primera leccion"),
    ("Completo los tres cursos", "COMPLETO_V los tres cursos"),
    ("Felicitaciones, completo", "Felicitaciones, COMPLETO_V"),
    ('Completo "', 'COMPLETO_V "'),
    ("Como funciona", "COMO_I funciona"),
    ("como funciona", "como_i funciona"),
    ("Que es una crisis", "QUE_I es una crisis"),
    ("Que son los primeros auxilios", "QUE_I son los primeros auxilios"),
    ("Que decir, que no decir", "QUE_I decir, QUE_I no decir"),
    ("Que hace", "QUE_I hace"),
    ("Que puede hacer", "QUE_I puede hacer"),
    ("Que lleva", "QUE_I lleva"),
    ("Que se audita", "QUE_I se audita"),
    ("Que guarda", "QUE_I guarda"),
    ("Que aporta", "QUE_I aporta"),
    ("Que es", "QUE_I es"),
    ("que el codigo este escrito", "que el codigo ESTE_V escrito"),
]

# Los marcadores se resuelven al final
MARCADORES = {
    "INICIO_V": "inició",
    "TERMINO_V": "terminó",
    "COMPLETO_V": "completó",
    "QUEDO_V": "quedó",
    "CURSO_V": "Cursó",
    "curso_v": "cursó",
    "COMO_I": "Cómo",
    "como_i": "cómo",
    "QUE_I": "Qué",
    "ESTE_V": "esté",
}

# "esta" como verbo (seguido de participio, adjetivo o preposicion)
RE_ESTA_VERBO = re.compile(
    r"\b([Ee])sta(\s+(?:incluido|incluida|modelada|modelado|matriculado|matriculada|"
    r"bloqueada|bloqueado|inactiva|inactivo|pendiente|disponible|activa|activo|"
    r"listo|lista|creado|creada|registrado|registrada|vigente|publicado|publicada|"
    r"en\s|al\s|por\s|siendo\s))"
)

# --------------------------------------------------------------------------
# 2. Diccionario de palabras (base en minuscula, sin ambiguedad de contexto)
# --------------------------------------------------------------------------
BASE = {
    # -cion / -sion  (el plural -ciones NO lleva tilde)
    "accion": "acción", "activacion": "activación", "administracion": "administración",
    "alteracion": "alteración", "aplicacion": "aplicación", "aprobacion": "aprobación",
    "articulacion": "articulación", "asignacion": "asignación", "atencion": "atención",
    "autoproteccion": "autoprotección", "calificacion": "calificación",
    "capacitacion": "capacitación", "categorizacion": "categorización",
    "certificacion": "certificación", "comunicacion": "comunicación",
    "compasion": "compasión", "configuracion": "configuración",
    "construccion": "construcción", "contencion": "contención", "convulsion": "convulsión",
    "cotizacion": "cotización", "creacion": "creación", "definicion": "definición",
    "derivacion": "derivación", "descripcion": "descripción",
    "desobstruccion": "desobstrucción", "emision": "emisión",
    "estabilizacion": "estabilización", "evaluacion": "evaluación",
    "exportacion": "exportación", "finalizacion": "finalización", "formacion": "formación",
    "gamificacion": "gamificación", "gestion": "gestión", "informacion": "información",
    "inmovilizacion": "inmovilización", "inscripcion": "inscripción",
    "intervencion": "intervención", "introduccion": "introducción", "leccion": "lección",
    "movilizacion": "movilización", "notificacion": "notificación",
    "obstruccion": "obstrucción", "permeabilizacion": "permeabilización",
    "poblacion": "población", "presentacion": "presentación", "presion": "presión",
    "prevencion": "prevención", "produccion": "producción", "proteccion": "protección",
    "psicoeducacion": "psicoeducación", "publicacion": "publicación", "reaccion": "reacción",
    "reanimacion": "reanimación", "recomendacion": "recomendación",
    "recuperacion": "recuperación", "resolucion": "resolución", "revision": "revisión",
    "revocacion": "revocación", "separacion": "separación", "sesion": "sesión",
    "sudoracion": "sudoración", "valoracion": "valoración", "ventilacion": "ventilación",
    "verificacion": "verificación", "vinculacion": "vinculación",
    # esdrujulas y otras con tilde
    "aerea": "aérea", "aereo": "aéreo", "analisis": "análisis", "area": "área",
    "areas": "áreas", "aqui": "aquí", "ahi": "ahí", "asi": "así",
    "auditoria": "auditoría", "auditorias": "auditorías",
    "automatico": "automático", "automatica": "automática",
    "automaticos": "automáticos", "automaticas": "automáticas",
    "basico": "básico", "basica": "básica", "basicos": "básicos", "basicas": "básicas",
    "botiquin": "botiquín", "caracter": "carácter",
    "categoria": "categoría", "categorias": "categorías",
    "clinico": "clínico", "clinica": "clínica", "clinicas": "clínicas",
    "codigo": "código", "codigos": "códigos", "cronico": "crónico",
    "despues": "después", "ademas": "además", "tambien": "también", "segun": "según",
    "dia": "día", "dias": "días", "diagnostico": "diagnóstico",
    "electrico": "eléctrico", "electrica": "eléctrica",
    "especifico": "específico", "especifica": "específica",
    "facil": "fácil", "dificil": "difícil", "fisico": "físico", "fisica": "física",
    "grafico": "gráfico", "grafica": "gráfica",
    "historico": "histórico", "historica": "histórica",
    "limite": "límite", "limites": "límites", "linea": "línea", "lineas": "líneas",
    "logico": "lógico", "logica": "lógica",
    "maximo": "máximo", "maxima": "máxima", "maximos": "máximos",
    "medico": "médico", "medica": "médica", "medicos": "médicos",
    "metodologia": "metodología",
    "minimo": "mínimo", "minima": "mínima", "minimos": "mínimos",
    "modulo": "módulo", "modulos": "módulos",
    "numero": "número", "numeros": "números", "numerico": "numérico",
    "oxigeno": "oxígeno", "pagina": "página", "paginas": "páginas",
    "parrafo": "párrafo", "pedagogico": "pedagógico", "pedagogica": "pedagógica",
    "pediatrico": "pediátrico", "pediatrica": "pediátrica", "pediatricos": "pediátricos",
    "practico": "práctico", "practica": "práctica",
    "practicos": "prácticos", "practicas": "prácticas",
    "proximo": "próximo", "proxima": "próxima",
    "psicologico": "psicológico", "psicologica": "psicológica",
    "psicologicos": "psicológicos",
    "publico": "público", "publica": "pública", "publicos": "públicos", "publicas": "públicas",
    "quien": "quién", "quienes": "quiénes", "cual": "cuál", "cuales": "cuáles",
    "rapido": "rápido", "rapida": "rápida",
    "sintoma": "síntoma", "sintomas": "síntomas",
    "tecnico": "técnico", "tecnica": "técnica", "tecnicos": "técnicos", "tecnicas": "técnicas",
    "telefono": "teléfono", "titulo": "título", "titulos": "títulos",
    "ultimo": "último", "ultima": "última", "ultimos": "últimos", "ultimas": "últimas",
    "unico": "único", "unica": "única", "unicos": "únicos", "unicas": "únicas",
    "util": "útil", "utiles": "útiles",
    "valido": "válido", "valida": "válida", "validos": "válidos",
    "via": "vía", "vias": "vías",
    "victima": "víctima", "victimas": "víctimas",
    "mas": "más", "aun": "aún", "ningun": "ningún",
    # verbos sin ambiguedad
    "actua": "actúa", "aprobo": "aprobó", "asigno": "asignó", "creo": "creó",
    "emitio": "emitió", "estan": "están", "podra": "podrá", "debera": "deberá",
    "sera": "será", "tendra": "tendrá", "habra": "habrá", "estara": "estará",
    "mostrara": "mostrará", "quedara": "quedará", "recibira": "recibirá",
    "enviara": "enviará", "aparecera": "aparecerá", "permitira": "permitirá",
    # ene
    "ano": "año", "anos": "años", "nino": "niño", "ninos": "niños", "nina": "niña",
    "extrano": "extraño", "dano": "daño", "danos": "daños", "danan": "dañan",
    "senal": "señal", "senales": "señales", "diseno": "diseño",
    "disenado": "diseñado", "disenada": "diseñada", "disenar": "diseñar",
    "contrasena": "contraseña", "contrasenas": "contraseñas",
    "pequeno": "pequeño", "companero": "compañero", "companeros": "compañeros",
    "compania": "compañía", "manana": "mañana", "tamano": "tamaño",
    # vocabulario clinico y academico detectado en la revision de KG
    "medicas": "médicas", "anatomico": "anatómico", "anatomica": "anatómica",
    "anatomicos": "anatómicos", "anatomicas": "anatómicas",
    "fisiologico": "fisiológico", "fisiologica": "fisiológica",
    "fisiologicos": "fisiológicos", "fisiologicas": "fisiológicas",
    "fisiopatologico": "fisiopatológico", "fisiopatologica": "fisiopatológica",
    "fisiopatologicos": "fisiopatológicos", "fisiopatologicas": "fisiopatológicas",
    "clinicos": "clínicos", "cardiaco": "cardíaco",
    "evalua": "evalúa", "evaluan": "evalúan", "continua": "continúa",
    "suscripcion": "suscripción",
    "programatico": "programático", "programatica": "programática",
    "asincronico": "asincrónico", "asincronica": "asincrónica",
    "sincronico": "sincrónico", "sincronica": "sincrónica",
    "dialogo": "diálogo", "dialogos": "diálogos",
    "vision": "visión", "conexion": "conexión", "edicion": "edición",
    "seleccion": "selección", "demostracion": "demostración",
    "distribucion": "distribución", "expedicion": "expedición",
    "facturacion": "facturación",
    "matricula": "matrícula", "matriculas": "matrículas", "demas": "demás",
    "envio": "envío", "actualizacion": "actualización", "duracion": "duración",
    "estandar": "estándar", "estandares": "estándares",
    "desempeno": "desempeño", "acompanamiento": "acompañamiento",
    "acompanar": "acompañar", "guanarita": "guañarita",
}


def variantes(base):
    """Genera minuscula, Capitalizada y MAYUSCULA de cada par."""
    out = {}
    for k, v in base.items():
        out[k] = v
        out[k.capitalize()] = v.capitalize()
        out[k.upper()] = v.upper()
    return out


DICC = variantes(BASE)
RE_PALABRAS = re.compile(r"\b(" + "|".join(sorted(DICC, key=len, reverse=True)) + r")\b")

RE_ESPACIO = re.compile(r"\s")


def es_codigo(txt):
    if not txt.strip():
        return True
    if not RE_ESPACIO.search(txt):
        if txt.islower() or txt.startswith("/") or "_" in txt or "-" in txt or "://" in txt:
            return True
    return False


def corregir_texto(t):
    return RE_PALABRAS.sub(lambda m: DICC[m.group(1)], t)


# Dentro de un template literal, lo que va en ${...} es codigo (variables),
# no texto: hay que dejarlo intacto o se renombran identificadores.
RE_INTERPOLACION = re.compile(r"\$\{[^{}]*\}")


def corregir_template(t):
    partes, ultimo = [], 0
    for m in RE_INTERPOLACION.finditer(t):
        partes.append(corregir_texto(t[ultimo:m.start()]))
        partes.append(m.group(0))
        ultimo = m.end()
    partes.append(corregir_texto(t[ultimo:]))
    return "".join(partes)


RE_DOBLE = re.compile(r'"([^"\n]*)"')
RE_SIMPLE = re.compile(r"'([^'\n]*)'")
RE_BACKTICK = re.compile(r"`([^`]*)`")
# Un texto JSX es un tramo delimitado por una etiqueta o una expresion a cada
# lado: empieza tras `>` o `}` y termina antes de `<` o `{`. Puede ocupar varias
# lineas, que es como quedan los parrafos largos del maquetado.
RE_JSX = re.compile(r"(?<=[>}])([^<>{}]+)(?=[<{])")

# Las entidades HTML (&middot; &quot;) llevan punto y coma. Se apartan antes de
# decidir si el tramo es prosa: si no, ese ";" lo haria pasar por codigo.
RE_ENTIDAD = re.compile(r"&[a-zA-Z]+;|&#[0-9]+;")
# Si el tramo trae puntuacion de codigo no es prosa: no se toca.
RE_NO_PROSA = re.compile(r"[=;\[\]\"'`$\\]")
RE_PALABRA_LARGA = re.compile(r"[A-Za-zÁÉÍÓÚÑáéíóúñ]{4,}")
# Acceso a propiedad: la marca mas fiable de que un tramo es codigo.
RE_PROPIEDAD = re.compile(r"\.[A-Za-z]")


def es_prosa(t):
    limpio = RE_ENTIDAD.sub(" ", t)
    if RE_NO_PROSA.search(limpio):
        return False
    palabras = RE_PALABRA_LARGA.findall(limpio)
    # La prosa usa parentesis —"trabajador(es)"— pero el codigo tambien. Con
    # parentesis se exige mas evidencia de que es una frase de verdad.
    if "(" in limpio or ")" in limpio:
        if RE_PROPIEDAD.search(limpio) or len(palabras) < 3:
            return False
    return len(palabras) >= 1


def corregir_jsx(t):
    """Corrige el tramo dejando intactas las entidades HTML."""
    if not es_prosa(t):
        return t
    out, ultimo = [], 0
    for m in RE_ENTIDAD.finditer(t):
        out.append(corregir_texto(t[ultimo:m.start()]))
        out.append(m.group(0))
        ultimo = m.end()
    out.append(corregir_texto(t[ultimo:]))
    return "".join(out)
RE_COMENTARIO = re.compile(r"^(\s*(?://|\*|/\*)\s?)(.*)$")
RE_COMENTARIO_JSX = re.compile(r"\{/\*([^*]*)\*/\}")


def procesar(ruta):
    original = io.open(ruta, encoding="utf-8").read()
    s = original

    # --- frases con contexto ---
    for viejo, nuevo in FRASES_CONTEXTO:
        s = s.replace(viejo, nuevo)
    s = RE_ESTA_VERBO.sub(lambda m: m.group(1) + "stá" + m.group(2), s)

    # --- comentarios completos ---
    lineas = []
    for linea in s.split("\n"):
        m = RE_COMENTARIO.match(linea)
        if m:
            linea = m.group(1) + corregir_texto(m.group(2))
        lineas.append(linea)
    s = "\n".join(lineas)

    # --- literales de cadena y texto JSX ---
    def sub_literal(comilla):
        def _f(m):
            t = m.group(1)
            if es_codigo(t):
                return m.group(0)
            return comilla + corregir_texto(t) + comilla
        return _f

    s = RE_DOBLE.sub(sub_literal('"'), s)
    s = RE_SIMPLE.sub(sub_literal("'"), s)

    def sub_backtick(m):
        t = m.group(1)
        if es_codigo(t):
            return m.group(0)
        return "`" + corregir_template(t) + "`"

    s = RE_BACKTICK.sub(sub_backtick, s)
    s = RE_JSX.sub(lambda m: corregir_jsx(m.group(1)), s)

    # comentarios JSX: {/* ... */}
    s = RE_COMENTARIO_JSX.sub(lambda m: "{/*" + corregir_texto(m.group(1)) + "*/}", s)

    # --- resolver marcadores ---
    for marca, valor in MARCADORES.items():
        s = s.replace(marca, valor)

    if s != original:
        io.open(ruta, "w", encoding="utf-8", newline="\n").write(s)
        return True
    return False


if __name__ == "__main__":
    archivos = sorted(
        glob.glob("src/**/*.tsx", recursive=True)
        + glob.glob("src/**/*.ts", recursive=True)
        + ["prisma/seed.ts"]
    )
    cambiados = [f for f in archivos if procesar(f)]
    print("Archivos corregidos: %d de %d" % (len(cambiados), len(archivos)))
    for f in cambiados:
        print("  ", f)
