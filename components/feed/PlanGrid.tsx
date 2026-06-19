"use client";

import type { Plan } from "@/types";
import { PlanCard } from "@/components/plans/PlanCard";

type PlanGridProps = {
  plans: Plan[];
  columns?: 2 | 3 | 4;
};

export function PlanGrid({ plans, columns = 3 }: PlanGridProps) {
  const gridClass = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  };

  return (
    <div className={`grid gap-4 ${gridClass[columns]}`}>
      {plans.map((plan) => (
        <PlanCard key={plan.id} plan={plan} />
      ))}
    </div>
  );
}
