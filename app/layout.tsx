import type { Metadata } from "next";
import localFont from "next/font/local";
import { Newsreader } from "next/font/google";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import "./globals.css";

const aileron = localFont({
  src: [
    { path: "./fonts/aileron/Aileron-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/aileron/Aileron-Italic.woff2", weight: "400", style: "italic" },
    { path: "./fonts/aileron/Aileron-SemiBold.woff2", weight: "600", style: "normal" },
    { path: "./fonts/aileron/Aileron-SemiBoldItalic.woff2", weight: "600", style: "italic" },
    { path: "./fonts/aileron/Aileron-Bold.woff2", weight: "700", style: "normal" },
    { path: "./fonts/aileron/Aileron-BoldItalic.woff2", weight: "700", style: "italic" },
    { path: "./fonts/aileron/Aileron-ExtraBold.woff2", weight: "800", style: "normal" },
  ],
  variable: "--font-aileron",
  display: "swap",
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  weight: ["600"],
  style: ["italic"],
});

export const metadata: Metadata = {
  title: "La Emperatriz — Mentoría cultural | Puente",
  description:
    "La emperatriz — un proceso vivo para cogestar y encaminar tus proyectos culturales. Mentoría de Puente, consultora de gestión cultural.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${aileron.variable} ${newsreader.variable} scroll-smooth antialiased`}
    >
      <body className="min-h-screen bg-crema text-negro font-sans">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
