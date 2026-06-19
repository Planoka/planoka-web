import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import "./globals.css";

/* Police officielle Planoka (charte graphique) */
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

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <ClerkProvider>
      <html lang={locale} className={`${inter.variable} h-full antialiased`}>
        <body className="min-h-full flex flex-col bg-[var(--color-bg-page)] text-[var(--color-text-primary)]">
          <NextIntlClientProvider locale={locale} messages={messages}>
            {children}
          </NextIntlClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
