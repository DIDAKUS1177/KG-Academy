# CONTEXTO DEL PROYECTO — KG ACADEMY

> Documento de contexto para cualquier persona (o agente) que abra este repositorio.
> Explica **qué es**, **por qué está hecho así** y **qué no se debe romper**.
> Para instrucciones de instalación y rutas, ver [README.md](README.md).

---

## 1. Qué es

**KG Academy** es la plataforma educativa virtual (LMS) de **KG GESTIÓN INTEGRAL S.A.S.**,
empresa colombiana de consultoría en Seguridad y Salud en el Trabajo dirigida por
**Katerine Guañarita**.

No es un LMS genérico. Su razón de existir es que una empresa cliente pueda **demostrar ante
una auditoría o ante la ARL** que capacitó a su gente: quién estudió, cuánto avanzó, qué nota
sacó y qué certificado obtuvo. Todo lo demás (catálogo, aula, gamificación) está al servicio
de eso.

- **Desarrollo:** Diego Alejandro Hernández Blanco.
- **Propietario del producto:** KG Gestión Integral S.A.S.
- **Repositorio:** <https://github.com/DIDAKUS1177/KG-Academy>

---

## 2. De dónde salió

El proyecto se construyó a partir de dos insumos entregados por el cliente, ambos conservados
en `docs/`:

| Documento | Qué aporta |
|---|---|
| `Esqueleto_Especificaciones_KG_Academy.docx` | Especificación funcional v0.1 con 26 apartados. Es **la fuente de verdad del alcance**. |
| `Portafolio_KG_Gestion_Integral.pdf` | Portafolio comercial de KG (es un PDF de imágenes, sin texto extraíble). |
| `public/brand/kg-logo.png` | Logotipo oficial. De aquí salió toda la paleta de la plataforma. |

Cuando en el código o en los documentos aparece algo como *"punto 8 del esqueleto"*, se refiere
al apartado numerado de ese Word.

**Regla heredada del documento:** todo lo que el esqueleto marcó como *«POR DEFINIR»* **no se
asumió**. Se modeló la base de datos para soportarlo y se dejó explícitamente pendiente. No
inventar reglas de negocio que el cliente no aprobó.

---

## 3. Modelo de negocio

KG Academy se vende como **servicio: acceso a la plataforma por suscripción de la empresa**.
**No** se vende curso por curso.

Consecuencias concretas en el código:

- La interfaz **no muestra precios individuales**; muestra la etiqueta *«Incluido en el plan»*.
- Los cursos se siembran con `accessType: "plan_empresarial"` y `price: 0`.
- Los campos `price` / `discountPrice` y las tablas `orders`, `order_items` y `coupons`
  **se conservan** en el modelo por si KG habilita venta B2C directa más adelante, pero hoy
  no se usan en pantalla.
- El indicador comercial del panel de KG es **«Horas certificadas»**, no ingresos.
- Los planes de suscripción viven en `plans` / `company_subscriptions` y se consultan en
  `/admin/empresas`.

Si alguien vuelve a poner precios por curso en la interfaz, está contradiciendo una decisión
explícita del cliente.

---

## 4. Estado actual

**Fase 1 (MVP) entregada y funcionando en local.** Verificado de extremo a extremo: se
completaron todas las lecciones de un curso, se presentó la evaluación final, el sistema emitió
el certificado solo y la página pública de verificación lo validó.

| Módulo | Estado |
|---|---|
| Acceso, sesión JWT, 6 roles y 72 permisos | Funcionando |
| Catálogo, ficha de curso y matrícula | Funcionando |
| Aula virtual con progreso lección a lección | Funcionando |
| Evaluaciones con calificación automática | Funcionando |
| Certificados automáticos con QR y verificación pública | Funcionando |
| Panel empresarial: trabajadores, asignación masiva, seguimiento, CSV | Funcionando |
| Panel SuperAdmin: constructor de cursos, usuarios, empresas, auditoría | Funcionando |
| Gamificación: puntos, niveles, rachas | Funcionando |
| Entrega automática de insignias | **No implementada** (catálogo creado, regla pendiente) |
| Envío de correo real (SMTP) | **No implementado** (plantillas creadas) |
| Pasarela de pagos | **No implementada** (tablas creadas) |

