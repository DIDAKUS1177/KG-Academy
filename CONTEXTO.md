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
| KG-PA-001 | Curso Básico de Primeros Auxilios | 7 | 20 | Publicado | 22 de agosto de 2026 |
| KG-PA-002 | Primeros Auxilios Pediátricos | 4 | 16 | Borrador | Finales de agosto de 2026 |
| KG-PA-003 | Primeros Auxilios Psicológicos | 4 | 12 | Borrador | Finales de agosto de 2026 |

### KG-PA-001 — el único con contenido real

*«Curso Básico de Primeros Auxilios — Para Brigadas de Emergencia y Equipos de Primera
Respuesta».* El temario **no es inventado**: se tomó del índice de la presentación entregada
por KG el 19 de agosto de 2026.

| Módulo | Contenido |
|---|---|
| 1. Introducción a los Primeros Auxilios y Marco Legal del Brigadista | **Genially embebido** |
| 2. Valoración de la Escena, Bioseguridad y Activación del SEM | Pendiente |
| 3. Evaluación Primaria y Soporte Vital Básico (SVB, RCP y DEA) | Pendiente |
| 4. Manejo de la Vía Aérea y Obstrucción (OVACE) | Pendiente |
| 5. Control de Hemorragias, Heridas y Quemaduras | Pendiente |
| 6. Lesiones Osteomusculares, Shock y Alteraciones de Conciencia | Pendiente |
| 7. Movilización, Transporte de Pacientes y Casos Prácticos | Pendiente |

**Cómo se sirve el contenido.** KG produce cada módulo como una presentación de Genially y la
publica. La plataforma **solo guarda la URL pública** y la embebe en un iframe 16:9; el material
vive en Genially. Ventaja: si KG edita la presentación, el cambio se ve al instante sin volver a
desplegar. La constante está en `prisma/seed.ts` (`GENIALLY_PA_MODULO_1`) y, una vez en
producción, se administra desde `/admin/cursos/[id]`.

El export offline de Genially (unos 22 MB por módulo) se conserva en la carpeta local `cursos/`
como respaldo, pero **no se versiona**: está en `.gitignore`. Servir esos archivos desde el
servidor consumiría el ancho de banda del VPS.

### Los otros dos cursos

KG-PA-002 y KG-PA-003 conservan la estructura tentativa derivada de la especificación. **Cuando
KG entregue su material, hay que corregir el temario igual que se hizo con KG-PA-001**: lo que
está sembrado hoy es una propuesta, no el temario oficial.

### Lo que sigue pendiente en KG-PA-001

- Contenido de los módulos 2 a 7.
- **Intensidad horaria real**: las 20 horas son una estimación previa; KG debe confirmarla porque
  es el dato que se imprime en el certificado.
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

- **Idioma:** el código y los comentarios están en español, **sin tildes en identificadores**
  ni en cadenas del dominio (los estados son `no_iniciado`, `en_progreso`, etc.). La interfaz
  de usuario sí usa español natural.
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
6. **Dominio definitivo** de producción.
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

---

© 2026 KG Gestión Integral S.A.S. — Desarrollado por Diego Alejandro Hernández Blanco.
