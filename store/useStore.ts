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
}

const defaultFilters: FeedFilters = {
  page: 1,
  limit: 12,
  sort: "recommended",
};

export const useStore = create<AppState>()(
  persist(
    (set) => ({
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
    }),
    {
      name: "planoka-store",
      partialize: (state) => ({
        feedView: state.feedView,
        feedFilters: { sort: state.feedFilters.sort },
      }),
    }
  )
);