---

## 5. Los tres primeros cursos

| Código | Curso | Módulos | Horas | Estado | Lanzamiento previsto |
|---|---|---|---|---|---|
| KG-PA-001 | Curso Básico de Primeros Auxilios | 7 | 40 | Publicado | 22 de agosto de 2026 |
| KG-PA-002 | Primeros Auxilios Pediátricos | 4 | 60 | Borrador | Finales de agosto de 2026 |
| KG-PA-003 | Primeros Auxilios Psicológicos | 4 | 12 | Borrador | Finales de agosto de 2026 |

### KG-PA-001 — el único con contenido real

*«Curso Básico de Primeros Auxilios — Para Brigadas de Emergencia y Equipos de Primera
Respuesta».* El temario **no es inventado**: se tomó del índice de la presentación entregada
por KG el 19 de agosto de 2026.

**Solo se siembran los módulos con contenido producido**, decisión de KG del 25 de agosto de
2026: se publica lo que existe y se agregan los módulos a medida que se produzcan. KG-PA-001 ya
tiene dos (entregas del 24 y del 31 de agosto de 2026); KG-PA-002 y KG-PA-003 siguen con uno.

No es solo estética. Sembrar los otros seis módulos vacíos y obligatorios abría un hueco real:
el botón «Marcar como completada» aparecía igual en una lección sin contenido, así que un
trabajador podía recorrer seis pantallas en blanco, presentar la evaluación y salir certificado
sin haber estudiado. Hoy eso está cerrado en dos capas:

- **En el servidor**, `/api/aula/leccion` responde 409 si se intenta completar una lección con
  `contentType` en `pendiente`. Es la barrera que cuenta.
- **En pantalla**, el aula muestra «Disponible cuando KG publique el contenido» en vez de un
  botón que iba a fallar.

El temario oficial de los siete módulos queda documentado como comentario en `prisma/seed.ts`,
para no perderlo: los módulos 3 a 7 se agregan ahí a medida que KG entregue cada presentación.

**Intensidad horaria: decisión de KG.** El certificado del Curso Básico acredita **40 horas**
aunque hoy solo se dicten los módulos 1 y 2 de los siete del temario. Se advirtió que en un contexto de SST el certificado es
evidencia ante la ARL y que lo consecuente sería certificar lo realmente cursado; KG optó por
conservar las 40 horas. Queda registrado aquí para que nadie lo cambie por error.

**Cómo se sirve el contenido.** KG produce cada módulo como una presentación de Genially y la
publica. La plataforma **solo guarda la URL pública** y la embebe en un iframe 16:9; el material
vive en Genially. Ventaja: si KG edita la presentación, el cambio se ve al instante sin volver a
desplegar. Las constantes están en `prisma/seed.ts` (`GENIALLY_PA_MODULO_1`,
`GENIALLY_PA_MODULO_2`) y, una vez en producción, se administran desde `/admin/cursos/[id]`.

**Usar siempre la URL corta, por identificador**
(`https://view.genially.com/<id>`), nunca la larga que incluye el título. KG renombró la
presentación el 24 de agosto de 2026 —de «CU RSO» a «CURSO»— y eso cambió el final de la
dirección. La forma corta sobrevive a ese tipo de cambios; la larga solo funcionaba gracias a una
redirección de Genially, que no conviene dar por garantizada.

El export offline de Genially (20+ MB por entrega) se conserva en la carpeta local `cursos/`
como respaldo, pero **no se versiona**: está en `.gitignore`. Servir esos archivos desde el
servidor consumiría el ancho de banda del VPS.

**Estado del Módulo 1 (entrega del 24 de agosto de 2026).** KG lo dio por terminado: pasó de 11 a
31 diapositivas. Cubre marco legal (Decreto 1072 de 2015), definición y objetivos de los primeros
auxilios, rol, competencias y límites del brigadista, y responsabilidad y consentimiento.

Dos cosas que KG debe corregir **dentro de Genially**, no en el código:

- Las **diapositivas 27 a 31 son texto de relleno de la plantilla** («Escribe un texto genial,
  haciendo clic en Texto…», «Disciplinas como el Visual Thinking…»). Hay que borrarlas: hoy
  el trabajador las ve al final del módulo.
