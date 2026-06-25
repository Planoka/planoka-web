"use client";

import { useTranslations } from "next-intl";
import {
  UtensilsCrossed,
  Gamepad2,
  Music,
  ShoppingBag,
  Briefcase,
  Heart,
  BookOpen,
  Dumbbell,
} from "lucide-react";
import { cn } from "@/lib/utils";

const CATEGORY_FILTERS = [
  { id: "all", slug: "all", color: "#E8610A", icon: null },
  { id: "cat-1", slug: "restauration", color: "#E8610A", icon: UtensilsCrossed },
  { id: "cat-2", slug: "loisirs", color: "#7C3AED", icon: Gamepad2 },
  { id: "cat-3", slug: "sorties", color: "#059669", icon: Music },
  { id: "cat-4", slug: "shopping", color: "#DC2626", icon: ShoppingBag },
  { id: "cat-5", slug: "services", color: "#2563EB", icon: Briefcase },
  { id: "cat-6", slug: "sante", color: "#DB2777", icon: Heart },
  { id: "cat-7", slug: "education", color: "#D97706", icon: BookOpen },
  { id: "cat-8", slug: "sport", color: "#0891B2", icon: Dumbbell },
] as const;

interface CategoryFilterProps {
  selected: string;
  onSelect: (id: string) => void;
  variant?: "solid" | "glass";
  className?: string;
}

export function CategoryFilter({
  selected,
  onSelect,
  variant = "solid",
  className,
}: CategoryFilterProps) {
  const t = useTranslations("explore");
  const tCat = useTranslations("categories");

  return (
    <div
      className={cn(
        "no-scrollbar flex gap-2 overflow-x-auto px-4 py-3",
        className
      )}
    >
      {CATEGORY_FILTERS.map((cat) => {
        const isActive = selected === cat.id;
        const Icon = cat.icon;
        const label =
          cat.id === "all"
            ? t("all")
            : tCat(
                cat.slug as
                  | "restauration"
                  | "loisirs"
                  | "sorties"
                  | "shopping"
                  | "services"
                  | "sante"
                  | "education"
                  | "sport"
              );

        if (variant === "glass") {
          return (
            <button
              key={cat.id}
              onClick={() => onSelect(cat.id)}
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold backdrop-blur-md transition-all",
                isActive
                  ? "bg-[var(--color-primary)] text-white shadow-lg"
                  : "bg-white/15 text-white hover:bg-white/25"
              )}
            >
              {Icon && <Icon size={14} />}
              {label}
            </button>
          );
        }

        return (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className={cn(
              "flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-semibold transition-all",
              isActive
                ? "border-transparent text-white shadow-sm"
                : "border-[var(--color-border)] bg-[var(--color-bg-card)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)]/30 hover:text-[var(--color-primary)]"
            )}
            style={{
              backgroundColor: isActive ? cat.color : undefined,
            }}
          >
            {Icon && <Icon size={14} />}
            {label}
          </button>
        );
      })}
    </div>
  );
}

export { CATEGORY_FILTERS };
