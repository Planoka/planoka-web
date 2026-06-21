import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { plansApi } from "@/lib/api";
import { getPlansWithDetails, getPlansByCategory } from "@/lib/mock-data";
import type { Plan } from "@/types";

// Toggle this to switch between Mock and API mode
const USE_MOCK = true;

export function usePlans(categoryId?: string | null) {
  return useQuery({
    queryKey: ["plans", { categoryId }],
    queryFn: async () => {
      if (USE_MOCK) {
        // Simulating network delay
        await new Promise((resolve) => setTimeout(resolve, 500));
        if (categoryId) {
          // In a real mock scenario we'd join user/category data,
          // but getPlansWithDetails handles this for us partially.
          // Let's filter getPlansWithDetails instead to keep authors/categories
          return getPlansWithDetails().filter((p) => p.categorie_id === categoryId);
        }
        return getPlansWithDetails();
      } else {
        const filters = categoryId ? { category: categoryId } : undefined;
        const { data } = await plansApi.getAll(filters);
        return data as Plan[];
      }
    },
  });
}

export function usePlan(id: string) {
  return useQuery({
    queryKey: ["plans", id],
    queryFn: async () => {
      if (USE_MOCK) {
        await new Promise((resolve) => setTimeout(resolve, 300));
        const plan = getPlansWithDetails().find((p) => p.id === id);
        if (!plan) throw new Error("Plan not found");
        return plan;
      } else {
        const { data } = await plansApi.getById(id);
        return data as Plan;
      }
    },
    enabled: !!id,
  });
}

export function useBoostPlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (USE_MOCK) {
        await new Promise((resolve) => setTimeout(resolve, 300));
        return { success: true };
      } else {
        const { data } = await plansApi.boost(id);
        return data;
      }
    },
    onSuccess: (_, id) => {
      // Invalidate both lists and specific plan to refresh boost count
      queryClient.invalidateQueries({ queryKey: ["plans"] });
    },
  });
}

export function useFavoritePlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (USE_MOCK) {
        await new Promise((resolve) => setTimeout(resolve, 300));
        return { success: true };
      } else {
        const { data } = await plansApi.favorite(id);
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });
}
