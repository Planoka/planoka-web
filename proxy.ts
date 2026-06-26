/**
 * Middleware Principal (proxy.ts)
 * 
 * Ce fichier est le point d'entrée de toutes les requêtes vers l'application.
 * Il combine deux responsabilités majeures :
 * 1. L'authentification via Clerk (clerkMiddleware)
 * 2. L'internationalisation via next-intl (intlMiddleware)
 */
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import { getClerkPaths, getLocaleFromPathname } from "./lib/clerk-paths";
import { locales, defaultLocale } from "./i18n";

// Configuration du middleware d'internationalisation
// "localePrefix: 'always'" force la présence de /fr ou /en dans l'URL
const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "always",
});

// Définition des routes nécessitant une authentification
// On utilise (.*) pour inclure toutes les sous-routes éventuelles
const isProtectedRoute = createRouteMatcher([
  "/:locale/plans/new(.*)",
  "/:locale/plans/:id/edit(.*)",
  "/:locale/profile(.*)",
  "/:locale/settings(.*)",
  "/:locale/onboarding(.*)",
]);

export default clerkMiddleware(
  async (auth, req) => {
    // Récupération de l'ID utilisateur pour vérifier s'il est connecté
    const { userId } = await auth();

    // 1. Protection des routes privées
    // Si la route nécessite d'être connecté et que l'utilisateur ne l'est pas
    if (isProtectedRoute(req) && !userId) {
      const locale = getLocaleFromPathname(req.nextUrl.pathname);
      const signInUrl = new URL(`/${locale}/sign-in`, req.url);
      
      // On sauvegarde l'URL d'origine pour y revenir après la connexion
      signInUrl.searchParams.set("redirect_url", req.nextUrl.pathname);
      return NextResponse.redirect(signInUrl);
    }

    // 2. Redirection des utilisateurs déjà connectés
    // Empêche un utilisateur connecté d'accéder aux pages de connexion/inscription
    if (userId && (req.nextUrl.pathname.includes("/sign-in") || req.nextUrl.pathname.includes("/sign-up"))) {
      const locale = getLocaleFromPathname(req.nextUrl.pathname);
      return NextResponse.redirect(new URL(`/${locale}`, req.url));
    }

    // 3. Application de l'internationalisation
    // Si les règles d'auth sont respectées, on passe le relais à next-intl
    return intlMiddleware(req);
  },
  // Configuration dynamique des chemins Clerk selon la langue (locale)
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

// Configuration du Matcher pour définir sur quels fichiers le middleware s'exécute
export const config = {
  matcher: [
    // Ignore les fichiers statiques (images, css, js, etc.) et le dossier interne _next
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // S'applique toujours sur les requêtes API
    "/(api|trpc)(.*)",
    // S'applique toujours sur les routes internes de Clerk
    "/__clerk/:path*",
  ],
};
