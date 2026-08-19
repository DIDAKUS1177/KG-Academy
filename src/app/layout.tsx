import type { Metadata, Viewport } from "next";
import { BRAND } from "@/lib/constants";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: {
    default: "KG Academy | KG Gestion Integral S.A.S.",
    template: "%s | KG Academy",
  },
  description:
    "Plataforma de formacion virtual en Seguridad y Salud en el Trabajo de KG Gestion Integral S.A.S. Cursos, evaluaciones, certificados verificables y trazabilidad corporativa.",
  applicationName: "KG Academy",
  authors: [{ name: BRAND.developer, url: BRAND.developerUrl }],
  creator: BRAND.developer,
  publisher: "KG Gestion Integral S.A.S.",
  keywords: ["SST", "e-learning", "primeros auxilios", "capacitacion", "certificados", "KG Academy"],
  icons: { icon: "/brand/kg-logo.png", apple: "/brand/kg-logo.png" },
};

export const viewport: Viewport = {
  themeColor: "#0A2D4D",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-CO">
      <body>{children}</body>
    </html>
  );
}
