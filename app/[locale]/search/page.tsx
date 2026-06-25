"use client";

import { useState, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence } from "motion/react";
import { Search, Navigation, Flame, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { CategoryFilter } from "@/components/explore/CategoryFilter";
import { PlanBottomSheet } from "@/components/explore/PlanBottomSheet";
import { getPlansWithDetails } from "@/lib/mock-data";
import type { Plan } from "@/types";

/* ── Lazy-load the map to avoid SSR issues with Leaflet ── */
const ExploreMap = dynamic(
  () =>
    import("@/components/explore/ExploreMap").then((mod) => mod.ExploreMap),
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
  const locale = useLocale();
  const allPlans = useMemo(() => getPlansWithDetails(), []);

  /* ── State ── */
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [userPosition, setUserPosition] = useState<[number, number] | null>(
    null
  );
  const [flyTo, setFlyTo] = useState<[number, number] | null>(null);
  const [locating, setLocating] = useState(false);

  /* ── Filtered plans ── */
  const filteredPlans = useMemo(() => {
    let plans = allPlans.filter(
      (p) => p.latitude != null && p.longitude != null
    );

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

  const handleLocateMe = useCallback(() => {
    if (!navigator.geolocation) {
      toast.error(t("locationNotSupported"));
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: [number, number] = [
          pos.coords.latitude,
          pos.coords.longitude,
        ];
        setUserPosition(coords);
        setFlyTo(coords);
        setLocating(false);
        toast.success(t("myLocation"));
      },
      () => {
        setLocating(false);
        toast.error(t("locationError"));
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, [t]);

  return (
    <div className="relative h-[calc(100vh-64px)] w-full overflow-hidden md:h-[calc(100vh-64px)]">
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
            <div className="flex items-center gap-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)] px-4 py-2.5 shadow-xl">
              <Search size={16} className="text-[var(--color-text-tertiary)]" />
              <input
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("searchPlaceholder")}
                className="flex-1 bg-transparent text-sm text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-tertiary)]"
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
            {/* Results count */}
            <div className="mt-2 px-1">
              <span className="rounded-full bg-[var(--color-bg-card)] px-3 py-1 text-xs font-medium text-[var(--color-text-secondary)] shadow-sm">
                {t("plansFound", { count: filteredPlans.length })}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ Map ═══ */}
      <ExploreMap
        plans={filteredPlans}
        onSelectPlan={handleSelectPlan}
        userPosition={userPosition}
        flyTo={flyTo}
      />

      {/* ═══ Locate Me Button ═══ */}
      <button
        onClick={handleLocateMe}
        disabled={locating}
        className="absolute right-4 bottom-44 z-[1000] flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-bg-card)] text-[var(--color-primary)] shadow-xl transition-all hover:scale-105 active:scale-95 disabled:opacity-50 md:bottom-8"
        aria-label={t("myLocation")}
      >
        {locating ? (
          <Loader2 size={20} className="animate-spin" />
        ) : (
          <Navigation size={20} />
        )}
      </button>

      {/* ═══ Discover Button ═══ */}
      <Link
        href={`/${locale}/search/discover`}
        className="absolute bottom-44 left-4 z-[1000] flex items-center gap-2 rounded-full bg-[var(--color-primary)] px-5 py-3 text-sm font-bold text-white shadow-xl transition-all hover:brightness-110 active:scale-95 md:bottom-8"
      >
        <Flame size={18} className="fill-white" />
        {t("discover")}
      </Link>

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
