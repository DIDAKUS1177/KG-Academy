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

**KG-PA-001 ya tiene contenido real:** el Módulo 1 se sirve con la presentación interactiva de
Genially entregada por KG, embebida por URL pública. Los módulos 2 a 7 y los otros dos cursos
conservan el espacio reservado hasta que KG produzca el material.

| Código | Curso | Módulos | Lecciones | Horas | Estado | Lanzamiento |
|---|---|---|---|---|---|---|
| KG-PA-001 | Curso Básico de Primeros Auxilios | 7 | 7 | 20 | Publicado | 22 de agosto de 2026 |
| KG-PA-002 | Primeros Auxilios Pediátricos | 4 | 14 | 16 | Borrador | Finales de agosto |
| KG-PA-003 | Primeros Auxilios Psicológicos | 4 | 12 | 12 | Borrador | Finales de agosto |

### Modelo comercial

KG Academy se vende como **servicio: acceso a la plataforma por suscripción de la empresa**, no
curso por curso. Por eso la interfaz no muestra precios individuales, sino la etiqueta
*«Incluido en el plan»*. Los campos `price` y `discountPrice` y las tablas `orders`,
`order_items` y `coupons` se conservan en el modelo por si KG habilita venta B2C directa
más adelante; los planes se administran en `/admin/empresas`.

### Cómo cargar el contenido de una lección

1. Entrar como SuperAdmin → **Cursos** → botón **Constructor** del curso.
2. En cada lección elegir el tipo: `video`, `genially`, `pdf`, `texto`, `enlace` o `scorm`.
3. Pegar la URL del recurso y pulsar **Guardar**.
4. La lección pasa automáticamente a *contenido cargado* y se muestra en el aula virtual.

No hace falta tocar el código: todo queda registrado en la tabla `lessons` y en `audit_logs`.

Las **preguntas cargadas son de ejemplo** y deben reemplazarse por el banco oficial de KG.

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
| `/aula/curso/[slug]` | Aula virtual: índice, reproductor y progreso leción a lección |
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

**44 tablas en 11 dominios funcionales.** El detalle completo está en el PowerPoint
`docs/KG_Academy_Infraestructura_y_Base_de_Datos.pptx` y el modelo fuente en
`prisma/schema.prisma`.

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

## 7. Despliegue en producción (Hostinger)

1. En `prisma/schema.prisma` cambiar `provider = "sqlite"` por `provider = "postgresql"`.
2. En el `.env` del servidor:
   ```
   DATABASE_URL="postgresql://usuario:clave@host:5432/kg_academy?schema=public"
   AUTH_SECRET="<cadena aleatoria larga>"
   NEXT_PUBLIC_APP_URL="https://kgacademy.co"
   ```
3. `npm ci && npx prisma migrate deploy && npm run build && npm start`
4. Mantener el proceso con PM2 o systemd detrás del proxy de Hostinger con HTTPS.

No hay ningún otro cambio de código entre ambientes.

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
├── prisma/
│   ├── schema.prisma        44 tablas
│   ├── seed.ts              cursos, empresa demo, usuarios y avances
│   └── kg_academy.db        base SQLite local (se genera)
├── public/brand/kg-logo.png logotipo oficial
├── scripts/generar_pptx.py  generador del PowerPoint
└── src/
    ├── app/
    │   ├── (public)/  (auth)/  aula/  empresa/  admin/  api/
    ├── components/    Logo · AppShell · CourseCard · ui · Icons
    ├── lib/           auth · prisma · progress · certificates · empresa · constants
    └── styles/globals.css   design system KG
```

---

## 9. Pendientes declarados

Los siguientes puntos quedaron marcados como **POR DEFINIR** en el esqueleto funcional y por
tanto **no se asumieron**; el modelo de datos ya los soporta:

- Pasarela de pagos y facturación (tablas `orders`, `order_items`, `coupons` listas).
- Proveedor SMTP para el envío real de correos (tabla `notification_templates` lista).
- Banco oficial de preguntas de cada curso (el cargado es de ejemplo).
- Matriz fina de permisos por rol más allá de la propuesta implementada.
- Proveedor de alojamiento de video y política de retención.

---

© 2026 KG Gestión Integral S.A.S. — Todos los derechos reservados.
Desarrollado por **Diego Alejandro Hernández Blanco**.
