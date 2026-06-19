import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getClerkPaths } from "@/lib/clerk-paths";
import { OnboardingClient } from "@/components/onboarding/OnboardingClient";

type OnboardingPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function OnboardingPage({ params }: OnboardingPageProps) {
  const { locale } = await params;
  const { isAuthenticated } = await auth();
  const paths = getClerkPaths(locale);

  if (!isAuthenticated) {
    redirect(paths.signIn);
  }

  return <OnboardingClient />;
}
