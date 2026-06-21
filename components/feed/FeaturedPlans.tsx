"use client";

import type { Plan } from "@/types";
import { PlanCard } from "@/components/plans/PlanCard";

type FeaturedPlansProps = {
  plans: Plan[];
};

export function FeaturedPlans({ plans }: FeaturedPlansProps) {
  if (plans.length === 0) return null;

  return (
    <section>
      <h2 className="mb-4 text-lg font-semibold text-[var(--color-text-primary)]">
        En vedette
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {plans.slice(0, 2).map((plan) => (
          <PlanCard key={plan.id} plan={plan} />
        ))}
      </div>
    </section>
  );
}
