# Authentification (Clerk)

## Vue d'ensemble

Planoka utilise [Clerk](https://clerk.com/) pour l'authentification. L'integration repose sur `@clerk/nextjs` v7.

## Configuration

### Variables d'environnement requises

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

### Fichiers cles

| Fichier                    | Role                                                          |
| -------------------------- | ------------------------------------------------------------- |
| `proxy.ts`                 | Middleware Clerk + next-intl. Protege les routes et redirige.  |
| `lib/clerk-paths.ts`       | Genere les URLs d'auth prefixees par la locale.                |
| `components/providers/AuthSync.tsx` | Synchronise l'utilisateur Clerk avec le store Zustand. |
| `components/common/AuthControls.tsx` | Boutons connexion/deconnexion et menu utilisateur.   |

## Middleware (`proxy.ts`)

Le middleware utilise `clerkMiddleware` pour :

1. **Verifier l'authentification** sur chaque requete.
2. **Proteger les routes privees** (definies via `createRouteMatcher`).
3. **Rediriger** les utilisateurs non connectes vers `/:locale/sign-in`.
4. **Empecher** les utilisateurs connectes d'acceder a `/sign-in` et `/sign-up` (redirection vers l'accueil).

### Routes protegees

```typescript
const isProtectedRoute = createRouteMatcher([
  "/:locale/plans/new(.*)",
  "/:locale/plans/:id/edit(.*)",
  "/:locale/profile(.*)",
  "/:locale/settings(.*)",
  "/:locale/onboarding(.*)",
]);
```

## Chemins d'authentification localises

La fonction `getClerkPaths(locale)` dans `lib/clerk-paths.ts` retourne :

| Chemin          | Valeur                     |
| --------------- | -------------------------- |
| `signIn`        | `/:locale/sign-in`         |
| `signUp`        | `/:locale/sign-up`         |
| `afterSignIn`   | `/:locale`                 |
| `afterSignUp`   | `/:locale/onboarding`      |

Apres l'inscription, l'utilisateur est dirige vers la page d'onboarding pour selectionner ses centres d'interet.

## Pages d'authentification

Les pages `/sign-in` et `/sign-up` utilisent les composants Clerk pre-construits (`<SignIn />` et `<SignUp />`). Elles sont encadrees par des catch-all routes (`[[...sign-in]]`, `[[...sign-up]]`) pour gerer les sous-routes Clerk (verification, reset password, etc.).

## Synchronisation avec le store

Le composant `AuthSync.tsx` est monte au niveau du layout racine. Il :
1. Ecoute les changements d'etat Clerk (via `useUser`).
2. Met a jour `currentUser` dans le store Zustand.

## Token API

Le client API (`lib/api.ts`) recupere automatiquement le token de session Clerk via `window.Clerk?.session?.getToken()` et l'injecte dans le header `Authorization: Bearer <token>` de chaque requete Axios.
