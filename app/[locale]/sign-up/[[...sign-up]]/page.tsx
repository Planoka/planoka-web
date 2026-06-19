import { SignUp } from "@clerk/nextjs";
import { getClerkPaths } from "@/lib/clerk-paths";

type SignUpPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function SignUpPage({ params }: SignUpPageProps) {
  const { locale } = await params;
  const paths = getClerkPaths(locale);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg-page)]">
      <SignUp
        routing="path"
        path={paths.signUp}
        signInUrl={paths.signIn}
        forceRedirectUrl={paths.afterSignUp}
        signInForceRedirectUrl={paths.afterSignIn}
      />
    </div>
  );
}
