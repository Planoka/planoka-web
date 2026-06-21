"use client";

import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { Bell, Mail, Zap, Tag, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type NotificationPrefs = {
  push: boolean;
  email: boolean;
  weekly: boolean;
  deals: boolean;
};

type StepNotificationsProps = {
  notifications: NotificationPrefs;
  onChange: (notifications: NotificationPrefs) => void;
};

const NOTIFICATION_OPTIONS = [
  { key: "push" as const, icon: Bell, titleKey: "notifications.push.title", descKey: "notifications.push.desc", color: "#E8610A" },
  { key: "email" as const, icon: Mail, titleKey: "notifications.email.title", descKey: "notifications.email.desc", color: "#7C3AED" },
  { key: "weekly" as const, icon: Zap, titleKey: "notifications.weekly.title", descKey: "notifications.weekly.desc", color: "#059669" },
  { key: "deals" as const, icon: Tag, titleKey: "notifications.deals.title", descKey: "notifications.deals.desc", color: "#DB2777" },
];

function Toggle({ checked, onToggle }: { checked: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onToggle}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200",
        checked ? "bg-[var(--color-primary)]" : "bg-[var(--color-border-strong)]"
      )}
    >
      <span
        className={cn(
          "inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200",
          checked ? "translate-x-6" : "translate-x-1"
        )}
      />
    </button>
  );
}

export function StepNotifications({ notifications, onChange }: StepNotificationsProps) {
  const t = useTranslations("onboarding");

  const toggle = (key: keyof NotificationPrefs) => {
    onChange({ ...notifications, [key]: !notifications[key] });
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6 sm:mb-8"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
          className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-primary-light)] sm:h-20 sm:w-20 sm:rounded-3xl"
        >
          <Bell className="h-8 w-8 text-[var(--color-primary)] sm:h-10 sm:w-10" />
        </motion.div>

        <h2 className="text-xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-2xl">
          {t("notifications.title")}
        </h2>
        <p className="mt-1.5 text-sm text-[var(--color-text-secondary)] sm:text-base">
          {t("notifications.subtitle")}
        </p>
      </motion.div>

      <div className="space-y-2.5">
        {NOTIFICATION_OPTIONS.map((option, i) => (
          <motion.div
            key={option.key}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.06 }}
          >
            <div
              className={cn(
                "flex items-center gap-3 rounded-xl border p-3 sm:rounded-2xl sm:p-4 transition-all",
                notifications[option.key]
                  ? "border-[var(--color-primary)] bg-[var(--color-primary-light)]"
                  : "border-[var(--color-border)] bg-[var(--color-bg-card)]"
              )}
            >
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl sm:h-12 sm:w-12"
                style={{ backgroundColor: `${option.color}15` }}
              >
                <option.icon className="h-5 w-5 sm:h-6 sm:w-6" style={{ color: option.color }} />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-[var(--color-text-primary)] sm:text-base">
                  {t(option.titleKey)}
                </h3>
                <p className="text-xs text-[var(--color-text-tertiary)] sm:text-sm">
                  {t(option.descKey)}
                </p>
              </div>

              <Toggle checked={notifications[option.key]} onToggle={() => toggle(option.key)} />
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-6 flex items-start gap-2.5 rounded-xl bg-[var(--color-bg-surface)] p-3 sm:rounded-2xl sm:p-4"
      >
        <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-primary)]" />
        <div>
          <p className="text-sm font-medium text-[var(--color-text-primary)]">
            {t("notifications.summary")}
          </p>
          <p className="mt-0.5 text-xs text-[var(--color-text-tertiary)] sm:text-sm">
            {t("notifications.summaryDesc")}
          </p>
        </div>
      </motion.div>
    </div>
  );
}