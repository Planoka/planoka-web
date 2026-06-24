"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

/* ─── Password Input ─── */
function PasswordField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.1em] text-[var(--color-text-tertiary)]">
        {label}
      </label>
      <div className="flex items-center rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] px-4 py-3.5 transition-all focus-within:border-[var(--color-primary)] focus-within:ring-2 focus-within:ring-[var(--color-primary)]/20">
        <input
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-[15px] font-medium text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-tertiary)]"
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="ml-2 text-[var(--color-text-tertiary)] transition-colors hover:text-[var(--color-text-secondary)]"
          aria-label={visible ? "Masquer" : "Afficher"}
        >
          {visible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   SECURITY & PASSWORD PAGE
═══════════════════════════════════════ */
export default function SecurityPage() {
  const router = useRouter();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);

  const canSubmit =
    currentPassword.length >= 6 &&
    newPassword.length >= 6 &&
    newPassword === confirmPassword;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    if (newPassword !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }
    setSaving(true);
    // Mock update
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSaving(false);
    toast.success("Mot de passe mis à jour !");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    router.back();
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-page)]">
      {/* ═══ HEADER ═══ */}
      <div className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[var(--color-bg-card)]/95 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-2xl items-center px-4">
          <button
            onClick={() => router.back()}
            className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-[var(--color-bg-surface)] active:scale-95"
            aria-label="Retour"
          >
            <ArrowLeft className="h-5 w-5 text-[var(--color-text-primary)]" />
          </button>
          <h2 className="flex-1 text-center text-base font-bold text-[var(--color-text-primary)]">
            Sécurité &amp; Mot de passe
          </h2>
          <div className="w-9" /> {/* Spacer for centering */}
        </div>
      </div>

      {/* ═══ FORM ═══ */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mx-auto max-w-2xl px-4 pt-6"
      >
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)] px-5 py-6">
          <div className="space-y-5">
            <PasswordField
              label="Mot de passe actuel"
              value={currentPassword}
              onChange={setCurrentPassword}
              placeholder="••••••••"
            />
            <PasswordField
              label="Nouveau mot de passe"
              value={newPassword}
              onChange={setNewPassword}
              placeholder="••••••••"
            />
            <PasswordField
              label="Confirmer le mot de passe"
              value={confirmPassword}
              onChange={setConfirmPassword}
              placeholder="••••••••"
            />

            {/* Validation hints */}
            {newPassword.length > 0 && newPassword.length < 6 && (
              <p className="text-xs text-[var(--color-danger)]">
                Le mot de passe doit contenir au moins 6 caractères
              </p>
            )}
            {confirmPassword.length > 0 &&
              newPassword !== confirmPassword && (
                <p className="text-xs text-[var(--color-danger)]">
                  Les mots de passe ne correspondent pas
                </p>
              )}
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={!canSubmit || saving}
            className="mt-8 w-full rounded-2xl bg-[var(--color-primary)] py-4 text-[15px] font-bold text-white shadow-md shadow-[var(--color-primary)]/25 transition-all hover:bg-[var(--color-primary-hover)] active:scale-[0.98] disabled:opacity-50 disabled:shadow-none"
          >
            {saving ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Mise à jour...
              </span>
            ) : (
              "Mettre à jour le mot de passe"
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
