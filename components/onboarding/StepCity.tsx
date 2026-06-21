"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { MapPin, Check, Search } from "lucide-react";
import { CAMEROON_CITIES } from "@/lib/constants";
import { cn } from "@/lib/utils";

type StepCityProps = {
  selected: string | null;
  onSelect: (city: string | null) => void;
};

export function StepCity({ selected, onSelect }: StepCityProps) {
  const t = useTranslations("onboarding");
  const [search, setSearch] = useState("");

  const filtered = CAMEROON_CITIES.filter((city) =>
    city.toLowerCase().includes(search.toLowerCase()),
  );

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
          <MapPin className="h-10 w-10 text-[var(--color-primary)]" />
        </motion.div>

        <h2 className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">
          {t("city.title")}
        </h2>
        <p className="mt-2 text-base text-[var(--color-text-secondary)] leading-relaxed">
          {t("city.subtitle")}
        </p>
      </motion.div>

      <div className="relative mx-auto max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-tertiary)]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher une ville..."
          className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] py-3 pl-10 pr-4 text-sm text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-tertiary)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all"
        />
      </div>

      <div className="mt-4 grid max-w-sm mx-auto grid-cols-1 gap-2">
        {filtered.map((city, i) => (
          <motion.button
            key={city}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => onSelect(city)}
            className={cn(
              "flex items-center gap-3 rounded-xl border-2 px-4 py-3 transition-all",
              selected === city
                ? "border-[var(--color-primary)] bg-[var(--color-primary-light)] shadow-sm"
                : "border-transparent bg-[var(--color-bg-card)] hover:border-[var(--color-border-strong)]",
            )}
          >
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-lg transition-colors",
                selected === city ? "bg-[var(--color-primary)] text-white" : "bg-[var(--color-bg-surface)] text-[var(--color-text-tertiary)]",
              )}
            >
              {selected === city ? (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300 }}>
                  <Check className="h-5 w-5" />
                </motion.div>
              ) : (
                <MapPin className="h-5 w-5" />
              )}
            </div>
            <span className="text-sm font-medium text-[var(--color-text-primary)]">{city}</span>
          </motion.button>
        ))}
        {filtered.length === 0 && (
          <p className="py-8 text-center text-sm text-[var(--color-text-tertiary)]">
            Aucune ville trouvée
          </p>
        )}
      </div>
    </div>
  );
}
