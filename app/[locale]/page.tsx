"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { Search, MapPin, ArrowRight, Sparkles } from "lucide-react";
import { CategoryPills } from "@/components/feed/CategoryPills";
import { FeaturedPlans } from "@/components/feed/FeaturedPlans";
import { PlanGrid } from "@/components/feed/PlanGrid";
import { getPlansWithDetails, getFeaturedPlans } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const t = useTranslations("feed");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const allPlans = useMemo(() => getPlansWithDetails(), []);
  const featuredPlans = useMemo(() => getFeaturedPlans(), []);

  const filteredPlans = useMemo(() => {
    if (!selectedCategory) return allPlans;
    const catMap: Record<string, string> = {
      restauration: "cat-1", loisirs: "cat-2", sorties: "cat-3",
      shopping: "cat-4", services: "cat-5", sante: "cat-6",
      education: "cat-7", sport: "cat-8",
    };
    const catId = catMap[selectedCategory];
    return allPlans.filter((p) => p.categorie_id === catId);
  }, [selectedCategory, allPlans]);

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden bg-gradient-to-b from-[var(--color-primary)]/10 to-transparent pb-12 pt-8 sm:pt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-2xl text-center"
          >
            <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-[var(--color-primary)]/20 bg-[var(--color-primary-light)] px-3 py-1 text-xs font-medium text-[var(--color-primary)]">
              <Sparkles className="h-3 w-3" />
              Découvrez les meilleurs plans près de chez vous
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-5xl lg:text-6xl">
              {t("title")}
            </h1>
            <p className="mt-4 text-lg text-[var(--color-text-secondary)] sm:text-xl">
              {t("subtitle")}
            </p>

            <div className="mx-auto mt-8 flex max-w-md items-center gap-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)] px-4 py-2 shadow-sm transition-all focus-within:border-[var(--color-primary)] focus-within:ring-2 focus-within:ring-[var(--color-primary)]/20">
              <Search className="h-5 w-5 text-[var(--color-text-tertiary)]" />
              <input
                type="text"
                placeholder="Rechercher un bon plan, une ville..."
                className="flex-1 bg-transparent text-sm text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-tertiary)]"
              />
              <kbd className="hidden rounded-md border border-[var(--color-border)] px-1.5 py-0.5 text-[10px] text-[var(--color-text-tertiary)] sm:inline">
                ⌘K
              </kbd>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <FeaturedPlans plans={featuredPlans} />
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
            {selectedCategory ? "Plans filtrés" : t("latest")}
          </h2>
          <span className="text-sm text-[var(--color-text-tertiary)]">
            {filteredPlans.length} plan{filteredPlans.length !== 1 ? "s" : ""}
          </span>
        </div>

        <CategoryPills selected={selectedCategory} onSelect={setSelectedCategory} />

        <div className="mt-6">
          <PlanGrid plans={filteredPlans} />
        </div>

        {filteredPlans.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-bg-surface)]">
              <MapPin className="h-8 w-8 text-[var(--color-text-tertiary)]" />
            </div>
            <p className="text-[var(--color-text-secondary)]">{t("empty")}</p>
          </div>
        )}

        {filteredPlans.length > 0 && (
          <div className="mt-8 flex justify-center">
            <Button variant="outline" className="gap-2">
              {t("loadMore")}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}
