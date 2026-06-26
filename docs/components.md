# Composants

## Organisation

Les composants sont regroupes par domaine fonctionnel dans `components/`.

```
components/
├── common/          # Composants transversaux
├── explore/         # Carte et decouverte
├── feed/            # Flux de bons plans
├── layout/          # Shell de l'application
├── onboarding/      # Etapes d'onboarding
├── plans/           # Bons plans (cartes, formulaire)
├── providers/       # Providers React
└── ui/              # Primitifs UI (shadcn/ui)
```

## common/

| Composant            | Description                                                      |
| -------------------- | ---------------------------------------------------------------- |
| `AuthControls.tsx`   | Boutons de connexion/deconnexion et menu utilisateur Clerk.      |
| `CookieConsent.tsx`  | Bandeau de consentement aux cookies avec gestion des preferences.|
| `LanguageToggle.tsx` | Bouton de bascule de langue (FR/EN).                             |
| `ThemeToggle.tsx`    | Bouton de bascule de theme (clair/sombre/systeme).               |
| `ReviewsCarousel.tsx`| Carrousel de temoignages/avis affiche sur la page d'accueil.     |

## explore/

| Composant                  | Description                                                     |
| -------------------------- | --------------------------------------------------------------- |
| `ExploreMap.tsx`            | Carte Leaflet avec marqueurs personnalises, geolocalisation, clusters et panneau de filtre par categorie. S'adapte au theme (tuiles claires/sombres). |
| `DiscoverFeed.tsx`          | Flux de decouverte vertical plein ecran (style TikTok). Navigation par scroll/swipe entre les bons plans. Boutons boost, favori, commentaire, partage. |
| `DiscoverCommentsSheet.tsx` | Sheet (bottom sheet) de commentaires pour le mode Decouverte.   |
| `CategoryFilter.tsx`        | Barre de filtres par categorie avec icones Lucide.              |
| `PlanBottomSheet.tsx`       | Bottom sheet qui s'affiche quand on clique sur un marqueur de la carte. Apercu rapide du bon plan. |

## layout/

| Composant          | Description                                                        |
| ------------------ | ------------------------------------------------------------------ |
| `LayoutShell.tsx`  | Composant racine qui orchestre l'affichage de la Navbar, du Footer et de la TabBar mobile en fonction de la route courante. |
| `Navbar.tsx`       | Barre de navigation desktop avec logo, liens, theme, langue et auth.|
| `Footer.tsx`       | Footer complet affiche uniquement sur la page d'accueil.            |
| `FooterMinimal.tsx`| Footer reduit affiche sur les autres pages.                         |
| `TabBarMobile.tsx` | Barre de navigation mobile fixee en bas (Accueil, Explorer, Creer, Favoris, Profil). |

## plans/

| Composant        | Description                                                          |
| ---------------- | -------------------------------------------------------------------- |
| `AddPlanForm.tsx` | Formulaire multi-etapes de creation de bon plan : 1) Categorie + ville, 2) Titre + description + media, 3) Geolocalisation + confirmation. Validation Zod a chaque etape. Modal de felicitation avec confettis apres soumission reussie. |
| `PlanCard.tsx`    | Carte d'affichage d'un bon plan dans les listes et le feed. Affiche image, titre, categorie, ville, compteurs (boost, commentaires, partages) et bouton favori. |

## providers/

| Composant                  | Description                                             |
| -------------------------- | ------------------------------------------------------- |
| `AuthSync.tsx`             | Synchronise l'utilisateur Clerk avec le store Zustand.  |
| `LenisProvider.tsx`        | Fournit le smooth scroll via Lenis.                     |
| `QueryProvider.tsx`        | Fournit le client React Query a toute l'application.    |
| `ThemeProviderWrapper.tsx` | Fournit le theme via next-themes.                       |

## ui/

Composants primitifs issus de [shadcn/ui](https://ui.shadcn.com/), personnalises pour Planoka :

`avatar`, `badge`, `button`, `card`, `dialog`, `input`, `select`, `sheet`, `skeleton`, `sonner`, `tabs`, `textarea`.

Ces composants utilisent `class-variance-authority` (CVA) pour les variantes et `tailwind-merge` pour la resolution des classes.
