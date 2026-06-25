"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { plansApi } from "@/lib/api";
import { toast } from "sonner";

interface CreatePlanVariables {
  formData: FormData;
}

interface UseCreatePlanOptions {
  onSuccess?: (data: { id: string }) => void;
}

export function useCreatePlan(options?: UseCreatePlanOptions) {
  const router = useRouter();
  const locale = useLocale();

  return useMutation({
    mutationFn: async ({ formData }: CreatePlanVariables) => {
      const response = await plansApi.create(formData);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success("Plan publié avec succès !");
      if (options?.onSuccess) {
        options.onSuccess(data);
      } else {
        router.push(`/${locale}/plans/${data.id}`);
        router.refresh();
      }
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      const message = err.response?.data?.message || "Erreur lors de la publication";
      toast.error(message);
    },
  });
}

export function useCreatePlanMock(options?: UseCreatePlanOptions) {
  const router = useRouter();
  const locale = useLocale();

  return useMutation({
    mutationFn: async ({ formData }: CreatePlanVariables) => {
      // Simulate upload delay
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Mock response - create a fake plan ID
      const mockPlan = {
        id: `plan-${Date.now()}`,
        ...Object.fromEntries(formData.entries()),
        boosts_count: 0,
        comments_count: 0,
        shares_count: 0,
        status: "active",
        is_featured: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      return mockPlan;
    },
    onSuccess: (data) => {
      toast.success("Plan publié avec succès ! (Mode démo)");
      if (options?.onSuccess) {
        options.onSuccess(data);
      } else {
        router.push(`/${locale}/plans/${data.id}`);
        router.refresh();
      }
    },
    onError: () => {
      toast.error("Erreur lors de la publication");
    },
  });
}