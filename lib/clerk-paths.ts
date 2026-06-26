/**
 * Chemins de navigation pour Clerk (Auth)
 * 
 * Ce fichier gère la génération des URLs utilisées par Clerk pour
 * l'authentification (connexion, inscription, redirection après action),
 * en s'assurant que la langue (locale) est toujours conservée dans l'URL.
 */
import { defaultLocale, locales, type Locale } from "@/i18n";

export type ClerkPaths = {
  signIn: string;
  signUp: string;
  afterSignIn: string;
  afterSignUp: string;
};

/** 
 * Génère les chemins Clerk préfixés par la langue active (ex: /fr/sign-in). 
 * 
 * @param locale La langue actuelle extraite de l'URL
 * @returns Un objet contenant les chemins corrects pour Clerk
 */
export function getClerkPaths(locale: string): ClerkPaths {
  // Sécurité : si la langue n'est pas reconnue, on force la langue par défaut (fr)
  const safeLocale = locales.includes(locale as Locale) ? locale : defaultLocale;

  return {
    signIn: `/${safeLocale}/sign-in`,
    signUp: `/${safeLocale}/sign-up`,
    afterSignIn: `/${safeLocale}`,
    // Après l'inscription, on force l'utilisateur à passer par l'étape de configuration (onboarding)
    afterSignUp: `/${safeLocale}/onboarding`,
  };
}

/** 
 * Utilitaire pour extraire la langue depuis une URL dans le middleware.
 * Ex: "/fr/plans/new" -> retourne "fr"
 * Ex: "/unknown/plans" -> retourne "fr" (langue par défaut)
 */
export function getLocaleFromPathname(pathname: string): Locale {
  // Découpe l'URL et récupère le premier segment non vide
  const segment = pathname.split("/").filter(Boolean)[0];
  
  // Vérifie si le segment est bien une de nos langues configurées
  return locales.includes(segment as Locale) ? (segment as Locale) : defaultLocale;
}
