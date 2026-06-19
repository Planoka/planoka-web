"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StepWelcome } from "./StepWelcome";
import { StepCategories } from "./StepCategories";
import { StepCity } from "./StepCity";
import { StepPreferences } from "./StepPreferences";

const STEPS = ["welcome", "categories", "city", "preferences"] as const;

export function OnboardingClient() {
  const t = useTranslations("onboarding");
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
      router.push("/");
      return;
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const handleBack = () => {
    setStep((s) => Math.max(s - 1, 0));
  };

  const handleSkip = () => {
    router.push("/");
  };

  return (
    <div className="flex min-h-screen flex-col bg-[var(--color-bg-page)]">
      <div className="fixed left-0 right-0 top-0 z-50 bg-[var(--color-bg-page)] px-4 pb-2 pt-4">
        <div className="mx-auto flex h-1 max-w-md overflow-hidden rounded-full bg-[var(--color-border)]">
          <motion.div
            className="h-full rounded-full bg-[var(--color-primary)]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          />
        </div>
        <div className="mt-1 flex justify-between px-1 text-[10px] text-[var(--color-text-tertiary)]">
          <span>Bienvenue</span>
          <span>Centres d&apos;intérêt</span>
          <span>Ville</span>
          <span>Préférences</span>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center px-6 py-28">
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

      <div className="fixed bottom-0 left-0 right-0 border-t border-[var(--color-border)] bg-[var(--color-bg-card)] px-6 py-4">
        <div className="mx-auto flex max-w-md items-center justify-between gap-3">
          {!isFirst ? (
            <Button variant="ghost" onClick={handleBack} className="gap-1.5">
              <ArrowLeft className="h-4 w-4" />
              Retour
            </Button>
          ) : (
            <Button variant="ghost" onClick={handleSkip} className="text-[var(--color-text-tertiary)]">
              {t("skip")}
            </Button>
          )}

          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="gap-1.5 bg-[var(--color-primary)] hover:brightness-90 disabled:opacity-40"
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
  );
}
