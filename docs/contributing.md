# Contribuer

## Prerequis

- Node.js >= 24
- pnpm >= 11
- Git

## Installation du projet

```bash
git clone <repo-url>
cd planoka-web
pnpm install
```

Husky s'installe automatiquement via le script `prepare` et configurera les git hooks.

## Workflow Git

### Branches

| Branche        | Role                                        |
| -------------- | ------------------------------------------- |
| `main`         | Production. Chaque merge declenche un deploiement. |
| `develop`      | Integration. Les features sont mergees ici.  |
| `feature/xxx`  | Branches de fonctionnalites.                 |

### Processus

1. Creer une branche depuis `develop` :
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/ma-feature
   ```
2. Developper et commiter.
3. Pousser et creer une Pull Request vers `develop`.
4. Le CI verifie automatiquement (lint, types, format).
5. Apres review et merge dans `develop`, creer une PR vers `main` pour deployer.

## Standards de code

### TypeScript

- Pas de `any` explicite. Utiliser des types precis ou `unknown` si necessaire.
- Tous les types partages sont dans `types/index.ts`.
- Les schemas de validation sont dans `lib/validations/`.

### Composants React

- Un composant par fichier.
- Les composants client commencent par `"use client"`.
- Les composants sont organises par domaine dans `components/`.
- Utiliser les composants `ui/` (shadcn) comme primitifs.

### Style

- Tailwind CSS v4 pour le styling.
- `tailwind-merge` pour la resolution des classes.
- `class-variance-authority` pour les variantes de composants.
- Variables CSS custom definies dans `globals.css` pour les couleurs du theme.

### Internationalisation

- **Toute** chaine visible par l'utilisateur doit etre traduite.
- Les cles de traduction sont ajoutees dans `messages/fr.json` (reference) et `messages/en.json`.
- Utiliser `useTranslations("namespace")` dans les composants client.

## Checks automatiques

### Pre-commit (Husky + lint-staged)

A chaque commit, Husky execute automatiquement :
- ESLint sur les fichiers modifies.
- Prettier sur les fichiers modifies.

### CI (GitHub Actions)

A chaque push/PR :
- ESLint (`pnpm lint`)
- TypeScript (`pnpm tsc --noEmit`)
- Prettier (`pnpm prettier --check`)

### Avant de pousser

Verifier localement :

```bash
pnpm lint
pnpm type-check
```

## Ajouter une nouvelle page

1. Creer le fichier dans `app/[locale]/ma-page/page.tsx`.
2. Ajouter les traductions dans `messages/fr.json` et `messages/en.json`.
3. Si la page necessite une authentification, l'ajouter dans `isProtectedRoute` dans `proxy.ts`.
4. Si la page doit masquer le layout (Navbar/Footer), l'ajouter dans les constantes de `LayoutShell.tsx`.

## Ajouter un nouveau composant

1. Creer le fichier dans le bon sous-dossier de `components/`.
2. Si c'est un composant UI generique, le mettre dans `components/ui/`.
3. Si c'est un composant metier, le mettre dans le dossier du domaine (`plans/`, `explore/`, etc.).
