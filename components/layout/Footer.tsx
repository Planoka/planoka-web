import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

export function Footer() {
  const locale = useLocale();
  const t = useTranslations("nav");

  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-bg-card)]">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
        <div className="flex items-center gap-2 text-sm text-[var(--color-text-tertiary)]">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-primary)] text-[10px] font-bold text-white">
            P
          </span>
          <span>&copy; {new Date().getFullYear()} Planoka. Tous droits réservés.</span>
        </div>
        <nav className="flex items-center gap-6 text-sm text-[var(--color-text-tertiary)]">
          <Link href={`/${locale}`} className="transition-colors hover:text-[var(--color-primary)]">
            {t("home")}
          </Link>
          <Link href={`/${locale}/search`} className="transition-colors hover:text-[var(--color-primary)]">
            {t("explore")}
          </Link>
          <Link href={`/${locale}/settings`} className="transition-colors hover:text-[var(--color-primary)]">
            {t("settings")}
          </Link>
        </nav>
      </div>
    </footer>
  );
}
