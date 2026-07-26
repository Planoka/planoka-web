"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "motion/react";
import { Search, X, Loader2 } from "lucide-react";
import { CategoryFilter } from "@/components/explore/CategoryFilter";
import { PlanBottomSheet } from "@/components/explore/PlanBottomSheet";
import { EmptyStateCard } from "@/components/common/EmptyStateCard";
import { getPlansWithDetails } from "@/lib/mock-data";
import type { Plan } from "@/types";

/* ── Lazy-load the map to avoid SSR issues with Leaflet ── */
const ExploreMap = dynamic(
  () => import("@/components/explore/ExploreMap").then((mod) => mod.ExploreMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center bg-[var(--color-bg-primary)]">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--color-primary)]" />
      </div>
    ),
  }
);

export default function ExplorePage() {
  const t = useTranslations("explore");
  const allPlans = useMemo(() => getPlansWithDetails(), []);

  /* ── State ── */
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const userPosition: [number, number] | null = null;
  const [flyTo, setFlyTo] = useState<[number, number] | null>(null);
  const [isOnline, setIsOnline] = useState(() =>
    typeof window === "undefined" ? true : window.navigator.onLine
  );

  /* ── Filtered plans ── */
  const filteredPlans = useMemo(() => {
    let plans = allPlans.filter((p) => p.latitude != null && p.longitude != null);

    if (selectedCategory !== "all") {
      plans = plans.filter((p) => p.categorie_id === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      plans = plans.filter(
        (p) =>
          p.titre.toLowerCase().includes(q) ||
          p.ville.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    return plans;
  }, [allPlans, selectedCategory, searchQuery]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  /* ── Handlers ── */
  const handleSelectPlan = useCallback((plan: Plan) => {
    setSelectedPlan(plan);
    if (plan.latitude && plan.longitude) {
      setFlyTo([plan.latitude, plan.longitude]);
    }
  }, []);

  const handleClosePlan = useCallback(() => {
    setSelectedPlan(null);
  }, []);

  const handleCategoryChange = useCallback((catId: string) => {
    setSelectedCategory(catId);
    setSelectedPlan(null);
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden md:h-[calc(100vh-64px)]">
      {/* ═══ Category Filters ═══ */}
      <div className="absolute top-0 right-0 left-0 z-[1000]">
        <div className="flex items-center gap-2 pr-14">
          <CategoryFilter
            selected={selectedCategory}
            onSelect={handleCategoryChange}
            className="flex-1"
          />
        </div>

        {/* Search toggle button */}
        <button
          onClick={() => setShowSearch(!showSearch)}
          className="absolute top-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-bg-card)] text-[var(--color-primary)] shadow-lg transition-all hover:scale-105 active:scale-95"
          aria-label="Search"
        >
          <Search size={18} />
        </button>
      </div>

      {/* ═══ Search Bar (expandable) ═══ */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-16 right-3 left-3 z-[1001]"
          >
            <div className="flex items-center gap-2 rounded-2xl bg-[var(--color-bg-card)] px-4 py-2.5 shadow-xl border-none outline-none ring-0 focus-within:border-none focus-within:outline-none focus-within:ring-0">
              <Search size={16} className="text-[var(--color-text-tertiary)]" />
              <input
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("searchPlaceholder")}
                className="flex-1 bg-transparent text-sm text-[var(--color-text-primary)] !outline-none !ring-0 !border-none focus:!outline-none focus:!ring-0 focus:!border-none placeholder:text-[var(--color-text-tertiary)]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-[var(--color-text-tertiary)]"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            <div className="mt-2 px-1">
              <span className="rounded-full bg-[var(--color-bg-card)] px-3 py-1 text-xs font-medium text-[var(--color-text-secondary)] shadow-sm">
                {t("plansFound", { count: filteredPlans.length })}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ MAP CONTAINER (z-0) ═══ */}
      <div className="absolute inset-0 z-0">
        <ExploreMap
          plans={filteredPlans}
          onSelectPlan={handleSelectPlan}
          userPosition={userPosition}
          flyTo={flyTo}
        />
      </div>

      {/* Empty States */}
      {!isOnline && filteredPlans.length === 0 ? (
        <div className="absolute inset-x-0 top-32 z-[1001] px-4">
          <EmptyStateCard
            title={t("offlineTitle")}
            description={t("offlineDesc")}
            imageSrc="/images/mascot-offline.png"
            imageAlt="Mascotte Planoka"
            actionLabel={t("retry")}
            onAction={() => window.location.reload()}
            className="max-w-2xl"
          />
        </div>
      ) : null}

      {isOnline && filteredPlans.length === 0 && (
        <div className="absolute inset-x-0 top-32 z-[1001] px-4">
          <EmptyStateCard
            title={t("noResultsTitle")}
            description={t("noResultsDesc")}
            imageSrc="/images/mascot-introuvable.png"
            imageAlt="Mascotte Planoka"
            actionLabel={searchQuery ? t("clearSearch") : t("clearFilters")}
            onAction={() => {
              setSearchQuery("");
              setSelectedCategory("all");
            }}
            className="max-w-2xl"
          />
        </div>
      )}

      {/* ═══ Discover Button (commenté temporairement) ═══ */}
      {/* 
      <Link
        href={`/${locale}/search/discover`}
        className="absolute bottom-28 left-4 z-[1100] flex items-center gap-2 rounded-full bg-[var(--color-primary)] px-5 py-3 text-sm font-bold text-white shadow-xl transition-all hover:brightness-110 active:scale-95 md:bottom-8"
      >
        <Flame size={18} className="fill-white" />
        {t("discover")}
      </Link>
      */}

      {/* ═══ Plan Bottom Sheet ═══ */}
      <PlanBottomSheet
        plan={selectedPlan}
        onClose={handleClosePlan}
        viewLabel={t("viewPlan")}
        boostsLabel={t("boosts")}
        commentsLabel={t("comments")}
      />
    </div>
  );
}