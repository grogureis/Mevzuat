import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Figtree } from "next/font/google";
import "./globals.css";

const baslikFont = Bricolage_Grotesque({
  subsets: ["latin", "latin-ext"],
  variable: "--font-baslik",
  weight: ["500", "600", "700", "800"],
});

const govdeFont = Figtree({
  subsets: ["latin", "latin-ext"],
  variable: "--font-govde",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Mevzuat — Acil Servis Rehberi",
  description:
    "Yataklı acil servis çalışma kurallarını mevzuata dayalı, kaynak göstererek yanıtlayan rehber uygulama.",
  // iPhone "Ana Ekrana Ekle" ile tam ekran, native benzeri açılış
  appleWebApp: {
    capable: true,
    title: "Mevzuat",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#e30a17",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className={`${baslikFont.variable} ${govdeFont.variable}`}>
      <body>{children}</body>
    </html>
  );
}
