import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, FeedFilters } from "@/types";

interface AppState {
  /** Utilisateur courant */
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;

  /** Filtres du feed */
  feedFilters: FeedFilters;
  setFeedFilters: (filters: Partial<FeedFilters>) => void;
  resetFeedFilters: () => void;

  /** Vue (grille ou liste) */
  feedView: "grid" | "list";
  setFeedView: (view: "grid" | "list") => void;

  /** Catégorie sélectionnée */
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;

  /** Favoris — IDs des plans sauvegardés */
  favorites: string[];
  toggleFavorite: (planId: string) => void;
  addFavorite: (planId: string) => void;
  removeFavorite: (planId: string) => void;
  isFavorite: (planId: string) => boolean;
}

const defaultFilters: FeedFilters = {
  page: 1,
  limit: 12,
  sort: "recommended",
};

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      setCurrentUser: (user) => set({ currentUser: user }),

      feedFilters: defaultFilters,
      setFeedFilters: (filters) =>
        set((state) => ({ feedFilters: { ...state.feedFilters, ...filters } })),
      resetFeedFilters: () => set({ feedFilters: defaultFilters }),

      feedView: "grid",
      setFeedView: (view) => set({ feedView: view }),

      selectedCategory: null,
      setSelectedCategory: (category) => set({ selectedCategory: category }),

      favorites: [],
      toggleFavorite: (planId) =>
        set((state) => ({
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
    }),
    {
      name: "planoka-store",
      partialize: (state) => ({
        feedView: state.feedView,
        feedFilters: { sort: state.feedFilters.sort },
        favorites: state.favorites,
      }),
    }
  )
);
