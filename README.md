# KG ACADEMY

Plataforma educativa (LMS) B2C / B2B de **KG GESTIÓN INTEGRAL S.A.S. — Katerine Guañarita**.

> Diseñado y desarrollado por **Diego Alejandro Hernández Blanco**.

Construida sobre el documento *Esqueleto de Especificaciones Funcionales KG Academy v0.1*
(incluido en `docs/`), con la identidad visual tomada directamente del logotipo oficial.

---

> ¿Primera vez en este repositorio? Lee **[CONTEXTO.md](CONTEXTO.md)**: explica de dónde salió
> el proyecto, el modelo de negocio, las reglas de negocio que no se deben romper y lo que
> queda pendiente del cliente.

---

## 1. Puesta en marcha local (4 comandos)

Requisitos: **Node.js 20 o superior**.

```bash
cp .env.example .env
```

```bash
npm install
```

```bash
npm run setup
```

```bash
npm run dev
```

Abrir <http://localhost:3000>.

- `npm run setup` = `prisma generate` + `prisma db push` + `tsx prisma/seed.ts`
- Para volver al estado inicial de datos en cualquier momento: `npm run db:reset`
- Para inspeccionar la base de datos con interfaz visual: `npm run db:studio`

> Todo lo relativo a la base de datos (crearla en local y en producción, las dos
> semillas, el SQL de las 43 tablas, copias de seguridad) está en
> **[docs/BASES_DE_DATOS.md](docs/BASES_DE_DATOS.md)**.

> Si `npm install` muestra el aviso `allow-scripts` de npm 11, ejecutar una vez:
> `npm approve-scripts @prisma/client prisma @prisma/engines esbuild` y repetir `npm install`.

---

## 2. Usuarios de prueba

Contraseña para **todos**: `KgAcademy2026*`

| Rol | Correo | Entra a |
|---|---|---|
| SuperAdmin KG | `admin@kggestionintegral.com` | `/admin` |
| Instructor | `instructor@kggestionintegral.com` | `/admin/cursos` |
| Administrador de empresa | `rrhh@constructoraandina.com` | `/empresa` |
| Supervisor | `diana.suarez@constructoraandina.com` | `/empresa/seguimiento` |
| Estudiante (empresa) | `sandra.molina@constructoraandina.com` | `/aula` |
| Estudiante B2C | `estudiante@correo.com` | `/aula` |

En la pantalla de ingreso hay accesos rápidos que rellenan estas credenciales.

---

## 3. Los tres primeros cursos

**Solo se publican los módulos que KG ya produjo**, y se agregan los siguientes a medida que
los entregue. KG-PA-001 tiene terminados los módulos 1, 2 y 3: cada uno se sirve con su
presentación interactiva de Genially, embebida por URL pública.

| Código | Curso | Módulos | Lecciones | Horas | Estado | Lanzamiento |
|---|---|---|---|---|---|---|
| KG-PA-001 | Curso Básico de Primeros Auxilios | 3 | 3 | 40 | Publicado | 22 de agosto de 2026 |
| KG-PA-002 | Primeros Auxilios Pediátricos | 1 | 1 | 60 | Borrador | Por definir |
| KG-PA-003 | Primeros Auxilios Psicológicos | 1 | 1 | 12 | Borrador | Por definir |

La estructura de los tres vive en `prisma/catalogo-cursos.ts`, compartida por la semilla de
demostración y por el script que los crea en producción (ver 7.2).

### Cursos interactivos de demostración

La base **local** trae además dos prototipos hechos con el motor de lecciones nativo, cada uno
con 3 módulos, 6 lecciones y evaluación final de 12 preguntas (nota mínima 80, 3 intentos):

| Código | Curso | Guía |
|---|---|---|
| KG-EM-001 | Fuego bajo control: extintores y evacuación | Lucía Torres, líder de brigada |
| KG-PA-004 | Detén el sangrado: control de hemorragias | Andrés Rincón, paramédico |

Laura (empresa) y el estudiante B2C quedan matriculados para probarlos. Son **prototipos**:
su contenido sigue recomendaciones generales pero lo debe validar un profesional de KG antes de
certificar a nadie, y las 4 horas de cada uno son una estimación. Por eso no se cargan en
producción. El contenido está en `prisma/cursos-interactivos.ts`.

### Lecciones interactivas nativas

Una lección de tipo `interactivo` guarda en `lessons.contentBody` un JSON que el aula dibuja
como una secuencia de pantallas (`src/lib/leccion-interactiva.ts` define y valida el esquema;
`src/components/leccion/` lo dibuja):

