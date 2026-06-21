"use client";

import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { Sparkles, Compass, MapPin } from "lucide-react";

export function StepWelcome() {
  const t = useTranslations("onboarding");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-[var(--color-primary)]"
      >
        <Compass className="h-12 w-12 text-white" />
      </motion.div>

      <h1 className="text-3xl font-bold tracking-tight text-[var(--color-text-primary)]">
        {t("welcome")}
      </h1>
      <p className="mt-3 text-base text-[var(--color-text-secondary)] leading-relaxed">
        Découvrez les meilleurs bons plans près de chez vous : restaurants, sorties, promotions,
        loisirs et bien plus encore. Rejoignez la communauté Planoka !
      </p>

      <div className="mt-10 space-y-3 text-left">
        {[
          { icon: Compass, text: "Explorez des centaines de bons plans vérifiés" },
          { icon: Sparkles, text: "Recevez des recommandations personnalisées" },
          { icon: MapPin, text: "Trouvez les meilleures adresses près de chez vous" },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.1 }}
            className="flex items-center gap-3 rounded-xl bg-[var(--color-bg-card)] p-3"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary-light)]">
              <item.icon className="h-5 w-5 text-[var(--color-primary)]" />
            </div>
            <span className="text-sm text-[var(--color-text-secondary)]">{item.text}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
