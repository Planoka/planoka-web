"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

function ThemeScript() {
  useEffect(() => {
    const theme = localStorage.getItem("theme") || "system";
    const isDark =
      theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);
  return null;
}

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html className="" suppressHydrationWarning>
      <body className="flex min-h-screen flex-col bg-[var(--color-bg-page, #F5F0E8)] text-[var(--color-text-primary, #0F0F0F)]">
        <ThemeScript />
        <header className="flex h-16 items-center justify-between border-b border-[var(--color-border, #E8E8E8)] bg-[var(--color-bg-card, #FFFFFF)]/80 px-6 backdrop-blur-xl">
          <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E8610A] text-sm font-bold text-white">
              P
            </span>
            Planoka
          </Link>
        </header>
        <main className="flex flex-1 items-center justify-center px-6">
          <div className="flex flex-col items-center text-center">
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-red-50 dark:bg-red-950">
              <AlertTriangle className="h-12 w-12 text-[#EF4444]" />
            </div>
            <h1 className="text-2xl font-bold">Erreur critique</h1>
            <p className="mt-2 max-w-sm text-[var(--color-text-secondary, #3D3D3D)]">
              Une erreur critique est survenue. Veuillez recharger la page.
            </p>
            <div className="mt-6 flex gap-3">
              <Button onClick={reset} className="gap-2 bg-[#E8610A] hover:brightness-90">
                <RefreshCw className="h-4 w-4" />
                Recharger
              </Button>
              <Link href="/">
                <Button variant="outline" className="gap-2">
                  <Home className="h-4 w-4" />
                  Accueil
                </Button>
              </Link>
            </div>
          </div>
        </main>
        <footer className="border-t border-[var(--color-border, #E8E8E8)] bg-[var(--color-bg-card, #FFFFFF)] py-6 text-center text-sm text-[var(--color-text-tertiary, #6B6B6B)]">
          &copy; {new Date().getFullYear()} Planoka
        </footer>
      </body>
    </html>
  );
}
