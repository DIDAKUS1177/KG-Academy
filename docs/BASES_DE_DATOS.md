# KG Academy — Bases de datos: creación, carga y operación

Guía completa para dejar la base de datos de KG Academy funcionando, en local y en
producción. Está escrita para poder seguirla sin haber visto el código.

> Resumen en una línea: **el esquema vive en `prisma/schema.prisma`; todo lo demás se
> genera a partir de él.** Nunca se crean tablas a mano.

---

## 1. Qué hay que crear

**Una sola base de datos** con **43 tablas** en 11 dominios. No hay bases separadas
por módulo: empresas, cursos, evaluaciones y certificados conviven en el mismo
esquema porque se relacionan entre sí (una matrícula apunta a un usuario y a un
curso; un certificado apunta a una matrícula).

| Dominio | Tablas | Para qué |
|---|---|---|
| Identidad y acceso | `roles`, `permissions`, `role_permissions`, `users`, `sessions`, `password_reset_tokens` | Quién entra y qué puede hacer |
| Empresas B2B | `companies`, `company_locations`, `areas`, `positions`, `company_members` | Clientes y su nómina |
| Planes | `plans`, `company_subscriptions` | Qué contrató cada empresa |
| Catálogo | `categories`, `courses`, `modules`, `lessons`, `lesson_resources` | Los cursos y su contenido |
| Matrícula y progreso | `enrollments`, `module_progress`, `lesson_progress` | Quién cursa qué y cuánto lleva |
| Evaluaciones | `question_banks`, `questions`, `question_options`, `assessments`, `assessment_questions`, `assessment_attempts`, `attempt_answers` | Exámenes, intentos y respuestas |
| Certificados | `certificate_templates`, `certificates` | Emisión y verificación pública |
| Asignación empresarial | `assignment_batches`, `course_assignments` | Lo que la empresa le asigna a cada trabajador |
| Comercial | `coupons`, `orders`, `order_items` | Reservado para venta directa |
| Notificaciones y gamificación | `notification_templates`, `notifications`, `badges`, `user_badges`, `points_ledger`, `streaks` | Avisos, puntos e insignias |
| Sistema | `audit_logs`, `system_settings` | Trazabilidad y parámetros |

El SQL exacto de creación, con índices y llaves foráneas, está generado en:

- `docs/sql/kg_academy_postgresql.sql` — producción (43 tablas, 49 índices, 68 llaves foráneas)
- `docs/sql/kg_academy_sqlite.sql` — desarrollo

Se regeneran con `npm run db:sql`. **No se editan a mano**: cualquier cambio va en
`prisma/schema.prisma` y se vuelve a generar.

---

## 2. Dos motores, un esquema

| | Desarrollo | Producción |
|---|---|---|
| Motor | SQLite | PostgreSQL |
| Dónde vive | Un archivo: `prisma/kg_academy.db` | Un servidor (recomendado: Neon) |
| Instalación | Ninguna | Crear la base en el proveedor |
| Cambiar entre uno y otro | `npm run db:sqlite` | `npm run db:postgres` |

El modelo es portable: no usa enumeraciones nativas, arrays ni tipos propios de
PostgreSQL. Por eso el mismo esquema sirve en los dos motores sin tocar una línea.

Prisma exige que el motor (`provider`) sea un literal en el esquema, no una variable
de entorno. Los comandos `db:sqlite` y `db:postgres` lo cambian por usted. **No editar
`provider` a mano**: quedan desincronizados el esquema y el `.env`.

---

## 3. Crear la base en desarrollo (SQLite)

Cuatro comandos. No hay que instalar ningún motor.

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

`npm run setup` hace tres cosas: genera el cliente de Prisma, crea las 43 tablas en
`prisma/kg_academy.db` y carga la **semilla de demostración** (`prisma/seed.ts`): una
empresa ficticia, ocho trabajadores, tres cursos, avances y certificados de ejemplo,
todos con la contraseña `KgAcademy2026*`.

Para volver al estado inicial en cualquier momento:

```bash
npm run db:reset
```

