# Routing

## Middleware

Le fichier `proxy.ts` (racine du projet) fait office de middleware Next.js. Il combine :
- **Clerk** pour l'authentification.
- **next-intl** pour le prefixage automatique de la locale (`/fr/...` ou `/en/...`).

Le middleware s'applique a toutes les requetes sauf les fichiers statiques (`_next`, images, fonts, etc.).

## Routes publiques

| Route                          | Fichier                                      | Description                         |
| ------------------------------ | -------------------------------------------- | ----------------------------------- |
| `/:locale`                     | `app/[locale]/page.tsx`                      | Page d'accueil / Feed principal     |
| `/:locale/plans`               | `app/[locale]/plans/page.tsx`                | Liste de tous les bons plans        |
| `/:locale/plans/:id`           | `app/[locale]/plans/[id]/page.tsx`           | Detail d'un bon plan                |
| `/:locale/search`              | `app/[locale]/search/page.tsx`               | Carte d'exploration (ExploreMap)    |
| `/:locale/search/discover`     | `app/[locale]/search/discover/page.tsx`      | Flux decouverte (DiscoverFeed)      |
| `/:locale/profile`             | `app/[locale]/profile/page.tsx`              | Page profil utilisateur             |
| `/:locale/profile/favorites`   | `app/[locale]/profile/favorites/page.tsx`    | Liste des favoris                   |
| `/:locale/notifications`       | `app/[locale]/notifications/page.tsx`        | Centre de notifications             |
| `/:locale/sign-in`             | `app/[locale]/sign-in/[[...sign-in]]/page.tsx` | Connexion (Clerk)                |
| `/:locale/sign-up`             | `app/[locale]/sign-up/[[...sign-up]]/page.tsx` | Inscription (Clerk)              |
| `/:locale/privacy`             | `app/[locale]/privacy/page.tsx`              | Politique de confidentialite        |
| `/:locale/terms`               | `app/[locale]/terms/page.tsx`                | Conditions d'utilisation            |

## Routes protegees

Les routes suivantes necessitent une authentification. Un utilisateur non connecte est redirige vers `/:locale/sign-in` avec un parametre `redirect_url`.

| Route                          | Description                        |
| ------------------------------ | ---------------------------------- |
| `/:locale/plans/new`           | Creer un nouveau bon plan          |
| `/:locale/plans/:id/edit`      | Modifier un bon plan existant      |
| `/:locale/profile/*`           | Profil, edition, securite, settings|
| `/:locale/settings/*`          | Parametres de l'application        |
| `/:locale/onboarding`          | Onboarding post-inscription        |

La liste des routes protegees est definie dans `proxy.ts` via `createRouteMatcher`.

## Redirections automatiques

- Un utilisateur **connecte** qui tente d'acceder a `/sign-in` ou `/sign-up` est redirige vers la page d'accueil.
- La locale par defaut est `fr`. Acceder a `/` redirige vers `/fr`.

## Layout conditionnel (LayoutShell)

Le composant `components/layout/LayoutShell.tsx` adapte le layout selon la route :

| Route                             | Navbar | Footer | TabBar mobile |
| --------------------------------- | ------ | ------ | ------------- |
| Accueil (`/:locale`)              | Oui    | Full   | Oui           |
| Pages standard                    | Oui    | Minimal| Oui           |
| Onboarding, Auth, Discover, etc.  | Non    | Non    | Non           |
| Carte d'exploration               | Oui    | Non    | Oui           |

Les constantes `HIDE_NAV_PATHS` et `HIDE_ALL_PATHS` dans `LayoutShell.tsx` controlent ce comportement.
