"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

const LANGUAGES = [
  { value: "fr", label: "Français", flag: "🇫🇷" },
  { value: "en", label: "English", flag: "🇬🇧" },
];

const THEMES = [
  { value: "light", icon: "☀️" },
  { value: "dark", icon: "🌙" },
  { value: "system", icon: "💻" },
];

export function StepPreferences() {
  const t = useTranslations();
  const [langue, setLangue] = useState("fr");
  const [theme, setTheme] = useState("system");

  return (
    <div>
      <h2 className="text-2xl font-bold text-[var(--color-text-primary)] text-center">
        {t("onboarding.step3")}
      </h2>
      <p className="mt-2 text-center text-sm text-[var(--color-text-secondary)]">
        Personnalisez votre expérience
      </p>

      <div className="mx-auto mt-10 max-w-sm">
        <p className="mb-3 text-sm font-medium text-[var(--color-text-primary)]">Langue préférée</p>
        <div className="grid grid-cols-2 gap-3">
          {LANGUAGES.map((lang) => (
            <motion.button
              key={lang.value}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setLangue(lang.value)}
              className={cn(
                "flex items-center gap-3 rounded-xl border-2 px-4 py-4 transition-all",
                langue === lang.value
                  ? "border-[var(--color-primary)] bg-[var(--color-primary-light)]"
                  : "border-transparent bg-[var(--color-bg-card)]",
              )}
            >
              <span className="text-xl">{lang.flag}</span>
              <span className="text-sm font-medium text-[var(--color-text-primary)]">{lang.label}</span>
              {langue === lang.value && <Check className="ml-auto h-4 w-4 text-[var(--color-primary)]" />}
            </motion.button>
          ))}
        </div>

        <p className="mb-3 mt-8 text-sm font-medium text-[var(--color-text-primary)]">Thème</p>
        <div className="grid grid-cols-3 gap-3">
          {THEMES.map((th) => (
            <motion.button
              key={th.value}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setTheme(th.value)}
              className={cn(
                "flex flex-col items-center gap-2 rounded-xl border-2 px-3 py-4 transition-all",
                theme === th.value
                  ? "border-[var(--color-primary)] bg-[var(--color-primary-light)]"
                  : "border-transparent bg-[var(--color-bg-card)]",
              )}
            >
              <span className="text-2xl">{th.icon}</span>
              <span className="text-xs font-medium text-[var(--color-text-secondary)]">
                {t(`theme.${th.value}`)}
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
