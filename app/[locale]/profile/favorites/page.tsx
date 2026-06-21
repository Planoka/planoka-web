"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { motion, AnimatePresence } from "motion/react";
import {
  Heart,
  Search,
  Grid3X3,
  List,
  ArrowUpDown,
  Trash2,
  Compass,
  X,
  Undo2,
  Sparkles,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { useStore } from "@/store/useStore";
import { getPlansWithDetails } from "@/lib/mock-data";
import { CATEGORIES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { Plan } from "@/types";

const CATEGORY_MAP: Record<string, { fr: string; en: string }> = {
  "cat-1": { fr: "Restauration", en: "Restaurants" },
  "cat-2": { fr: "Loisirs", en: "Leisure" },
  "cat-3": { fr: "Sorties", en: "Outings" },
  "cat-4": { fr: "Shopping", en: "Shopping" },
  "cat-5": { fr: "Services", en: "Services" },
  "cat-6": { fr: "Santé", en: "Health" },
  "cat-7": { fr: "Éducation", en: "Education" },
  "cat-8": { fr: "Sport", en: "Sport" },
};

type SortKey = "recent" | "oldest" | "alpha" | "alphaDesc" | "boosted";

const SORT_OPTIONS: SortKey[] = ["recent", "oldest", "alpha", "alphaDesc", "boosted"];

function sortPlans(plans: Plan[], sort: SortKey): Plan[] {
  const sorted = [...plans];
  switch (sort) {
    case "recent":
      return sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    case "oldest":
      return sorted.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    case "alpha":
      return sorted.sort((a, b) => a.titre.localeCompare(b.titre, "fr"));
    case "alphaDesc":
      return sorted.sort((a, b) => b.titre.localeCompare(a.titre, "fr"));
    case "boosted":
      return sorted.sort((a, b) => b.boosts_count - a.boosts_count);
    default:
      return sorted;
  }
}

export default function FavoritesPage() {
  const locale = useLocale();
  const t = useTranslations("favorites");
  const tCat = useTranslations("categories");
  const allPlans = useMemo(() => getPlansWithDetails(), []);
  const favorites = useStore((s) => s.favorites);
  const removeFavorite = useStore((s) => s.removeFavorite);
  const toggleFavorite = useStore((s) => s.toggleFavorite);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sort, setSort] = useState<SortKey>("recent");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [clearAllOpen, setClearAllOpen] = useState(false);
  const [undoToast, setUndoToast] = useState<{ plan: Plan } | null>(null);

  const favoritePlans = useMemo(() => {
    const plans = allPlans.filter((p) => favorites.includes(p.id));
    let filtered = plans;

    if (search.trim()) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.titre.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.ville.toLowerCase().includes(q),
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter((p) => p.categorie_id === selectedCategory);
    }

    return sortPlans(filtered, sort);
  }, [allPlans, favorites, search, selectedCategory, sort]);

  const removeWithUndo = (plan: Plan) => {
    removeFavorite(plan.id);
    setUndoToast({ plan });
    setTimeout(() => setUndoToast(null), 5000);
  };

  const handleUndo = () => {
    if (undoToast) {
      toggleFavorite(undoToast.plan.id);
      setUndoToast(null);
    }
  };

  const handleClearAll = () => {
    favorites.forEach((id) => removeFavorite(id));
    setClearAllOpen(false);
  };

  const getCategoryName = (cat: Plan["categorie_id"]) => {
    const name = CATEGORY_MAP[cat];
    return name ? name[locale as "fr" | "en"] : "Plan";
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-page)] pb-28 md:pb-12">
      {/* ═══ HEADER ═══ */}
      <section className="relative overflow-hidden border-b border-[var(--color-border)] bg-[var(--color-bg-card)] pt-8 pb-6 sm:pt-12 sm:pb-8">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-32 -left-32 h-64 w-64 rounded-full bg-[var(--color-primary)]/5 blur-3xl" />
          <div className="absolute -top-16 -right-32 h-64 w-64 rounded-full bg-[var(--color-primary)]/5 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-primary)]/10">
                <Heart className="h-7 w-7 text-[var(--color-primary)]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-3xl">
                  {t("title")}
                </h1>
                <p className="mt-1 text-sm text-[var(--color-text-tertiary)]">
                  {t("subtitle")}
                </p>
              </div>
              <div className="sm:ml-auto">
                <Badge variant="secondary" className="rounded-full px-3 py-1 text-sm">
                  <Heart className="mr-1 h-3.5 w-3.5 fill-[var(--color-primary)] text-[var(--color-primary)]" />
                  {t("count", { count: favorites.length })}
                </Badge>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ TOOLBAR ═══ */}
      {favorites.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="sticky top-16 z-40 border-b border-[var(--color-border)] bg-[var(--color-bg-card)]/80 backdrop-blur-xl"
        >
          <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
            {/* Search */}
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-tertiary)]" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("search")}
                className="h-10 rounded-xl border-[var(--color-border)] bg-[var(--color-bg-surface)] pl-10 pr-10 text-sm"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)]"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Category pills */}
            <div className="mb-3 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              <button
                onClick={() => setSelectedCategory(null)}
                className={cn(
                  "shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all",
                  !selectedCategory
                    ? "bg-[var(--color-primary)] text-white shadow-sm"
                    : "bg-[var(--color-bg-surface)] text-[var(--color-text-secondary)] hover:bg-[var(--color-primary-light)] hover:text-[var(--color-primary)]",
                )}
              >
                {t("filter.all")}
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() => setSelectedCategory(selectedCategory === `cat-${CATEGORIES.indexOf(cat) + 1}` ? null : `cat-${CATEGORIES.indexOf(cat) + 1}`)}
                  className={cn(
                    "shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all",
                    selectedCategory === `cat-${CATEGORIES.indexOf(cat) + 1}`
                      ? "text-white shadow-sm"
                      : "bg-[var(--color-bg-surface)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]",
                  )}
                  style={
                    selectedCategory === `cat-${CATEGORIES.indexOf(cat) + 1}`
                      ? { backgroundColor: cat.color }
                      : undefined
                  }
                >
                  {tCat(cat.slug as "restauration" | "loisirs" | "sorties" | "shopping" | "services" | "sante" | "education" | "sport")}
                </button>
              ))}
            </div>

            {/* Sort + View + Actions */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <ArrowUpDown className="h-3.5 w-3.5 text-[var(--color-text-tertiary)]" />
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortKey)}
                  className="rounded-lg border-0 bg-transparent text-xs font-medium text-[var(--color-text-secondary)] outline-none cursor-pointer"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {t(`sort.${opt}`)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1">
                <Button
                  variant={view === "grid" ? "secondary" : "ghost"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setView("grid")}
                  aria-label={t("grid")}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={view === "list" ? "secondary" : "ghost"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setView("list")}
                  aria-label={t("list")}
                >
                  <List className="h-4 w-4" />
                </Button>

                <div className="mx-1 h-4 w-px bg-[var(--color-border)]" />

                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-1.5 text-xs text-[var(--color-danger)] hover:bg-[var(--color-danger)]/10 hover:text-[var(--color-danger)]"
                  onClick={() => setClearAllOpen(true)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{t("clearAll")}</span>
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* ═══ CONTENT ═══ */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait">
          {favorites.length === 0 ? (
            /* ═══ EMPTY STATE ═══ */
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="relative mb-6">
                <div className="flex h-28 w-28 items-center justify-center rounded-full bg-[var(--color-primary-light)]">
                  <Heart className="h-14 w-14 text-[var(--color-primary)]/40" />
                </div>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -right-2 -top-2 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-primary)] shadow-lg"
                >
                  <Sparkles className="h-5 w-5 text-white" />
                </motion.div>
              </div>
              <h2 className="mb-2 text-xl font-bold text-[var(--color-text-primary)]">
                {t("empty")}
              </h2>
              <p className="mb-8 max-w-sm text-sm text-[var(--color-text-tertiary)]">
                {t("emptyDesc")}
              </p>
              <Link href={`/${locale}`}>
                <Button className="gap-2 rounded-full bg-[var(--color-primary)] px-6 text-white hover:brightness-90">
                  <Compass className="h-4 w-4" />
                  {t("emptyAction")}
                </Button>
              </Link>
            </motion.div>
          ) : favoritePlans.length === 0 ? (
            /* ═══ NO RESULTS ═══ */
            <motion.div
              key="no-results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center justify-center py-16 text-center"
            >
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-bg-surface)]">
                <Search className="h-7 w-7 text-[var(--color-text-tertiary)]" />
              </div>
              <p className="text-sm text-[var(--color-text-tertiary)]">
                {t("empty")}
              </p>
            </motion.div>
          ) : view === "grid" ? (
            /* ═══ GRID VIEW ═══ */
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="columns-1 gap-4 sm:columns-2 lg:columns-3"
            >
              {favoritePlans.map((plan, i) => (
                <FavoriteGridCard
                  key={plan.id}
                  plan={plan}
                  index={i}
                  locale={locale}
                  onRemove={removeWithUndo}
                  getCategoryName={getCategoryName}
                />
              ))}
            </motion.div>
          ) : (
            /* ═══ LIST VIEW ═══ */
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-3"
            >
              {favoritePlans.map((plan, i) => (
                <FavoriteListCard
                  key={plan.id}
                  plan={plan}
                  index={i}
                  locale={locale}
                  onRemove={removeWithUndo}
                  getCategoryName={getCategoryName}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ═══ UNDO TOAST ═══ */}
      <AnimatePresence>
        {undoToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="fixed bottom-24 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] px-4 py-3 shadow-lg md:bottom-8"
          >
            <p className="text-sm text-[var(--color-text-secondary)]">
              {t("removed")}
            </p>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 gap-1 text-xs font-semibold text-[var(--color-primary)]"
              onClick={handleUndo}
            >
              <Undo2 className="h-3.5 w-3.5" />
              {t("undo")}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ CLEAR ALL DIALOG ═══ */}
      <Dialog open={clearAllOpen} onOpenChange={setClearAllOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("clearAllConfirm")}</DialogTitle>
            <DialogDescription>{t("clearAllDesc")}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost" size="sm">
                {t("common.cancel")}
              </Button>
            </DialogClose>
            <Button
              size="sm"
              className="bg-[var(--color-danger)] text-white hover:brightness-90"
              onClick={handleClearAll}
            >
              <Trash2 className="mr-1.5 h-3.5 w-3.5" />
              {t("clearAll")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ═══ GRID CARD ═══ */
function FavoriteGridCard({
  plan,
  index,
  locale,
  onRemove,
  getCategoryName,
}: {
  plan: Plan;
  index: number;
  locale: string;
  onRemove: (plan: Plan) => void;
  getCategoryName: (cat: string) => string;
}) {
  const catColor = CATEGORIES[parseInt(plan.categorie_id.replace("cat-", "")) - 1]?.color ?? "#E8610A";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.3) }}
      className="break-inside-avoid mb-4"
    >
      <Link
        href={`/${locale}/plans/${plan.id}`}
        className="group relative flex flex-col overflow-hidden rounded-2xl bg-[var(--color-bg-card)] shadow-sm transition-all hover:shadow-lg"
      >
        {/* Image */}
        <div className="relative h-48 overflow-hidden sm:h-52">
          {plan.image_url ? (
            <Image
              src={plan.image_url}
              alt={plan.titre}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[var(--color-primary-light)] to-[var(--color-bg-surface)]">
              <Sparkles className="h-10 w-10 text-[var(--color-primary)]/30" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

          {/* Category badge */}
          <span
            className="absolute left-3 top-3 z-10 rounded-md px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-white backdrop-blur-sm"
            style={{ backgroundColor: `${catColor}CC` }}
          >
            {getCategoryName(plan.categorie_id)}
          </span>

          {/* Remove button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onRemove(plan);
            }}
            className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-[var(--color-danger)] opacity-0 backdrop-blur-sm transition-all group-hover:opacity-100 hover:scale-110 active:scale-90"
            aria-label="Retirer des favoris"
          >
            <Heart className="h-4 w-4 fill-[var(--color-danger)]" />
          </button>

          {/* Bottom info */}
          <div className="absolute bottom-0 left-0 right-0 z-10 p-3">
            <h3 className="line-clamp-2 text-base font-bold leading-tight text-white drop-shadow-sm">
              {plan.titre}
            </h3>
            <p className="mt-1 flex items-center gap-1 text-[12px] text-white/75">
              <span>{plan.ville}</span>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-3 py-2.5">
          <div className="flex items-center gap-3 text-[11px] text-[var(--color-text-tertiary)]">
            <span className="flex items-center gap-1">
              <Zap className="h-3 w-3" />
              {plan.boosts_count}
            </span>
            <span>{plan.comments_count} comments</span>
          </div>
          <span className="text-[11px] text-[var(--color-text-tertiary)]">
            {new Date(plan.created_at).toLocaleDateString(locale === "fr" ? "fr-FR" : "en-US", { day: "numeric", month: "short" })}
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

/* ═══ LIST CARD ═══ */
function FavoriteListCard({
  plan,
  index,
  locale,
  onRemove,
  getCategoryName,
}: {
  plan: Plan;
  index: number;
  locale: string;
  onRemove: (plan: Plan) => void;
  getCategoryName: (cat: string) => string;
}) {
  const catColor = CATEGORIES[parseInt(plan.categorie_id.replace("cat-", "")) - 1]?.color ?? "#E8610A";

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20, scale: 0.95 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.04, 0.3) }}
    >
      <Link
        href={`/${locale}/plans/${plan.id}`}
        className="group flex gap-4 overflow-hidden rounded-2xl bg-[var(--color-bg-card)] p-3 shadow-sm transition-all hover:shadow-md"
      >
        {/* Thumbnail */}
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl sm:h-28 sm:w-28">
          {plan.image_url ? (
            <Image
              src={plan.image_url}
              alt={plan.titre}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="112px"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[var(--color-primary-light)] to-[var(--color-bg-surface)]">
              <Sparkles className="h-8 w-8 text-[var(--color-primary)]/30" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col justify-between py-0.5">
          <div>
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <span
                  className="mb-1 inline-block rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white"
                  style={{ backgroundColor: catColor }}
                >
                  {getCategoryName(plan.categorie_id)}
                </span>
                <h3 className="line-clamp-1 text-sm font-bold text-[var(--color-text-primary)]">
                  {plan.titre}
                </h3>
                <p className="mt-0.5 flex items-center gap-1 text-xs text-[var(--color-text-tertiary)]">
                  <span>{plan.ville}</span>
                  <span>&bull;</span>
                  <span>
                    {new Date(plan.created_at).toLocaleDateString(locale === "fr" ? "fr-FR" : "en-US", { day: "numeric", month: "short" })}
                  </span>
                </p>
              </div>

              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onRemove(plan);
                }}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[var(--color-text-tertiary)] transition-all hover:bg-[var(--color-danger)]/10 hover:text-[var(--color-danger)]"
                aria-label="Retirer des favoris"
              >
                <Heart className="h-4 w-4 fill-[var(--color-danger)]" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-[var(--color-text-tertiary)]">
            <span className="flex items-center gap-1">
              <Zap className="h-3 w-3" />
              {plan.boosts_count}
            </span>
            <span>{plan.comments_count} comments</span>
            <span>{plan.shares_count} shares</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}