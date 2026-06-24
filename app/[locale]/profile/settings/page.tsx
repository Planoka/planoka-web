"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useClerk } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { motion } from "motion/react";
import {
  ArrowLeft,
  UserRoundPen,
  ShieldCheck,
  Bell,
  Globe,
  Moon,
  HelpCircle,
  MessageSquareText,
  FileText,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { toast } from "sonner";

/* ─── Toggle Switch ─── */
function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="relative h-7 w-[50px] shrink-0 rounded-full transition-colors duration-200"
      style={{
        backgroundColor: checked ? "var(--color-primary)" : "var(--color-border-strong)",
      }}
    >
      <motion.div
        className="absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-sm"
        animate={{ left: checked ? 23 : 2 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </button>
  );
}

/* ─── Settings Row ─── */
function SettingsRow({
  icon: Icon,
  label,
  href,
  trailing,
  onClick,
  danger,
}: {
  icon: React.ElementType;
  label: string;
  href?: string;
  trailing?: React.ReactNode;
  onClick?: () => void;
  danger?: boolean;
}) {
  const content = (
    <div
      className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-[var(--color-bg-surface)] active:bg-[var(--color-bg-surface)]"
      onClick={onClick}
      role={onClick ? "button" : undefined}
    >
      <Icon
        className="h-5 w-5 shrink-0"
        style={{
          color: danger
            ? "var(--color-danger)"
            : "var(--color-text-tertiary)",
        }}
      />
      <span
        className="flex-1 text-[15px] font-medium"
        style={{
          color: danger
            ? "var(--color-danger)"
            : "var(--color-text-primary)",
        }}
      >
        {label}
      </span>
      {trailing ?? (
        <ChevronRight className="h-4.5 w-4.5 text-[var(--color-text-tertiary)]" />
      )}
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }
  return content;
}

/* ─── Section Header ─── */
function SectionHeader({ title }: { title: string }) {
  return (
    <p className="mb-2 mt-7 px-5 text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--color-text-tertiary)]">
      {title}
    </p>
  );
}

/* ═══════════════════════════════════════
   SETTINGS PAGE
═══════════════════════════════════════ */
export default function SettingsPage() {
  const locale = useLocale();
  const t = useTranslations("profile.settings");
  const router = useRouter();
  const { signOut } = useClerk();
  const { theme, setTheme } = useTheme();

  const [pushEnabled, setPushEnabled] = useState(true);
  const isDark = theme === "dark";

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success(t("signOutSuccess"));
      router.push(`/${locale}`);
    } catch {
      toast.error(t("signOutError"));
    }
  };

  const handleDarkToggle = (checked: boolean) => {
    setTheme(checked ? "dark" : "light");
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-page)] pb-28 md:pb-8">
      {/* ═══ HEADER ═══ */}
      <div className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[var(--color-bg-card)]/95 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-2xl items-center gap-3 px-4">
          <button
            onClick={() => router.back()}
            className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-[var(--color-bg-surface)] active:scale-95"
            aria-label="Retour"
          >
            <ArrowLeft className="h-5 w-5 text-[var(--color-text-primary)]" />
          </button>
        </div>
      </div>

      {/* ═══ TITLE ═══ */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mx-auto max-w-2xl px-5 pt-6"
      >
        <h1 className="text-[28px] font-bold tracking-tight text-[var(--color-text-primary)]">
          {t("title")}
        </h1>
        <p className="mt-1 text-sm text-[var(--color-text-tertiary)]">
          {t("subtitle")}
        </p>
      </motion.div>

      {/* ═══ SECTIONS ═══ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="mx-auto max-w-2xl"
      >
        {/* ── COMPTE ── */}
        <SectionHeader title={t("sections.account")} />
        <div className="mx-4 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)]">
          <SettingsRow
            icon={UserRoundPen}
            label={t("items.editProfile")}
            href={`/${locale}/profile/edit`}
          />
          <div className="mx-5 h-px bg-[var(--color-border)]" />
          <SettingsRow
            icon={ShieldCheck}
            label={t("items.security")}
            href={`/${locale}/profile/security`}
          />
          <div className="mx-5 h-px bg-[var(--color-border)]" />
          <SettingsRow
            icon={Bell}
            label={t("items.pushNotifications")}
            trailing={
              <Toggle checked={pushEnabled} onChange={setPushEnabled} />
            }
          />
        </div>

        {/* ── PRÉFÉRENCES ── */}
        <SectionHeader title={t("sections.preferences")} />
        <div className="mx-4 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)]">
          <SettingsRow
            icon={Globe}
            label={t("items.language")}
            href={`/${locale === "fr" ? "en" : "fr"}/profile/settings`}
            trailing={
              <span className="mr-1 text-sm text-[var(--color-text-tertiary)]">
                {locale === "fr" ? "Français" : "English"}
              </span>
            }
          />
          <div className="mx-5 h-px bg-[var(--color-border)]" />
          <SettingsRow
            icon={Moon}
            label={t("items.darkMode")}
            trailing={
              <Toggle checked={isDark} onChange={handleDarkToggle} />
            }
          />
        </div>

        {/* ── SUPPORT & LÉGAL ── */}
        <SectionHeader title={t("sections.support")} />
        <div className="mx-4 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)]">
          <SettingsRow
            icon={HelpCircle}
            label={t("items.help")}
            onClick={() => toast.info(t("soon"))}
          />
          <div className="mx-5 h-px bg-[var(--color-border)]" />
          <SettingsRow
            icon={MessageSquareText}
            label={t("items.contact")}
            onClick={() => toast.info(t("soon"))}
          />
          <div className="mx-5 h-px bg-[var(--color-border)]" />
          <SettingsRow
            icon={FileText}
            label={t("items.privacy")}
            href={`/${locale}/privacy`}
          />
        </div>

        {/* ── SIGN OUT ── */}
        <div className="mx-4 mt-8">
          <button
            onClick={handleSignOut}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-50 py-4 text-[15px] font-bold text-[var(--color-danger)] transition-all hover:bg-red-100 active:scale-[0.98]"
          >
            <LogOut className="h-5 w-5" />
            {t("signOut")}
          </button>
        </div>

        {/* ── App version ── */}
        <p className="mt-4 mb-8 text-center text-xs text-[var(--color-text-tertiary)]">
          Planoka v1.0.0 ({t("build")} 42)
        </p>
      </motion.div>
    </div>
  );
}
