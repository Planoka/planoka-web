"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Home, Compass, Heart, User, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { key: "home", href: "/", icon: Home },
  { key: "explore", href: "/search", icon: Compass },
  { key: "add", href: "/plans/new", icon: Plus, isCenter: true },
  { key: "favorites", href: "/profile/favorites", icon: Heart },
  { key: "profile", href: "/profile", icon: User },
] as const;

export function TabBarMobile() {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("nav");

  return (
    <nav className="fixed bottom-4 left-4 right-4 z-50 flex h-[72px] items-center justify-around rounded-2xl bg-[var(--color-bg-card)] px-2 shadow-[0_-4px_24px_rgba(0,0,0,0.08)] md:hidden">
      {tabs.map((tab) => {
        const isActive = tab.href === "/"
          ? pathname === `/${locale}` || pathname === `/${locale}/`
          : pathname.startsWith(`/${locale}${tab.href}`);
        const Icon = tab.icon;
        const isCenter = tab.key === "add";

        if (isCenter) {
          return (
            <Link
              key={tab.key}
              href={`/${locale}${tab.href}`}
              className="flex h-[52px] w-[52px] -translate-y-3 items-center justify-center rounded-full bg-[var(--color-primary)] text-white shadow-lg transition-transform active:scale-95"
              aria-label={t("addPlan")}
            >
              <Icon className="h-6 w-6" />
            </Link>
          );
        }

        return (
          <Link
            key={tab.key}
            href={`/${locale}${tab.href}`}
            className={cn(
              "flex flex-col items-center gap-0.5 px-3 py-1 text-xs font-medium transition-colors",
              isActive
                ? "text-[var(--color-primary)]"
                : "text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)]",
            )}
          >
            <Icon className={cn("h-5 w-5", isActive && "fill-[var(--color-primary)]")} />
            <span className={cn(isActive && "font-semibold")}>{t(tab.key)}</span>
          </Link>
        );
      })}
    </nav>
  );
}
