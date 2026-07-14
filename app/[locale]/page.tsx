import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { LandingPageClient } from "@/components/landing/LandingPageClient";

type HomePageProps = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  const { isAuthenticated } = await auth();

  if (isAuthenticated) {
    redirect(`/${locale}/plans`);
  }

  return <LandingPageClient />;
}
