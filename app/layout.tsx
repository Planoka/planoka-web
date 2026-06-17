import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Police officielle Planoka (charte graphique)
const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Planoka — Les meilleurs bons plans au Cameroun",
  description:
    "Découvrez et partagez les meilleurs bons plans locaux au Cameroun : restaurants, sorties, promotions, services et loisirs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[var(--color-bg-page)] text-[var(--color-text-primary)]">
        {children}
      </body>
    </html>
  );
}
