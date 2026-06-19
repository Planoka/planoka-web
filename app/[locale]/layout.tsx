import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { shadcn } from "@clerk/ui/themes";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { AuthSync } from "@/components/providers/AuthSync";
import { ThemeProviderWrapper } from "@/components/providers/ThemeProviderWrapper";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { TabBarMobile } from "@/components/layout/TabBarMobile";
import { getClerkPaths } from "@/lib/clerk-paths";
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
  const clerkPaths = getClerkPaths(locale);

  return (
    <html lang={locale} className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-[var(--color-bg-page)] text-[var(--color-text-primary)]">
        <ClerkProvider
          dynamic
          appearance={{ theme: shadcn }}
          signInUrl={clerkPaths.signIn}
          signUpUrl={clerkPaths.signUp}
        >
          <ThemeProviderWrapper>
            <NextIntlClientProvider locale={locale} messages={messages}>
              <QueryProvider>
                <AuthSync />
                <Navbar />
                <main className="flex-1">{children}</main>
                <Footer />
                <TabBarMobile />
              </QueryProvider>
            </NextIntlClientProvider>
          </ThemeProviderWrapper>
        </ClerkProvider>
      </body>
    </html>
  );
}
