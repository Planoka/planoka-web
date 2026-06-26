# Planoka

Planoka est une application web communautaire qui permet aux utilisateurs d'explorer, de partager et de decouvrir les meilleurs bons plans (restaurants, loisirs, sorties, services, etc.) au Cameroun. L'application combine une carte interactive, un flux de decouverte immersif et un systeme de recommendations sociales.

## Fonctionnalites

- **Carte interactive** : Exploration geographique des bons plans via Leaflet avec marqueurs personnalises, clusters et filtres par categorie.
- **Flux Decouverte** : Navigation verticale plein ecran (style TikTok) pour decouvrir les bons plans de maniere immersive.
- **Creation de bons plans** : Formulaire multi-etapes avec validation Zod, geolocalisation, upload media (image/video).
- **Systeme social** : Boosts, commentaires avec reponses imbriquees, partage et favoris.
- **Notifications** : Centre de notifications temps reel (boost, commentaire, systeme).
- **Internationalisation** : Support complet francais/anglais via next-intl.
- **Theme adaptatif** : Mode clair, sombre et suivi systeme.
- **Authentification** : Inscription/connexion via Clerk avec routes protegees et onboarding.
- **SEO dynamique** : Metadonnees OpenGraph generees par page (titre du bon plan, image, description).

## Stack technique

| Couche            | Technologie                                    |
| ----------------- | ---------------------------------------------- |
| Framework         | Next.js 16 (App Router)                        |
| UI                | React 19, Tailwind CSS v4, Radix UI            |
| Animations        | Motion (Framer Motion)                         |
| Etat global       | Zustand (persiste via localStorage)            |
| Requetes          | React Query (TanStack Query v5)                |
| Formulaires       | React Hook Form + Zod v4                       |
| Authentification  | Clerk (@clerk/nextjs v7)                       |
| Cartographie      | Leaflet + React-Leaflet                        |
| i18n              | next-intl v4                                   |
| Scroll            | Lenis (smooth scroll)                          |
| Notifications UI  | Sonner (toasts)                                |
| Langage           | TypeScript 5                                   |
| Linter / Format   | ESLint 9, Prettier, Husky + lint-staged        |
| Deploiement       | Vercel + GitHub Actions                        |

## Demarrage rapide

### Prerequis

- Node.js >= 24
- pnpm >= 11

### Installation

```bash
git clone <repo-url>
cd planoka-web
pnpm install
```

### Variables d'environnement

Creer un fichier `.env.local` a la racine :

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_API_URL=http://localhost:3001
```

Voir [docs/environment.md](docs/environment.md) pour la liste complete.

### Lancer le serveur

```bash
pnpm dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

## Scripts disponibles

| Commande           | Description                          |
| ------------------ | ------------------------------------ |
| `pnpm dev`         | Serveur de developpement             |
| `pnpm build`       | Build de production                  |
| `pnpm start`       | Serveur de production                |
| `pnpm lint`        | Verification ESLint                  |
| `pnpm type-check`  | Verification TypeScript (`tsc`)      |

## Documentation

La documentation detaillee se trouve dans le dossier [`docs/`](docs/) :

- [Architecture](docs/architecture.md) : Structure du projet, couches et flux de donnees.
- [Routing](docs/routing.md) : Toutes les routes, protections et middleware.
- [Composants](docs/components.md) : Arborescence et responsabilite de chaque composant.
- [Etat et donnees](docs/state.md) : Store Zustand, React Query, API client.
- [Internationalisation](docs/i18n.md) : Configuration next-intl, ajout de traductions.
- [Authentification](docs/auth.md) : Integration Clerk, middleware, routes protegees.
- [Deploiement](docs/deployment.md) : CI/CD GitHub Actions, configuration Vercel.
- [Variables d'environnement](docs/environment.md) : Toutes les variables requises.
- [Contribuer](docs/contributing.md) : Conventions, workflow Git, standards de code.

## Licence

Projet prive - Planoka.
