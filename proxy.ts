import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import createMiddleware from "next-intl/middleware";
import { getClerkPaths, getLocaleFromPathname } from "./lib/clerk-paths";
import { locales, defaultLocale } from "./i18n";

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "always",
});

/** Routes qui necessitent une authentification */
const isProtectedRoute = createRouteMatcher([
  "/:locale/plans/new(.*)",
  "/:locale/profile(.*)",
  "/:locale/settings(.*)",
  "/:locale/onboarding(.*)",
]);

export default clerkMiddleware(
  async (auth, req) => {
    if (isProtectedRoute(req)) await auth.protect();
    return intlMiddleware(req);
  },
  (req) => {
    const locale = getLocaleFromPathname(req.nextUrl.pathname);
    const paths = getClerkPaths(locale);

    return {
      signInUrl: paths.signIn,
      signUpUrl: paths.signUp,
      afterSignInUrl: paths.afterSignIn,
      afterSignUpUrl: paths.afterSignUp,
    };
  }
);

export const config = {
  matcher: [
    /** Exclure les fichiers statiques et Next.js internals */
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    /** Toujours exécuter pour les routes API */
    "/(api|trpc)(.*)",
    /** Clerk auto-proxy — obligatoire pour Next.js 15+ */
    "/__clerk/:path*",
  ],
};
