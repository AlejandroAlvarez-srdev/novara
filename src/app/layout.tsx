import type { Metadata } from "next";
import localFont from "next/font/local";
import { Caveat } from "next/font/google";
import "./globals.css";
import "./experience.css";

const poppins = localFont({
  src: [
    { path: "../../public/fonts/poppins-regular.ttf", weight: "400", style: "normal" },
    { path: "../../public/fonts/poppins-semibold.ttf", weight: "600", style: "normal" },
  ],
  variable: "--font-body",
  display: "swap",
});

// La fuente display de la marca (El Pacre) tiene licencia de uso personal y no se
// redistribuye en este repositorio; Caveat es el sustituto libre.
const elPacre = Caveat({ subsets: ["latin"], variable: "--font-display", display: "swap" });

const deploymentHost = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || (deploymentHost ? `https://${deploymentHost}` : "http://localhost:3002")),
  title: "Novara Grupo Constructor | Construimos lo que imaginas",
  description: "Diseño, planificación y construcción en Duitama, Boyacá. Novara transforma ideas en espacios con calidad, confianza y proyección. Conversemos sobre tu proyecto.",
  openGraph: {
    title: "Novara — Construimos lo que imaginas",
    description: "Diseño, planificación y construcción. Una visión integral para espacios que perduran.",
    locale: "es_CO",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es" className={`${poppins.variable} ${elPacre.variable}`}><body>{children}</body></html>;
}
