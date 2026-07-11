import type { Metadata } from "next";
import { Fraunces, Hanken_Grotesk } from "next/font/google";
import "./globals.css";
import { getConfig } from "@/lib/datos";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const config = await getConfig();
  return {
    title: {
      default: `${config.nombreEmpresa} — Cortinas y diseño a medida`,
      template: `%s · ${config.nombreEmpresa}`,
    },
    description:
      config.claim ??
      "Cortinas, diseño y trabajos a medida para tu hogar. Mirá nuestros trabajos y pedí tu presupuesto.",
  };
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es"
      className={`${fraunces.variable} ${hanken.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
