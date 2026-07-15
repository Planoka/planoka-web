# Planoka 

Planoka est une application web moderne et interactive permettant d'explorer, de découvrir et de partager les meilleurs "bons plans" (activités, restaurants, services, événements, etc.) autour de vous.

## 🌟 Fonctionnalités Principales

- **🗺️ Exploration sur Carte (Map) :** Découvrez des lieux interactifs grâce à une intégration personnalisée de la carte (via Leaflet).
- **📱 Flux Découverte (Style TikTok) :** Scrollez verticalement pour découvrir de nouveaux lieux et bons plans de manière immersive.
- **🌍 Internationalisation (i18n) :** Support multilingue complet (Français / Anglais).
- **✍️ Création et Gestion :** Formulaire multi-étapes pour publier vos propres bons plans avec validation stricte (Zod).
- **❤️ Favoris et Interactions :** Sauvegardez vos endroits favoris, commentez, partagez et "boostez" les meilleurs plans.
- **🌓 Mode Sombre / Clair :** Thème dynamique avec support système.
- **🔔 Système de Notifications :** Restez informé des activités sur vos bons plans.

## 🛠️ Stack Technique

Le projet repose sur des technologies modernes pour garantir performance et maintenabilité :

- **Framework Core :** [Next.js 16](https://nextjs.org/) (App Router) & [React 19](https://react.dev/)
- **Langage :** [TypeScript](https://www.typescriptlang.org/)
- **Style & UI :** [Tailwind CSS v4](https://tailwindcss.com/), Radix UI, [Motion (Framer)](https://motion.dev/) pour les animations.
- **Gestion d'État & Données :** [Zustand](https://zustand-demo.pmnd.rs/) (état global), [React Query](https://tanstack.com/query/latest) (gestion des requêtes)
- **Authentification :** [Clerk](https://clerk.com/)
- **Formulaires :** [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
- **Cartographie :** [Leaflet](https://leafletjs.com/) & [React-Leaflet](https://react-leaflet.js.org/)

## 🚀 Lancement Rapide (Développement)

### Prérequis
Assurez-vous d'avoir installé **[Node.js](https://nodejs.org/)** (v24 recommandé) et **[pnpm](https://pnpm.io/)** (v11).

### 1. Installation

Clonez le dépôt puis installez les dépendances :

```bash
pnpm install
```

### 2. Variables d'environnement

Copiez le fichier `.env.example` (s'il existe) vers un nouveau fichier `.env.local` et remplissez les clés nécessaires (notamment les clés d'API pour Clerk, Cloudinary, etc.).

### 3. Lancer le serveur

Démarrez le serveur de développement local :

```bash
pnpm dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur pour visualiser l'application.

## ⚙️ Commandes Utiles

- `pnpm dev` : Lance le serveur de développement.
- `pnpm build` : Compile l'application pour la production.
- `pnpm lint` : Exécute le linter (ESLint) pour vérifier la qualité du code.
- `pnpm type-check` : Vérifie les types TypeScript.

## 🚀 Déploiement (CI/CD)

Le projet est configuré pour être déployé automatiquement sur **Vercel** via **GitHub Actions**.

Pour que l'action de déploiement (`deploy.yml`) fonctionne correctement, vous devez configurer les secrets suivants dans les paramètres de votre dépôt GitHub (`Settings > Secrets and variables > Actions`) :
- `VERCEL_TOKEN` (Généré depuis votre compte Vercel)
- `VERCEL_ORG_ID` (ID de votre organisation Vercel)
- `VERCEL_PROJECT_ID` (ID du projet sur Vercel)

Vous pouvez obtenir l'organisation et l'ID de projet en exécutant `npx vercel link` localement.

---

*Développé avec passion pour la communauté Planoka.*
