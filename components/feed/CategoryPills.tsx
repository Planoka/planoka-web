"use client";

import { useTranslations } from "next-intl";
import { CATEGORIES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import {
  UtensilsCrossed, Gamepad2, Music, ShoppingBag,
  Briefcase, Heart, BookOpen, Dumbbell,
  type LucideIcon,
} from "lucide-react";
import { motion } from "motion/react";

const iconMap: Record<string, LucideIcon> = {
  UtensilsCrossed, Gamepad2, Music, ShoppingBag,
  Briefcase, Heart, BookOpen, Dumbbell,
};

type CategoryPillsProps = {
  selected: string | null;
  onSelect: (slug: string | null) => void;
};

export function CategoryPills({ selected, onSelect }: CategoryPillsProps) {
  const t = useTranslations("categories");

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
      <button
        onClick={() => onSelect(null)}
        className={cn(
          "flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all",
          selected === null
            ? "bg-[var(--color-primary)] text-white"
            : "bg-[var(--color-bg-surface)] text-[var(--color-text-secondary)] hover:bg-[var(--color-primary-light)] hover:text-[var(--color-primary)]",
        )}
      >
        Tous
      </button>
      {CATEGORIES.map((cat) => {
        const Icon = iconMap[cat.icon];
        const isSelected = selected === cat.slug;
        return (
          <motion.button
            key={cat.slug}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(isSelected ? null : cat.slug)}
            className={cn(
              "flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all",
              isSelected
                ? "text-white"
                : "bg-[var(--color-bg-surface)] text-[var(--color-text-secondary)] hover:bg-[var(--color-primary-light)]",
            )}
            style={isSelected ? { backgroundColor: cat.color } : undefined}
          >
            {Icon && <Icon className="h-4 w-4" />}
            {t(cat.slug)}
          </motion.button>
        );
      })}
    </div>
  );
}
