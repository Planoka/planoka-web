"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { Wallet, TrendingDown, TrendingUp, Check } from "lucide-react";
import { cn } from "@/lib/utils";

type StepBudgetProps = {
  onChange: (range: [number, number]) => void;
};

const BUDGET_PRESETS = [
  { label: "Économe", icon: TrendingDown, min: 0, max: 5000, color: "#059669", desc: "Plans gratuits et abordables" },
  { label: "Modéré", icon: Wallet, min: 0, max: 20000, color: "#E8610A", desc: "Bon rapport qualité-prix" },
  { label: "Premium", icon: TrendingUp, min: 0, max: 50000, color: "#7C3AED", desc: "Expériences haut de gamme" },
  { label: "Tous", icon: Wallet, min: 0, max: 100000, color: "#2563EB", desc: "Pas de limite de budget" },
] as const;

export function StepBudget({ onChange }: StepBudgetProps) {
  const t = useTranslations("onboarding");
  const [selectedPreset, setSelectedPreset] = useState<number | null>(1);

  const handlePreset = (index: number, min: number, max: number) => {
    setSelectedPreset(index);
    onChange([min, max]);
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6 sm:mb-8"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
          className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-primary-light)] sm:h-20 sm:w-20 sm:rounded-3xl"
        >
          <Wallet className="h-8 w-8 text-[var(--color-primary)] sm:h-10 sm:w-10" />
        </motion.div>

        <h2 className="text-xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-2xl">
          {t("budget.title")}
        </h2>
        <p className="mt-1.5 text-sm text-[var(--color-text-secondary)] sm:text-base">
          {t("budget.subtitle")}
        </p>
      </motion.div>

      <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
        {BUDGET_PRESETS.map((preset, i) => (
          <motion.button
            key={preset.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.06 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handlePreset(i, preset.min, preset.max)}
            className={cn(
              "relative flex flex-col items-center gap-2 rounded-xl border-2 p-3 text-center transition-all sm:rounded-2xl sm:p-5",
              selectedPreset === i
                ? "border-[var(--color-primary)] bg-[var(--color-primary-light)] shadow-sm"
                : "border-[var(--color-border)] bg-[var(--color-bg-card)] hover:border-[var(--color-primary)]/30"
            )}
          >
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl sm:h-12 sm:w-12"
              style={{ backgroundColor: `${preset.color}15` }}
            >
              <preset.icon className="h-5 w-5 sm:h-6 sm:w-6" style={{ color: preset.color }} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">{preset.label}</h3>
              <p className="mt-0.5 text-[11px] text-[var(--color-text-tertiary)] sm:text-xs">{preset.desc}</p>
            </div>
            {selectedPreset === i && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-primary)] sm:h-6 sm:w-6"
              >
                <Check className="h-3 w-3 text-white sm:h-3.5 sm:w-3.5" />
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-6 rounded-xl bg-[var(--color-bg-surface)] p-3 sm:rounded-2xl sm:p-4"
      >
        <p className="text-xs text-[var(--color-text-secondary)] sm:text-sm">
          {t("budget.hint")}
        </p>
      </motion.div>
    </div>
  );
}