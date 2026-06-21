import { getTranslations } from "next-intl/server";
import { FileText } from "lucide-react";

export default async function TermsPage() {
  const t = await getTranslations("legal.terms");

  const sections = ["acceptance", "account", "content", "conduct", "liability", "modifications", "contact"] as const;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-primary-light)]">
          <FileText className="h-6 w-6 text-[var(--color-primary)]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)] sm:text-3xl">
            {t("title")}
          </h1>
          <p className="text-sm text-[var(--color-text-tertiary)]">
            {t("lastUpdated")} 21 juin 2026
          </p>
        </div>
      </div>

      <p className="mb-8 leading-relaxed text-[var(--color-text-secondary)]">
        {t("intro")}
      </p>

      <div className="space-y-8">
        {sections.map((section) => (
          <div
            key={section}
            className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-6"
          >
            <h2 className="mb-3 text-lg font-semibold text-[var(--color-text-primary)]">
              {t(`sections.${section}.title`)}
            </h2>
            <p className="leading-relaxed text-[var(--color-text-secondary)]">
              {t(`sections.${section}.content`)}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-2xl border border-[var(--color-border)] bg-[var(--color-primary-light)] p-6">
        <p className="text-sm text-[var(--color-text-secondary)]">
          Pour toute question concernant ces conditions, contactez-nous à{" "}
          <a
            href="mailto:legal@planoka.cm"
            className="font-medium text-[var(--color-primary)] underline underline-offset-2"
          >
            legal@planoka.cm
          </a>
        </p>
      </div>
    </div>
  );
}
