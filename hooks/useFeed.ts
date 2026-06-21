import { useQuery } from "@tanstack/react-query";
import { feedApi } from "@/lib/api";
import { getFeaturedPlans } from "@/lib/mock-data";
import type { Plan } from "@/types";

// Toggle this to switch between Mock and API mode
const USE_MOCK = true;

export function useFeed() {
  return useQuery({
    queryKey: ["feed", "recommended"],
    queryFn: async () => {
      if (USE_MOCK) {
        // Simulating network delay
        await new Promise((resolve) => setTimeout(resolve, 600));
        // Use featured plans as recommended feed for now
        // Assuming we need user and category details merged
        const mockPlansWithDetails = await import("@/lib/mock-data").then((m) => m.getPlansWithDetails());
        return mockPlansWithDetails.filter((p) => p.is_featured);
      } else {
        const { data } = await feedApi.getRecommended();
        return data as Plan[];
      }
    },
  });
}