- La **primera diapositiva sigue diciendo «CU RSO BÁSICO»**, con el espacio de más. El título del
  archivo ya se corrigió, pero el texto dentro de la portada no.

**Estado del Módulo 2 (entrega del 31 de agosto de 2026).** «Valoración de la Escena,
Bioseguridad y Activación del SEM», 28 diapositivas y 9 actividades. Cambia de formato: es una
narrativa ramificada, no una exposición. El participante acompaña a un personaje (Vera) por tres
misiones —valoración de la escena, condiciones y riesgos del lugar, y bioseguridad— y cierra
eligiendo entre atender de inmediato o protegerse primero, con un final distinto según la
respuesta. Las actividades viven dentro de Genially, no en la tabla `assessments`.

Tres cosas que KG debe corregir **dentro de Genially**:

- El **FINAL B es texto de relleno de la plantilla**: quien elige la opción incorrecta
  («me acerco rápidamente y atiendo, después me preocuparé por protegerme») recibe *«Vera se
  rebela. Escapa y comienza una nueva vida en la sombra»*, que no tiene relación con el curso.
  Es la diapositiva pedagógicamente más importante del módulo —la que debe explicar por qué
  atender sin protección es peligroso— y hoy no enseña nada. **Es la corrección prioritaria.**
- La diapositiva **RECURSOS dice literalmente «Texto»**: quedó sin llenar.
- Hay **dos diapositivas duplicadas** («Copia») del aviso de salir del juego.

La duración de 60 minutos por módulo es una **estimación**, no un dato de KG: falta que
confirmen la intensidad real de cada módulo para que cuadre con las 40 horas del certificado.

**Trampa que apareció al publicar el segundo módulo.** El aula tenía un `redirect` a la misma
dirección que ya estaba sirviendo cuando un estudiante con la matrícula en `no_iniciado` abría
una lección desde el índice. Con un solo módulo casi nadie lo pisaba —la única lección ya venía
abierta—, pero con dos, entrar al Módulo 2 es lo primero que hace cualquiera: el bucle devolvía
una pantalla en blanco. Hoy ese caso **marca la matrícula y la asignación como iniciadas** y
sigue renderizando, que era la intención original. Abrir el curso sin elegir lección **no**
cuenta como iniciarlo.

### Los otros dos cursos

KG-PA-002 y KG-PA-003 conservan la estructura tentativa derivada de la especificación. **Cuando
KG entregue su material, hay que corregir el temario igual que se hizo con KG-PA-001**: lo que
está sembrado hoy es una propuesta, no el temario oficial.

### Lo que sigue pendiente en KG-PA-001

- Contenido de los módulos 2 a 7.
- ~~Intensidad horaria~~: **confirmada por KG en 40 horas** el Curso Básico y **60 horas** el
  Pediátrico (antes estimadas en 20 y 16). Es el dato que se imprime en el certificado.
  El curso Psicológico sigue con 12 horas **sin confirmar**.
- **Entidad instructora:** los cursos se acreditan a **Bomberos**, no al desarrollador. Falta
  que KG confirme el nombre oficial completo de la entidad (`instructorBomberos` en el seed).
- Banco oficial de preguntas (el cargado sigue siendo de ejemplo).

---

## 6. Decisiones de arquitectura y por qué

| Decisión | Razón |
|---|---|
| **Next.js 14 App Router** (interfaz + API en un solo proyecto) | Un solo despliegue, un solo repositorio, más barato de alojar y de entregar al cliente. |
| **TypeScript estricto** | El dominio tiene muchos estados; el tipado evita errores de estado inválido en producción. |
| **Prisma + SQLite en local, PostgreSQL en producción** | El mismo esquema sirve en ambos. En local se revisa sin instalar ningún motor de base de datos. |
| **JWT propio con `jose` + cookie HttpOnly** | Sin dependencias externas de pago ni servicios de terceros para autenticar. |
| **Sin librería de componentes** (Tailwind + componentes propios) | La identidad visual es de KG, no de un framework. Menos peso y control total del diseño. |
| **Contenido de video embebido, no alojado** | Servir video desde el servidor de la aplicación satura el ancho de banda. El material vive en Vimeo/Bunny/Genially; la plataforma solo guarda la URL. |
| **Estados como `String`, no `enum`** | SQLite no soporta enum nativo. Las listas cerradas están documentadas en `src/lib/constants.ts` y pueden migrarse a enum en PostgreSQL. |

