"use client";

/**
 * Shell Principal de l'Application (LayoutShell.tsx)
 * 
 * Ce composant enveloppe toutes les pages de l'application. 
 * Son rôle est d'afficher ou de masquer de manière dynamique les éléments
 * de navigation globale (Navbar, Footer, TabBar) en fonction de l'URL courante.
 */

import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { FooterMinimal } from "./FooterMinimal";
import { TabBarMobile } from "./TabBarMobile";

// Chemins où la Navbar est masquée (mais pas le reste, par exemple l'onboarding)
const HIDE_NAV_PATHS = ["/onboarding"];

// Chemins "Plein Écran" où TOUTE la navigation globale est masquée
// Exemple : les pages de login, la découverte façon TikTok, les paramètres du profil
const HIDE_ALL_PATHS = ["/sign-in", "/sign-up", "/profile/settings", "/profile/edit", "/profile/security", "/search/discover"];

/**
 * Utilitaire pour vérifier si l'URL courante correspond à un de nos chemins,
 * en tenant compte du préfixe de langue (ex: /fr/sign-in correspondra à /sign-in).
 */
function isPathMatch(pathname: string, patterns: string[], locale: string): boolean {
  return patterns.some((p) => pathname === `/${locale}${p}` || pathname === `${p}`);
}

export function LayoutShell({ children, locale }: { children: React.ReactNode; locale: string }) {
  // Récupère l'URL complète courante (ex: /fr/search/discover)
  const pathname = usePathname();

  // 1. Doit-on masquer toute l'interface autour de la page ?
  const hideAll = isPathMatch(pathname, [...HIDE_NAV_PATHS, ...HIDE_ALL_PATHS], locale);
  
  // 2. Doit-on masquer le footer ? 
  // Sur la carte (search) on n'affiche pas le footer car la carte prend toute la hauteur.
  const hideFooter = pathname.startsWith(`/${locale}/search`) && !pathname.includes("/search/discover");
  
  // 3. Sommes-nous sur la page d'accueil stricte ?
  const isHome = pathname === `/${locale}` || pathname === `/${locale}/`;

  // Si on est sur une route "Plein Écran" (auth, discover...), on rend juste le contenu enfant
  if (hideAll) {
    return <main className="flex-1">{children}</main>;
  }

  // Structure classique avec Navbar, Contenu central, Footer et TabBar mobile
  return (
    <>
      <Navbar />
      
      {/* 
        Le padding-bottom (pb-[90px]) sur mobile empêche le contenu 
        d'être caché par la TabBar qui est fixée en bas de l'écran. 
      */}
      <main className="flex-1 pb-[90px] md:pb-0">{children}</main>
      
      {/* 
        Le gros Footer n'est affiché que sur l'accueil.
        Ailleurs, on utilise une version minimaliste (sauf si le footer est totalement masqué).
      */}
      {!hideFooter && (isHome ? <Footer /> : <FooterMinimal />)}
      
      <TabBarMobile />
    </>
  );
}