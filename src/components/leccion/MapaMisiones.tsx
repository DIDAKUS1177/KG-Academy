"use client";

/**
 * MAPA DE MISIONES
 *
 * Navegación de un curso en modo juego: cada módulo es un MUNDO y cada
 * lección un NIVEL. Los niveles se desbloquean en orden; al final esperan el
 * desafío final (la evaluación) y el trofeo (el certificado).
 *
 * El estado (completado, bloqueado) viene del servidor. Las estrellas de cada
 * nivel viven en el navegador (las guarda el motor de lecciones al terminar).
 */

import Link from "next/link";
import { useEffect, useState } from "react";
import { Avatar, type AvatarId } from "./Avatares";
import { claveEstrellas } from "./LeccionInteractiva";
import { IconAward, IconCheck, IconFire, IconLock } from "@/components/Icons";

export type NivelMapa = {
  id: string;
  titulo: string;
  href: string;
  estado: "completado" | "disponible" | "bloqueado";
  activo: boolean;
};
export type MundoMapa = { titulo: string; niveles: NivelMapa[] };

export function MapaMisiones({
  mundos,
  jefe,
  trofeo,
  avatar,
  avatarEnJefe = false,
}: {
  mundos: MundoMapa[];
  jefe: { href: string | null; estado: "bloqueado" | "disponible" | "superado"; detalle: string } | null;
  trofeo: { href: string | null };
  avatar?: AvatarId;
  /** Todos los niveles superados: el personaje espera frente al desafío final. */
  avatarEnJefe?: boolean;
}) {
  const [estrellas, setEstrellas] = useState<Record<string, number>>({});
  const niveles = mundos.flatMap((m) => m.niveles);

  useEffect(() => {
    const e: Record<string, number> = {};
    for (const n of niveles) {
      try {
        e[n.id] = Number(localStorage.getItem(claveEstrellas(n.id)) ?? 0);
      } catch {
        e[n.id] = 0;
      }
    }
    setEstrellas(e);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [niveles.map((n) => n.id).join()]);

  const hechos = niveles.filter((n) => n.estado === "completado").length;
  const totalEstrellas = niveles.reduce((s, n) => s + (n.estado === "completado" ? Math.max(1, estrellas[n.id] ?? 0) : 0), 0);
  let numero = 0;

  return (
    <section aria-label="Mapa de misiones" className="relative mb-7 overflow-hidden rounded-3xl bg-navy-900 p-5 text-white sm:p-7">
      <style>{`
        @keyframes kg-mapa-salto { 0%,100%{transform:translate(-50%,0)} 50%{transform:translate(-50%,-7px)} }
        .kg-mapa-avatar { animation: kg-mapa-salto 1.6s ease-in-out infinite; }
        @keyframes kg-mapa-pulso { 0%{box-shadow:0 0 0 0 rgba(165,206,48,.7)} 100%{box-shadow:0 0 0 16px rgba(165,206,48,0)} }
        .kg-mapa-pulso { animation: kg-mapa-pulso 1.5s ease-out infinite; }
        @media (prefers-reduced-motion: reduce) { .kg-mapa-avatar, .kg-mapa-pulso { animation: none !important; } }
      `}</style>
      <div className="pointer-events-none absolute inset-0 bg-kg-mesh opacity-60" />
      <div className="pointer-events-none absolute inset-0 bg-grid bg-[size:32px_32px] opacity-15" />

      <div className="relative flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-display text-xs font-extrabold tracking-[0.25em] text-lime-400">MAPA DE MISIONES</p>
          <p className="mt-1 font-display text-xl font-extrabold">
            {hechos === niveles.length ? "¡Todos los niveles superados!" : `Nivel ${Math.min(hechos + 1, niveles.length)} de ${niveles.length}`}
          </p>
        </div>
        <div className="flex gap-2 text-xs font-extrabold">
          <span className="rounded-full bg-white/10 px-3 py-1.5">
            <span className="text-amber-300">★</span> {totalEstrellas}/{niveles.length * 3}
          </span>
          <span className="rounded-full bg-white/10 px-3 py-1.5 text-lime-300">
            {hechos}/{niveles.length} niveles
          </span>
        </div>
      </div>

      <div className="relative mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {mundos.map((m, mi) => (
          <div key={mi} className="rounded-2xl bg-white/[0.06] p-4 ring-1 ring-white/10">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-lime-300/80">Mundo {mi + 1}</p>
            <p className="mt-0.5 line-clamp-2 min-h-[2.5rem] font-display text-sm font-bold leading-snug text-white/90">
              {m.titulo.replace(/^M[oó]dulo\s*\d+\.\s*/i, "")}
            </p>
            <div className="relative mt-4 flex items-start justify-around gap-2">
              <div className="pointer-events-none absolute left-[18%] right-[18%] top-8 border-t-[3px] border-dashed border-white/20" />
              {m.niveles.map((n) => {
                numero += 1;
                return <Nodo key={n.id} n={n} numero={numero} estrellas={estrellas[n.id] ?? 0} avatar={avatar} />;
              })}
            </div>
          </div>
        ))}

        {/* Desafío final y trofeo */}
        <div className="rounded-2xl bg-gradient-to-br from-red-600/30 to-amber-500/20 p-4 ring-1 ring-red-400/30">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-amber-300">Final</p>
          <p className="mt-0.5 min-h-[2.5rem] font-display text-sm font-bold leading-snug">Desafío final y certificado</p>
          <div className="relative mt-4 flex items-start justify-around gap-2">
            <div className="pointer-events-none absolute left-[18%] right-[18%] top-8 border-t-[3px] border-dashed border-white/20" />
            {jefe && (
              <NodoEspecial
                href={jefe.estado === "bloqueado" ? null : jefe.href}
                etiqueta="Desafío final"
                detalle={jefe.detalle}
                tono={jefe.estado === "superado" ? "lima" : jefe.estado === "disponible" ? "rojo" : "gris"}
                pulso={jefe.estado === "disponible"}
                avatar={avatarEnJefe ? avatar : undefined}
                icono={jefe.estado === "bloqueado" ? <IconLock width={24} height={24} /> : jefe.estado === "superado" ? <IconCheck width={26} height={26} strokeWidth={3} /> : <IconFire width={28} height={28} fill="currentColor" />}
              />
            )}
            <NodoEspecial
              href={trofeo.href}
              etiqueta="Certificado"
              detalle={trofeo.href ? "¡Obtenido!" : "Al superar el desafío"}
              tono={trofeo.href ? "oro" : "gris"}
              pulso={false}
              icono={<IconAward width={26} height={26} />}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function Nodo({ n, numero, estrellas, avatar }: { n: NivelMapa; numero: number; estrellas: number; avatar?: AvatarId }) {
  const bloqueado = n.estado === "bloqueado";
  const hecho = n.estado === "completado";
  const circulo = (
    <span
      className={`relative flex h-16 w-16 items-center justify-center rounded-full border-4 font-display text-xl font-extrabold transition ${
        hecho
          ? "border-lime-300 bg-lime-500 text-navy-900"
          : bloqueado
            ? "border-white/10 bg-white/5 text-white/30"
            : "kg-mapa-pulso border-white bg-navy-700 text-white"
      } ${n.activo ? "ring-4 ring-lime-400/60 ring-offset-2 ring-offset-navy-900" : ""} ${bloqueado ? "" : "group-hover:scale-110"}`}
    >
      {hecho ? <IconCheck width={26} height={26} strokeWidth={3.5} /> : bloqueado ? <IconLock width={22} height={22} /> : numero}
      {n.activo && avatar && (
        <span className="kg-mapa-avatar absolute -top-11 left-1/2">
          <Avatar id={avatar} className="h-10 w-10 drop-shadow-lg" />
        </span>
      )}
    </span>
  );
  const contenido = (
    <>
      {circulo}
      <span className="mt-1.5 h-4 text-sm leading-none" aria-label={hecho ? `${Math.max(1, estrellas)} estrellas` : undefined}>
        {hecho &&
          [1, 2, 3].map((s) => (
            <span key={s} className={s <= Math.max(1, estrellas) ? "text-amber-300" : "text-white/15"}>
              ★
            </span>
          ))}
      </span>
      <span className={`mt-1 line-clamp-2 max-w-[7.5rem] text-center text-[11px] font-semibold leading-snug ${bloqueado ? "text-white/35" : "text-white/85"}`}>
        {n.titulo}
      </span>
    </>
  );
  return bloqueado ? (
    <div className="relative z-[1] flex flex-col items-center" aria-label={`Nivel ${numero}: ${n.titulo}, bloqueado`}>
      {contenido}
    </div>
  ) : (
    <Link href={n.href} className="group relative z-[1] flex flex-col items-center" aria-current={n.activo ? "step" : undefined} aria-label={`Nivel ${numero}: ${n.titulo}${hecho ? ", superado" : ""}`}>
      {contenido}
    </Link>
  );
}

