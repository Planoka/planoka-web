# Architecture

## Vue d'ensemble

Planoka utilise **Next.js 16** avec l'App Router. Le projet suit une architecture par couches :

```
planoka-web/
├── app/                  # Routes (pages) Next.js
│   ├── [locale]/         # Routes localisees (fr, en)
│   │   ├── page.tsx              # Accueil / Feed
│   │   ├── plans/
│   │   │   ├── page.tsx          # Liste des bons plans
│   │   │   ├── new/page.tsx      # Creer un bon plan (protege)
│   │   │   └── [id]/
│   │   │       ├── layout.tsx    # Layout SEO dynamique (OpenGraph)
│   │   │       └── page.tsx      # Detail d'un bon plan
│   │   ├── search/
│   │   │   ├── page.tsx          # Carte d'exploration (ExploreMap)
│   │   │   └── discover/page.tsx # Flux decouverte (DiscoverFeed)
│   │   ├── profile/
│   │   │   ├── page.tsx          # Page profil utilisateur
│   │   │   ├── favorites/        # Page favoris
│   │   │   ├── edit/             # Modifier profil (protege)
│   │   │   ├── security/         # Securite compte (protege)
│   │   │   └── settings/         # Parametres (protege)
│   │   ├── notifications/        # Centre de notifications
│   │   ├── onboarding/           # Onboarding post-inscription (protege)
│   │   ├── sign-in/              # Connexion (Clerk)
│   │   ├── sign-up/              # Inscription (Clerk)
│   │   ├── privacy/              # Politique de confidentialite
│   │   └── terms/                # Conditions d'utilisation
│   ├── api/                      # Route Handlers (API, actuellement vide)
│   ├── global-error.tsx          # Boundary d'erreur global
│   └── not-found.tsx             # Page 404
├── components/           # Composants React reutilisables
│   ├── common/           # Composants transversaux (auth, theme, langue)
│   ├── explore/          # Composants carte et decouverte
│   ├── feed/             # Composants du flux / feed
│   ├── layout/           # Shell de l'application (Navbar, Footer, TabBar)
│   ├── onboarding/       # Etapes d'onboarding
│   ├── plans/            # Carte de plan, formulaire de creation
│   ├── providers/        # Providers React (Theme, Query, Auth, Lenis)
│   └── ui/               # Composants UI de base (shadcn/ui)
├── hooks/                # Custom hooks React
├── lib/                  # Utilitaires, client API, constantes
│   ├── mock-data/        # Donnees factices pour le developpement
│   └── validations/      # Schemas Zod
├── messages/             # Fichiers de traduction (fr.json, en.json)
├── store/                # Store Zustand (etat global)
├── types/                # Definitions TypeScript partagees
├── public/               # Assets statiques (icones, images)
└── proxy.ts              # Middleware (Clerk + next-intl)
```

## Flux de donnees

```
Utilisateur
    │
    ▼
┌──────────────────┐
│  Middleware       │  proxy.ts : Clerk auth + next-intl locale routing
│  (Edge Runtime)  │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│  App Router      │  app/[locale]/* : Pages et layouts
│  (Server/Client) │
└──────┬───────────┘
       │
       ├──── Composants ──── hooks/ ──── React Query ──── lib/api.ts ──── Backend API
       │
       └──── Store Zustand (useStore) ──── localStorage (persistance partielle)
```

### Couche Middleware (`proxy.ts`)

Le middleware est le point d'entree de chaque requete. Il enchaine :

1. **Clerk** : Verifie l'authentification. Redirige vers `/sign-in` si la route est protegee et l'utilisateur non connecte.
2. **next-intl** : Detecte la locale (`fr` ou `en`) et prefixe la route.

### Couche Composants

Les composants sont organises par domaine fonctionnel :

- `layout/` : Shell global de l'application. Le composant `LayoutShell` decide dynamiquement d'afficher ou masquer la Navbar, le Footer et la TabBar mobile selon la route courante.
- `explore/` : Composants dediee a l'exploration geographique et au flux decouverte.
- `plans/` : Composants pour l'affichage et la creation de bons plans.
- `ui/` : Composants primitifs (Button, Input, Dialog, Sheet, etc.) bases sur shadcn/ui.

### Couche Etat

Deux mecanismes complementaires :

1. **Zustand** (`store/useStore.ts`) : Etat global client-side (utilisateur courant, filtres, favoris, notifications). Persiste partiellement dans `localStorage` sous la cle `planoka-store`.
2. **React Query** (`hooks/`) : Cache et synchronisation des donnees serveur (plans, commentaires, feed).

### Couche Donnees

Actuellement, l'application fonctionne avec des **donnees mockees** (`lib/mock-data/`). Le client API (`lib/api.ts`) est pre-configure avec Axios pour se connecter a un backend REST une fois celui-ci disponible. L'intercepteur Axios injecte automatiquement le token Clerk dans les headers `Authorization`.
