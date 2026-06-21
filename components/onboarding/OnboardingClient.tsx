"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, ArrowRight, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { StepWelcome } from "./StepWelcome";
import { StepCategories } from "./StepCategories";
import { StepCity } from "./StepCity";
import { StepNotifications } from "./StepNotifications";
import { StepBudget } from "./StepBudget";
import { cn } from "@/lib/utils";

const STEPS = ["welcome", "categories", "city", "notifications", "budget"] as const;

export function OnboardingClient() {
  const t = useTranslations("onboarding");
  const locale = useLocale();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [notifications, setNotifications] = useState({
    push: true,
    email: false,
    weekly: true,
    deals: true,
  });
  const [budgetRange, setBudgetRange] = useState<[number, number]>([0, 50000]);

  const currentStep = STEPS[step];
  const progress = ((step + 1) / STEPS.length) * 100;
  const isFirst = step === 0;
  const isLast = step === STEPS.length - 1;

  const canProceed = () => {
    if (currentStep === "categories") return selectedCategories.length >= 3;
    if (currentStep === "city") return selectedCity !== null;
    return true;
  };

  const handleNext = () => {
    if (isLast) {
      const onboardingData = {
        categories: selectedCategories,
        city: selectedCity,
        notifications,
        budgetRange,
        completed: true,
      };
      localStorage.setItem("planoka-onboarding", JSON.stringify(onboardingData));
      router.push(`/${locale}`);
      return;
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const handleBack = () => {
    setStep((s) => Math.max(s - 1, 0));
  };

  const handleSkip = () => {
    router.push(`/${locale}`);
  };

  const stepLabels = [
    t("stepLabels.welcome"),
    t("stepLabels.categories"),
    t("stepLabels.city"),
    t("stepLabels.notifications"),
    t("stepLabels.budget"),
  ];

  return (
    <div className="flex min-h-dvh flex-col bg-[var(--color-bg-page)]">
      {/* Progress Bar — fixed top, below navbar height */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-[var(--color-bg-page)] border-b border-[var(--color-border)]">
        {/* Thin progress bar */}
        <div className="h-1 w-full bg-[var(--color-border)]">
          <motion.div
            className="h-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-hover)]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>

        {/* Step dots — compact on mobile */}
        <div className="flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3">
          {STEPS.map((_, index) => (
            <div key={index} className="flex items-center gap-2">
              <motion.div
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all sm:h-8 sm:w-8",
                  index < step
                    ? "bg-[var(--color-primary)] text-white"
                    : index === step
                    ? "bg-[var(--color-primary)] text-white ring-4 ring-[var(--color-primary)]/20"
                    : "bg-[var(--color-bg-card)] text-[var(--color-text-tertiary)] border border-[var(--color-border)]"
                )}
              >
                {index < step ? <Check className="h-3.5 w-3.5" /> : index + 1}
              </motion.div>
              {/* Label hidden on mobile, visible on sm+ */}
              <span className={cn(
                "hidden text-xs font-medium sm:inline",
                index <= step ? "text-[var(--color-text-primary)]" : "text-[var(--color-text-tertiary)]"
              )}>
                {stepLabels[index]}
              </span>
              {index < STEPS.length - 1 && (
                <div className={cn(
                  "hidden sm:block h-px w-6 transition-colors",
                  index < step ? "bg-[var(--color-primary)]" : "bg-[var(--color-border)]"
                )} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main content — scrollable, padded for fixed top and bottom */}
      <div className="flex-1 overflow-y-auto pt-[88px] pb-[88px] sm:pt-[96px] sm:pb-[96px]">
        <div className="flex min-h-full items-start justify-center px-4 py-6 sm:items-center sm:py-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="w-full max-w-md"
            >
              {currentStep === "welcome" && <StepWelcome />}
              {currentStep === "categories" && (
                <StepCategories selected={selectedCategories} onSelect={setSelectedCategories} />
              )}
              {currentStep === "city" && (
                <StepCity selected={selectedCity} onSelect={setSelectedCity} />
              )}
              {currentStep === "notifications" && (
                <StepNotifications notifications={notifications} onChange={setNotifications} />
              )}
              {currentStep === "budget" && <StepBudget onChange={setBudgetRange} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom nav — fixed, above tabbar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-[var(--color-border)] bg-[var(--color-bg-card)] px-4 py-3 sm:px-6 sm:py-4">
        <div className="mx-auto flex max-w-md items-center justify-between gap-3">
          {!isFirst ? (
            <Button
              variant="ghost"
              onClick={handleBack}
              className="gap-1.5 text-sm hover:bg-[var(--color-bg-surface)]"
            >
              <ArrowLeft className="h-4 w-4" />
              {t("back")}
            </Button>
          ) : (
            <Button
              variant="ghost"
              onClick={handleSkip}
              className="text-sm text-[var(--color-text-tertiary)] hover:bg-[var(--color-bg-surface)]"
            >
              {t("skip")}
            </Button>
          )}

          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className={cn(
              "gap-1.5 h-11 min-w-[140px] flex-1 max-w-[200px] rounded-xl text-sm font-semibold transition-all",
              "bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-hover)]",
              "text-white shadow-[0_4px_14px_0_rgba(232,97,10,0.35)]",
              "disabled:opacity-40 disabled:shadow-none"
            )}
          >
            {isLast ? (
              <>{t("finish")}<Check className="h-4 w-4" /></>
            ) : (
              <>{t("next")}<ArrowRight className="h-4 w-4" /></>
            )}
          </Button>
        </div>
      </div>

      {/* Right side: Mascot — desktop only */}
      <div className="hidden lg:flex fixed top-0 right-0 bottom-0 w-1/2 flex-col items-center justify-center bg-gradient-to-br from-[var(--color-primary-light)] via-[var(--color-bg-page)] to-[var(--color-primary-light)] overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--color-primary)]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[var(--color-primary)]/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3" />

        <motion.div
          animate={{ y: [0, -15, 0], scale: [1, 1.02, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="relative w-[380px] h-[380px] z-10"
        >
          <Image src="/images/mascot.png" alt="Planoka Mascot" fill className="object-contain drop-shadow-2xl" priority />
        </motion.div>

        <div className="mt-8 text-center z-10 max-w-xs px-4">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-primary)]/10 mx-auto">
            <Sparkles className="h-6 w-6 text-[var(--color-primary)]" />
          </div>
          <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">Bienvenue sur Planoka !</h2>
          <p className="mt-2 text-[var(--color-text-secondary)]">
            Personnalisez votre expérience pour découvrir les meilleurs plans près de chez vous.
          </p>
        </div>
      </div>
    </div>
  );
}