> `db:reset` y `db:seed` **borran toda la base** antes de sembrar. Son solo para
> desarrollo. En producción se usa la semilla de la sección 5.

---

## 4. Crear la base en producción (PostgreSQL)

### 4.1 Crear la base en Neon

1. Entrar a <https://neon.tech> con la cuenta de KG y crear un proyecto llamado
   `kg-academy`, región más cercana (Sudamérica si está disponible, si no, Este de EE. UU.).
2. Copiar la **cadena de conexión** que muestra el panel. Tiene esta forma:

   ```
   postgresql://usuario:clave@ep-xxxx.region.aws.neon.tech/neondb?sslmode=require
   ```

3. Guardarla en un lugar seguro. Es la credencial de la base: quien la tenga puede
   leer y modificar todos los datos.

Cualquier otro proveedor de PostgreSQL sirve igual (Supabase, Railway, un servidor
propio). Lo único que cambia es de dónde sale la cadena de conexión.

### 4.2 Crear las tablas

En el equipo desde el que se despliega:

```bash
npm run db:postgres
```

Pone el esquema en modo PostgreSQL. Luego, con la cadena de conexión de Neon:

```bash
DATABASE_URL="postgresql://..." npx prisma db push
```

Al terminar, Neon tiene las 43 tablas vacías. `prisma db push` aplica exactamente el
SQL de `docs/sql/kg_academy_postgresql.sql`; si un administrador de base de datos
prefiere ejecutar ese archivo directamente en Neon, el resultado es el mismo.

### 4.3 Cargar los catálogos y el primer administrador

```bash
DATABASE_URL="postgresql://..." SEED_ADMIN_EMAIL="direccion@kggestionintegral.com" SEED_ADMIN_PASSWORD="una-clave-larga-y-unica" npm run db:seed:prod
```

Ver la sección 5 para lo que hace exactamente.

### 4.4 Variables de entorno en el alojamiento

En Vercel (o donde corra la aplicación), definir:

| Variable | Valor | Notas |
|---|---|---|
| `DATABASE_URL` | La cadena de Neon | Con `?sslmode=require` |
| `AUTH_SECRET` | Cadena aleatoria de 48+ caracteres | `openssl rand -base64 48`. Distinta a la de desarrollo. |
| `NEXT_PUBLIC_APP_URL` | `https://kgacademy.co` (el dominio real) | **Antes del primer certificado**: los QR se generan con esta dirección |

### 4.5 Volver a desarrollo

```bash
npm run db:sqlite
```

---

## 5. Las dos semillas

| | `npm run db:seed` | `npm run db:seed:prod` |
|---|---|---|
| Archivo | `prisma/seed.ts` | `prisma/seed-produccion.ts` |
| Borra la base antes | **Sí, toda** | **No, nunca** |
| Se puede repetir | Sí, deja la demo como nueva | Sí, crea solo lo que falte |
| Carga | Catálogos + empresa demo + trabajadores + cursos + avances + certificados | Solo catálogos |
| Superadministrador | `admin@kggestionintegral.com` / `KgAcademy2026*` | El de `SEED_ADMIN_*`, solo si no existe ninguno |
| Cursos | Los tres con su contenido | Ninguno: se crean desde el panel |
| Uso | Desarrollo y demostraciones | Producción, una vez y las que hagan falta |

### Qué carga la semilla de producción

| Catálogo | Cantidad | Detalle |
|---|---|---|
| Roles | 6 | superadmin, admin_kg, instructor, admin_empresa, supervisor, estudiante |
| Permisos | 72 | 9 módulos × 8 acciones (`cursos.publicar`, `certificados.revocar`…) |
| Parámetros del sistema | 13 | Marca, firmante de certificados, seguridad, contacto |
| Plantilla de certificado | 1 | La oficial de KG |
| Plantillas de notificación | 7 | Bienvenida, curso asignado, recordatorio, etc. |
| Insignias | 5 | Gamificación |
| Categorías | 4 | Primeros auxilios, SST, riesgo psicosocial, analítica |
| Planes | 3 | Básico, Pro, personalizado |