---

## 7. Reglas de negocio críticas — NO romper

Esto es el contrato funcional del sistema. Está implementado en
[`src/lib/progress.ts`](src/lib/progress.ts) y [`src/lib/certificates.ts`](src/lib/certificates.ts).

### Progreso

El porcentaje se calcula según `courses.progressRule`:

- `obligatorios` **(por defecto)** — lecciones obligatorias completadas / total obligatorias.
- `peso_lecciones` — suma de pesos de lecciones completadas / suma total de pesos.
- `peso_modulos` — suma ponderada del avance de cada módulo según su peso.

### Aprobación

Un curso se marca **completado** cuando se cumplen **las dos** condiciones:

1. El 100 % de las lecciones obligatorias (si `requiresAllLessons` está activo), **y**
2. Existe un intento aprobado de la evaluación final (si `requiresFinalExam` está activo).

Llegar al 100 % de lecciones **no** aprueba el curso por sí solo.

### Calificación

```
NOTA = (puntos obtenidos / puntos posibles) × 100      → aprueba si NOTA ≥ minScore
```

- Una pregunta sin responder se califica como incorrecta.
- La evaluación **diagnóstica** siempre queda como aprobada: mide, no filtra.
- Los intentos se cuentan aunque se abandonen; al agotar `maxAttempts` sin aprobar, se bloquea.

### Dos sistemas de puntaje distintos

| | Qué es | Afecta la aprobación |
|---|---|---|
| **NOTA** (0–100) | Calificación de una evaluación | **Sí** |
| **PUNTOS** (gamificación) | +10 lección, +50 evaluación, +100 curso. Nivel = (puntos ÷ 250) + 1 | **No, nunca** |

### Certificados

- Se emiten **solos** al cumplirse la regla de aprobación. Nadie los genera a mano.
- Los datos quedan **congelados**: si mañana se edita el curso o cambia el nombre del
  trabajador, el certificado ya emitido conserva la información con la que fue expedido.
  Esto es lo que exige una auditoría; no "corregirlo".
- Código único `KG-AAAA-XXXXXX` + QR hacia `/verificar/[codigo]`, consultable sin sesión.

### Trazabilidad

`lesson_progress` y `assessment_attempts` **no se borran** por una edición administrativa.
Toda acción relevante deja un renglón en `audit_logs` con el estado antes y después.

### Aislamiento entre empresas

Un `admin_empresa` **nunca** ve datos de otra empresa. Se valida en el servidor en cada
consulta (`src/lib/empresa.ts` y cada endpoint), no escondiendo botones en la interfaz.

---

## 8. Identidad de marca

Extraída del logotipo oficial. Está en `tailwind.config.ts` y `src/lib/constants.ts`.

| Color | Hex | Uso |
|---|---|---|
| Navy KG | `#0A2D4D` | Color primario: fondos, tipografía, sidebar |
| Lima KG | `#8FBF16` | Acento: botones de acción, progreso, destacados |

Reglas de marca que deben respetarse en cualquier entregable:

- El **logotipo oficial** (`public/brand/kg-logo.png`) debe aparecer: landing, login, sidebar,
  certificado, verificación pública y portada de todos los documentos.
- El crédito **«Desarrollado por Diego Alejandro Hernández Blanco»** aparece en el pie de la
  landing, el sidebar, el certificado, la configuración y los documentos, y **enlaza al perfil
  de LinkedIn** del desarrollador. Se renderiza siempre con el componente
  `CreditoDesarrollo` de `src/components/Contacto.tsx`; nunca copiar el nombre como texto suelto.
  La única excepción es el certificado: es un documento que se imprime, así que ahí va en texto plano.

### Contacto público

Definido en `CONTACTO` (`src/lib/constants.ts`) y replicado en `system_settings` para que se
vea en `/admin/configuracion`. **Si cambia, se cambia en la constante**, no en cada pantalla.

