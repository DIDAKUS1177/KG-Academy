import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { formatDate } from "@/lib/utils";
import { EmptyState, SectionTitle, StatusBadge } from "@/components/ui";
import { IconAward, IconArrowRight, IconQr } from "@/components/Icons";

export const metadata: Metadata = { title: "Mis certificados" };
export const dynamic = "force-dynamic";

export default async function CertificadosPage() {
  const user = await requireUser();
  const certs = await prisma.certificate.findMany({
    where: { userId: user.id },
    include: { course: true },
    orderBy: { issuedAt: "desc" },
  });

  return (
    <div>
      <SectionTitle
        eyebrow="Mi aprendizaje"
        title="Mis certificados"
        description="Cada certificado tiene un codigo unico y un QR de verificacion publica."
      />

      {certs.length === 0 ? (
        <EmptyState
          icon={<IconAward width={30} height={30} />}
          title="Aun no tiene certificados"
          description="Complete todas las lecciones de un curso y apruebe la evaluacion final para obtener su certificado automaticamente."
          action={
            <Link href="/aula/cursos" className="btn-lime">
              Ir a mis cursos
            </Link>
          }
        />
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {certs.map((c) => (
            <Link key={c.id} href={`/aula/certificado/${c.code}`} className="card card-hover overflow-hidden">
              <div className="relative h-28 overflow-hidden bg-kg-gradient p-5">
                <div className="absolute inset-0 bg-kg-mesh opacity-80" />
                <div className="absolute inset-0 bg-grid bg-[size:22px_22px] opacity-40" />
                <div className="relative flex items-start justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-lime-500 text-navy-900">
                    <IconAward width={22} height={22} />
                  </span>
                  <StatusBadge status={c.status} />
                </div>
                <p className="relative mt-3 font-mono text-[11px] font-bold tracking-widest text-lime-400">
                  {c.code}
                </p>
              </div>

              <div className="p-5">
                <p className="font-display text-[15px] font-bold leading-snug text-navy-700">
                  {c.courseTitle}
                </p>
                <dl className="mt-4 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <dt className="text-navy-400">Emitido</dt>
                    <dd className="font-semibold text-navy-600">{formatDate(c.issuedAt)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-navy-400">Intensidad</dt>
                    <dd className="font-semibold text-navy-600">{c.hours} horas</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-navy-400">Vigente hasta</dt>
                    <dd className="font-semibold text-navy-600">
                      {c.expiresAt ? formatDate(c.expiresAt) : "Indefinida"}
                    </dd>
                  </div>
                </dl>
                <div className="mt-4 flex items-center justify-between border-t border-navy-50 pt-4 text-xs font-bold text-navy-500">
                  <span className="inline-flex items-center gap-1.5">
                    <IconQr width={13} height={13} /> Verificable
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-lime-600">
                    Ver certificado <IconArrowRight width={13} height={13} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