function NodoEspecial({
  href,
  etiqueta,
  detalle,
  tono,
  pulso,
  icono,
  avatar,
}: {
  href: string | null;
  etiqueta: string;
  detalle: string;
  tono: "lima" | "rojo" | "oro" | "gris";
  pulso: boolean;
  icono: React.ReactNode;
  avatar?: AvatarId;
}) {
  const c =
    tono === "lima"
      ? "border-lime-300 bg-lime-500 text-navy-900"
      : tono === "rojo"
        ? "border-red-300 bg-red-600 text-white"
        : tono === "oro"
          ? "border-amber-200 bg-amber-400 text-navy-900"
          : "border-white/10 bg-white/5 text-white/30";
  const contenido = (
    <>
      <span className={`relative flex h-16 w-16 items-center justify-center rounded-2xl border-4 transition group-hover:scale-110 ${c} ${pulso ? "kg-mapa-pulso" : ""}`}>
        {icono}
        {avatar && (
          <span className="kg-mapa-avatar absolute -top-11 left-1/2">
            <Avatar id={avatar} className="h-10 w-10 drop-shadow-lg" />
          </span>
        )}
      </span>
      <span className="mt-2 text-center text-[11px] font-extrabold">{etiqueta}</span>
      <span className="text-center text-[10px] text-white/55">{detalle}</span>
    </>
  );
  return href ? (
    <Link href={href} className="group relative z-[1] flex flex-col items-center">
      {contenido}
    </Link>
  ) : (
    <div className="relative z-[1] flex flex-col items-center">{contenido}</div>
  );
}
