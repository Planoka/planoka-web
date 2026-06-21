"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Cookie, Settings, X, Check, Shield, BarChart3, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type CookiePrefs = {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  personalization: boolean;
};

const COOKIE_CATEGORIES = [
  {
    key: "essential" as const,
    icon: Shield,
    required: true,
    color: "#059669",
  },
  {
    key: "analytics" as const,
    icon: BarChart3,
    required: false,
    color: "#2563EB",
  },
  {
    key: "marketing" as const,
    icon: Target,
    required: false,
    color: "#DC2626",
  },
  {
    key: "personalization" as const,
    icon: Settings,
    required: false,
    color: "#7C3AED",
  },
] as const;

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [prefs, setPrefs] = useState<CookiePrefs>({
    essential: true,
    analytics: false,
    marketing: false,
    personalization: true,
  });

  useEffect(() => {
    const saved = localStorage.getItem("planoka-cookies");
    if (!saved) {
      setTimeout(() => setShowBanner(true), 1500);
    }
  }, []);

  const handleAcceptAll = () => {
    setPrefs({ essential: true, analytics: true, marketing: true, personalization: true });
    localStorage.setItem("planoka-cookies", JSON.stringify({ essential: true, analytics: true, marketing: true, personalization: true }));
    setShowBanner(false);
    setShowDetails(false);
  };

  const handleSavePrefs = () => {
    localStorage.setItem("planoka-cookies", JSON.stringify(prefs));
    setShowBanner(false);
    setShowDetails(false);
  };

  const handleRejectOptional = () => {
    setPrefs({ essential: true, analytics: false, marketing: false, personalization: false });
    localStorage.setItem("planoka-cookies", JSON.stringify({ essential: true, analytics: false, marketing: false, personalization: false }));
    setShowBanner(false);
    setShowDetails(false);
  };

  return (
    <AnimatePresence>
      {showBanner && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm"
            onClick={handleRejectOptional}
          />

          {/* Banner */}
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-4 left-4 right-4 z-[101] mx-auto max-w-lg sm:left-4 sm:right-auto sm:bottom-4"
          >
            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-5 shadow-2xl">
              {/* Header */}
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-hover)]">
                  <Cookie className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-bold text-[var(--color-text-primary)]">
                    Préférences de cookies
                  </h3>
                  <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                    Nous utilisons des cookies pour améliorer votre expérience.
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0"
                  onClick={handleRejectOptional}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Details Panel */}
              <AnimatePresence>
                {showDetails && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 space-y-3">
                      {COOKIE_CATEGORIES.map((cat) => (
                        <div
                          key={cat.key}
                          className="flex items-center gap-3 rounded-xl border border-[var(--color-border)] p-3"
                        >
                          <div
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                            style={{ backgroundColor: `${cat.color}15` }}
                          >
                            <cat.icon className="h-4 w-4" style={{ color: cat.color }} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-[var(--color-text-primary)]">
                                {cat.key === "essential" && "Essentiels"}
                                {cat.key === "analytics" && "Analytiques"}
                                {cat.key === "marketing" && "Marketing"}
                                {cat.key === "personalization" && "Personnalisation"}
                              </span>
                              {cat.required && (
                                <span className="rounded-full bg-[var(--color-success)]/10 px-2 py-0.5 text-[10px] font-bold text-[var(--color-success)]">
                                  REQUIS
                                </span>
                              )}
                            </div>
                            <p className="mt-0.5 text-xs text-[var(--color-text-tertiary)]">
                              {cat.key === "essential" && "Nécessaires au fonctionnement"}
                              {cat.key === "analytics" && "Mesure d'audience anonyme"}
                              {cat.key === "marketing" && "Publicités personnalisées"}
                              {cat.key === "personalization" && "Contenus adaptés à vos goûts"}
                            </p>
                          </div>
                          <button
                            disabled={cat.required}
                            onClick={() => {
                              if (!cat.required) {
                                setPrefs((p) => ({ ...p, [cat.key]: !p[cat.key] }));
                              }
                            }}
                            className={cn(
                              "relative h-6 w-11 rounded-full transition-colors",
                              prefs[cat.key]
                                ? "bg-[var(--color-primary)]"
                                : "bg-[var(--color-bg-surface)]",
                              cat.required && "opacity-60 cursor-not-allowed"
                            )}
                          >
                            <motion.div
                              animate={{ x: prefs[cat.key] ? 20 : 2 }}
                              transition={{ type: "spring", stiffness: 400, damping: 20 }}
                              className="absolute top-1 left-0.5 h-4 w-4 rounded-full bg-white shadow-sm"
                            />
                          </button>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Actions */}
              <div className="mt-4 flex flex-col gap-2">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 rounded-xl"
                    onClick={() => setShowDetails(!showDetails)}
                  >
                    <Settings className="mr-1.5 h-3.5 w-3.5" />
                    {showDetails ? "Masquer" : "Personnaliser"}
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 rounded-xl bg-[var(--color-primary)] text-white hover:brightness-90"
                    onClick={showDetails ? handleSavePrefs : handleAcceptAll}
                  >
                    <Check className="mr-1.5 h-3.5 w-3.5" />
                    {showDetails ? "Enregistrer" : "Tout accepter"}
                  </Button>
                </div>
                {!showDetails && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-[var(--color-text-tertiary)]"
                    onClick={handleRejectOptional}
                  >
                    Refuser les optionnels
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}