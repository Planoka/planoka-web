"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { Compass, Heart, Plus, Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { Button } from "@/components/ui/button";
import { getClerkPaths } from "@/lib/clerk-paths";

const navLinks = [
  { key: "home", href: "/", icon: Compass },
  { key: "explore", href: "/search", icon: Compass },
  { key: "favorites", href: "/profile/favorites", icon: Heart },
] as const;

export function Navbar() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const paths = getClerkPaths(locale);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--color-border)] bg-[var(--color-bg-card)]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href={`/${locale}`}
          className="flex items-center gap-2 text-lg font-bold tracking-tight text-[var(--color-text-primary)]"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-primary)] text-sm font-bold text-white">
            P
          </span>
          Planoka
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.key}
              href={`/${locale}${link.href}`}
              className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-primary-light)] hover:text-[var(--color-primary)]"
            >
              {t(link.key)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          <Show when="signed-in">
            <Link
              href={`/${locale}/plans/new`}
              className="hidden sm:flex items-center gap-1.5 rounded-full bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white transition-all hover:brightness-90 active:scale-95"
            >
              <Plus className="h-4 w-4" />
              {t("addPlan")}
            </Link>
          </Show>

          <Show when="signed-out">
            <div className="hidden items-center gap-2 sm:flex">
              <SignInButton mode="redirect" forceRedirectUrl={paths.afterSignIn} signUpForceRedirectUrl={paths.afterSignUp}>
                <Button variant="ghost" size="sm">
                  {t("signIn")}
                </Button>
              </SignInButton>
              <SignUpButton mode="redirect" forceRedirectUrl={paths.afterSignUp} signInForceRedirectUrl={paths.afterSignIn}>
                <Button variant="default" size="sm" className="bg-[var(--color-primary)] hover:brightness-90">
                  {t("signUp") ?? "S'inscrire"}
                </Button>
              </SignUpButton>
            </div>
          </Show>

          <Show when="signed-in">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8",
                },
              }}
            />
          </Show>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-[var(--color-border)] md:hidden"
          >
            <div className="flex flex-col gap-1 px-4 py-4">
              {navLinks.map((link) => (
                <Link
                  key={link.key}
                  href={`/${locale}${link.href}`}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-primary-light)] hover:text-[var(--color-primary)]"
                >
                  <link.icon className="h-5 w-5" />
                  {t(link.key)}
                </Link>
              ))}
              <Show when="signed-in">
                <Link
                  href={`/${locale}/plans/new`}
                  onClick={() => setMobileOpen(false)}
                  className="mt-2 flex items-center gap-3 rounded-xl bg-[var(--color-primary)] px-4 py-3 text-sm font-medium text-white"
                >
                  <Plus className="h-5 w-5" />
                  {t("addPlan")}
                </Link>
              </Show>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
