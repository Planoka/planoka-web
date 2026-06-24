"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useUser } from "@clerk/nextjs";
import { motion, AnimatePresence } from "motion/react";
import {
  Settings,
  Share2,
  MapPin,
  Zap,
  MessageCircle,
  Heart,
  BadgeCheck,
  Camera,
  MoreVertical,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useStore } from "@/store/useStore";
import { getPlansWithDetails } from "@/lib/mock-data";
import type { Plan } from "@/types";

/* ─── Mock stats ─── */
const MOCK_STATS = { posts: 24, following: 156, followers: 892 };

/* ─── Category colors ─── */
const CAT_COLORS: Record<string, string> = {
  "cat-1": "#E8610A",
  "cat-2": "#7C3AED",
  "cat-3": "#059669",
  "cat-4": "#DC2626",
  "cat-5": "#2563EB",
  "cat-6": "#DB2777",
  "cat-7": "#D97706",
  "cat-8": "#0891B2",
};

/* ─── Avatar component ─── */
function ProfileAvatar({
  src,
  name,
  size = 96,
}: {
  src?: string | null;
  name: string;
  size?: number;
}) {
  const [error, setError] = useState(false);
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className="relative mx-auto"
      style={{ width: size + 8, height: size + 8 }}
    >
      {/* Ring */}
      <div
        className="absolute inset-0 rounded-full border-[3px] border-[var(--color-border)]"
        style={{ width: size + 8, height: size + 8 }}
      />
      {src && !error ? (
        <Image
          src={src}
          alt={name}
          width={size}
          height={size}
          onError={() => setError(true)}
          className="absolute left-1 top-1 rounded-full object-cover"
          style={{ width: size, height: size }}
        />
      ) : (
        <div
          className="absolute left-1 top-1 flex items-center justify-center rounded-full bg-[var(--color-primary)] font-bold text-white"
          style={{ width: size, height: size, fontSize: size * 0.36 }}
        >
          {initials}
        </div>
      )}
      {/* Verified badge */}
      <div className="absolute -bottom-0.5 right-0 flex h-7 w-7 items-center justify-center rounded-full border-2 border-[var(--color-bg-card)] bg-blue-500">
        <BadgeCheck className="h-4 w-4 text-white" />
      </div>
    </div>
  );
}

/* ─── Stat counter ─── */
function StatItem({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  const formatted =
    value >= 1000 ? `${(value / 1000).toFixed(1).replace(/\.0$/, "")}k` : String(value);

  return (
    <div className="flex flex-col items-center">
      <span className="text-xl font-bold text-[var(--color-text-primary)]">
        {formatted}
      </span>
      <span className="text-xs text-[var(--color-text-tertiary)]">{label}</span>
    </div>
  );
}

/* ─── Plan Grid Card (profile-specific) ─── */
function ProfilePlanCard({
  plan,
  locale,
  index,
}: {
  plan: Plan;
  locale: string;
  index: number;
}) {
  const catColor = CAT_COLORS[plan.categorie_id] ?? "#E8610A";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.3) }}
    >
      <Link
        href={`/${locale}/plans/${plan.id}`}
        className="group relative flex aspect-[4/5] overflow-hidden rounded-2xl bg-[var(--color-bg-card)] transition-shadow hover:shadow-lg"
      >
        {plan.image_url ? (
          <Image
            src={plan.image_url}
            alt={plan.titre}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, 33vw"
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{ backgroundColor: `${catColor}15` }}
          />
        )}
        {/* Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

        {/* Bottom info */}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <h3 className="line-clamp-2 text-sm font-bold leading-tight text-white drop-shadow-sm">
            {plan.titre}
          </h3>
          <div className="mt-1.5 flex items-center gap-2 text-[11px] text-white/70">
            <span className="flex items-center gap-0.5">
              <Heart className="h-3 w-3" />
              {plan.boosts_count}
            </span>
            <span className="flex items-center gap-0.5">
              <MessageCircle className="h-3 w-3" />
              {plan.comments_count}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

const TABS = ["posts", "liked", "saved"] as const;

type TabKey = (typeof TABS)[number];

