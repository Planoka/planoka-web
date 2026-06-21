"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Search, MapPin, SlidersHorizontal } from "lucide-react";
import { CategoryPills } from "@/components/feed/CategoryPills";
import { PlanCard } from "@/components/plans/PlanCard";
import { usePlans } from "@/hooks/usePlans";
import { Button } from "@/components/ui/button";

export default function PlansPage() {
  const t = useTranslations("feed");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"recent" | "popular">("recent");

  // Determine category string mapped from CategoryPills (which uses "restauration" etc instead of "cat-1")
  const categoryMap: Record<string, string> = {
    restauration: "cat-1",
    loisirs: "cat-2",
    sorties: "cat-3",
    shopping: "cat-4",
    services: "cat-5",
    sante: "cat-6",
    education: "cat-7",
    sport: "cat-8",
  };
  const categoryId = selectedCategory ? categoryMap[selectedCategory] : null;

  const { data: plans = [], isLoading } = usePlans(categoryId);

  const filteredAndSortedPlans = useMemo(() => {
    let result = [...plans];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) => p.titre.toLowerCase().includes(query) || p.ville.toLowerCase().includes(query)
      );
    }

    if (sortBy === "recent") {
      result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else if (sortBy === "popular") {
      result.sort((a, b) => b.boosts_count - a.boosts_count);
    }

    return result;
  }, [plans, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-[var(--color-bg-page)] pb-20 pt-20 sm:pt-24 lg:pb-0">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header & Search */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">
              {t("latest")}
            </h1>
            <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
              Découvrez des pépites autour de vous
            </p>
          </div>

          <div className="flex w-full sm:w-auto items-center gap-2">
            <div className="flex-1 flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] px-3 py-2 focus-within:border-[var(--color-primary)] focus-within:ring-1 focus-within:ring-[var(--color-primary)]">
              <Search className="h-4 w-4 text-[var(--color-text-tertiary)]" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-sm text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-tertiary)]"
              />
            </div>
            <Button
              variant="outline"
              className="h-10 w-10 shrink-0 p-0 rounded-xl"
              onClick={() => setSortBy(sortBy === "recent" ? "popular" : "recent")}
              title={`Trié par: ${sortBy === "recent" ? "Plus récents" : "Populaires"}`}
            >
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-8 overflow-hidden">
          <CategoryPills selected={selectedCategory} onSelect={setSelectedCategory} />
        </div>

        {/* Masonry Grid */}
        {isLoading ? (
          <div className="mt-6 columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="mb-4 h-[300px] w-full animate-pulse rounded-2xl bg-[var(--color-border)]" />
            ))}
          </div>
        ) : filteredAndSortedPlans.length > 0 ? (
          <div className="mt-6 columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4">
            {filteredAndSortedPlans.map((plan) => (
              <PlanCard key={plan.id} plan={plan} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-bg-surface)]">
              <MapPin className="h-8 w-8 text-[var(--color-text-tertiary)]" />
            </div>
            <p className="text-[var(--color-text-secondary)]">{t("empty")}</p>
            {searchQuery && (
              <Button 
                variant="link" 
                onClick={() => setSearchQuery("")}
                className="mt-2 text-[var(--color-primary)]"
              >
                Effacer la recherche
              </Button>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
