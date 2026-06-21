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
      // Save onboarding data to localStorage or send to API
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
    <div className="flex min-h-screen flex-col lg:flex-row bg-[var(--color-bg-page)]">
      {/* Left side: Form content */}
      <div className="flex-1 flex flex-col relative z-10 lg:w-full lg:max-w-2xl">
        {/* Progress Bar & Step Indicators */}
        <div className="fixed lg:absolute left-0 right-0 top-0 z-50 bg-[var(--color-bg-page)] px-6 pb-2 pt-6 lg:pt-10">
          {/* Progress Bar */}
          <div className="mx-auto flex h-2 max-w-md overflow-hidden rounded-full bg-[var(--color-border)] lg:mx-0 lg:max-w-xl">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-hover)]"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
          
          {/* Step Indicators */}
          <div className="mx-auto mt-4 flex max-w-md items-center justify-between lg:mx-0 lg:max-w-xl">
            {STEPS.map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                className="relative flex flex-col items-center gap-1"
              >
                <div
                  className={cn(
                    "relative flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all",
                    index < step
                      ? "bg-[var(--color-primary)] border-[var(--color-primary)] text-white"
                      : index === step
                      ? "bg-[var(--color-bg-page)] border-[var(--color-primary)] text-[var(--color-primary)] ring-4 ring-[var(--color-primary)]/20"
                      : "bg-[var(--color-bg-card)] border-[var(--color-border)] text-[var(--color-text-tertiary)]"
                  )}
                >
                  {index < step ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-bold">{index + 1}</span>
                  )}
                </div>
                <span className={cn(
                  "text-[11px] font-medium whitespace-nowrap transition-colors",
                  index <= step
                    ? "text-[var(--color-text-primary)]"
                    : "text-[var(--color-text-tertiary)]"
                )}>
                  {stepLabels[index]}
                </span>
                {index < STEPS.length - 1 && (
                  <motion.div
                    className="absolute top-5 left-full w-full h-0.5 -translate-y-1/2 bg-[var(--color-border)]"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: index < step ? 1 : 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    style={{ transformOrigin: "left center" }}
                  />
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="flex flex-1 items-center justify-center px-6 py-20 lg:py-0 lg:justify-start lg:pl-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 40, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -40, scale: 0.95 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="w-full max-w-md"
            >
              {currentStep === "welcome" && <StepWelcome />}
              {currentStep === "categories" && (
                <StepCategories
                  selected={selectedCategories}
                  onSelect={setSelectedCategories}
                />
              )}
              {currentStep === "city" && (
                <StepCity selected={selectedCity} onSelect={setSelectedCity} />
              )}
              {currentStep === "notifications" && (
                <StepNotifications
                  notifications={notifications}
                  onChange={setNotifications}
                />
              )}
              {currentStep === "budget" && <StepBudget budgetRange={budgetRange} onChange={setBudgetRange} />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Buttons */}
        <div className="fixed lg:absolute bottom-0 left-0 right-0 lg:right-auto lg:w-full border-t border-[var(--color-border)] bg-[var(--color-bg-card)] px-6 py-4 lg:px-0">
          <div className="mx-auto flex max-w-md lg:max-w-xl items-center justify-between gap-3">
            {!isFirst ? (
              <Button
                variant="ghost"
                onClick={handleBack}
                className="gap-1.5 hover:bg-[var(--color-bg-surface)]"
              >
                <ArrowLeft className="h-4 w-4" />
                {t("back")}
              </Button>
            ) : (
              <Button
                variant="ghost"
                onClick={handleSkip}
                className="text-[var(--color-text-tertiary)] hover:bg-[var(--color-bg-surface)]"
              >
                {t("skip")}
              </Button>
            )}

            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className={cn(
                "gap-1.5 flex-1 max-w-[200px] transition-all",
                "bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-hover)]",
                "hover:from-[var(--color-primary-hover)] hover:to-[var(--color-primary)]",
                "text-white shadow-[0_4px_14px_0_rgba(232,97,10,0.35)]",
                "disabled:opacity-40 disabled:shadow-none disabled:hover:from-[var(--color-primary)] disabled:hover:to-[var(--color-primary-hover)]"
              )}
            >
              {isLast ? (
                <>
                  {t("finish")}
                  <Check className="h-4 w-4" />
                </>
              ) : (
                <>
                  {t("next")}
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Right side: Mascot and branding (Hidden on small screens) */}
      <div className="hidden lg:flex flex-1 flex-col items-center justify-center bg-gradient-to-br from-[var(--color-primary-light)] via-[var(--color-bg-page)] to-[var(--color-primary-light)] relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--color-primary)]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[var(--color-primary)]/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--color-primary)]/5 rounded-full blur-3xl" />
        
        {/* Floating decorative shapes */}
        <motion.div
          animate={{ y: [0, -20, 0], rotate: [0, 3, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-10 right-10 w-20 h-20 bg-[var(--color-primary)]/20 rounded-2xl blur-xl"
        />
        <motion.div
          animate={{ y: [0, 15, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-20 left-10 w-16 h-16 bg-[var(--color-primary)]/15 rounded-xl blur-lg"
        />
        
        <motion.div
          animate={{ y: [0, -15, 0], scale: [1, 1.02, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="relative w-[380px] h-[380px] z-10"
        >
          <Image
            src="/images/mascot.png"
            alt="Planoka Mascot"
            fill
            className="object-contain drop-shadow-2xl"
            priority
          />
        </motion.div>
        
        <div className="mt-8 text-center z-10 max-w-xs px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-primary)]/10 mx-auto"
          >
            <Sparkles className="h-6 w-6 text-[var(--color-primary)]" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-2xl font-bold text-[var(--color-text-primary)]"
          >
            Bienvenue sur Planoka !
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-2 text-[var(--color-text-secondary)]"
          >
            Personnalisez votre expérience pour découvrir les meilleurs plans près de chez vous.
          </motion.p>
        </div>
      </div>
    </div>
  );
}
