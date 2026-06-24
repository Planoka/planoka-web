"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

export function FooterMinimal() {
  const locale = useLocale();
  const t = useTranslations("footer");

  return (
    <footer className="hidden md:block border-t border-[var(--color-border)] bg-[var(--color-bg-card)] pb-24 pt-8 md:pb-8 mt-4">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-xs text-[var(--color-text-tertiary)]">
            &copy; {new Date().getFullYear()} Planoka. {t("rights")}
          </p>
          <div className="flex items-center gap-4 text-xs text-[var(--color-text-tertiary)]">
            <Link href={`/${locale}/privacy`} className="transition-colors hover:text-[var(--color-primary)]">
              {t("privacy")}
            </Link>
            <Link href={`/${locale}/terms`} className="transition-colors hover:text-[var(--color-primary)]">
              {t("terms")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}