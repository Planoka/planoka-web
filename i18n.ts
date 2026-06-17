import { getRequestConfig } from "next-intl/server";

export const locales = ["fr", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "fr";

export default getRequestConfig(async ({ requestLocale }) => {
  /**
   * next-intl v4 : requestLocale est une Promise, il faut l'await
   */
  let locale = await requestLocale;

  /**
   * Valider et fallback sur la locale par défaut si invalide
   */
  if (!locale || !locales.includes(locale as Locale)) {
    locale = defaultLocale;
  }

  return {
    locale /* obligatoire en v4 */,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
