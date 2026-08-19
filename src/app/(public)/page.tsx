import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { LogoFull, LogoMark } from "@/components/Logo";
import { CourseCard } from "@/components/CourseCard";
import { CreditoDesarrollo, EnlacesContacto } from "@/components/Contacto";
import {
  IconShield,
  IconGraduation,
  IconChart,
  IconArrowRight,
  IconAward,
  IconUsers,
  IconClipboard,
  IconQr,
  IconSpark,
  IconCheck,
  IconBuilding,
} from "@/components/Icons";

export const dynamic = "force-dynamic";

const SERVICIOS = [
  {
    icon: <IconShield width={26} height={26} />,
    title: "Gestión SST",
    text: "Capacitación alineada al SG-SST, con evidencia descargable para auditorías y visitas de la ARL.",
  },
  {
    icon: <IconGraduation width={26} height={26} />,
    title: "E-Learning",
    text: "Aula virtual con módulos, lecciones, recursos interactivos y evaluaciones automáticas.",
  },
  {
    icon: <IconChart width={26} height={26} />,
    title: "Business Analytics",
    text: "Indicadores de cumplimiento por área, cargo y sede, exportables a Excel para su informe.",
  },
];

const PASOS = [
  { n: "01", t: "La empresa carga sus trabajadores", d: "Individual o de forma masiva, organizados por área, cargo y sede." },
  { n: "02", t: "Se asignan los cursos", d: "Con fecha límite y carácter obligatorio u opcional. El trabajador recibe la notificación." },
  { n: "03", t: "El trabajador estudia y se evalua", d: "Aula virtual con progreso guardado lección a lección y evaluación final." },
  { n: "04", t: "Se emite el certificado", d: "Automático, con código único y QR de verificación pública." },
];

