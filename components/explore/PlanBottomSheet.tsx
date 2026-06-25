"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale } from "next-intl";
import { motion, AnimatePresence } from "motion/react";
import { MapPin, Zap, MessageCircle, X, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Plan } from "@/types";

const CATEGORY_META: Record<string, { color: string; label: string }> = {
  "cat-1": { color: "#E8610A", label: "Restauration" },
  "cat-2": { color: "#7C3AED", label: "Loisirs" },
  "cat-3": { color: "#059669", label: "Sorties" },
  "cat-4": { color: "#DC2626", label: "Shopping" },
  "cat-5": { color: "#2563EB", label: "Services" },
  "cat-6": { color: "#DB2777", label: "Santé" },
  "cat-7": { color: "#D97706", label: "Éducation" },
  "cat-8": { color: "#0891B2", label: "Sport" },
};

interface PlanBottomSheetProps {
  plan: Plan | null;
  onClose: () => void;
  viewLabel: string;
  boostsLabel: string;
  commentsLabel: string;
}

export function PlanBottomSheet({
  plan,
  onClose,
  viewLabel,
  boostsLabel,
  commentsLabel,
}: PlanBottomSheetProps) {
  const locale = useLocale();
  const cat = plan ? CATEGORY_META[plan.categorie_id] : null;

  return (
    <AnimatePresence>
      {plan && (
        <motion.div
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ type: "spring", damping: 28, stiffness: 300 }}
          className="absolute bottom-20 right-4 left-4 z-[1000] overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)] shadow-2xl md:bottom-6 md:right-6 md:left-auto md:w-[400px]"
        >
          {/* Handle bar */}
          <div className="flex justify-center pt-2">
            <div className="h-1 w-10 rounded-full bg-[var(--color-border)]" />
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-bg-surface)] text-[var(--color-text-tertiary)] transition-colors hover:bg-[var(--color-bg-card)] hover:text-[var(--color-text-primary)]"
          >
            <X size={16} />
          </button>

          <div className="flex gap-4 p-4">
            {/* Image */}
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl">
              {plan.image_url ? (
                <Image
                  src={plan.image_url}
                  alt={plan.titre}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              ) : (
                <div
                  className="flex h-full w-full items-center justify-center"
                  style={{ backgroundColor: `${cat?.color ?? "#E8610A"}20` }}
                >
                  <MapPin
                    size={28}
                    style={{ color: cat?.color ?? "#E8610A" }}
                  />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="min-w-0 flex-1">
              <h3 className="line-clamp-2 text-sm font-bold text-[var(--color-text-primary)]">
                {plan.titre}
              </h3>
              <div className="mt-1 flex items-center gap-1 text-xs text-[var(--color-text-tertiary)]">
                <MapPin size={12} />
                <span>{plan.ville}</span>
              </div>
              <div className="mt-2 flex items-center gap-3 text-xs text-[var(--color-text-tertiary)]">
                <span className="flex items-center gap-1">
                  <Zap size={12} className="text-[var(--color-primary)]" />
                  {plan.boosts_count} {boostsLabel}
                </span>
                <span className="flex items-center gap-1">
                  <MessageCircle size={12} />
                  {plan.comments_count} {commentsLabel}
                </span>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="px-4 pb-4">
            <Link
              href={`/${locale}/plans/${plan.id}`}
              className={cn(
                "flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white transition-all hover:brightness-110 active:scale-[0.98]"
              )}
              style={{ backgroundColor: cat?.color ?? "#E8610A" }}
            >
              {viewLabel}
              <ArrowRight size={16} />
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
