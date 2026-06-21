"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { Search, MapPin, Flame, Clock, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { CategoryPills } from "@/components/feed/CategoryPills";
import { PlanCard } from "@/components/plans/PlanCard";
import { usePlans } from "@/hooks/usePlans";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FEED_PAGE_SIZE } from "@/lib/constants";

export default function PlansPage() {
  const t = useTranslations("feed");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"recent" | "popular">("recent");
  const [currentPage, setCurrentPage] = useState(1);

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

  const totalPages = Math.ceil(filteredAndSortedPlans.length / FEED_PAGE_SIZE);
  const paginatedPlans = filteredAndSortedPlans.slice(
    (currentPage - 1) * FEED_PAGE_SIZE,
    currentPage * FEED_PAGE_SIZE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-page)] pt-20 pb-24 sm:pt-24 sm:pb-0">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <h1 className="mb-10 text-3xl font-bold text-[var(--color-text-primary)]">
                <span className="relative inline-block">
                  <svg
                    width="219"
                    height="24"
                    viewBox="0 0 219 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="absolute inset-x-0 inset-y-10 -bottom-1 w-full text-[var(--color-primary)]"
                  >
                    <path
                      d="M0.5 2H218L21 12.5H182.5L48.5 21.5H151"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                  </svg>
                  <span className="relative">{t("latest")}</span>
                </span>
              </h1>
              <p className="mt-4 text-sm text-[var(--color-text-secondary)]">
                Découvrez des pépites autour de vous
              </p>
            </div>

            {/* Search & Sort */}
            <div className="flex w-full items-center gap-2 sm:w-auto">
              <div className="flex flex-1 items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] px-3 py-2.5 transition-all focus-within:border-[var(--color-primary)] focus-within:ring-1 focus-within:ring-[var(--color-primary)] sm:w-64">
                <Search className="h-4 w-4 text-[var(--color-text-tertiary)]" />
                <input
                  type="text"
                  placeholder="Rechercher un plan, une ville..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full bg-transparent text-sm text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-tertiary)]"
                />
              </div>
              <div className="flex overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)]">
                <button
                  onClick={() => {
                    setSortBy("recent");
                    setCurrentPage(1);
                  }}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium transition-all",
                    sortBy === "recent"
                      ? "bg-[var(--color-primary)] text-white"
                      : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-surface)]"
                  )}
                >
                  <Clock className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Récents</span>
                </button>
                <button
                  onClick={() => {
                    setSortBy("popular");
                    setCurrentPage(1);
                  }}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium transition-all",
                    sortBy === "popular"
                      ? "bg-[var(--color-primary)] text-white"
                      : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-surface)]"
                  )}
                >
                  <Flame className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Populaires</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Categories */}
        <div className="mb-8 overflow-hidden">
          <CategoryPills
            selected={selectedCategory}
            onSelect={(cat) => {
              setSelectedCategory(cat);
              setCurrentPage(1);
            }}
          />
        </div>

        {/* Results count */}
        <div className="mb-4 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-[var(--color-primary)]" />
          <p className="text-sm font-medium text-[var(--color-text-secondary)]">
            {filteredAndSortedPlans.length} plan{filteredAndSortedPlans.length !== 1 ? "s" : ""}{" "}
            disponible{filteredAndSortedPlans.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Masonry Grid */}
        {isLoading ? (
          <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4">
            {Array.from({ length: FEED_PAGE_SIZE }).map((_, i) => (
              <div
                key={i}
                className="mb-4 h-[300px] w-full animate-pulse rounded-2xl bg-[var(--color-border)]"
              />
            ))}
          </div>
        ) : paginatedPlans.length > 0 ? (
          <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4">
            {paginatedPlans.map((plan) => (
              <PlanCard key={plan.id} plan={plan} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-[var(--color-primary-light)]">
              <MapPin className="h-10 w-10 text-[var(--color-primary)]" />
            </div>
            <h3 className="text-lg font-bold text-[var(--color-text-primary)]">{t("empty")}</h3>
            <p className="mt-1 text-sm text-[var(--color-text-tertiary)]">
              Essayez de modifier vos filtres ou votre recherche
            </p>
            {searchQuery && (
              <Button
                variant="link"
                onClick={() => {
                  setSearchQuery("");
                  setCurrentPage(1);
                }}
                className="mt-2 text-[var(--color-primary)]"
              >
                Effacer la recherche
              </Button>
            )}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 rounded-xl"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((page) => {
                if (totalPages <= 7) return true;
                if (page === 1 || page === totalPages) return true;
                if (Math.abs(page - currentPage) <= 1) return true;
                return false;
              })
              .reduce<(number | "ellipsis")[]>((acc, page, i, arr) => {
                if (i > 0 && page - (arr[i - 1] as number) > 1) {
                  acc.push("ellipsis");
                }
                acc.push(page);
                return acc;
              }, [])
              .map((item, i) =>
                item === "ellipsis" ? (
                  <span key={`ellipsis-${i}`} className="px-2 text-[var(--color-text-tertiary)]">
                    ...
                  </span>
                ) : (
                  <button
                    key={item}
                    onClick={() => handlePageChange(item as number)}
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-xl text-sm font-medium transition-all",
                      currentPage === item
                        ? "bg-[var(--color-primary)] text-white shadow-[var(--color-primary)]/20 shadow-md"
                        : "border border-[var(--color-border)] bg-[var(--color-bg-card)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)]/30"
                    )}
                  >
                    {item}
                  </button>
                )
              )}

            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 rounded-xl"
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
