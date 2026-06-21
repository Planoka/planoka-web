"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { locales, type Locale } from "@/i18n";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LanguageToggle() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("common");

  const toggleLocale = () => {
    const currentIndex = locales.indexOf(locale as Locale);
    const nextLocale = locales[(currentIndex + 1) % locales.length];
    const pathWithoutLocale = pathname.replace(new RegExp(`^/${locale}`), "") || "/";
    router.push(`/${nextLocale}${pathWithoutLocale}`);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleLocale}
      className="gap-1"
      aria-label={t("language")}
    >
      <Globe className="h-4 w-4" />
      <span className="hidden text-[11px] font-semibold uppercase sm:inline">{locale}</span>
    </Button>
  );
}
