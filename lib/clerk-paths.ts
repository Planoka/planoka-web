import { defaultLocale, locales, type Locale } from "@/i18n";

export type ClerkPaths = {
  signIn: string;
  signUp: string;
  afterSignIn: string;
  afterSignUp: string;
};

/** Chemins Clerk préfixés par la locale active (next-intl). */
export function getClerkPaths(locale: string): ClerkPaths {
  const safeLocale = locales.includes(locale as Locale) ? locale : defaultLocale;

  return {
    signIn: `/${safeLocale}/sign-in`,
    signUp: `/${safeLocale}/sign-up`,
    afterSignIn: `/${safeLocale}`,
    afterSignUp: `/${safeLocale}/onboarding`,
  };
}

/** Extrait la locale depuis le pathname d'une requête middleware. */
export function getLocaleFromPathname(pathname: string): Locale {
  const segment = pathname.split("/").filter(Boolean)[0];
  return locales.includes(segment as Locale) ? (segment as Locale) : defaultLocale;
}
