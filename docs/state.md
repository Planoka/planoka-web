# Etat et donnees

## Store global (Zustand)

Le store Zustand est defini dans `store/useStore.ts`. Il centralise l'etat client-side de l'application.

### Structure

```typescript
interface AppState {
  // Utilisateur courant (synchronise depuis Clerk)
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;

  // Filtres du feed (categorie, ville, tri, pagination)
  feedFilters: FeedFilters;
  setFeedFilters: (filters: Partial<FeedFilters>) => void;
  resetFeedFilters: () => void;

  // Mode d'affichage du feed
  feedView: "grid" | "list";
  setFeedView: (view: "grid" | "list") => void;

  // Categorie selectionnee (filtrage)
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;

  // Favoris (IDs des plans sauvegardes)
  favorites: string[];
  toggleFavorite: (planId: string) => void;
  addFavorite: (planId: string) => void;
  removeFavorite: (planId: string) => void;
  isFavorite: (planId: string) => boolean;

  // Notifications
  notifications: Notification[];
  unreadNotificationsCount: number;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  initNotifications: () => void;
}
```

### Persistance

Le store utilise le middleware `persist` de Zustand. Seules certaines donnees sont persistees dans `localStorage` sous la cle `planoka-store` :

- `feedView` (mode grille ou liste)
- `feedFilters.sort` (tri selectionne)
- `favorites` (IDs des plans en favoris)

Les notifications, l'utilisateur courant et la categorie selectionnee ne sont pas persistees.

### Utilisation

```tsx
import { useStore } from "@/store/useStore";

function MyComponent() {
  const favorites = useStore((s) => s.favorites);
  const toggleFavorite = useStore((s) => s.toggleFavorite);
  // ...
}
```

---

## Custom hooks

Les hooks dans `hooks/` encapsulent la logique de chargement des donnees :

| Hook               | Fichier              | Description                                    |
| ------------------ | -------------------- | ---------------------------------------------- |
| `usePlans`         | `hooks/usePlans.ts`  | Charge et filtre les bons plans. Fournit les fonctions de boost et favoris. |
| `useFeed`          | `hooks/useFeed.ts`   | Charge le feed recommande avec support pagination. |
| `useComments`      | `hooks/useComments.ts` | Charge les commentaires d'un plan. Fournit la fonction d'ajout de commentaire. |
| `useCreatePlan`    | `hooks/useCreatePlan.ts` | Gere la soumission du formulaire de creation de plan. Upload media + donnees. |

Actuellement ces hooks utilisent les **donnees mockees** de `lib/mock-data/`. Ils sont pre-cablees pour se brancher sur React Query et le client API (`lib/api.ts`) quand le backend sera pret.

---

## Client API (`lib/api.ts`)

Client Axios pre-configure avec :
- **Base URL** : `NEXT_PUBLIC_API_URL` (defaut `http://localhost:3001`).
- **Intercepteur requete** : Injecte automatiquement le token Clerk (`Bearer <token>`).
- **Intercepteur reponse** : Gere les erreurs 401 (non authentifie) et 429 (rate limit).
- **Timeout** : 10 secondes.

### Endpoints configures

```typescript
plansApi.getAll(filters)          // GET    /api/plans
plansApi.getById(id)              // GET    /api/plans/:id
plansApi.create(formData)         // POST   /api/plans
plansApi.update(id, data)         // PATCH  /api/plans/:id
plansApi.delete(id)               // DELETE /api/plans/:id
plansApi.boost(id)                // POST   /api/plans/:id/boost
plansApi.favorite(id)             // POST   /api/plans/:id/favorite
plansApi.share(id)                // POST   /api/plans/:id/share
plansApi.getComments(id)          // GET    /api/plans/:id/comments
plansApi.addComment(id, contenu)  // POST   /api/plans/:id/comments
plansApi.report(id, raison)       // POST   /api/plans/:id/report

feedApi.getRecommended()          // GET    /api/feed/recommended

usersApi.getMe()                  // GET    /api/users/me
usersApi.getById(id)              // GET    /api/users/:id
usersApi.getMyFavorites()         // GET    /api/users/me/favorites
usersApi.updateInterests(cats)    // POST   /api/users/me/interests

categoriesApi.getAll()            // GET    /api/categories

uploadApi.uploadMedia(file)       // POST   /api/upload

eventsApi.track(plan_id, type)    // POST   /api/events
```

---

## Donnees mockees (`lib/mock-data/`)

Pour le developpement sans backend :

| Fichier             | Contenu                                                 |
| ------------------- | ------------------------------------------------------- |
| `plans.ts`          | 24 bons plans avec villes, coordonnees GPS et categories|
| `categories.ts`     | 8 categories (Restauration, Loisirs, Sorties, etc.)     |
| `users.ts`          | 6 utilisateurs fictifs avec avatars                     |
| `comments.ts`       | 14 commentaires avec reponses imbriquees                |
| `notifications.ts`  | Notifications de test (boost, commentaire, systeme)     |
| `index.ts`          | Fonctions utilitaires (`getPlansWithDetails`, `getPlanById`, `getCommentsByPlanId`, etc.) |

---

## Types TypeScript (`types/index.ts`)

Tous les types partages sont centralises :

- `Category`, `User`, `Plan`, `Comment`, `Boost`, `Favorite`
- `Notification`, `UserEvent`
- `ApiResponse<T>`, `PaginatedResponse<T>`, `FeedFilters`
- Enums : `Locale`, `Theme`, `UserRole`, `PlanStatus`, `EventType`, `ReportReason`, `MediaType`

---

## Validation (Zod)

Le schema de validation pour la creation d'un bon plan est dans `lib/validations/plan.ts` :

- **Titre** : 5 a 120 caracteres.
- **Description** : 20 a 2000 caracteres.
- **Categorie** : Doit etre un ID valide parmi les 8 categories.
- **Ville** : Doit etre une des 15 villes camerounaises configurees.
- **Image** : Max 10 MB, type `image/*`.
- **Video** : Max 100 MB, type `video/*`.
- **Coordonnees GPS** : Optionnelles (latitude, longitude, accuracy).
