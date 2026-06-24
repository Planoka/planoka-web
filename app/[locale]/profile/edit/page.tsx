"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useUser } from "@clerk/nextjs";
import { motion } from "motion/react";
import { X, Camera } from "lucide-react";
import { toast } from "sonner";

/* ═══════════════════════════════════════
   EDIT PROFILE PAGE
═══════════════════════════════════════ */
export default function EditProfilePage() {
  const router = useRouter();
  const t = useTranslations("profile.edit");
  const { user, isLoaded } = useUser();

  const [avatarError, setAvatarError] = useState(false);
  const [fullName, setFullName] = useState(user?.fullName ?? user?.firstName ?? "Amadou Diallo");
  const [username, setUsername] = useState(
    user?.username ?? (user?.fullName ?? "Amadou Diallo").toLowerCase().replace(/\s+/g, "_")
  );
  const [bio, setBio] = useState(
    "Explorateur passionné et planificateur d'aventures au Cameroun. 🇨🇲"
  );
  const [saving, setSaving] = useState(false);

  const avatarUrl = user?.imageUrl ?? null;
  const initials = fullName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleSave = async () => {
    setSaving(true);
    // Mock save
    await new Promise((resolve) => setTimeout(resolve, 800));
    setSaving(false);
    toast.success(t("success"));
    router.back();
  };

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg-page)]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--color-primary)] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-page)]">
      {/* ═══ HEADER ═══ */}
      <div className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[var(--color-bg-card)]/95 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-2xl items-center justify-between px-4">
          <button
            onClick={() => router.back()}
            className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-[var(--color-bg-surface)] active:scale-95"
            aria-label="Fermer"
          >
            <X className="h-5 w-5 text-[var(--color-text-primary)]" />
          </button>
          <h2 className="text-base font-bold text-[var(--color-text-primary)]">{t("title")}</h2>
          <button
            onClick={handleSave}
            disabled={saving}
            className="text-sm font-bold text-[var(--color-primary)] transition-opacity disabled:opacity-50"
          >
            {saving ? t("saving") : t("save")}
          </button>
        </div>
      </div>

      {/* ═══ FORM ═══ */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mx-auto max-w-2xl px-5 pt-8"
      >
        {/* ── Avatar ── */}
        <div className="flex flex-col items-center">
          <div className="relative">
            {avatarUrl && !avatarError ? (
              <Image
                src={avatarUrl}
                alt={fullName}
                width={110}
                height={110}
                onError={() => setAvatarError(true)}
                className="rounded-full object-cover"
                style={{ width: 110, height: 110 }}
              />
            ) : (
              <div
                className="flex items-center justify-center rounded-full bg-[var(--color-primary)] text-3xl font-bold text-white"
                style={{ width: 110, height: 110 }}
              >
                {initials}
              </div>
            )}
            {/* Camera badge */}
            <button
              className="absolute -right-1 -bottom-1 flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-primary)] shadow-md transition-all hover:bg-[var(--color-primary-hover)] active:scale-90"
              aria-label="Modifier la photo"
            >
              <Camera className="h-4 w-4 text-white" />
            </button>
          </div>
          <button className="mt-3 text-sm font-semibold text-[var(--color-primary)]">
            {t("changePhoto")}
          </button>
        </div>

        {/* ── Fields ── */}
        <div className="mt-10 space-y-6">
          {/* Full name */}
          <div>
            <label className="mb-2 block text-[11px] font-bold tracking-[0.1em] text-[var(--color-text-tertiary)] uppercase">
              {t("fullName")}
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] px-4 py-3.5 text-[15px] font-medium text-[var(--color-text-primary)] transition-all outline-none placeholder:text-[var(--color-text-tertiary)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
              placeholder={t("fullNamePlaceholder")}
            />
          </div>

          {/* Username */}
          <div>
            <label className="mb-2 block text-[11px] font-bold tracking-[0.1em] text-[var(--color-text-tertiary)] uppercase">
              {t("username")}
            </label>
            <div className="flex items-center rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] px-4 py-3.5 transition-all focus-within:border-[var(--color-primary)] focus-within:ring-2 focus-within:ring-[var(--color-primary)]/20">
              <span className="mr-1 text-[15px] text-[var(--color-text-tertiary)]">@</span>
              <input
                type="text"
                value={username}
                onChange={(e) =>
                  setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))
                }
                className="flex-1 bg-transparent text-[15px] font-medium text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-tertiary)]"
                placeholder={t("usernamePlaceholder")}
              />
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="mb-2 block text-[11px] font-bold tracking-[0.1em] text-[var(--color-text-tertiary)] uppercase">
              {t("bio")}
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              maxLength={160}
              className="w-full resize-none rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] px-4 py-3.5 text-[15px] leading-relaxed font-medium text-[var(--color-text-primary)] transition-all outline-none placeholder:text-[var(--color-text-tertiary)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
              placeholder={t("bioPlaceholder")}
            />
            <p className="mt-1 text-right text-xs text-[var(--color-text-tertiary)]">
              {bio.length}/160
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
