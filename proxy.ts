import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import { getClerkPaths, getLocaleFromPathname } from "./lib/clerk-paths";
import { locales, defaultLocale } from "./i18n";

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "always",
});

const isProtectedRoute = createRouteMatcher([
  "/:locale/plans/new(.*)",
  "/:locale/plans/:id/edit(.*)",
  "/:locale/profile(.*)",
  "/:locale/settings(.*)",
  "/:locale/onboarding(.*)",
]);

export default clerkMiddleware(
  async (auth, req) => {
    const { userId } = await auth();

    // Protect private routes
    if (isProtectedRoute(req) && !userId) {
      const locale = getLocaleFromPathname(req.nextUrl.pathname);
      const signInUrl = new URL(`/${locale}/sign-in`, req.url);
      signInUrl.searchParams.set("redirect_url", req.nextUrl.pathname);
      return NextResponse.redirect(signInUrl);
    }

    // Redirect authenticated users away from auth pages
    if (userId && (req.nextUrl.pathname.includes("/sign-in") || req.nextUrl.pathname.includes("/sign-up"))) {
      const locale = getLocaleFromPathname(req.nextUrl.pathname);
      return NextResponse.redirect(new URL(`/${locale}`, req.url));
    }

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
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
    "/__clerk/:path*",
  ],
};
