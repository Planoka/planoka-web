"use client";

import {
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { useTranslations } from "next-intl";
import { getClerkPaths } from "@/lib/clerk-paths";

type AuthControlsProps = {
  locale: string;
};

export function AuthControls({ locale }: AuthControlsProps) {
  const t = useTranslations("nav");
  const paths = getClerkPaths(locale);

  return (
    <div className="flex items-center gap-3">
      <Show when="signed-out">
        <SignInButton
          mode="redirect"
          forceRedirectUrl={paths.afterSignIn}
          signUpForceRedirectUrl={paths.afterSignUp}
        >
          <button className="rounded-full border border-white/20 px-4 py-1.5 text-sm font-medium text-white/80 transition-colors hover:border-white/50 hover:text-white">
            {t("signIn")}
          </button>
        </SignInButton>
        <SignUpButton
          mode="redirect"
          forceRedirectUrl={paths.afterSignUp}
          signInForceRedirectUrl={paths.afterSignIn}
        >
          <button className="rounded-full bg-[var(--color-primary,#f97316)] px-4 py-1.5 text-sm font-medium text-white transition-opacity hover:opacity-90">
            S&apos;inscrire
          </button>
        </SignUpButton>
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
    </div>
  );
}