export default async function LandingPage() {
  const courses = await prisma.course.findMany({
    where: { status: { in: ["publicado", "revision", "borrador"] } },
    include: {
      category: true,
      modules: { include: { lessons: true } },
    },
    orderBy: { createdAt: "asc" },
    take: 3,
  });

  const [totalCourses, totalUsers, totalCerts] = await Promise.all([
    prisma.course.count(),
    prisma.user.count(),
    prisma.certificate.count(),
  ]);

  return (
    <>
      {/* ============================== HERO ============================== */}
      <section className="relative -mt-[72px] overflow-hidden bg-kg-gradient pb-24 pt-[132px] text-white">
        <div className="pointer-events-none absolute inset-0 bg-kg-mesh" />
        <div className="pointer-events-none absolute inset-0 bg-grid bg-[size:48px_48px] opacity-40" />
        <div className="pointer-events-none absolute -left-32 top-20 h-80 w-80 rounded-full bg-lime-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-lime-400/10 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 lg:grid-cols-[1.05fr_.95fr] lg:px-8">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-lime-500/30 bg-lime-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-lime-400">
              <IconSpark width={14} height={14} /> Nueva plataforma educativa
            </span>

            <h1 className="mt-6 font-display text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
              Formación que
              <span className="relative mx-3 inline-block">
                <span className="relative z-10 text-lime-400">protege vidas</span>
                <span className="absolute inset-x-0 bottom-1.5 z-0 h-3 rounded bg-lime-500/25" />
              </span>
              y que su empresa puede demostrar.
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-white/65 sm:text-lg">
              KG Academy es el aula virtual de <strong className="font-semibold text-white">KG Gestión Integral S.A.S.</strong>{" "}
              Cursos en Seguridad y Salud en el Trabajo con progreso trazable, evaluaciones y
              certificados verificables por código único y QR.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/catalogo" className="btn-lime px-7 py-3 text-base">
                Ver los cursos <IconArrowRight width={18} height={18} />
              </Link>
              <Link
                href="/#empresas"
                className="btn border border-white/20 bg-white/5 px-7 py-3 text-base text-white backdrop-blur hover:bg-white/10"
              >
                <IconBuilding width={18} height={18} /> Soy una empresa
              </Link>
            </div>

            <dl className="mt-12 grid max-w-lg grid-cols-3 gap-4">
              {[
                { k: totalCourses, l: "Cursos en plataforma" },
                { k: totalUsers, l: "Usuarios registrados" },
                { k: totalCerts, l: "Certificados emitidos" },
              ].map((s) => (
                <div key={s.l} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                  <dt className="font-display text-3xl font-extrabold text-lime-400">{s.k}</dt>
                  <dd className="mt-1 text-[11px] leading-tight text-white/50">{s.l}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Tarjeta con el logotipo oficial */}
          <div className="relative animate-fade-up [animation-delay:150ms]">
            <div className="absolute -inset-6 rounded-[2.5rem] bg-lime-500/10 blur-2xl" />
            <div className="relative animate-float rounded-[2rem] border border-white/15 bg-white p-8 shadow-kg-lg">
              <LogoFull width={360} className="mx-auto" />
            </div>

            <div className="absolute -bottom-6 -left-6 hidden rounded-2xl border border-white/15 bg-white/95 p-4 shadow-kg-lg backdrop-blur sm:block">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime-500 text-navy-900">
                  <IconAward width={20} height={20} />
                </span>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wide text-navy-400">Certificado</p>
                  <p className="font-display text-sm font-extrabold text-navy-700">Verificable con QR</p>
                </div>
              </div>
            </div>

            <div className="absolute -right-4 top-8 hidden rounded-2xl border border-white/15 bg-navy-800/90 p-4 shadow-kg-lg backdrop-blur lg:block">
              <p className="text-[10px] font-bold uppercase tracking-wide text-lime-400">Avance del grupo</p>
              <p className="font-display text-2xl font-extrabold text-white">86%</p>
              <div className="mt-2 h-1.5 w-32 overflow-hidden rounded-full bg-white/15">
                <div className="h-full w-[86%] rounded-full bg-kg-lime" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================ SERVICIOS ============================ */}
      <section className="relative z-10 mx-auto -mt-14 max-w-7xl px-4 lg:px-8">
        <div className="grid gap-5 md:grid-cols-3">
          {SERVICIOS.map((s, i) => (
            <div
              key={s.title}
              className="card card-hover animate-fade-up p-7"
              style={{ animationDelay: `${i * 90}ms` }}
            >
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-navy-700 text-lime-400">
                {s.icon}
              </span>
              <h3 className="mt-5 font-display text-lg font-bold text-navy-700">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-navy-400">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ============================= CURSOS ============================= */}
      <section id="cursos" className="mx-auto max-w-7xl px-4 py-24 lg:px-8">
        <div className="mb-10 text-center">
          <p className="eyebrow">Primera etapa</p>
          <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-navy-700 sm:text-4xl">
            Los tres primeros cursos
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-navy-400">
            La estructura pedagógica, las evaluaciones y los certificados ya están listos. El contenido
            audiovisual de cada lección se carga desde el panel administrativo cuando KG lo tenga
            producido.
          </p>
          <p className="mx-auto mt-4 inline-flex items-center gap-2 rounded-full bg-lime-100 px-4 py-2 text-xs font-bold text-lime-800">
            <IconCheck width={14} height={14} strokeWidth={3.5} />
            Todo el catálogo está incluido en el acceso a la plataforma
          </p>
          <span className="mx-auto mt-5 block h-1 w-16 rounded-full bg-kg-lime" />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((c) => (
            <CourseCard
              key={c.id}
              course={{
                slug: c.slug,
                code: c.code,
                title: c.title,
                subtitle: c.subtitle,
                level: c.level,
                durationHours: c.durationHours,
                accessType: c.accessType,
                price: c.price,
                status: c.status,
                modulesCount: c.modules.length,
                lessonsCount: c.modules.reduce((s, m) => s + m.lessons.length, 0),
                categoryName: c.category.name,
                categoryColor: c.category.color,
              }}
            />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link href="/catalogo" className="btn-outline">
            Ver el catálogo completo <IconArrowRight width={16} height={16} />
          </Link>
        </div>
      </section>

      {/* =========================== COMO FUNCIONA ========================= */}
      <section id="como-funciona" className="relative overflow-hidden bg-navy-50/60 py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mb-14 max-w-2xl">
            <p className="eyebrow">Del aula al indicador</p>
            <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-navy-700 sm:text-4xl">
              Cómo funciona KG Academy
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {PASOS.map((p) => (
              <div key={p.n} className="group relative rounded-2xl border border-navy-100 bg-white p-6 transition-all hover:-translate-y-1 hover:shadow-kg-lg">
                <span className="font-display text-4xl font-extrabold text-navy-100 transition-colors group-hover:text-lime-200">
                  {p.n}
                </span>
                <h3 className="mt-3 font-display text-base font-bold text-navy-700">{p.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-navy-400">{p.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================= EMPRESAS ============================ */}
      <section id="empresas" className="mx-auto max-w-7xl px-4 py-24 lg:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <div>
            <p className="eyebrow">Módulo B2B</p>
            <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-navy-700 sm:text-4xl">
              Su matriz de capacitación, siempre al día
            </h2>
            <p className="mt-4 text-navy-400">
              El panel empresarial responde en un clic las preguntas que hace un auditor: quién inició,
              quién va en progreso, quién terminó y quién no ha entrado.
            </p>

            <ul className="mt-8 space-y-4">
              {[
                "Carga de trabajadores individual o masiva por área, cargo y sede.",
                "Asignación de cursos con fecha límite y recordatorios automáticos.",
                "Seguimiento en tiempo real del porcentaje de avance de cada persona.",
                "Descarga de certificados y exportación de reportes a Excel/CSV.",
                "Separación total de la información entre empresas.",
              ].map((t) => (
                <li key={t} className="flex gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-lime-500 text-navy-900">
                    <IconCheck width={13} height={13} strokeWidth={3} />
                  </span>
                  <span className="text-sm leading-relaxed text-navy-600">{t}</span>
                </li>
              ))}
            </ul>

            <Link href="/registro?tipo=empresa" className="btn-primary mt-9">
              Solicitar acceso empresarial <IconArrowRight width={16} height={16} />
            </Link>
          </div>

          {/* Mock del panel empresarial */}
          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl bg-lime-500/10 blur-2xl" />
            <div className="relative overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-kg-lg">
              <div className="flex items-center gap-2 border-b border-navy-100 bg-navy-50/60 px-5 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-lime-500" />
                <span className="ml-3 text-[11px] font-semibold text-navy-400">
                  Panel empresarial &middot; Seguimiento
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3 p-5">
                {[
                  { l: "Asignados", v: "48", c: "text-navy-700" },
                  { l: "En progreso", v: "17", c: "text-amber-600" },
                  { l: "Completados", v: "26", c: "text-lime-600" },
                ].map((k) => (
                  <div key={k.l} className="rounded-xl bg-navy-50/70 p-3">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-navy-400">{k.l}</p>
                    <p className={`font-display text-2xl font-extrabold ${k.c}`}>{k.v}</p>
                  </div>
                ))}
              </div>
              <div className="space-y-3 px-5 pb-6">
                {[
                  { n: "Laura Cardenas", a: "Operaciones", p: 100 },
                  { n: "Jhon Ramirez", a: "Mantenimiento", p: 64 },
                  { n: "Sandra Molina", a: "Administrativa", p: 38 },
                  { n: "Carlos Pineda", a: "Producción", p: 0 },
                ].map((r) => (
                  <div key={r.n} className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-kg-gradient text-[10px] font-bold text-white">
                      {r.n.split(" ").map((x) => x[0]).join("")}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between">
                        <p className="truncate text-xs font-semibold text-navy-700">{r.n}</p>
                        <p className="text-[10px] font-bold text-navy-400">{r.p}%</p>
                      </div>
                      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-navy-100">
                        <div className="h-full rounded-full bg-kg-lime" style={{ width: `${r.p}%` }} />
                      </div>
                      <p className="mt-0.5 text-[10px] text-navy-300">{r.a}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================== VERIFICACIÓN ========================== */}
      <section className="relative overflow-hidden bg-kg-gradient py-20 text-white">
        <div className="pointer-events-none absolute inset-0 bg-kg-mesh opacity-70" />
        <div className="relative mx-auto flex max-w-5xl flex-col items-center gap-8 px-4 text-center lg:px-8">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-lime-500 text-navy-900">
            <IconQr width={28} height={28} />
          </span>
          <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            Cada certificado se puede verificar
          </h2>
          <p className="max-w-2xl text-white/65">
            Todo certificado emitido por KG Academy lleva un código único y un código QR. Cualquier
            persona puede confirmar su autenticidad, sin necesidad de tener cuenta.
          </p>
          <form action="/verificar" className="flex w-full max-w-md gap-2">
            <input
              name="codigo"
              placeholder="KG-2026-XXXXXX"
              className="input flex-1 border-white/20 bg-white/10 text-white placeholder:text-white/40 focus:border-lime-500"
            />
            <button className="btn-lime shrink-0">Verificar</button>
          </form>
        </div>
      </section>

      {/* ============================== CIERRE ============================= */}
      <section className="mx-auto max-w-7xl px-4 py-24 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-navy-100 bg-white p-10 shadow-kg lg:p-14">
          <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-lime-500/10 blur-3xl" />
          <div className="relative grid items-center gap-10 lg:grid-cols-[auto_1fr_auto]">
            <LogoMark size={92} className="shadow-kg" />
            <div>
              <p className="eyebrow">KG Gestión Integral S.A.S.</p>
              <h2 className="mt-2 font-display text-2xl font-extrabold text-navy-700 sm:text-3xl">
                Empiece hoy la capacitación de su equipo
              </h2>
              <p className="mt-2 max-w-xl text-sm text-navy-400">
                Cree su cuenta gratis, explore el catálogo y solicite su plan empresarial.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/registro" className="btn-lime px-6 py-3">
                Crear cuenta
              </Link>
              <Link href="/catalogo" className="btn-outline px-6 py-3">
                Ver cursos
              </Link>
            </div>
          </div>

          {/* Contacto directo con KG */}
          <div className="relative mt-10 grid gap-8 border-t border-navy-100 pt-9 lg:grid-cols-[1fr_auto]">
            <div>
              <p className="eyebrow">Hablemos</p>
              <h3 className="mt-2 font-display text-xl font-extrabold text-navy-700">
                Prefiere que le expliquemos?
              </h3>
              <p className="mt-2 max-w-lg text-sm leading-relaxed text-navy-400">
                Escríbanos por WhatsApp o por correo y le mostramos la plataforma, resolvemos sus
                dudas y le armamos el plan que necesita su empresa.
              </p>
            </div>
            <div className="lg:min-w-[290px]">
              <EnlacesContacto tone="light" />
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3 text-center text-xs text-navy-300">
          <IconUsers width={14} height={14} />
          <span>
            Plataforma diseñada y desarrollada por <CreditoDesarrollo /> para KG Gestión Integral
            S.A.S.
          </span>
          <IconClipboard width={14} height={14} />
        </div>
      </section>
    </>
  );
}
