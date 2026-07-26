"use client";

import Link from "next/link";
import Image from "next/image";
import { useLocale } from "next-intl";
import { MapPin, Heart, MessageCircle, Share2, Zap, MoreVertical } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { useStore } from "@/store/useStore";
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

// Hauteurs desktop (gardées augmentées)
const HEIGHT_CLASSES = [
  "md:h-[340px]",
  "md:h-[300px]",
  "md:h-[380px]",
  "md:h-[320px]",
  "md:h-[360px]",
  "md:h-[280px]",
];

function getCategoryMeta(categorieId: string) {
  return CATEGORY_META[categorieId] ?? { color: "#E8610A", name: "Plan" };
}

export function PlanCard({ plan }: PlanCardProps) {
  const locale = useLocale();
  const cat = getCategoryMeta(plan.categorie_id);
  const toggleFavorite = useStore((s) => s.toggleFavorite);
  const favorited = useStore((s) => s.favorites.includes(plan.id));
  const [boosted, setBoosted] = useState(plan.is_boosted ?? false);
  const [boostCount, setBoostCount] = useState(plan.boosts_count);

  const heightIndex = plan.id.charCodeAt(plan.id.length - 1) % HEIGHT_CLASSES.length;
  const heightClass = HEIGHT_CLASSES[heightIndex];

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(plan.id);
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
      className="mb-4 w-full break-inside-avoid"
    >
      <Link
        href={`/${locale}/plans/${plan.id}`}
        className={`group relative flex w-full overflow-hidden rounded-[2rem] bg-[var(--color-bg-card)] shadow-2xl
          h-[calc(100vh-240px)] min-h-[380px]
          md:h-[340px] md:min-h-0 md:rounded-2xl md:shadow-sm ${heightClass}`}
      >
        {plan.image_url ? (
          <Image
            src={plan.image_url}
            alt={plan.titre}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 md:duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary-light)] to-[var(--color-bg-surface)]" />
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 via-[40%] to-transparent md:from-black/60" />

        {/* ═══ TOP SECTION ═══ */}
        <div className="absolute top-0 left-0 right-0 z-10 p-4 sm:p-5">
          <div className="flex items-start justify-between">
            <div>
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg backdrop-blur-md"
                style={{ backgroundColor: `${cat.color}E6` }}
              >
                {cat.name}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleFavorite}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm transition-all hover:scale-110 active:scale-90 shadow-lg"
                aria-label={favorited ? "Retirer des favoris" : "Ajouter aux favoris"}
              >
                <Heart
                  className={`h-5 w-5 transition-colors ${
                    favorited ? "fill-red-500 text-red-500" : "text-gray-800"
                  }`}
                />
              </button>

              <button
                className="flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-all hover:bg-black/70 hover:scale-110 active:scale-90"
                aria-label="Plus d'options"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <MoreVertical className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* ═══ BOTTOM INFO SECTION ═══ */}
        <div className="absolute bottom-0 left-0 right-0 z-10 p-4 pb-5 sm:p-5 sm:pb-6">
          <div className="mb-2 flex items-center gap-2">
            <div className="h-7 w-7 overflow-hidden rounded-full bg-[var(--color-bg-surface)]">
              {plan.author?.avatar_url ? (
                <Image
                  src={plan.author.avatar_url}
                  alt={plan.author.nom}
                  width={28}
                  height={28}
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-[var(--color-primary)] text-xs font-bold text-white">
                  {plan.author?.nom?.charAt(0) || "U"}
                </div>
              )}
            </div>
            <span className="text-sm font-semibold text-white drop-shadow-md">
              {plan.author?.nom || "Utilisateur"}
            </span>
          </div>

          <h3 className="mb-1 text-xl font-bold leading-tight text-white drop-shadow-lg sm:text-2xl">
            {plan.titre}
          </h3>

          <div className="mb-4 flex items-center gap-1.5 text-sm text-white/90">
            <MapPin className="h-4 w-4" />
            <span>{plan.ville}</span>
          </div>

          <div className="flex items-center justify-between border-t border-white/20 pt-3">
            <button
              onClick={handleBoost}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold transition-all ${
                boosted
                  ? "bg-[var(--color-primary)] text-white"
                  : "bg-white/20 text-white backdrop-blur-md hover:bg-white/30"
              }`}
              aria-label="Booster"
            >
              <Zap className={`h-4 w-4 ${boosted ? "fill-white" : ""}`} />
              <span>{boostCount}</span>
            </button>

            <span className="flex items-center gap-1.5 text-sm font-medium text-white/90">
              <MessageCircle className="h-4 w-4" />
              {plan.comments_count}
            </span>

            <span className="flex items-center gap-1.5 text-sm font-medium text-white/90">
              <Share2 className="h-4 w-4" />
              {plan.shares_count}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}