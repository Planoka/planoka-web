"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import { MapPin, Star, Heart, Play } from "lucide-react";
import { motion } from "motion/react";
import type { Plan } from "@/types";
import { cn } from "@/lib/utils";

type PlanCardProps = {
  plan: Plan;
  featured?: boolean;
};

function getCategoryMeta(plan: Plan) {
  const colors: Record<string, string> = {
    "cat-1": "#E8610A", "cat-2": "#7C3AED", "cat-3": "#059669",
    "cat-4": "#DC2626", "cat-5": "#2563EB", "cat-6": "#DB2777",
    "cat-7": "#D97706", "cat-8": "#0891B2",
  };
  const names: Record<string, string> = {
    "cat-1": "Restauration", "cat-2": "Loisirs", "cat-3": "Sorties",
    "cat-4": "Shopping", "cat-5": "Services", "cat-6": "Santé",
    "cat-7": "Éducation", "cat-8": "Sport",
  };
  return { color: colors[plan.categorie_id] ?? "#E8610A", name: names[plan.categorie_id] ?? "Plan" };
}

export function PlanCard({ plan, featured = false }: PlanCardProps) {
  const locale = useLocale();
  const cat = getCategoryMeta(plan);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4 }}
    >
      <Link
        href={`/${locale}/plans/${plan.id}`}
        className={cn(
          "group relative flex overflow-hidden rounded-xl bg-[var(--color-bg-card)] transition-shadow hover:shadow-lg",
          featured ? "h-[280px] sm:h-[320px]" : "h-[240px] sm:h-[260px]",
        )}
      >
        <div className="absolute inset-0">
          <img
            src={plan.image_url ?? ""}
            alt={plan.titre}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            loading="lazy"
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {plan.is_featured && (
          <span className="absolute left-3 top-3 rounded-md bg-[var(--color-primary)] px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-white">
            En vedette
          </span>
        )}

        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm transition-transform hover:scale-110 active:scale-90"
          aria-label="Ajouter aux favoris"
        >
          <Heart className="h-4 w-4 text-gray-700 transition-colors hover:text-red-500" />
        </button>

        {plan.video_url && (
          <span className="absolute bottom-20 right-3 flex items-center gap-1 rounded-md bg-black/60 px-2 py-1 text-[11px] text-white">
            <Play className="h-3 w-3 fill-white" />
            1:42
          </span>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <span
            className="mb-1.5 inline-block rounded-sm px-2 py-0.5 text-[11px] font-medium"
            style={{ backgroundColor: `${cat.color}20`, color: cat.color }}
          >
            {cat.name}
          </span>

          <h3 className="text-base font-bold leading-tight text-white drop-shadow-sm sm:text-lg">
            {plan.titre}
          </h3>

          <div className="mt-1 flex items-center gap-3 text-xs text-white/70">
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {plan.ville}
            </span>
            <span className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-[var(--color-primary)] text-[var(--color-primary)]" />
              {plan.boosts_count}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
