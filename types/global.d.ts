/**
 * Augmentation du type global Window pour inclure l'instance Clerk.
 *
 * Clerk injecte son SDK sur window.Clerk au runtime côté navigateur,
 * mais les types DOM standards ne le connaissent pas. On étend Window
 * ici pour que TypeScript accepte window.Clerk sans erreur.
 *
 * Référence : https://clerk.com/docs/references/javascript/clerk
 */
export {};

declare global {
  interface Window {
    Clerk?: {
      session?: {
        /** Retourne le JWT actif de la session Clerk, ou null si aucune session */
        getToken: (options?: { template?: string }) => Promise<string | null>;
      };
      user?: {
        id: string;
      };
    };
  }
}
