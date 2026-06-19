"use client";

import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { CATEGORIES } from "@/lib/constants";
import {
  UtensilsCrossed, Gamepad2, Music, ShoppingBag,
  Briefcase, Heart, BookOpen, Dumbbell,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap: Record<string, LucideIcon> = {
  UtensilsCrossed, Gamepad2, Music, ShoppingBag,
  Briefcase, Heart, BookOpen, Dumbbell,
};

type StepCategoriesProps = {
  selected: string[];
  onSelect: (categories: string[]) => void;
};

export function StepCategories({ selected, onSelect }: StepCategoriesProps) {
  const t = useTranslations();

  const toggle = (slug: string) => {
    if (selected.includes(slug)) {
      onSelect(selected.filter((s) => s !== slug));
    } else if (selected.length < 8) {
      onSelect([...selected, slug]);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-[var(--color-text-primary)] text-center">
        {t("onboarding.step1")}
      </h2>
      <p className="mt-2 text-center text-sm text-[var(--color-text-secondary)]">
        {t("onboarding.minCategories")} &bull; {t("onboarding.maxCategories")}
      </p>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {CATEGORIES.map((cat) => {
          const Icon = iconMap[cat.icon];
          const isSelected = selected.includes(cat.slug);
          return (
            <motion.button
              key={cat.slug}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => toggle(cat.slug)}
              className={cn(
                "flex flex-col items-center gap-2 rounded-2xl border-2 p-4 text-center transition-all",
                isSelected
                  ? "border-transparent text-white"
                  : "border-[var(--color-border)] bg-[var(--color-bg-card)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)]/30",
              )}
              style={isSelected ? { backgroundColor: cat.color, borderColor: cat.color } : undefined}
            >
              {Icon && (
                <div
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-xl",
                    isSelected ? "bg-white/20" : "bg-[var(--color-bg-surface)]",
                  )}
                >
                  <Icon className="h-6 w-6" />
                </div>
              )}
              <span className="text-xs font-medium">{t(`categories.${cat.slug}`)}</span>
              {isSelected && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="-mt-1 text-[10px] font-semibold text-white/80"
                >
                  {selected.indexOf(cat.slug) + 1}
                </motion.span>
              )}
            </motion.button>
          );
        })}
      </div>

      <p className="mt-6 text-center text-xs text-[var(--color-text-tertiary)]">
        {selected.length}/8 sélectionné{selected.length !== 1 ? "s" : ""}
      </p>
    </div>
  );
}
