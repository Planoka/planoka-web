/**
 * Store Global de l'Application (Zustand)
 * 
 * Ce fichier gère l'état global côté client de l'application.
 * Il utilise Zustand pour la gestion d'état et le middleware 'persist'
 * pour sauvegarder certaines préférences dans le localStorage du navigateur.
 */
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, FeedFilters } from "@/types";

// Définition de la structure (interface) de notre store
interface AppState {
  /** 1. Gestion de l'Utilisateur courant (synchronisé avec Clerk) */
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;

  /** 2. Gestion des Filtres du Feed (Page d'accueil) */
  feedFilters: FeedFilters;
  setFeedFilters: (filters: Partial<FeedFilters>) => void;
  resetFeedFilters: () => void;

  /** 3. Préférences d'affichage (Vue grille ou liste) */
  feedView: "grid" | "list";
  setFeedView: (view: "grid" | "list") => void;

  /** 4. Filtre par Catégorie */
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;

  /** 5. Gestion des Favoris (Liste d'IDs des bons plans) */
  favorites: string[];
  toggleFavorite: (planId: string) => void;
  addFavorite: (planId: string) => void;
  removeFavorite: (planId: string) => void;
  isFavorite: (planId: string) => boolean;
  
  /** 6. Centre de Notifications */
  notifications: import("@/types").Notification[];
  unreadNotificationsCount: number;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  initNotifications: () => void;
}

// Paramètres de filtrage par défaut au lancement
const defaultFilters: FeedFilters = {
  page: 1,
  limit: 12,
  sort: "recommended",
};

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // --- Section: Utilisateur ---
      currentUser: null,
      setCurrentUser: (user) => set({ currentUser: user }),

      // --- Section: Feed et Filtres ---
      feedFilters: defaultFilters,
      // Fusionne les nouveaux filtres avec les anciens
      setFeedFilters: (filters) =>
        set((state) => ({ feedFilters: { ...state.feedFilters, ...filters } })),
      resetFeedFilters: () => set({ feedFilters: defaultFilters }),

      // --- Section: Préférences UI ---
      feedView: "grid",
      setFeedView: (view) => set({ feedView: view }),

      selectedCategory: null,
      setSelectedCategory: (category) => set({ selectedCategory: category }),

      // --- Section: Favoris ---
      favorites: [],
      toggleFavorite: (planId) =>
        set((state) => ({
          // Si le plan est déjà en favori, on le retire, sinon on l'ajoute
          favorites: state.favorites.includes(planId)
            ? state.favorites.filter((id) => id !== planId)
            : [...state.favorites, planId],
        })),
      addFavorite: (planId) =>
        set((state) => ({
          favorites: state.favorites.includes(planId)
            ? state.favorites
            : [...state.favorites, planId],
        })),
      removeFavorite: (planId) =>
        set((state) => ({
          favorites: state.favorites.filter((id) => id !== planId),
        })),
      isFavorite: (planId) => get().favorites.includes(planId),

      // --- Section: Notifications ---
      notifications: [],
      unreadNotificationsCount: 0,
      initNotifications: () => {
        // Chargement différé (lazy load) des notifications mockées
        import("@/lib/mock-data").then(({ getNotificationsWithDetails }) => {
          const notifs = getNotificationsWithDetails();
          set({
            notifications: notifs,
            unreadNotificationsCount: notifs.filter((n) => !n.is_read).length,
          });
        });
      },
      markNotificationAsRead: (id) =>
        set((state) => {
          const notifications = state.notifications.map((n) =>
            n.id === id ? { ...n, is_read: true } : n
          );
          return {
            notifications,
            unreadNotificationsCount: notifications.filter((n) => !n.is_read).length,
          };
        }),
      markAllNotificationsAsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, is_read: true })),
          unreadNotificationsCount: 0,
        })),
    }),
    {
      name: "planoka-store", // Nom de la clé dans le localStorage
      // Sélection des données à persister (conserver après rafraîchissement)
      partialize: (state) => ({
        feedView: state.feedView,
        feedFilters: { sort: state.feedFilters.sort },
        favorites: state.favorites,
        // On ne persiste ni l'utilisateur (Clerk s'en charge) 
        // ni les notifications (elles sont regénérées depuis le mock)
      }),
    }
  )
);
