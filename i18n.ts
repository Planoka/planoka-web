/**
 * Configuration de l'Internationalisation (i18n.ts)
 * 
 * Ce fichier configure next-intl pour gérer les différentes langues
 * de l'application. Il définit les langues supportées et comment
 * charger les fichiers de traduction (.json).
 */
import { getRequestConfig } from "next-intl/server";

// Définition des langues supportées par l'application
export const locales = ["fr", "en"] as const;
export type Locale = (typeof locales)[number];

// Langue par défaut si aucune n'est spécifiée ou si elle est invalide
export const defaultLocale: Locale = "fr";

export default getRequestConfig(async ({ requestLocale }) => {
  /**
   * next-intl v4 : requestLocale est une Promise, il faut l'await
   * pour obtenir la langue demandée par l'utilisateur via l'URL.
   */
  let locale = await requestLocale;

  /**
   * Validation de la langue :
   * Si la langue demandée n'est pas dans notre liste (ex: /es/...),
   * on utilise la langue par défaut (fr).
   */
  if (!locale || !locales.includes(locale as Locale)) {
    locale = defaultLocale;
  }

  return {
    locale /* Obligatoire dans la v4 de next-intl */,
    // Chargement dynamique du fichier JSON correspondant à la langue
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
