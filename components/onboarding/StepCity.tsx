"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { MapPin, Check, Search } from "lucide-react";
import { CAMEROON_CITIES } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function StepCity() {
  const t = useTranslations("onboarding");
  const [selected, setSelected] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const filtered = CAMEROON_CITIES.filter((city) =>
    city.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      <h2 className="text-2xl font-bold text-[var(--color-text-primary)] text-center">
        {t("step2")}
      </h2>
      <p className="mt-2 text-center text-sm text-[var(--color-text-secondary)]">
        Recevez les bons plans autour de votre ville
      </p>

      <div className="relative mx-auto mt-8 max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-tertiary)]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher une ville..."
          className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] py-3 pl-10 pr-4 text-sm text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-tertiary)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
        />
      </div>

      <div className="mx-auto mt-4 grid max-w-sm grid-cols-1 gap-2">
        {filtered.map((city) => (
          <motion.button
            key={city}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => setSelected(city)}
            className={cn(
              "flex items-center gap-3 rounded-xl border-2 px-4 py-3 transition-all",
              selected === city
                ? "border-[var(--color-primary)] bg-[var(--color-primary-light)]"
                : "border-transparent bg-[var(--color-bg-card)] hover:border-[var(--color-border-strong)]",
            )}
          >
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-lg",
                selected === city ? "bg-[var(--color-primary)] text-white" : "bg-[var(--color-bg-surface)] text-[var(--color-text-tertiary)]",
              )}
            >
              {selected === city ? <Check className="h-5 w-5" /> : <MapPin className="h-5 w-5" />}
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