| Pantalla | Qué hace el trabajador |
|---|---|
| `portada`, `explicacion`, `resumen` | Lee; la explicación admite ideas clave, un dato destacado y una ilustración |
| `tarjetas` | Voltea tarjetas de mito o realidad |
| `decision` | Elige qué hacer en una situación y ve la consecuencia de cada opción |
| `contrarreloj` | Decide lo mismo, con segundos contados |
| `ordenar` | Pone los pasos de un procedimiento en orden |
| `clasificar` | Asigna cada elemento a su categoría |
| `buscar` | Cacería de riesgos: toca los peligros escondidos en una escena ilustrada (oficina o taller) |
| `mision` | Misión contra el reloj: un medidor (vida del paciente o tamaño del fuego) empeora cada segundo y con cada error |

### Modo juego

Un curso cuyas lecciones son **todas** interactivas se presenta como videojuego:

- **Mapa de misiones**: cada módulo es un mundo y cada lección un nivel. Los niveles se
  desbloquean en orden (también si se intenta saltar por URL). Al final esperan el desafío
  final (la evaluación) y el trofeo (el certificado).
- **3 vidas por nivel.** Cada decisión equivocada cuesta una vida (al clasificar, solo el primer
  error de la pantalla; en la cacería, los toques fallidos solo restan XP). Sin vidas, el nivel
  se reinicia.
- **XP y rachas**: 10 XP al primer intento, 6 al segundo, 2 después; pantallas seguidas sin
  error dan XP extra.
- **Estrellas** (1 a 3 según la precisión) al completar cada nivel, visibles en el mapa.
- **Efectos de sonido** sintetizados en el navegador, con botón para silenciar.
- **Desafío final**: la evaluación arranca con su propia pantalla, el reloj corre desde que se
  acepta y el resultado se muestra con trofeo y estrellas. Las respuestas siguen revelándose
  solo al final.

Las estrellas y el avance dentro de un nivel se guardan en el navegador; lo que cuenta para
aprobar (lecciones completadas, nota de la evaluación) se guarda en la base.

A diferencia de un Genially, el contenido queda en la base: se versiona, se audita y se mide.

### Modelo comercial

KG Academy se vende como **servicio: acceso a la plataforma por suscripción de la empresa**, no
curso por curso. Por eso la interfaz no muestra precios individuales, sino la etiqueta
*«Incluido en el plan»*. Los campos `price` y `discountPrice` y las tablas `orders`,
`order_items` y `coupons` se conservan en el modelo por si KG habilita venta B2C directa
más adelante; los planes se administran en `/admin/empresas`.

### Qué administra KG desde el panel

Nada de lo de abajo exige tocar código ni la base de datos. Todo queda en `audit_logs`
con quién lo hizo y con los valores anteriores y nuevos.

| Dónde | Qué se puede hacer |
|---|---|
| `/admin/usuarios` | Crear cuentas con cualquier rol (con contraseña propia o temporal generada), editar datos, cambiar rol, empresa o estado, restablecer contraseña |
| `/admin/empresas` | Crear empresa con su plan y su administrador en un paso, editar, suspender o reactivar; crear y editar planes |
| `/admin/cursos` | Crear curso (y su categoría si es nueva), agregar, editar, reordenar y eliminar módulos y lecciones, cargar contenido, editar la ficha pública y las reglas (nota mínima, intentos, vigencia del certificado), publicar |
| `/admin/evaluaciones` | Crear la evaluación final de un curso que no la tiene; en cada evaluación, agregar, editar y quitar preguntas, cargarlas en bloque desde Excel, configurar nota, intentos, tiempo y retroalimentación, y publicarla |
| `/admin/certificados` | Revocar con motivo y restituir |
| `/admin/configuracion` | Editar parámetros del sistema en línea (solo superadministrador) |

**Nada se borra.** Usuarios, empresas y certificados se inactivan, suspenden o revocan,
porque son evidencia ante la ARL. Solo módulos y lecciones sin avance de estudiantes se
pueden eliminar; con avance, el servidor lo rechaza.

### Cómo cargar el contenido de una lección

1. Entrar como SuperAdmin → **Cursos** → botón **Constructor** del curso.
2. En cada lección elegir el tipo: `video`, `genially`, `pdf`, `texto`, `enlace` o `scorm`.
3. Pegar la URL del recurso y pulsar **Guardar**.
4. La lección pasa automáticamente a *contenido cargado* y se muestra en el aula virtual.

