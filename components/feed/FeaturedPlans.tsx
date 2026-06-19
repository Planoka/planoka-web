"use client";

import type { Plan } from "@/types";
import { PlanCard } from "@/components/plans/PlanCard";
import { useTranslations } from "next-intl";

type FeaturedPlansProps = {
  plans: Plan[];
};

export function FeaturedPlans({ plans }: FeaturedPlansProps) {
  const t = useTranslations("feed");

  if (plans.length === 0) return null;

  return (
    <section>
      <h2 className="mb-4 text-lg font-semibold text-[var(--color-text-primary)]">
        {t("featured")}
      </h2>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {plans.slice(0, 2).map((plan) => (
          <div key={plan.id} className="lg:first:col-span-2 lg:first:row-span-1">
            <PlanCard plan={plan} featured />
          </div>
        ))}
      </div>
    </section>
  );
}
