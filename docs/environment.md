# Variables d'environnement

## Fichier `.env.local`

Ce fichier contient les variables d'environnement locales. Il ne doit **jamais** etre commite (il est dans `.gitignore`).

## Variables requises

### Clerk (Authentification)

| Variable                             | Description                          | Obligatoire |
| ------------------------------------ | ------------------------------------ | ----------- |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`  | Cle publique Clerk (visible cote client) | Oui     |
| `CLERK_SECRET_KEY`                   | Cle secrete Clerk (serveur uniquement)   | Oui     |

Obtention : [Clerk Dashboard > API Keys](https://dashboard.clerk.com/last-active?path=api-keys)

### API Backend

| Variable                | Description                              | Obligatoire | Defaut                  |
| ----------------------- | ---------------------------------------- | ----------- | ----------------------- |
| `NEXT_PUBLIC_API_URL`   | URL de base du backend REST              | Non         | `http://localhost:3001`  |

### Cloudinary (Upload media)

| Variable                          | Description                 | Obligatoire |
| --------------------------------- | --------------------------- | ----------- |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Nom du cloud Cloudinary   | Non*        |

*Necessaire uniquement si l'upload media via Cloudinary est active.

## Configuration pour Vercel

Toutes les variables ci-dessus doivent etre ajoutees dans **Vercel > Settings > Environment Variables** pour que l'application fonctionne en production.

Important : les variables prefixees `NEXT_PUBLIC_` sont exposees cote client (navigateur). Ne jamais prefixer une cle secrete avec `NEXT_PUBLIC_`.

## Configuration pour GitHub Actions

Les secrets GitHub Actions (voir [deployment.md](deployment.md)) sont distincts des variables d'environnement de l'application. Ils servent uniquement a la CLI Vercel pour se connecter et deployer.