No hace falta tocar el código: todo queda registrado en la tabla `lessons` y en `audit_logs`.

Las **preguntas cargadas son de ejemplo** y deben reemplazarse por el banco oficial de KG.

### Cómo cargar el banco de preguntas

1. **Evaluaciones** → botón **Preguntas** de la evaluación (o **Crear evaluación final** si el
   curso aún no la tiene).
2. **Carga masiva**: una pregunta por línea, con los campos separados por `|` o en columnas de
   Excel copiadas tal cual:
   ```
   Enunciado | Opción A | Opción B | Opción C | Opción D | Letra correcta | Explicación
   Enunciado | V o F | Explicación
   ```
   La vista previa marca las líneas con error antes de guardar.
3. Revisar y pulsar **Publicar evaluación**. Sin preguntas no deja publicarla.

Una pregunta que ya fue respondida en algún intento solo admite corregir el enunciado y la
explicación: cambiar sus opciones alteraría notas ya emitidas. Si se quita, queda inactiva en el
banco para conservar el historial.

Un curso que exige evaluación final **no se aprueba ni certifica sin ella**: si todavía no la
tiene, aparece en **Evaluaciones** como pendiente. Las evaluaciones en borrador no se muestran
al estudiante. Preguntas y opciones se barajan en cada intento.

El temario oficial de KG-PA-001 tiene **7 módulos**; faltan del 4 al 7. Un módulo sin
presentación **no se siembra vacío**: si existiera, un trabajador podría marcarlo como visto sin
estudiar nada y salir certificado.

---

## 4. Mapa de rutas

### Público
| Ruta | Descripción |
|---|---|
| `/` | Landing con la marca, los 3 cursos y el módulo B2B |
| `/catalogo` | Catálogo con búsqueda y filtro por categoría |
| `/curso/[slug]` | Ficha del curso, contenido programático y reglas |
| `/verificar` · `/verificar/[codigo]` | Verificación pública de certificados (sin login) |
| `/ingresar` · `/registro` · `/recuperar` | Acceso |

### Aula virtual (estudiante / trabajador)
| Ruta | Descripción |
|---|---|
| `/aula` | Dashboard con avance global, racha y asignaciones con fecha límite |
| `/aula/cursos` | Mis cursos filtrados por estado |
| `/aula/curso/[slug]` | Aula virtual: índice, reproductor y progreso lección a lección |
| `/aula/evaluacion/[id]` | Evaluación con temporizador, calificación y retroalimentación |
| `/aula/certificados` · `/aula/certificado/[code]` | Certificados y vista imprimible a PDF |
| `/aula/logros` · `/aula/perfil` · `/aula/notificaciones` | Gamificación, perfil y avisos |

### Panel empresarial (B2B)
| Ruta | Descripción |
|---|---|
| `/empresa` | Dashboard de cumplimiento, avance por curso y por área |
| `/empresa/trabajadores` · `/empresa/trabajadores/[id]` | Nómina y ficha individual |
| `/empresa/asignar` | Asignación individual y masiva con fecha límite |
| `/empresa/seguimiento` | Quién inició, quién avanza, quién terminó, quién está vencido |
| `/empresa/reportes` | Indicadores y descarga de reportes CSV |

### Administración KG
| Ruta | Descripción |
|---|---|
| `/admin` | Estado general de la plataforma |
| `/admin/cursos` · `/admin/cursos/[id]` | Gestión y constructor de cursos |
| `/admin/evaluaciones` · `/admin/certificados` · `/admin/reportes` | Operación académica |
| `/admin/usuarios` · `/admin/empresas` | Usuarios, roles, empresas y planes |
| `/admin/auditoria` · `/admin/permisos` · `/admin/configuracion` | Sistema |

---

## 5. Arquitectura

```
Navegador
   │
   ├── Server Components (React 18)      →  interfaz renderizada en servidor
   └── Route Handlers  /api/*            →  API REST validada con Zod
                │
                ├── src/lib/progress.ts      motor de progreso y trazabilidad
                ├── src/lib/certificates.ts  emisión de certificados + QR
                ├── src/lib/auth.ts          sesión JWT, RBAC y auditoría
                └── src/lib/empresa.ts       aislamiento y KPIs por empresa
                            │
                        Prisma ORM  →  SQLite (local) / PostgreSQL (producción)
```

