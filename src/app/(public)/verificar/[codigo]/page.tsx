import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { LogoMark } from "@/components/Logo";
import { IconCheck, IconAlert, IconAward, IconX } from "@/components/Icons";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { codigo: string } }) {
  return { title: `Certificado ${params.codigo}` };
}

export default async function VerificarCodigoPage({ params }: { params: { codigo: string } }) {
  const code = decodeURIComponent(params.codigo).toUpperCase();
  const cert = await prisma.certificate.findUnique({
    where: { code },
    include: { course: true, user: { include: { company: true } } },
  });

  const vencido = cert?.expiresAt ? new Date(cert.expiresAt) < new Date() : false;
  const valido = !!cert && cert.status === "vigente" && !vencido;

  return (
    <section className="relative -mt-[72px] min-h-[85vh] overflow-hidden bg-kg-gradient pb-20 pt-[132px] text-white">
      <div className="pointer-events-none absolute inset-0 bg-kg-mesh" />
      <div className="pointer-events-none absolute inset-0 bg-grid bg-[size:44px_44px] opacity-40" />

      <div className="relative mx-auto max-w-3xl px-4 lg:px-8">
        <div className="card overflow-hidden p-0 text-navy-900">
          {/* Banda de estado */}
          <div
            className={`flex items-center gap-4 px-8 py-6 ${
              valido ? "bg-lime-500" : cert ? "bg-amber-500" : "bg-red-500"
            }`}
          >
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/25 text-white">
              {valido ? (
                <IconCheck width={28} height={28} strokeWidth={3} />
              ) : cert ? (
                <IconAlert width={28} height={28} />
              ) : (
                <IconX width={28} height={28} />
              )}
            </span>
            <div>
              <p className="font-display text-2xl font-extrabold text-white">
                {valido
                  ? "Certificado válido"
                  : cert
                    ? cert.status === "revocado"
                      ? "Certificado revocado"
                      : "Certificado vencido"
                    : "Certificado no encontrado"}
              </p>
              <p className="text-sm text-white/85">
                {cert
                  ? `Código ${cert.code}`
                  : `No existe ningún certificado con el código ${code} en KG Academy.`}
              </p>
            </div>
          </div>

          {cert ? (
            <div className="p-8">
              <div className="flex flex-wrap items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <LogoMark size={62} />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-navy-400">
                      Emitido por
                    </p>
                    <p className="font-display text-lg font-extrabold text-navy-700">
                      KG Gestión Integral S.A.S.
                    </p>
                  </div>
                </div>
                {cert.qrDataUrl && (
                  <Image
                    src={cert.qrDataUrl}
                    alt={`QR del certificado ${cert.code}`}
                    width={104}
                    height={104}
                    className="rounded-xl border border-navy-100 p-1"
                    unoptimized
                  />
                )}
              </div>

              <dl className="mt-8 grid gap-x-8 gap-y-5 sm:grid-cols-2">
                {[
                  ["Titular", cert.studentName],
                  ["Documento", cert.studentDocument ?? "No registrado"],
                  ["Curso", cert.courseTitle],
                  ["Intensidad horaria", `${cert.hours} horas`],
                  ["Calificación final", cert.finalScore ? `${cert.finalScore} / 100` : "Aprobado"],
                  ["Fecha de emisión", formatDate(cert.issuedAt)],
                  ["Vigente hasta", cert.expiresAt ? formatDate(cert.expiresAt) : "Indefinida"],
                  ["Empresa", cert.user.company?.tradeName ?? "Particular"],
                ].map(([k, v]) => (
                  <div key={k}>
                    <dt className="text-[10px] font-bold uppercase tracking-wider text-navy-400">{k}</dt>
                    <dd className="mt-1 font-semibold text-navy-700">{v}</dd>
                  </div>
                ))}
              </dl>

              {cert.status === "revocado" && (
                <div className="mt-7 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  <strong>Motivo de la revocación:</strong> {cert.revokedReason ?? "No especificado"}
                </div>
              )}

              <p className="mt-8 border-t border-navy-50 pt-5 text-xs leading-relaxed text-navy-400">
                Esta verificación se realiza directamente contra la base de datos de KG Academy. La
                información mostrada corresponde a los datos congelados en el momento de la emisión del
                certificado, conforme al principio de trazabilidad histórica de la plataforma.
              </p>
            </div>
          ) : (
            <div className="p-8">
              <p className="text-sm leading-relaxed text-navy-500">
                Revise que el código esté escrito correctamente. Los códigos de KG Academy tienen el
                formato <span className="font-mono font-bold text-navy-700">KG-AAAA-XXXXXX</span>. Si el
                problema persiste, comuníquese con KG Gestión Integral S.A.S.
              </p>
              <Link href="/verificar" className="btn-primary mt-6">
                Intentar con otro código
              </Link>
            </div>
          )}
        </div>

        <p className="mt-8 flex items-center justify-center gap-2 text-center text-xs text-white/40">
          <IconAward width={14} height={14} /> Sistema de verificación de KG Academy
        </p>
      </div>
    </section>
  );
}
