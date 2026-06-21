import Link from "next/link";
import { useLocale } from "next-intl";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const locale = useLocale();

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-[var(--color-primary-light)]">
        <span className="text-4xl font-bold text-[var(--color-primary)]">404</span>
      </div>
      <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Page introuvable</h1>
      <p className="mt-2 max-w-sm text-[var(--color-text-secondary)]">
        La page que vous cherchez n&apos;existe pas ou a été déplacée.
      </p>
      <div className="mt-6 flex gap-3">
        <Button variant="outline" onClick={() => window.history.back()} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Retour
        </Button>
        <Link href={`/${locale}`}>
          <Button className="gap-2 bg-[var(--color-primary)] hover:brightness-90">
            <Home className="h-4 w-4" />
            Accueil
          </Button>
        </Link>
      </div>
    </div>
  );
}
