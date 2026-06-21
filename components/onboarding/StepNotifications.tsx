"use client";

import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { Bell, Mail, Zap, Tag, Check, Sparkles } from "lucide-react";
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
  {
    key: "push",
    icon: Bell,
    titleKey: "notifications.push.title",
    descKey: "notifications.push.desc",
    color: "#E8610A",
  },
  {
    key: "email",
    icon: Mail,
    titleKey: "notifications.email.title",
    descKey: "notifications.email.desc",
    color: "#7C3AED",
  },
  {
    key: "weekly",
    icon: Zap,
    titleKey: "notifications.weekly.title",
    descKey: "notifications.weekly.desc",
    color: "#059669",
  },
  {
    key: "deals",
    icon: Tag,
    titleKey: "notifications.deals.title",
    descKey: "notifications.deals.desc",
    color: "#DB2777",
  },
] as const;

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
        className="text-center mb-8"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
          className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-[var(--color-primary-light)]"
        >
          <Bell className="h-10 w-10 text-[var(--color-primary)]" />
        </motion.div>

        <h2 className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">
          {t("notifications.title")}
        </h2>
        <p className="mt-2 text-base text-[var(--color-text-secondary)] leading-relaxed">
          {t("notifications.subtitle")}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-3"
      >
        {NOTIFICATION_OPTIONS.map((option, i) => (
          <motion.div
            key={option.key}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 + i * 0.08 }}
            className="relative"
          >
            <label className="group cursor-pointer">
              <div
                className={cn(
                  "flex items-center gap-4 rounded-2xl border-2 p-4 transition-all",
                  "bg-[var(--color-bg-card)]",
                  notifications[option.key]
                    ? "border-[var(--color-primary)] bg-[var(--color-primary-light)]"
                    : "border-[var(--color-border)] hover:border-[var(--color-primary)]/30"
                )}
              >
                <motion.div
                  animate={{ scale: notifications[option.key] ? 1.05 : 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                  style={{ backgroundColor: `${option.color}20` }}
                >
                  <option.icon
                    className="h-6 w-6 transition-colors"
                    style={{ color: option.color }}
                  />
                </motion.div>

                <div className="flex-1 text-left">
                  <h3 className="font-semibold text-[var(--color-text-primary)]">
                    {t(option.titleKey)}
                  </h3>
                  <p className="mt-0.5 text-sm text-[var(--color-text-tertiary)]">
                    {t(option.descKey)}
                  </p>
                </div>

                {/* Custom Toggle Switch */}
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={notifications[option.key]}
                    onChange={() => toggle(option.key)}
                    className="peer h-6 w-6 appearance-none rounded-full border-2 transition-all
                      bg-[var(--color-bg-surface)] border-[var(--color-border)]
                      peer-checked:bg-[var(--color-primary)] peer-checked:border-[var(--color-primary)]
                      peer-focus:ring-2 peer-focus:ring-[var(--color-primary)]/20
                      peer-hover:border-[var(--color-primary)]/50
                      cursor-pointer"
                    aria-label={t(option.titleKey)}
                  />
                  <motion.div
                    animate={{ x: notifications[option.key] ? 24 : 2 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-white shadow-md transition-transform
                      peer-checked:translate-x-6"
                  />
                </div>

                {/* Checkmark animation when enabled */}
                {notifications[option.key] && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15, delay: 0.1 }}
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--color-primary)]"
                  >
                    <Check className="h-5 w-5" />
                  </motion.div>
                )}
              </div>
            </label>
          </motion.div>
        ))}
      </motion.div>

      {/* Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-8 p-4 rounded-2xl bg-[var(--color-bg-surface)] border border-[var(--color-border)]"
      >
        <p className="text-sm font-medium text-[var(--color-text-primary)] flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-[var(--color-primary)]" />
          {t("notifications.summary")}
        </p>
        <p className="mt-1 text-sm text-[var(--color-text-tertiary)]">
          {t("notifications.summaryDesc")}
        </p>
      </motion.div>
    </div>
  );
}