| Componente | Tecnología |
|---|---|
| Lenguaje | TypeScript 5.6 |
| Framework | Next.js 14 (App Router) |
| Interfaz | React 18 + Tailwind CSS 3 |
| ORM | Prisma 5 |
| Base de datos | SQLite en local · PostgreSQL en producción |
| Sesión | JWT HS256 (`jose`) en cookie HttpOnly, 8 horas |
| Contraseñas | bcryptjs, 10 rondas |
| QR | `qrcode` (data URL embebido en el certificado) |

---

## 6. Base de datos

**43 tablas en 11 dominios funcionales.** El modelo fuente es `prisma/schema.prisma`; el
SQL generado para cada motor está en `docs/sql/` y la guía de creación y operación en
`docs/BASES_DE_DATOS.md`. El PowerPoint `docs/KG_Academy_Infraestructura_y_Base_de_Datos.pptx`
las presenta al cliente.

| Dominio | Tablas |
|---|---|
| Identidad y acceso | `roles`, `permissions`, `role_permissions`, `users`, `sessions`, `password_reset_tokens` |
| Empresas B2B | `companies`, `company_locations`, `areas`, `positions`, `company_members` |
| Planes | `plans`, `company_subscriptions` |
| Catálogo | `categories`, `courses`, `modules`, `lessons`, `lesson_resources` |
| Matrícula y progreso | `enrollments`, `module_progress`, `lesson_progress` |
| Evaluaciones | `question_banks`, `questions`, `question_options`, `assessments`, `assessment_questions`, `assessment_attempts`, `attempt_answers` |
| Certificados | `certificate_templates`, `certificates` |
| Asignación empresarial | `assignment_batches`, `course_assignments` |
| Comercial | `coupons`, `orders`, `order_items` |
| Notificaciones y gamificación | `notification_templates`, `notifications`, `badges`, `user_badges`, `points_ledger`, `streaks` |
| Sistema | `audit_logs`, `system_settings` |

### Motor de progreso (punto 8 del esqueleto)

Un curso se marca **completado** cuando:

1. Se cumple el 100 % de las lecciones obligatorias, **y**
2. Si `courses.requiresFinalExam` está activo, existe un intento aprobado de la evaluación final.

La regla de cálculo es configurable por curso en `courses.progressRule`:
`obligatorios` (por defecto) · `peso_lecciones` · `peso_modulos`.

Al cumplirse, el sistema emite el certificado automáticamente con código único, QR y datos
congelados, y sincroniza el estado de la asignación empresarial.

---

## 7. Despliegue

### 7.1 Vista rápida para el cliente (túnel temporal)

Sirve la plataforma que corre en este equipo a través de una dirección pública, sin
contratar nada. Útil para que KG revise, **no** para producción.

```bash
npm run dev
```

```bash
npx cloudflared@latest tunnel --url http://localhost:3000
```

El comando imprime una dirección `https://….trycloudflare.com`. Antes de compartirla,
poner esa dirección en `NEXT_PUBLIC_APP_URL` del `.env` y reiniciar `npm run dev`, para que
los QR de los certificados apunten al túnel y no a `localhost`.

Límites: solo funciona mientras el equipo esté encendido y el servidor corriendo, la
dirección cambia cada vez, y la pantalla de ingreso muestra las credenciales de prueba a
cualquiera que abra el enlace.

### 7.2 Producción (Vercel + Neon)

**En vivo desde el 23 de septiembre de 2026:** <https://kg-academy.vercel.app>

| Pieza | Dónde |
|---|---|
| Aplicación | Vercel, proyecto `kg-academy` (cuenta `didakus1177`), plan Hobby |
| Base de datos | Neon, proyecto `kg-academy` (`broad-lake-83564230`), `aws-us-east-1`, PostgreSQL 18 |
| Variables | `DATABASE_URL` (conexión agrupada con `pgbouncer=true`), `AUTH_SECRET`, `NEXT_PUBLIC_APP_URL`; las dos primeras marcadas como secretas |

La base está en la misma región donde Vercel ejecuta las funciones por defecto, para que
cada consulta viaje lo mínimo. `vercel.json` cambia el esquema a PostgreSQL solo durante la
compilación en Vercel: el repositorio sigue en SQLite y nadie edita `provider` a mano.

Para volver a publicar después de un cambio:

```bash
npx vercel deploy --prod
```

La carga inicial (catálogos y primer superadministrador) se hizo con
`scripts/sembrar-produccion.ps1`, que toma la conexión de Neon por sí mismo y pide la
contraseña oculta. Se puede repetir sin riesgo: no borra nada.

