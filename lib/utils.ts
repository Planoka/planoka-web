import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDistanceToNow, format } from "date-fns";
import { fr, enUS } from "date-fns/locale";
import type { Locale } from "@/types";

/** Utility pour merge les classes Tailwind */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Formater une date de façon relative (il y a 2h) */
export function formatRelativeDate(date: string, locale: Locale = "fr") {
  return formatDistanceToNow(new Date(date), {
    addSuffix: true,
    locale: locale === "fr" ? fr : enUS,
  });
}

/** Formater une date absolue */
export function formatAbsoluteDate(date: string, locale: Locale = "fr") {
  return format(new Date(date), "d MMM yyyy", {
    locale: locale === "fr" ? fr : enUS,
  });
}

/** Générer l'URL de partage d'un plan */
export function getPlanShareUrl(planId: string, locale: Locale = "fr") {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://planoka.cm";
  return `${baseUrl}/${locale}/plans/${planId}`;
}

/** Extraire la couleur d'une catégorie */
export function getCategoryColor(slug: string): string {
  const colors: Record<string, string> = {
    restauration: "#E8610A",
    loisirs: "#7C3AED",
    sorties: "#059669",
    shopping: "#DC2626",
    services: "#2563EB",
    sante: "#DB2777",
    education: "#D97706",
    sport: "#0891B2",
  };
  return colors[slug] || "#6B6B6B";
}

/** Formater la durée d'une vidéo (secondes → MM:SS) */
export function formatVideoDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}
