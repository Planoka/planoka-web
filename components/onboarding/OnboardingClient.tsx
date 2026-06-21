"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { StepWelcome } from "./StepWelcome";
import { StepCategories } from "./StepCategories";
import { StepCity } from "./StepCity";
import { StepPreferences } from "./StepPreferences";

const STEPS = ["welcome", "categories", "city", "preferences"] as const;

export function OnboardingClient() {
  const t = useTranslations("onboarding");
  const locale = useLocale();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const currentStep = STEPS[step];
  const progress = ((step + 1) / STEPS.length) * 100;
  const isFirst = step === 0;
  const isLast = step === STEPS.length - 1;

  const canProceed = () => {
    if (currentStep === "categories") return selectedCategories.length >= 3;
    return true;
  };

  const handleNext = () => {
    if (isLast) {
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

  return (
    <div className="flex min-h-screen flex-col lg:flex-row bg-[var(--color-bg-page)]">
      
      {/* Left side: Form content */}
      <div className="flex-1 flex flex-col relative z-10 lg:w-1/2">
        <div className="fixed lg:absolute left-0 right-0 top-0 z-50 bg-[var(--color-bg-page)] px-6 pb-2 pt-6 lg:pt-10">
          <div className="mx-auto flex h-1.5 max-w-md overflow-hidden rounded-full bg-[var(--color-border)] lg:mx-0 lg:max-w-xl">
            <motion.div
              className="h-full rounded-full bg-[var(--color-primary)]"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            />
          </div>
          <div className="mx-auto mt-2 flex max-w-md justify-between px-1 text-[11px] font-medium text-[var(--color-text-tertiary)] lg:mx-0 lg:max-w-xl">
            <span>{t("welcome")}</span>
            <span>{t("step1")}</span>
            <span>{t("step2")}</span>
            <span>{t("step3")}</span>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center px-6 py-28 lg:py-0 lg:justify-start lg:pl-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="w-full max-w-md"
            >
              {currentStep === "welcome" && <StepWelcome />}
              {currentStep === "categories" && (
                <StepCategories
                  selected={selectedCategories}
                  onSelect={setSelectedCategories}
                />
              )}
              {currentStep === "city" && <StepCity />}
              {currentStep === "preferences" && <StepPreferences />}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="fixed lg:absolute bottom-0 left-0 right-0 lg:right-auto lg:w-1/2 border-t border-[var(--color-border)] bg-[var(--color-bg-card)] px-6 py-4">
          <div className="mx-auto flex max-w-md lg:max-w-xl items-center justify-between gap-3">
            {!isFirst ? (
                <Button variant="ghost" onClick={handleBack} className="gap-1.5 hover:bg-[var(--color-bg-surface)]">
                <ArrowLeft className="h-4 w-4" />
                {t("back")}
              </Button>
            ) : (
              <Button variant="ghost" onClick={handleSkip} className="text-[var(--color-text-tertiary)] hover:bg-[var(--color-bg-surface)]">
                {t("skip")}
              </Button>
            )}

            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="gap-1.5 flex-1 max-w-[200px] bg-[var(--color-primary)] hover:brightness-90 disabled:opacity-40"
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
      <div className="hidden lg:flex flex-1 flex-col items-center justify-center bg-[var(--color-primary-light)] relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--color-primary)]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[var(--color-primary)]/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3" />
        
        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="relative w-[400px] h-[400px] z-10"
        >
          <Image
            src="/images/mascot.png"
            alt="Planoka Mascot"
            fill
            className="object-contain drop-shadow-2xl"
            priority
          />
        </motion.div>
        
        <div className="mt-8 text-center z-10 max-w-xs">
          <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
            Bienvenue sur Planoka !
          </h2>
          <p className="mt-2 text-[var(--color-text-secondary)]">
            Personnalisez votre expérience pour découvrir les meilleurs plans.
          </p>
        </div>
      </div>
    </div>
  );
}
