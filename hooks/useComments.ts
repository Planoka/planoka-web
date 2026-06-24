import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCommentsByPlanId } from "@/lib/mock-data";
import type { Comment } from "@/types";

const USE_MOCK = true;

export function useComments(planId: string) {
  return useQuery({
    queryKey: ["comments", planId],
    queryFn: async (): Promise<Comment[]> => {
      if (USE_MOCK) {
        await new Promise((resolve) => setTimeout(resolve, 400));
        return getCommentsByPlanId(planId);
      }
      const res = await fetch(`/api/plans/${planId}/comments`);
      return res.json();
    },
    enabled: !!planId,
  });
}

export function useAddComment(planId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      contenu,
      parent_id,
    }: {
      contenu: string;
      parent_id?: string | null;
    }): Promise<Comment> => {
      if (USE_MOCK) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        const newComment: Comment = {
          id: `cmt-${Date.now()}`,
          plan_id: planId,
          user_id: "user-current",
          parent_id: parent_id ?? null,
          contenu,
          created_at: new Date().toISOString(),
          author: {
            id: "user-current",
            clerk_id: "clerk_current",
            nom: "Vous",
            email: "vous@example.com",
            avatar_url: "https://i.pravatar.cc/150?img=68",
            role: "user",
            langue: "fr",
            theme: "system",
            ville: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        };
        return newComment;
      }
      const res = await fetch(`/api/plans/${planId}/comments`, {
        method: "POST",
        body: JSON.stringify({ contenu, parent_id }),
        headers: { "Content-Type": "application/json" },
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", planId] });
      queryClient.invalidateQueries({ queryKey: ["plans", planId] });
    },
  });
}
