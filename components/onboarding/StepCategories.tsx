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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
          className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-[var(--color-primary-light)]"
        >
          <Heart className="h-10 w-10 text-[var(--color-primary)]" />
        </motion.div>

        <h2 className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">
          {t("onboarding.step1")}
        </h2>
        <p className="mt-2 text-base text-[var(--color-text-secondary)] leading-relaxed">
          {t("onboarding.minCategories")} &bull; {t("onboarding.maxCategories")}
        </p>
      </motion.div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {CATEGORIES.map((cat, i) => {
          const Icon = iconMap[cat.icon];
          const isSelected = selected.includes(cat.slug);
          return (
            <motion.button
              key={cat.slug}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05, type: "spring", stiffness: 300 }}
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => toggle(cat.slug)}
              className={cn(
                "relative flex flex-col items-center gap-2 rounded-2xl border-2 p-4 text-center transition-all",
                isSelected
                  ? "border-transparent text-white shadow-lg"
                  : "border-[var(--color-border)] bg-[var(--color-bg-card)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)]/30 hover:shadow-md",
              )}
              style={isSelected ? { backgroundColor: cat.color, boxShadow: `0 8px 20px ${cat.color}40` } : undefined}
            >
              {Icon && (
                <div
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-xl transition-colors",
                    isSelected ? "bg-white/20" : "bg-[var(--color-bg-surface)]",
                  )}
                >
                  <Icon className="h-6 w-6" />
                </div>
              )}
              <span className="text-xs font-medium">{t(`categories.${cat.slug}`)}</span>
              {isSelected && (
                <motion.div
                  initial={{ scale: 0, y: -10 }}
                  animate={{ scale: 1, y: 0 }}
                  className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[10px] font-bold"
                  style={{ color: cat.color }}
                >
                  {selected.indexOf(cat.slug) + 1}
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-6 text-center"
      >
        <div className="mx-auto flex items-center justify-center gap-2">
          <div className="h-2 w-2 rounded-full bg-[var(--color-primary)]" />
          <p className="text-sm font-medium text-[var(--color-text-primary)]">
            {selected.length}/8 sélectionné{selected.length !== 1 ? "s" : ""}
          </p>
        </div>
        {selected.length < 3 && (
          <p className="mt-1 text-xs text-[var(--color-text-tertiary)]">
            Sélectionnez au moins 3 pour continuer
          </p>
        )}
      </motion.div>
    </div>
  );
}
