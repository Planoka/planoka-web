import Image from "next/image";
import Link from "next/link";
import { getLocale, getTranslations, getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { Home, Search, Sparkles } from "lucide-react";
import { Inter } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { ThemeProviderWrapper } from "@/components/providers/ThemeProviderWrapper";
import '@/app/[locale]/globals.css';

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export default async function NotFound() {
  const locale = await getLocale();
  const t = await getTranslations("notFound");
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="flex min-h-full flex-col bg-[var(--color-bg-page)] text-[var(--color-text-primary)]">
        <ThemeProviderWrapper>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <main className="flex-1 flex flex-col items-center justify-center px-4 text-center relative overflow-hidden">
              {/* Decorative blobs */}
              <div className="pointer-events-none absolute inset-0 -z-10">
                <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-[var(--color-primary)]/5 blur-3xl" />
                <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-[var(--color-primary)]/5 blur-3xl" />
              </div>

              {/* 404 Number */}
              <div className="relative">
                <h1 className="text-[120px] font-black leading-none text-[var(--color-primary)]/10 sm:text-[180px]">
                  404
                </h1>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Image
                    src="/images/404.png"
                    alt={t("imageAlt")}
                    width={200}
                    height={200}
                    className="h-32 w-32 sm:h-48 sm:w-48 object-contain drop-shadow-xl"
                    priority
                  />
                </div>
              </div>

              {/* Text */}
              <div className="mt-4 z-10">
                <h2 className="text-2xl font-bold text-[var(--color-text-primary)] sm:text-3xl">
                  {t("title")}
                </h2>
                <p className="mt-2 max-w-sm text-[var(--color-text-secondary)]">
                  {t("subtitle1")} {t("subtitle2")}
                </p>
              </div>

              {/* Action buttons */}
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href={`/${locale}`}>
                  <button className="flex items-center justify-center gap-2 rounded-full bg-[var(--color-primary)] px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[var(--color-primary)]/25 transition-all hover:brightness-90 active:scale-95">
                    <Home className="h-4 w-4" />
                    {t("backHome")}
                  </button>
                </Link>
                <Link href={`/${locale}/plans`}>
                  <button className="flex items-center justify-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-card)] px-8 py-3.5 text-sm font-semibold text-[var(--color-text-primary)] transition-all hover:border-[var(--color-primary)]/30 hover:shadow-md active:scale-95">
                    <Search className="h-4 w-4" />
                    Explorer les plans
                  </button>
                </Link>
              </div>

              {/* Floating decorative elements */}
              <div className="pointer-events-none absolute bottom-10 left-10 hidden sm:block">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-primary-light)] shadow-sm">
                  <Sparkles className="h-6 w-6 text-[var(--color-primary)]" />
                </div>
              </div>
            </main>
            <Footer />
          </NextIntlClientProvider>
        </ThemeProviderWrapper>
      </body>
    </html>
  );
}