/* ═══════════════════════════════════════
   MAIN PROFILE PAGE
═══════════════════════════════════════ */
export default function ProfilePage() {
  const locale = useLocale();
  const t = useTranslations("profile.page");
  const { user, isLoaded } = useUser();
  const favorites = useStore((s) => s.favorites);
  const [activeTab, setActiveTab] = useState<TabKey>("posts");

  const allPlans = useMemo(() => getPlansWithDetails(), []);

  /* Compute plans per tab */
  const tabPlans = useMemo(() => {
    const userPlans = allPlans.filter(
      (p) => p.user_id === "user-1" || p.user_id === "user-2"
    );
    const likedPlans = allPlans.filter(
      (_, i) => i % 3 === 0 || i % 5 === 0
    );
    const savedPlans = allPlans.filter((p) => favorites.includes(p.id));

    return { posts: userPlans, liked: likedPlans, saved: savedPlans };
  }, [allPlans, favorites]);

  const currentPlans = tabPlans[activeTab];

  /* Profile data (Clerk user or fallback) */
  const profileName =
    user?.fullName ?? user?.firstName ?? "Amadou Diallo";
  const profileUsername =
    user?.username ?? profileName.toLowerCase().replace(/\s+/g, "_");
  const profileAvatar = user?.imageUrl ?? null;
  const profileBio =
    "Explorateur passionné et planificateur d'aventures au Cameroun. 🇨🇲";
  const profileCity = "Douala";

  /* Loading skeleton */
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-page)]">
        <div className="mx-auto max-w-2xl px-4 pt-12">
          <div className="flex flex-col items-center gap-4">
            <div className="h-[104px] w-[104px] animate-pulse rounded-full bg-[var(--color-border)]" />
            <div className="h-6 w-40 animate-pulse rounded-lg bg-[var(--color-border)]" />
            <div className="h-4 w-24 animate-pulse rounded-lg bg-[var(--color-border)]" />
            <div className="h-4 w-64 animate-pulse rounded-lg bg-[var(--color-border)]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-page)] pb-28 md:pb-8">
      {/* ═══ HEADER ACTIONS ═══ */}
      <div className="mx-auto flex max-w-2xl items-center justify-end gap-2 px-4 pt-4 sm:pt-6">
        <Link
          href={`/${locale}/profile/settings`}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-bg-card)] shadow-sm transition-all hover:shadow-md active:scale-95"
          aria-label="Paramètres"
        >
          <Settings className="h-5 w-5 text-[var(--color-text-secondary)]" />
        </Link>
        <Link
          href={`/${locale}/profile/settings`}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-bg-card)] shadow-sm transition-all hover:shadow-md active:scale-95"
          aria-label="Plus d'options"
        >
          <MoreVertical className="h-5 w-5 text-[var(--color-text-secondary)]" />
        </Link>
      </div>

      {/* ═══ PROFILE CARD ═══ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-2xl px-4 pt-4"
      >
        {/* Avatar */}
        <div className="flex flex-col items-center">
          <ProfileAvatar src={profileAvatar} name={profileName} size={96} />

          {/* Name + Username */}
          <h1 className="mt-4 text-xl font-bold tracking-tight text-[var(--color-text-primary)]">
            {profileName}
          </h1>
          <p className="mt-0.5 text-sm text-[var(--color-text-tertiary)]">
            @{profileUsername}
          </p>

          {/* Bio */}
          <p className="mt-3 max-w-sm text-center text-sm leading-relaxed text-[var(--color-text-secondary)]">
            {profileBio}
          </p>

          {/* City */}
          <div className="mt-2 flex items-center gap-1 text-xs text-[var(--color-text-tertiary)]">
            <MapPin size={12} className="text-[var(--color-primary)]" />
            <span>{profileCity}</span>
          </div>
        </div>

        {/* ─── Stats ─── */}
        <div className="mt-6 flex items-center justify-center gap-10">
          <StatItem value={MOCK_STATS.posts} label="Posts" />
          <div className="h-8 w-px bg-[var(--color-border)]" />
          <StatItem value={MOCK_STATS.following} label="Following" />
          <div className="h-8 w-px bg-[var(--color-border)]" />
          <StatItem value={MOCK_STATS.followers} label="Followers" />
        </div>

        {/* ─── Action buttons ─── */}
        <div className="mt-6 flex items-center gap-3">
          <Link
            href={`/${locale}/profile/edit`}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[var(--color-primary)] px-5 py-3 text-sm font-bold text-white shadow-md shadow-[var(--color-primary)]/25 transition-all hover:bg-[var(--color-primary-hover)] active:scale-[0.97]"
          >
            {t("editProfile")}
          </Link>
          <button
            onClick={() => {
              if (typeof navigator !== "undefined" && navigator.share) {
                navigator.share({
                  title: profileName,
                  text: t("shareTitle", { name: profileName }),
                  url: window.location.href,
                });
              }
            }}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)] transition-all hover:border-[var(--color-border-strong)] active:scale-95"
            aria-label={t("shareProfile")}
          >
            <Share2 className="h-5 w-5 text-[var(--color-text-secondary)]" />
          </button>
        </div>
      </motion.div>

      {/* ═══ TABS ═══ */}
      <div className="mx-auto mt-8 max-w-2xl">
        <div className="relative flex border-b border-[var(--color-border)]">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "relative flex-1 py-3 text-center text-sm font-semibold transition-colors",
                activeTab === tab
                  ? "text-[var(--color-primary)]"
                  : "text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)]"
              )}
            >
              {t(`tabs.${tab}`)}
              {activeTab === tab && (
                <motion.div
                  layoutId="profile-tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-[3px] rounded-full bg-[var(--color-primary)]"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* ─── Tab content ─── */}
        <div className="px-4 pt-5">
          <AnimatePresence mode="wait">
            {currentPlans.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col items-center gap-3 py-16 text-center"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-bg-surface)]">
                  {activeTab === "saved" ? (
                    <Heart className="h-7 w-7 text-[var(--color-text-tertiary)]" />
                  ) : activeTab === "liked" ? (
                    <Zap className="h-7 w-7 text-[var(--color-text-tertiary)]" />
                  ) : (
                    <Camera className="h-7 w-7 text-[var(--color-text-tertiary)]" />
                  )}
                </div>
                <p className="text-sm font-medium text-[var(--color-text-secondary)]">
                  {t(`empty.${activeTab}`)}
                </p>
                <p className="max-w-xs text-xs text-[var(--color-text-tertiary)]">
                  {t(`empty.${activeTab}Desc`)}
                </p>
              </motion.div>
            ) : (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="grid grid-cols-2 gap-3 sm:grid-cols-3"
              >
                {currentPlans.map((plan, i) => (
                  <ProfilePlanCard
                    key={plan.id}
                    plan={plan}
                    locale={locale}
                    index={i}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
