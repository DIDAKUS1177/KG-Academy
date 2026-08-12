import QRCode from "qrcode";
import { prisma } from "./prisma";
import { certificateCode, fullName } from "./utils";

/**
 * Emision automatica de certificados (punto 10 del esqueleto funcional).
 * - Codigo unico de verificacion
 * - QR hacia la pagina publica /verificar/[codigo]
 * - Datos "congelados" en el momento de la emision (no cambian si el curso se edita)
 */
export async function issueCertificate(enrollmentId: string) {
  const enrollment = await prisma.enrollment.findUnique({
    where: { id: enrollmentId },
    include: { user: true, course: true },
  });
  if (!enrollment) throw new Error("Matricula no encontrada");

  const existing = await prisma.certificate.findUnique({ where: { enrollmentId } });
  if (existing) return existing;

  const template = await prisma.certificateTemplate.findFirst({ where: { isDefault: true } });
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  let code = certificateCode();
  while (await prisma.certificate.findUnique({ where: { code } })) code = certificateCode();

  const verifyUrl = `${base}/verificar/${code}`;
  const qrDataUrl = await QRCode.toDataURL(verifyUrl, {
    margin: 1,
    width: 320,
    color: { dark: "#0A2D4DFF", light: "#FFFFFFFF" },
  });

  const expiresAt = enrollment.course.certificateValidityMonths
    ? new Date(
        new Date().setMonth(new Date().getMonth() + enrollment.course.certificateValidityMonths)
      )
    : null;

  return prisma.certificate.create({
    data: {
      code,
      userId: enrollment.userId,
      courseId: enrollment.courseId,
      enrollmentId,
      templateId: template?.id,
      studentName: fullName(enrollment.user),
      studentDocument: enrollment.user.documentNumber,
      courseTitle: enrollment.course.title,
      hours: enrollment.course.durationHours,
      finalScore: enrollment.finalScore,
      verifyUrl,
      qrDataUrl,
      expiresAt,
      status: "vigente",
    },
  });
}
