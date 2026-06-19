"use client";

import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export function AuthControls() {
  return (
    <div className="flex items-center gap-3">
      <SignedOut>
        <SignInButton mode="redirect">
          <button className="rounded-full border border-white/20 px-4 py-1.5 text-sm font-medium text-white/80 transition-colors hover:border-white/50 hover:text-white">
            Connexion
          </button>
        </SignInButton>
        <SignUpButton mode="redirect">
          <button className="rounded-full bg-[var(--color-primary,#f97316)] px-4 py-1.5 text-sm font-medium text-white transition-opacity hover:opacity-90">
            S&apos;inscrire
          </button>
        </SignUpButton>
      </SignedOut>
      <SignedIn>
        <UserButton
          appearance={{
            elements: {
              avatarBox: "w-8 h-8",
            },
          }}
        />
      </SignedIn>
    </div>
  );
}
