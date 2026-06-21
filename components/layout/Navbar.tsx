"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { usePathname } from "next/navigation";
import { Plus, Search } from "lucide-react";
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { LanguageToggle } from "@/components/common/LanguageToggle";
import { Button } from "@/components/ui/button";
import { getClerkPaths } from "@/lib/clerk-paths";
import { cn } from "@/lib/utils";

const navLinks = [
  { key: "home", href: "/" },
  { key: "explore", href: "/search" },
  { key: "favorites", href: "/profile/favorites" },
] as const;

export function Navbar() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const paths = getClerkPaths(locale);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--color-border)] bg-[var(--color-bg-card)]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href={`/${locale}`} className="flex shrink-0 items-center gap-2.5">
          <Image src="/icons/logo.png" alt="Planoka" width={90} height={90} priority />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const isActive = link.href === "/"
              ? pathname === `/${locale}` || pathname === `/${locale}/`
              : pathname.startsWith(`/${locale}${link.href}`);
            return (
              <Link
                key={link.key}
                href={`/${locale}${link.href}`}
                className={cn(
                  "relative rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "text-[var(--color-primary)]"
                    : "text-[var(--color-text-secondary)] hover:bg-[var(--color-primary-light)] hover:text-[var(--color-primary)]",
                )}
              >
                {t(link.key)}
                {isActive && (
                  <span className="absolute inset-x-1 -bottom-0.5 h-0.5 rounded-full bg-[var(--color-primary)]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right section */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Search toggle */}
          <Button variant="ghost" size="icon" className="hidden sm:flex" aria-label="Rechercher">
            <Search className="h-4 w-4" />
          </Button>

          <LanguageToggle />
          <ThemeToggle />

          <Show when="signed-in">
            <Link
              href={`/${locale}/plans/new`}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white transition-all hover:brightness-90 active:scale-95"
            >
              <Plus className="h-4 w-4" />
              {t("addPlan")}
            </Link>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8 rounded-full ring-2 ring-[var(--color-primary)]/20",
                },
              }}
            />
          </Show>

          <Show when="signed-out">
            <div className="hidden items-center gap-2 sm:flex">
              <SignInButton mode="redirect" forceRedirectUrl={paths.afterSignIn} signUpForceRedirectUrl={paths.afterSignUp}>
                <Button variant="ghost" size="sm">
                  {t("signIn")}
                </Button>
              </SignInButton>
              <SignUpButton mode="redirect" forceRedirectUrl={paths.afterSignUp} signInForceRedirectUrl={paths.afterSignIn}>
                <Button size="sm" className="bg-[var(--color-primary)] text-white hover:brightness-90">
                  {t("signUp")}
                </Button>
              </SignUpButton>
            </div>
          </Show>
        </div>
      </div>
    </header>
  );
}