| Canal | Valor |
|---|---|
| Teléfono / WhatsApp | +57 320 7605561 |
| Correo | katerineguanarita@gmail.com |

Aparece en el pie del sitio, en el cierre de la landing y en un botón flotante de WhatsApp
presente en todas las páginas públicas (`BotonWhatsApp`). Es la vía de contacto principal
porque la plataforma se vende como servicio, no por autogestión de compra.

---

## 9. Convenciones del código

- **Idioma y ortografía.** Regla en dos niveles, y no es negociable:
  - **Identificadores y códigos de dominio: ASCII, sin tildes ni eñes.** Los estados
    (`no_iniciado`, `en_progreso`), los niveles (`basico`), los tipos (`diagnostica`), los
    slugs y las rutas se comparan por igualdad; una tilde ahí rompe el sistema.
  - **Todo el texto que lee una persona: español correcto, con tildes y eñes.** Interfaz,
    mensajes de error, correos, semilla y comentarios.
  - Cuando un código se muestra en pantalla, se traduce con un diccionario de etiquetas
    (`STATUS_LABEL`, `ASSESSMENT_TYPE_LABEL`, `MODULO_LABEL`), nunca imprimiendo el código
    crudo. Así el valor guardado sigue siendo ASCII y el usuario ve español bien escrito.

  Hay dos herramientas para sostenerlo:

  ```bash
  python scripts/ortografia.py
  ```
  ```bash
  PYTHONPATH=scripts python scripts/revisar_ortografia.py
  ```

  La primera corrige el texto visible (respeta identificadores, rutas y códigos); la segunda
  reporta lo que quede sin tilde. El informe trae unos pocos falsos positivos —variables como
  `dias`, rutas como `/admin/auditoria`— que son correctos.
- **Estados:** siempre en `snake_case` y declarados en `src/lib/constants.ts`. No inventar
  estados nuevos sin agregarlos allí.
- **Componentes de servidor por defecto.** Solo se marca `"use client"` cuando hay estado o
  eventos (formularios, reproductor, constructor).
- **Validación:** todo endpoint valida su entrada con Zod antes de tocar la base de datos.
- **Autorización:** cada layout protegido llama a `requireRole(...)`; cada endpoint revalida.
- **Auditoría:** toda acción administrativa relevante llama a `audit({...})`.

---

## 10. Cómo trabajar en el proyecto

```bash
cp .env.example .env
npm install
npm run setup     # prisma generate + db push + seed
npm run dev       # http://localhost:3000
```

Usuarios de prueba (contraseña **`KgAcademy2026*`** para todos):

| Rol | Correo |
|---|---|
| SuperAdmin KG | `admin@kggestionintegral.com` |
| Instructor | `instructor@kggestionintegral.com` |
| Administrador de empresa | `rrhh@constructoraandina.com` |
| Supervisor | `diana.suarez@constructoraandina.com` |
| Estudiante | `sandra.molina@constructoraandina.com` |

`npm run db:reset` devuelve la base al estado inicial de demostración.

---

## 11. Trampas conocidas

- **`npm run db:seed` BORRA la base antes de sembrar.** En producción solo debe ejecutarse la
  parte de catálogos (roles, permisos, plantillas, configuración), nunca el seed completo
  después del lanzamiento.
- **`NEXT_PUBLIC_APP_URL` debe tener el dominio definitivo antes de emitir el primer
  certificado**, o los códigos QR quedarán apuntando a `localhost` y habrá que reemitirlos.
- **`AUTH_SECRET` debe cambiarse en producción.** Con la clave de ejemplo cualquiera podría
  falsificar una sesión.
- **El `.env` no se versiona.** Está en `.gitignore`; usar `.env.example` como plantilla.
- En Windows, `npm install` con npm 11 puede bloquear los scripts de instalación. Si pasa:
  `npm approve-scripts @prisma/client prisma @prisma/engines esbuild` y repetir `npm install`.

---

## 12. Pendientes de KG (no asumir)

Marcados como *POR DEFINIR* en el esqueleto funcional o dependientes de una decisión del
cliente:

