"use client";

import Link from "next/link";
import Image from "next/image";
import { useLocale } from "next-intl";
import { MapPin, Heart, Play, MessageCircle, Share2, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import type { Plan } from "@/types";

type PlanCardProps = {
  plan: Plan;
};

const CATEGORY_META: Record<string, { color: string; name: string }> = {
  "cat-1": { color: "#E8610A", name: "Restauration" },
  "cat-2": { color: "#7C3AED", name: "Loisirs" },
  "cat-3": { color: "#059669", name: "Sorties" },
  "cat-4": { color: "#DC2626", name: "Shopping" },
  "cat-5": { color: "#2563EB", name: "Services" },
  "cat-6": { color: "#DB2777", name: "Santé" },
  "cat-7": { color: "#D97706", name: "Éducation" },
  "cat-8": { color: "#0891B2", name: "Sport" },
};

// Pinterest-like varied heights based on content
const HEIGHT_CLASSES = [
  "h-[320px]",
  "h-[280px]",
  "h-[360px]",
  "h-[300px]",
  "h-[340px]",
  "h-[260px]",
];

function getCategoryMeta(categorieId: string) {
  return CATEGORY_META[categorieId] ?? { color: "#E8610A", name: "Plan" };
}

export function PlanCard({ plan }: PlanCardProps) {
  const locale = useLocale();
  const cat = getCategoryMeta(plan.categorie_id);
  const [favorited, setFavorited] = useState(false);
  const [boosted, setBoosted] = useState(plan.is_boosted ?? false);
  const [boostCount, setBoostCount] = useState(plan.boosts_count);

  // Deterministic height based on id for Pinterest masonry
  const heightIndex = plan.id.charCodeAt(plan.id.length - 1) % HEIGHT_CLASSES.length;
  const heightClass = HEIGHT_CLASSES[heightIndex];

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorited(!favorited);
  };

  const handleBoost = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (boosted) {
      setBoosted(false);
      setBoostCount((c) => Math.max(0, c - 1));
    } else {
      setBoosted(true);
      setBoostCount((c) => c + 1);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.4 }}
      className="break-inside-avoid mb-4"
    >
      <Link
        href={`/${locale}/plans/${plan.id}`}
        className={`group relative flex overflow-hidden rounded-2xl bg-[var(--color-bg-card)] transition-shadow hover:shadow-lg ${heightClass}`}
      >
        {plan.image_url ? (
          <Image
            src={plan.image_url}
            alt={plan.titre}
            fill
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary-light)] to-[var(--color-bg-surface)]" />
        )}

        {/* Gradient overlay — exactly like mobile app */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

        {/* Featured badge */}
        {plan.is_featured && (
          <span className="absolute left-3 top-3 z-10 rounded-md bg-[var(--color-primary)] px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-white shadow-sm">
            En vedette
          </span>
        )}

        {/* Favorite button — top right, white circle like mobile */}
        <button
          onClick={handleFavorite}
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm transition-all hover:scale-110 active:scale-90"
          aria-label={favorited ? "Retirer des favoris" : "Ajouter aux favoris"}
        >
          <Heart
            className={`h-[18px] w-[18px] transition-colors ${
              favorited ? "fill-red-500 text-red-500" : "text-gray-700"
            }`}
          />
        </button>

        {/* Video duration badge */}
        {plan.video_url && (
          <span className="absolute right-3 top-14 z-10 flex items-center gap-1 rounded-md bg-black/70 px-2 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
            <Play className="h-3 w-3 fill-white" />
            1:42
          </span>
        )}

        {/* Bottom info section */}
        <div className="absolute bottom-0 left-0 right-0 z-10 p-4">
          {/* Category badge */}
          <div className="mb-2 inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider backdrop-blur-sm"
            style={{ backgroundColor: `${cat.color}30`, color: cat.color }}
          >
            {cat.name}
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold leading-tight text-white drop-shadow-sm">
            {plan.titre}
          </h3>

          {/* City + Date */}
          <div className="mt-1 flex items-center gap-1 text-[12px] text-white/75">
            <MapPin className="h-3 w-3" />
            <span>{plan.ville}</span>
          </div>

          {/* Action buttons row — boost count + icons like mobile app */}
          <div className="mt-3 flex items-center justify-between">
            {/* Boost count */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleBoost}
                className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold transition-all ${
                  boosted
                    ? "bg-[var(--color-primary)] text-white"
                    : "bg-white/20 text-white/90 backdrop-blur-sm hover:bg-white/30"
                }`}
                aria-label="Booster"
              >
                <Zap className={`h-3.5 w-3.5 ${boosted ? "fill-white" : ""}`} />
                {boostCount}
              </button>
            </div>

            {/* Comment + Share icons */}
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-[11px] text-white/70">
                <MessageCircle className="h-3.5 w-3.5" />
                {plan.comments_count}
              </span>
              <span className="flex items-center gap-1 text-[11px] text-white/70">
                <Share2 className="h-3.5 w-3.5" />
                {plan.shares_count}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
