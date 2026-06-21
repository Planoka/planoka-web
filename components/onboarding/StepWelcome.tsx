"use client";

import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { Sparkles, Compass, MapPin, TrendingUp } from "lucide-react";

export function StepWelcome() {
  const t = useTranslations("onboarding");

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
          className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-hover)] shadow-lg shadow-[var(--color-primary)]/30"
        >
          <Compass className="h-10 w-10 text-white" />
        </motion.div>

        <h2 className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">
          {t("welcome")}
        </h2>
        <p className="mt-2 text-base text-[var(--color-text-secondary)] leading-relaxed max-w-sm mx-auto">
          {t("welcomeDesc")}
        </p>
      </motion.div>

      <div className="space-y-3">
        {[
          { icon: Compass, textKey: "welcomeFeatures.explore", color: "#E8610A" },
          { icon: Sparkles, textKey: "welcomeFeatures.recommendations", color: "#7C3AED" },
          { icon: MapPin, textKey: "welcomeFeatures.local", color: "#059669" },
          { icon: TrendingUp, textKey: "welcomeFeatures.boost", color: "#DC2626" },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + i * 0.08 }}
            className="flex items-center gap-4 rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border)] p-4 transition-all hover:shadow-md"
          >
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
              style={{ backgroundColor: `${item.color}15` }}
            >
              <item.icon className="h-5 w-5" style={{ color: item.color }} />
            </div>
            <span className="text-sm font-medium text-[var(--color-text-primary)]">{t(item.textKey)}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