1. **Banco oficial de preguntas** de cada curso (el actual es de ejemplo).
2. **Contenido audiovisual** de los tres cursos.
3. **Pasarela de pagos** y facturación.
4. **Proveedor SMTP** para el envío real de correos.
5. **Proveedor de video** y política de retención.
6. **Dominio definitivo** de producción, y con él el **correo corporativo de contacto**: hoy la
   plataforma publica un Gmail personal porque un buzón que rebota sería peor. Se cambia en la
   constante `CONTACTO` de `src/lib/constants.ts`.
7. Matriz fina de permisos más allá de la propuesta implementada.
8. Redacción final de la política de tratamiento de datos (revisión jurídica).

---

## 13. Mapa de archivos clave

| Archivo | Qué contiene |
|---|---|
| `prisma/schema.prisma` | Las 44 tablas del modelo de datos. |
| `prisma/seed.ts` | Cursos, empresa demo, usuarios y avances de prueba. |
| `src/lib/progress.ts` | **Motor de progreso.** El corazón del sistema. |
| `src/lib/certificates.ts` | Emisión de certificados y generación del QR. |
| `src/lib/auth.ts` | Sesión JWT, `requireRole`, auditoría. |
| `src/lib/empresa.ts` | Aislamiento por empresa e indicadores B2B. |
| `src/lib/constants.ts` | Roles, estados, matriz de permisos, marca. |
| `src/components/AppShell.tsx` | Layout con sidebar de los tres paneles. |
| `src/styles/globals.css` | Design system de la marca. |
| `scripts/kg_ppt.py` | Utilidades compartidas para generar los documentos. |

---

## 14. Documentos entregables

En `docs/`, todos regenerables desde `scripts/`:

| Documento | Contenido | Se regenera con |
|---|---|---|
| `KG_Academy_Infraestructura_y_Base_de_Datos.pptx` | Arquitectura, stack y diccionario de las 44 tablas | `python scripts/generar_pptx.py` |
| `KG_Academy_Manual_Funcional.pptx` | Cómo funciona cada módulo, roles, notas y puntos | `python scripts/generar_manual_pptx.py` |
| `KG_Academy_Analisis_de_Despliegue.pptx` | Seis alternativas de alojamiento, costos y plan de producción | `python scripts/generar_despliegue_pptx.py` |

Requieren `python-pptx` (`pip install python-pptx`).

---

## 15. Recomendación de despliegue (resumen)

**Hostinger VPS KVM 2** (2 vCPU / 8 GB), Ubuntu, PostgreSQL en el mismo servidor, Nginx + SSL.
Aproximadamente US$ 10–34 al mes.

- El **hosting compartido no sirve**: la aplicación necesita un proceso Node permanente.
- Alternativa sin administración de servidor: **Vercel + Neon** (≈ el doble de costo).
- El **video nunca se sirve desde el VPS**.

El detalle completo, con criterios, costos y el plan de 12 pasos, está en
`docs/KG_Academy_Analisis_de_Despliegue.pptx`.

### Cómo se le muestra hoy a KG

Mientras no exista dominio ni cuenta contratada, la plataforma se le enseña al cliente con un
túnel de Cloudflare sobre el servidor local (`npx cloudflared@latest tunnel --url
http://localhost:3000`). Es una vista temporal: vive mientras el equipo esté encendido, la
dirección cambia en cada arranque y expone las credenciales de prueba a quien tenga el enlace.
El procedimiento está en la sección 7 del README.

Antes de compartir el enlace hay que poner esa dirección en `NEXT_PUBLIC_APP_URL` y reiniciar,
porque si no los QR de los certificados quedan apuntando a `localhost` y no resuelven desde el
celular de nadie. Al terminar la revisión, devolver la variable a `http://localhost:3000`.

### Cambio de motor de base de datos

Prisma no admite una variable de entorno en `provider`: exige un literal en el esquema. Por eso
el cambio se hace con `npm run db:postgres` / `npm run db:sqlite`
(`scripts/proveedor-bd.mjs`), no con configuración. El esquema está validado contra los dos
motores. **No editar `provider` a mano**: quedan desincronizados el esquema y el `.env`.

---

© 2026 KG Gestión Integral S.A.S. — Desarrollado por Diego Alejandro Hernández Blanco.