### Reglas de seguridad de la semilla de producción

- **Valida antes de escribir.** Si falta una variable o la clave es débil, se detiene
  sin haber tocado la base.
- La clave del administrador debe tener **12 caracteres o más** y **no puede ser la de
  la demo**. Se rechaza en ambos casos.
- Si ya existe un superadministrador, lo respeta y no crea otro.
- Si KG cambió un parámetro desde el panel (por ejemplo el firmante), la semilla no lo
  pisa: solo crea los que faltan.

---

## 6. Administrar los datos después

Una vez creada la base, **no hace falta tocarla directamente**. Todo se administra
desde el panel `/admin` con la cuenta de superadministrador:

| Qué | Dónde | Qué se puede hacer |
|---|---|---|
| Usuarios | `/admin/usuarios` | Crear con cualquier rol, editar, cambiar empresa o estado, restablecer contraseña |
| Empresas y planes | `/admin/empresas` | Crear empresa con su administrador, editar, cambiar plan, suspender; crear y editar planes |
| Cursos | `/admin/cursos` | Crear curso y categoría, armar módulos y lecciones, cargar contenido, editar ficha y reglas, publicar |
| Certificados | `/admin/certificados` | Revocar con motivo y restituir |
| Configuración | `/admin/configuracion` | Editar parámetros del sistema en línea |
| Auditoría | `/admin/auditoria` | Ver quién cambió qué, con el antes y el después |

Cada acción del panel queda en `audit_logs` con el usuario que la hizo, la entidad
afectada y los valores anteriores y nuevos.

**Nada se borra desde el panel.** Usuarios, empresas y certificados se inactivan,
suspenden o revocan, porque son evidencia. Solo módulos y lecciones sin avance de
estudiantes se pueden eliminar.

Para mirar la base con interfaz visual en desarrollo:

```bash
npm run db:studio
```

---

## 7. Cambios futuros en el esquema

Cuando haya que agregar una columna o una tabla:

1. Editar `prisma/schema.prisma`.
2. `npx prisma db push` en desarrollo para probar.
3. `npm run db:sql` para regenerar los archivos SQL de referencia.
4. En producción, `DATABASE_URL="postgresql://..." npx prisma db push` después de
   desplegar el código.

`db push` es suficiente mientras el equipo sea pequeño y los cambios sean aditivos.
Cuando haya varias personas desplegando o cambios que destruyan datos (renombrar o
borrar columnas), conviene pasar a `prisma migrate`, que deja cada cambio en un
archivo versionado. Ese paso queda documentado en la documentación oficial de Prisma
y no exige cambiar nada del código actual.

---

## 8. Copias de seguridad

Neon hace copias automáticas y permite restaurar a un punto en el tiempo desde su
panel. Aun así, antes de cualquier cambio de esquema en producción:

```bash
pg_dump "postgresql://..." --no-owner --format=custom --file=kg_academy_$(date +%F).dump
```

Y para restaurar en una base vacía:

```bash
pg_restore --no-owner --dbname="postgresql://..." kg_academy_2026-09-11.dump
```

En desarrollo la copia es copiar el archivo `prisma/kg_academy.db`.

---

## 9. Problemas frecuentes

| Síntoma | Causa | Solución |
|---|---|---|
| `Roles no inicializados` al ingresar | La base tiene tablas pero no catálogos | `npm run db:seed:prod` (o `db:seed` en desarrollo) |
| `provider` no coincide con `DATABASE_URL` | Se cambió uno sin el otro | `npm run db:postgres` o `db:sqlite` según corresponda |
| Los QR de los certificados apuntan a `localhost` | `NEXT_PUBLIC_APP_URL` no era el dominio real al emitirlos | Corregir la variable; los certificados ya emitidos conservan la URL con la que nacieron |
| `npm run db:seed` en producción | Error humano | No hay vuelta atrás sin copia de seguridad. Por eso existe `db:seed:prod`. |

---

Desarrollado por **Diego Alejandro Hernández Blanco** para KG Gestión Integral S.A.S.