Los cursos del catálogo se crean en producción con `scripts/cursos-produccion.ps1`: solo
agrega los que falten, **en borrador** y sin evaluaciones, y nunca modifica uno existente. Luego
KG crea la evaluación final desde el panel, carga sus preguntas y publica.

`.vercelignore` deja fuera de la subida el `.env` local, la base SQLite de demostración,
`node_modules`, `.next`, `cursos/` y `docs/`.

#### Montarlo desde cero

Next.js corre nativamente en Vercel y Neon da PostgreSQL administrado; ambos tienen plan
gratuito suficiente para arrancar. SQLite **no** sirve en producción: Vercel borra el disco
en cada despliegue.

1. Crear la base en Neon y copiar su cadena de conexión.
2. Cambiar el motor del esquema y publicar las tablas:
   ```bash
   npm run db:postgres
   ```
   ```bash
   npx prisma db push
   ```
3. Crear el proyecto en Vercel importando este repositorio y definir las variables:

   | Variable | Valor |
   |---|---|
   | `DATABASE_URL` | cadena de conexión de Neon (con `?sslmode=require`) |
   | `AUTH_SECRET` | cadena aleatoria larga, distinta a la de desarrollo |
   | `NEXT_PUBLIC_APP_URL` | dominio final, p. ej. `https://kgacademy.co` |

4. Cargar los catálogos y el primer administrador con la **semilla de producción**, que
   no borra nada y se puede repetir:
   ```bash
   SEED_ADMIN_EMAIL="direccion@kggestionintegral.com" SEED_ADMIN_PASSWORD="una-clave-larga" npm run db:seed:prod
   ```
   Nunca `npm run db:seed` en producción: esa **borra y reescribe** la base.
5. Para volver a trabajar en local: `npm run db:sqlite`.

`npm run db:postgres` / `db:sqlite` existen porque Prisma exige que `provider` sea un valor
literal en el esquema: no admite una variable de entorno. El modelo es portable entre los dos
motores (sin enum nativo, arrays ni tipos propios de PostgreSQL), así que no hay ningún otro
cambio de código entre ambientes.

---

## 8. Estructura del proyecto

```
KG-Academy/
├── CONTEXTO.md              contexto del proyecto y reglas de negocio
├── .env.example             plantilla de variables de entorno
├── docs/
│   ├── KG_Academy_Infraestructura_y_Base_de_Datos.pptx   ← arquitectura y 44 tablas
│   ├── KG_Academy_Manual_Funcional.pptx                  ← cómo funciona cada módulo
│   ├── KG_Academy_Analisis_de_Despliegue.pptx            ← dónde y cómo publicarla
│   ├── Esqueleto_Especificaciones_KG_Academy.docx
│   └── Portafolio_KG_Gestion_Integral.pdf
├── docs/BASES_DE_DATOS.md   crear, cargar y operar la base en local y producción
├── docs/sql/                SQL de las 43 tablas para PostgreSQL y SQLite (generado)
├── prisma/
│   ├── schema.prisma        43 tablas
│   ├── seed.ts              DEMO: borra todo y carga empresa, usuarios, cursos y avances
│   ├── seed-produccion.ts   PRODUCCIÓN: solo catálogos y un administrador, no borra
│   └── kg_academy.db        base SQLite local (se genera)
├── public/brand/kg-logo.png logotipo oficial
├── scripts/                 generadores de PPTX y utilidades de ortografía
└── src/
    ├── app/
    │   ├── (public)/  (auth)/  aula/  empresa/  admin/  api/
    ├── components/    Logo · AppShell · CourseCard · ui · Icons · admin/Formulario
    ├── lib/           auth · prisma · progress · certificates · empresa · constants
    └── styles/globals.css   design system KG
```

---

## 9. Pendientes declarados

Los siguientes puntos quedaron marcados como **POR DEFINIR** en el esqueleto funcional y por
tanto **no se asumieron**; el modelo de datos ya los soporta:

- Pasarela de pagos y facturación (tablas `orders`, `order_items`, `coupons` listas).
- Proveedor SMTP para el envío real de correos (tabla `notification_templates` lista).
- Banco oficial de preguntas de cada curso (el de la base de demostración es de ejemplo; se
  carga desde `/admin/evaluaciones`).
- Validación técnica de KG para los dos cursos interactivos de demostración.
- Matriz fina de permisos por rol más allá de la propuesta implementada.
- Proveedor de alojamiento de video y política de retención.

---

© 2026 KG Gestión Integral S.A.S. — Todos los derechos reservados.
Desarrollado por **Diego Alejandro Hernández Blanco**.
