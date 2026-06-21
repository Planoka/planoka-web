"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { useTranslations } from "next-intl";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("error");

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-red-50 dark:bg-red-950">
        <AlertTriangle className="h-12 w-12 text-red-500" />
      </div>
      <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">{t("title")}</h1>
      <p className="mt-2 max-w-sm text-[var(--color-text-secondary)]">{t("description")}</p>
      <div className="mt-6">
        <Button onClick={reset} className="gap-2 bg-[var(--color-primary)] hover:brightness-90">
          <RefreshCw className="h-4 w-4" />
          {t("retry")}
        </Button>
      </div>
    </div>
  );
}
