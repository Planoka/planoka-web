import { auth } from "@clerk/nextjs/server";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { getClerkPaths } from "@/lib/clerk-paths";

type OnboardingPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function OnboardingPage({ params }: OnboardingPageProps) {
  const { locale } = await params;
  const { isAuthenticated } = await auth();
  const t = await getTranslations({ locale, namespace: "onboarding" });
  const paths = getClerkPaths(locale);

  if (!isAuthenticated) {
    redirect(paths.signIn);
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[var(--color-bg-page)] px-6 py-24 text-center">
      <h1 className="text-3xl font-bold tracking-tight text-[var(--color-text-primary)]">
        {t("title")}
      </h1>
      <p className="max-w-lg text-lg text-[var(--color-text-secondary)]">
        {t("subtitle")}
      </p>
      <a
        href={paths.afterSignIn}
        className="rounded-full bg-[var(--color-primary)] px-6 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
      >
        {t("continue")}
      </a>
    </div>
  );
}
