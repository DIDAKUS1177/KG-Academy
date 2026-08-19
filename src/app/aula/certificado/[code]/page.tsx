import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { formatDate } from "@/lib/utils";
import { LogoFull } from "@/components/Logo";
import { Breadcrumb } from "@/components/ui";
import { PrintButton } from "./PrintButton";
import { IconArrowRight } from "@/components/Icons";

export const dynamic = "force-dynamic";

export default async function CertificadoPage({ params }: { params: { code: string } }) {
  const user = await requireUser();
  const cert = await prisma.certificate.findUnique({
    where: { code: decodeURIComponent(params.code).toUpperCase() },
    include: { course: true, template: true, user: { include: { company: true } } },
  });

  if (!cert) notFound();
  // Solo el titular o el staff de KG pueden abrir la vista completa
  const staff = ["superadmin", "admin_kg"].includes(user.role.code);
  if (cert.userId !== user.id && !staff) notFound();

  await prisma.certificate.update({
    where: { id: cert.id },
    data: { downloads: { increment: 1 } },
  });

  return (
    <div>
      <div className="no-print">
        <Breadcrumb
          items={[
            { label: "Aula", href: "/aula" },
            { label: "Mis certificados", href: "/aula/certificados" },
            { label: cert.code },
          ]}
        />
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="h-display text-2xl">Certificado {cert.code}</h1>
            <p className="mt-1 text-sm text-navy-400">
              Use el boton para imprimir o guardar como PDF (A4 horizontal).
            </p>
          </div>
          <div className="flex gap-3">
            <PrintButton />
            <Link href={`/verificar/${cert.code}`} target="_blank" className="btn-outline">
              Página pública de verificación <IconArrowRight width={15} height={15} />
            </Link>
          </div>
        </div>
      </div>

      {/* ===================== LIENZO DEL CERTIFICADO ===================== */}
      <div className="cert-sheet mx-auto w-full max-w-[1120px] overflow-hidden rounded-3xl border border-navy-100 bg-white shadow-kg-lg">
        <div className="relative">
          {/* Marco decorativo */}
          <div className="absolute inset-0 bg-kg-mesh opacity-40" />
          <div className="absolute inset-x-0 top-0 h-2 bg-kg-gradient" />
          <div className="absolute inset-x-0 bottom-0 h-2 bg-kg-lime" />
          <div className="absolute left-0 inset-y-2 w-2 bg-kg-gradient" />
          <div className="absolute right-0 inset-y-2 w-2 bg-kg-gradient" />

          <div className="relative px-10 py-12 sm:px-16 sm:py-14">
            {/* Encabezado */}
            <div className="flex flex-wrap items-center justify-between gap-6">
              <LogoFull width={190} />
              <div className="text-right">
                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-navy-400">
                  Certificado de aprobación
                </p>
                <p className="mt-1 font-mono text-lg font-extrabold tracking-widest text-lime-600">
                  {cert.code}
                </p>
              </div>
            </div>

            <div className="my-8 h-px bg-gradient-to-r from-transparent vía-navy-200 to-transparent" />

            {/* Cuerpo */}
            <div className="text-center">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-navy-400">
                KG Gestión Integral S.A.S. certifica que
              </p>

              <h2 className="mt-5 font-display text-4xl font-extrabold tracking-tight text-navy-700 sm:text-5xl">
                {cert.studentName}
              </h2>
              {cert.studentDocument && (
                <p className="mt-2 text-sm text-navy-400">
                  Identificado(a) con documento No. {cert.studentDocument}
                </p>
              )}

              <p className="mx-auto mt-7 max-w-2xl text-sm leading-relaxed text-navy-500">
                Cursó y aprobó satisfactoriamente el programa de formación virtual
              </p>

              <p className="mx-auto mt-3 max-w-3xl font-display text-2xl font-bold text-lime-600 sm:text-3xl">
                {cert.courseTitle}
              </p>

              <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-navy-500">
                Con una intensidad academica de{" "}
                <strong className="text-navy-700">{cert.hours} horas</strong>
                {cert.finalScore ? (
                  <>
                    {" "}
                    y una calificación final de{" "}
                    <strong className="text-navy-700">{Math.round(cert.finalScore)}/100</strong>
                  </>
                ) : null}
                , cumpliendo la totalidad de los requisitos academicos establecidos.
              </p>
            </div>

            {/* Pie */}
            <div className="mt-14 grid items-end gap-8 sm:grid-cols-3">
              <div className="text-center sm:text-left">
                <p className="text-[10px] font-bold uppercase tracking-wider text-navy-400">
                  Fecha de expedicion
                </p>
                <p className="mt-1 font-semibold text-navy-700">{formatDate(cert.issuedAt)}</p>
                <p className="mt-3 text-[10px] font-bold uppercase tracking-wider text-navy-400">
                  Vigencia
                </p>
                <p className="mt-1 font-semibold text-navy-700">
                  {cert.expiresAt ? `Hasta ${formatDate(cert.expiresAt)}` : "Indefinida"}
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto h-px w-52 bg-navy-300" />
                <p className="mt-2 font-display text-sm font-bold text-navy-700">
                  {cert.template?.signerName ?? "Katerine Guañarita"}
                </p>
                <p className="text-[11px] text-navy-400">
                  {cert.template?.signerTitle ?? "Directora - KG Gestión Integral S.A.S."}
                </p>
              </div>

              <div className="flex flex-col items-center sm:items-end">
                {cert.qrDataUrl && (
                  <Image
                    src={cert.qrDataUrl}
                    alt={`Código QR de verificación ${cert.code}`}
                    width={104}
                    height={104}
                    className="rounded-lg border border-navy-100 p-1"
                    unoptimized
                  />
                )}
                <p className="mt-2 max-w-[150px] text-center text-[9px] leading-tight text-navy-400 sm:text-right">
                  Escanee para verificar la autenticidad de este certificado
                </p>
              </div>
            </div>

            <p className="mt-10 border-t border-navy-100 pt-4 text-center text-[9px] leading-relaxed text-navy-300">
              Verifique este certificado en {cert.verifyUrl} &middot; Plataforma KG Academy desarrollada
              por Diego Alejandro Hernández Blanco
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
