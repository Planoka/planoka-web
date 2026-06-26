# Deploiement

## Infrastructure

- **Hebergement** : Vercel
- **CI/CD** : GitHub Actions

## Workflows GitHub Actions

### CI (`ci.yml`)

Declenche sur : `push` vers `develop` et `feature/*`, et sur toute `pull_request` vers `main` ou `develop`.

Etapes :
1. Checkout du code.
2. Setup Node.js 24 + pnpm 11.
3. Cache du store pnpm pour accelerer les builds suivants.
4. Installation des dependances (`pnpm install --frozen-lockfile`).
5. ESLint (`pnpm lint`).
6. TypeScript (`pnpm tsc --noEmit`).
7. Prettier (`pnpm prettier --check`).

### Deploy (`deploy.yml`)

Declenche sur : `push` vers `main` uniquement.

Etapes :
1. Checkout du code.
2. Setup Node.js 24 + pnpm 11.
3. Installation des dependances.
4. ESLint + TypeScript.
5. Deploiement sur Vercel via la CLI officielle :
   ```bash
   npx vercel pull --yes --environment=production --token=***
   npx vercel build --prod --token=***
   npx vercel deploy --prebuilt --prod --token=***
   ```

## Secrets GitHub requis

Ces secrets doivent etre configures dans **Settings > Secrets and variables > Actions** du depot GitHub :

| Secret               | Description                                              | Obtention                            |
| -------------------- | -------------------------------------------------------- | ------------------------------------ |
| `VERCEL_TOKEN`       | Token d'authentification Vercel                          | Vercel > Account Settings > Tokens   |
| `VERCEL_ORG_ID`      | ID de l'organisation Vercel                              | `npx vercel link` puis `.vercel/project.json` |
| `VERCEL_PROJECT_ID`  | ID du projet Vercel                                      | Meme fichier `.vercel/project.json`  |

## Variables d'environnement Vercel

Les variables d'environnement de l'application (cles Clerk, URL API, etc.) doivent etre configurees dans **Vercel > Settings > Environment Variables**.

Methode rapide : copier-coller le contenu de `.env.local` dans le champ "Key" du dashboard Vercel. Vercel detecte automatiquement les paires cle=valeur.

Voir [environment.md](environment.md) pour la liste complete des variables.

## Workflow Git recommande

```
main          ← deploiement production automatique
  └── develop ← branche d'integration
       └── feature/xxx ← branches de fonctionnalites
```

1. Creer une branche `feature/xxx` depuis `develop`.
2. Push : le CI s'execute automatiquement.
3. Creer une PR vers `develop` : le CI s'execute a nouveau.
4. Merger dans `develop`.
5. Creer une PR de `develop` vers `main` : le CI s'execute.
6. Merger dans `main` : le deploiement vers Vercel se declenche automatiquement.
