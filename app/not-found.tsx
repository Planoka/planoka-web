import Image from "next/image";
import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";
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

  return (
    <html lang={locale} className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="flex min-h-full flex-col bg-[var(--color-bg-page)] text-[var(--color-text-primary)]">
        <ThemeProviderWrapper>
          <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
            <div className="z-10 mt-8">
              <h1 className="text-5xl font-black tracking-wide text-[var(--color-text-primary)] md:text-7xl">
                {t("title")}
              </h1>
              <p className="mt-4 text-lg font-bold leading-snug text-[var(--color-text-primary)] md:text-xl">
                {t("subtitle1")}
                <br />{t("subtitle2")}
              </p>
            </div>

            <div className="relative my-8 w-full max-w-2xl">
              <Image
                src="/images/404.png"
                alt={t("imageAlt")}
                width={800}
                height={500}
                className="mx-auto h-auto w-full object-contain"
                priority
              />
            </div>

            <Link href={`/${locale}`}>
              <button className="flex items-center justify-center gap-2 rounded-full border-2 border-[var(--color-text-primary)] bg-[var(--color-primary)] px-8 py-3.5 text-lg font-bold text-white transition-all hover:-translate-y-1 hover:shadow-[0_4px_0_0_var(--color-text-primary)] active:translate-y-0 active:shadow-none">
                {t("backHome")}
                <ArrowRight className="h-5 w-5 stroke-[2.5]" />
              </button>
            </Link>
          </main>
          <Footer />
        </ThemeProviderWrapper>
      </body>
    </html>
  );
}
