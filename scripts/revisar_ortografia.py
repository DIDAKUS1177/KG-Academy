# -*- coding: utf-8 -*-
"""Reporta palabras sin tilde que quedaron en texto visible, ignorando identificadores."""
import io, re, glob
from ortografia import BASE, variantes

DICC = variantes(BASE)
RX = re.compile(r"(?<![\w.])(" + "|".join(sorted(DICC, key=len, reverse=True)) + r")(?![\w])")

# El token es codigo si es una clave, una propiedad o una declaracion.
CODIGO_DESPUES = re.compile(r"^\s*[:?=(),.\[\]]")
DECLARACION = re.compile(r"\b(const|let|var|function|interface|type|import|from)\s+$")

ARCHIVOS = sorted(
    glob.glob("src/**/*.tsx", recursive=True)
    + glob.glob("src/**/*.ts", recursive=True)
    + ["prisma/seed.ts"]
)

total = 0
for f in ARCHIVOS:
    for i, linea in enumerate(io.open(f, encoding="utf-8").read().split("\n"), 1):
        for m in RX.finditer(linea):
            antes = linea[: m.start()]
            despues = linea[m.end():]
            if CODIGO_DESPUES.match(despues):
                continue
            if DECLARACION.search(antes):
                continue
            if '"' + m.group(1) + '"' in linea or "'" + m.group(1) + "'" in linea:
                continue  # literal exacto: es un codigo o el nombre de un campo
            total += 1
            print("%s:%d  [%s]  %s" % (f.replace("\\", "/"), i, m.group(1), linea.strip()[:110]))

print("\nTOTAL CANDIDATOS: %d" % total)
