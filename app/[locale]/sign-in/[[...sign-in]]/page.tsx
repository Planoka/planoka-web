import { SignIn } from "@clerk/nextjs";
import { getClerkPaths } from "@/lib/clerk-paths";

type SignInPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function SignInPage({ params }: SignInPageProps) {
  const { locale } = await params;
  const paths = getClerkPaths(locale);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg-page)]">
      <SignIn
        routing="path"
        path={paths.signIn}
        signUpUrl={paths.signUp}
        forceRedirectUrl={paths.afterSignIn}
        signUpForceRedirectUrl={paths.afterSignUp}
      />
    </div>
  );
}
