"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { motion, AnimatePresence } from "motion/react";
import {
  Zap,
  Heart,
  MessageCircle,
  Share2,
  MapPin,
  ChevronUp,
  ArrowLeft,
  Compass,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useStore } from "@/store/useStore";
import type { Plan } from "@/types";
import { DiscoverCommentsSheet } from "./DiscoverCommentsSheet";

const CAT_META: Record<string, { color: string }> = {
  "cat-1": { color: "#E8610A" },
  "cat-2": { color: "#7C3AED" },
  "cat-3": { color: "#059669" },
  "cat-4": { color: "#DC2626" },
  "cat-5": { color: "#2563EB" },
  "cat-6": { color: "#DB2777" },
  "cat-7": { color: "#D97706" },
  "cat-8": { color: "#0891B2" },
};

interface DiscoverFeedProps {
  plans: Plan[];
  onBack: () => void;
}

export function DiscoverFeed({ plans, onBack }: DiscoverFeedProps) {
  const t = useTranslations("explore");
  const tCat = useTranslations("categories");
  const locale = useLocale();
  const toggleFavorite = useStore((s) => s.toggleFavorite);
  const favorites = useStore((s) => s.favorites);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [boostedIds, setBoostedIds] = useState<Set<string>>(new Set());
  const [commentsPlan, setCommentsPlan] = useState<Plan | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentPlan = plans[currentIndex] ?? null;

  /* ── Scroll handler for snap ── */
  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const scrollTop = container.scrollTop;
    const height = container.clientHeight;
    const newIndex = Math.round(scrollTop / height);
    if (newIndex !== currentIndex && newIndex >= 0 && newIndex < plans.length) {
      setCurrentIndex(newIndex);
    }
  }, [currentIndex, plans.length]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  /* ── Actions ── */
  const handleBoost = useCallback(
    (planId: string) => {
      setBoostedIds((prev) => {
        const next = new Set(prev);
        if (next.has(planId)) {
          next.delete(planId);
        } else {
          next.add(planId);
          toast.success("Boosté ! ⚡");
        }
        return next;
      });
    },
    []
  );

  const handleFavorite = useCallback(
    (planId: string) => {
      toggleFavorite(planId);
      const isFav = favorites.includes(planId);
      toast.success(isFav ? "Retiré des favoris" : "Ajouté aux favoris ❤️");
    },
    [toggleFavorite, favorites]
  );

  const handleShare = useCallback((plan: Plan) => {
    if (navigator.share) {
      navigator.share({
        title: plan.titre,
        text: plan.description,
        url: window.location.origin + `/plans/${plan.id}`,
      });
    } else {
      navigator.clipboard.writeText(
        window.location.origin + `/plans/${plan.id}`
      );
      toast.success("Lien copié !");
    }
  }, []);

  if (plans.length === 0) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 bg-[var(--color-bg-primary)] px-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-[var(--color-primary-light)]">
          <Compass size={40} className="text-[var(--color-primary)]" />
        </div>
        <h2 className="text-xl font-bold text-[var(--color-text-primary)]">
          {t("noMorePlans")}
        </h2>
        <p className="text-center text-sm text-[var(--color-text-tertiary)]">
          {t("noMorePlansDesc")}
        </p>
        <button
          onClick={onBack}
          className="mt-4 rounded-xl bg-[var(--color-primary)] px-6 py-3 text-sm font-bold text-white"
        >
          {t("backToMap")}
        </button>
      </div>
    );
  }

  return (
    <div className="relative h-screen bg-black">
      {/* Back button */}
      <button
        onClick={onBack}
        className="absolute top-4 left-4 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition-all hover:bg-black/60 active:scale-90"
        aria-label={t("backToMap")}
      >
        <ArrowLeft size={20} />
      </button>

      {/* Plan counter */}
      <div className="absolute top-4 right-4 z-50 rounded-full bg-black/40 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
        {currentIndex + 1} / {plans.length}
      </div>

      {/* Scrollable container */}
      <div
        ref={containerRef}
        className="no-scrollbar h-full scroll-smooth overscroll-none snap-y snap-mandatory overflow-y-scroll"
      >
        {plans.map((plan, index) => {
          const cat = CAT_META[plan.categorie_id] ?? { color: "#E8610A" };
          const isBoosted = boostedIds.has(plan.id);
          const isFavorited = favorites.includes(plan.id);
          const isVisible = Math.abs(index - currentIndex) <= 1;

          return (
            <div
              key={plan.id}
              className="relative h-screen w-full snap-start snap-always"
            >
              {/* Background image */}
              {isVisible && plan.image_url && (
                <Image
                  src={plan.image_url}
                  alt={plan.titre}
                  fill
                  className="object-cover"
                  sizes="100vw"
                  priority={index <= 1}
                />
              )}

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />

              {/* ─── Right side actions (TikTok-style) ─── */}
              <div className="absolute right-3 bottom-40 z-30 flex flex-col items-center gap-5 md:right-6">
                {/* Boost */}
                <button
                  onClick={() => handleBoost(plan.id)}
                  className="flex flex-col items-center gap-1"
                >
                  <div
                    className={cn(
                      "flex h-12 w-12 items-center justify-center rounded-full transition-all",
                      isBoosted
                        ? "bg-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary)]/40"
                        : "bg-white/15 text-white backdrop-blur-sm hover:bg-white/25"
                    )}
                  >
                    <Zap
                      size={22}
                      className={cn(isBoosted && "fill-white")}
                    />
                  </div>
                  <span className="text-xs font-semibold text-white">
                    {plan.boosts_count + (isBoosted ? 1 : 0)}
                  </span>
                </button>

                {/* Favorite */}
                <button
                  onClick={() => handleFavorite(plan.id)}
                  className="flex flex-col items-center gap-1"
                >
                  <div
                    className={cn(
                      "flex h-12 w-12 items-center justify-center rounded-full transition-all",
                      isFavorited
                        ? "bg-red-500 text-white shadow-lg shadow-red-500/40"
                        : "bg-white/15 text-white backdrop-blur-sm hover:bg-white/25"
                    )}
                  >
                    <Heart
                      size={22}
                      className={cn(isFavorited && "fill-white")}
                    />
                  </div>
                  <span className="text-xs font-semibold text-white">
                    {isFavorited ? "❤️" : ""}
                  </span>
                </button>

                {/* Comment */}
                <button
                  onClick={() => setCommentsPlan(plan)}
                  className="flex flex-col items-center gap-1"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm transition-all hover:bg-white/25 active:scale-95">
                    <MessageCircle size={22} />
                  </div>
                  <span className="text-xs font-semibold text-white">
                    {plan.comments_count}
                  </span>
                </button>

                {/* Share */}
                <button
                  onClick={() => handleShare(plan)}
                  className="flex flex-col items-center gap-1"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm hover:bg-white/25">
                    <Share2 size={22} />
                  </div>
                </button>
              </div>

              {/* ─── Bottom info overlay ─── */}
              <div className="absolute right-0 bottom-24 left-0 z-20 px-4 md:bottom-8 md:px-8">
                {/* Author */}
                {plan.author && (
                  <div className="mb-3 flex items-center gap-2">
                    <div className="relative h-9 w-9 overflow-hidden rounded-full border-2 border-white/50">
                      {plan.author.avatar_url ? (
                        <Image
                          src={plan.author.avatar_url}
                          alt={plan.author.nom}
                          fill
                          className="object-cover"
                          sizes="36px"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-[var(--color-primary)] text-xs font-bold text-white">
                          {plan.author.nom.charAt(0)}
                        </div>
                      )}
                    </div>
                    <span className="text-sm font-semibold text-white drop-shadow-md">
                      {plan.author.nom}
                    </span>
                  </div>
                )}

                {/* Title */}
                <h2 className="mb-2 text-xl font-bold leading-tight text-white drop-shadow-lg md:text-2xl">
                  {plan.titre}
                </h2>

                {/* Location + category */}
                <div className="mb-5 flex items-center gap-3">
                  <span className="flex items-center gap-1 text-xs text-white/80">
                    <MapPin size={12} />
                    {plan.ville}
                  </span>
                  <span
                    className="rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                    style={{
                      backgroundColor: `${cat.color}40`,
                      color: "white",
                    }}
                  >
                    {plan.category?.nom_fr ?? ""}
                  </span>
                </div>

                {/* Description */}
                <p className="line-clamp-2 text-sm leading-relaxed text-white/70">
                  {plan.description}
                </p>

                {/* View details link */}
                <Link
                  href={`/${locale}/plans/${plan.id}`}
                  className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-primary)] transition-all hover:gap-2.5"
                >
                  {t("viewPlan")} →
                </Link>
              </div>

              {/* Swipe hint — only on first card */}
              <AnimatePresence>
                {index === 0 && currentIndex === 0 && (
                  <motion.div
                    initial={{ opacity: 1, y: 0 }}
                    animate={{ y: [0, -8, 0] }}
                    transition={{
                      repeat: 3,
                      duration: 1.2,
                      delay: 1,
                    }}
                    exit={{ opacity: 0 }}
                    className="absolute bottom-6 left-1/2 z-30 flex -translate-x-1/2 flex-col items-center gap-1"
                  >
                    <ChevronUp size={20} className="text-white/60" />
                    <span className="text-[10px] font-medium text-white/50">
                      {t("swipeUp")}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
      {/* ═══ Comments Bottom Sheet ═══ */}
      <DiscoverCommentsSheet
        plan={commentsPlan}
        onClose={() => setCommentsPlan(null)}
      />
    </div>
  );
}
