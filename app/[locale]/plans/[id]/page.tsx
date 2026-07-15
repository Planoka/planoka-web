"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  MoreHorizontal,
  MapPin,
  Zap,
  Heart,
  Share2,
  MessageCircle,
  Send,
  ChevronDown,
  ChevronUp,
  Flag,
  Link as LinkIcon,
  Check,
  UtensilsCrossed,
  Gamepad2,
  Music,
  ShoppingBag,
  Briefcase,
  BookOpen,
  Dumbbell,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { usePlan, useBoostPlan, useFavoritePlan } from "@/hooks/usePlans";
import { useComments, useAddComment } from "@/hooks/useComments";
import { useStore } from "@/store/useStore";
import type { Comment } from "@/types";

/* ─── Category Meta ─── */
const CATEGORY_META: Record<string, { color: string; icon: React.ElementType; label: string }> = {
  "cat-1": { color: "#E8610A", icon: UtensilsCrossed, label: "Restauration" },
  "cat-2": { color: "#7C3AED", icon: Gamepad2, label: "Loisirs" },
  "cat-3": { color: "#059669", icon: Music, label: "Sorties" },
  "cat-4": { color: "#DC2626", icon: ShoppingBag, label: "Shopping" },
  "cat-5": { color: "#2563EB", icon: Briefcase, label: "Services" },
  "cat-6": { color: "#DB2777", icon: Heart, label: "Santé" },
  "cat-7": { color: "#D97706", icon: BookOpen, label: "Éducation" },
  "cat-8": { color: "#0891B2", icon: Dumbbell, label: "Sport" },
};

/* ─── Time ago helper ─── */
function timeAgo(dateStr: string, t: (key: string) => string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return t("justNow");
  if (mins < 60) return `${mins}${t("min")}`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}${t("h")}`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}${t("d")}`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks}${t("w")}`;
  const months = Math.floor(days / 30);
  return `${months}${t("mo")}`;
}

/* ─── Avatar Fallback ─── */
function Avatar({
  src,
  name,
  size = 40,
  className,
}: {
  src?: string;
  name: string;
  size?: number;
  className?: string;
}) {
  const [error, setError] = useState(false);
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  if (!src || error) {
    return (
      <div
        className={cn(
          "flex shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] font-semibold text-white",
          className
        )}
        style={{ width: size, height: size, fontSize: size * 0.38 }}
      >
        {initials}
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={name}
      width={size}
      height={size}
      onError={() => setError(true)}
      className={cn("shrink-0 rounded-full object-cover", className)}
      style={{ width: size, height: size }}
    />
  );
}

/* ─── Share Sheet ── */
function ShareSheet({
  plan,
  onClose,
  t,
}: {
  plan: { titre: string; id: string };
  onClose: () => void;
  t: (key: string) => string;
}) {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== "undefined" ? window.location.href : "";

  const copyLink = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success(t("linkCopied"));
  };

  const shareItems = [
    {
      label: t("copyLink"),
      icon: copied ? Check : LinkIcon,
      action: copyLink,
      color: "#6b6b6b",
      svgContent: null,
    },
    {
      label: "WhatsApp",
      icon: null,
      svgContent: (
        <svg viewBox="0 0 24 24" fill="currentColor" width={20} height={20}>
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.464 3.488" />
        </svg>
      ),
      action: () => {
        window.open(
          `https://wa.me/?text=${encodeURIComponent(`${plan.titre} — ${url}`)}`,
          "_blank"
        );
        onClose();
      },
      color: "#25D366",
    },
    {
      label: "Twitter / X",
      icon: null,
      svgContent: (
        <svg viewBox="0 0 24 24" fill="currentColor" width={20} height={20}>
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      action: () => {
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(plan.titre)}&url=${encodeURIComponent(url)}`,
          "_blank"
        );
        onClose();
      },
      color: "#000000",
    },
    {
      label: "Facebook",
      icon: null,
      svgContent: (
        <svg viewBox="0 0 24 24" fill="currentColor" width={20} height={20}>
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
      action: () => {
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
          "_blank"
        );
        onClose();
      },
      color: "#1877F2",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 400 }}
        className="w-full max-w-lg rounded-t-3xl bg-[var(--color-bg-card)] p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-[var(--color-border-strong)]" />
        <h3 className="mb-5 text-center text-base font-bold text-[var(--color-text-primary)]">
          {t("sharePlan")}
        </h3>
        <div className="grid grid-cols-4 gap-3">
          {shareItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                onClick={item.action}
                className="flex flex-col items-center gap-2 rounded-2xl p-3 transition-all hover:bg-[var(--color-bg-surface)] active:scale-95"
              >
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-2xl"
                  style={{ backgroundColor: `${item.color}18`, color: item.color }}
                >
                  {item.svgContent ?? (Icon ? <Icon size={20} /> : null)}
                </div>
                <span className="text-center text-[11px] leading-tight font-medium text-[var(--color-text-secondary)]">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
        <button
          onClick={onClose}
          className="mt-4 w-full rounded-2xl bg-[var(--color-bg-surface)] py-3.5 text-sm font-semibold text-[var(--color-text-secondary)] transition-all hover:bg-[var(--color-border)]"
        >
          {t("cancel")}
        </button>
      </motion.div>
    </motion.div>
  );
}

function stringToHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

/* ─── Comment Item ─── */
function CommentItem({
  comment,
  planId,
  depth = 0,
}: {
  comment: Comment;
  planId: string;
  depth?: number;
}) {
  const t = useTranslations("plan.detail");
  const timeT = useTranslations("plan.detail.time");
  const [liked, setLiked] = useState(false);
  const [likeDisplayCount, setLikeDisplayCount] = useState(
    () => (stringToHash(comment.id) % 15) + 1
  );

  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [showReplies, setShowReplies] = useState(depth === 0);
  const addComment = useAddComment(planId);

  const handleLike = () => {
    setLiked((prev) => !prev);
    setLikeDisplayCount((c) => (liked ? c - 1 : c + 1));
  };

  const handleReply = () => {
    if (!replyText.trim()) return;
    addComment.mutate(
      { contenu: replyText.trim(), parent_id: comment.id },
      {
        onSuccess: () => {
          setReplyText("");
          setShowReplyInput(false);
          toast.success(t("replyAdded"));
        },
      }
    );
  };

  const hasReplies = comment.replies && comment.replies.length > 0;

  return (
    <div className={cn("flex gap-3", depth > 0 && "mt-3 ml-10")}>
      <Avatar
        src={comment.author?.avatar_url}
        name={comment.author?.nom ?? "?"}
        size={depth > 0 ? 32 : 38}
      />
      <div className="min-w-0 flex-1">
        {/* Main Layout Row: Bubble content + Like Button side by side */}
        <div className="flex items-start gap-2">
          {/* Bubble */}
          <div className="min-w-0 flex-1 rounded-2xl rounded-tl-sm bg-[var(--color-bg-surface)] px-4 py-3">
            <div className="mb-1 flex items-baseline gap-2">
              <span className="text-sm font-semibold text-[var(--color-text-primary)]">
                {comment.author?.nom ?? "Anonyme"}
              </span>
            </div>
            <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
              {comment.contenu}
            </p>
          </div>

          {/* Social Media Style Side Like Button */}
          <button
            onClick={handleLike}
            className={cn(
              "flex flex-col items-center gap-0.5 pt-3 text-[10px] font-medium transition-colors shrink-0 min-w-[24px]",
              liked ? "text-[var(--color-danger)]" : "text-[var(--color-text-tertiary)]"
            )}
          >
            <Heart size={14} className={cn("transition-all", liked && "scale-110 fill-current")} />
            <span>{likeDisplayCount}</span>
          </button>
        </div>

        {/* Actions metadata bar below bubble */}
        <div className="mt-1 flex items-center gap-4 px-1 text-xs text-[var(--color-text-tertiary)]">
          <span>{timeAgo(comment.created_at, timeT)}</span>

          {depth === 0 && (
            <button
              onClick={() => setShowReplyInput((s) => !s)}
              className="font-semibold transition-colors hover:text-[var(--color-primary)]"
            >
              {t("reply")}
            </button>
          )}

          <button className="ml-auto transition-colors hover:text-[var(--color-danger)]">
            <Flag size={12} />
          </button>
        </div>

        {/* Reply input */}
        <AnimatePresence>
          {showReplyInput && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 flex items-center gap-2 overflow-hidden"
            >
              <Avatar src="https://i.pravatar.cc/150?img=68" name="Vous" size={28} />
              <div className="flex flex-1 items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-card)] px-4 py-2 transition-all focus-within:border-[var(--color-primary)] focus-within:ring-1 focus-within:ring-[var(--color-primary)]/30">
                <input
                  autoFocus
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleReply()}
                  placeholder={`Répondre à ${comment.author?.nom?.split(" ")[0]}...`}
                  className="flex-1 bg-transparent text-sm text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-tertiary)]"
                />
                <button
                  onClick={handleReply}
                  disabled={!replyText.trim() || addComment.isPending}
                  className="text-[var(--color-primary)] transition-opacity disabled:opacity-40"
                >
                  <Send size={15} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Show/hide replies toggle */}
        {hasReplies && depth === 0 && (
          <button
            onClick={() => setShowReplies((s) => !s)}
            className="mt-2 flex items-center gap-1 px-1 text-xs font-semibold text-[var(--color-primary)] transition-opacity hover:opacity-75"
          >
            {showReplies ? (
              <>
                <ChevronUp size={13} />
                {t("hideReplies")}
              </>
            ) : (
              <>
                <ChevronDown size={13} />
                {t("viewReplies", { count: comment.replies!.length })}
              </>
            )}
          </button>
        )}

        {/* Sub-comments */}
        <AnimatePresence>
          {showReplies && hasReplies && depth === 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              {comment.replies!.map((reply) => (
                <CommentItem key={reply.id} comment={reply} planId={planId} depth={1} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ─── Main Page ─── */
export default function PlanDetailPage() {
  const params = useParams();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("plan.detail");
  const planId = params.id as string;

  const { data: plan, isLoading, isError } = usePlan(planId);
  const { data: comments = [], isLoading: commentsLoading } = useComments(planId);
  const boostPlan = useBoostPlan();
  const favoritePlan = useFavoritePlan();
  const addComment = useAddComment(planId);

  const toggleFavorite = useStore((s) => s.toggleFavorite);
  const favorited = useStore((s) => s.favorites.includes(planId));

  const [optimisticBoosted, setOptimisticBoosted] = useState<boolean | null>(null);
  const [optimisticBoostCount, setOptimisticBoostCount] = useState<number | null>(null);
  const [following, setFollowing] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [showAllComments, setShowAllComments] = useState(false);
  const commentInputRef = useRef<HTMLInputElement>(null);

  const boosted = optimisticBoosted ?? plan?.is_boosted ?? false;
  const boostCount = optimisticBoostCount ?? plan?.boosts_count ?? 0;

  const cat = plan ? (CATEGORY_META[plan.categorie_id] ?? CATEGORY_META["cat-1"]) : null;

  const handleBoost = useCallback(() => {
    const next = !boosted;
    setOptimisticBoosted(next);
    setOptimisticBoostCount(next ? boostCount + 1 : Math.max(0, boostCount - 1));
    boostPlan.mutate(planId);
    if (next) toast.success(t("boostedToast"));
  }, [boosted, boostCount, boostPlan, planId, t]);

  const handleFavorite = useCallback(() => {
    toggleFavorite(planId);
    favoritePlan.mutate(planId);
    toast.success(favorited ? t("removedFav") : t("addedFav"));
  }, [toggleFavorite, favoritePlan, planId, favorited, t]);

  const handleSubmitComment = useCallback(() => {
    const text = commentText.trim();
    if (!text) return;
    addComment.mutate(
      { contenu: text, parent_id: null },
      {
        onSuccess: () => {
          setCommentText("");
          toast.success(t("commentAdded"));
          setShowAllComments(true);
        },
      }
    );
  }, [commentText, addComment, t]);

  // focusCommentInput removed (unused) to satisfy linter rules

  const visibleComments = showAllComments ? comments : comments.slice(0, 3);
  const totalCommentCount = comments.reduce((acc, c) => acc + 1 + (c.replies?.length ?? 0), 0);

  /* ── Loading skeleton ── */
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-page)]">
        <div className="relative h-[55vw] max-h-[480px] w-full animate-pulse bg-[var(--color-border)]" />
        <div className="mx-auto max-w-2xl px-4 py-6">
          <div className="mb-3 h-5 w-24 animate-pulse rounded-full bg-[var(--color-border)]" />
          <div className="mb-2 h-8 w-3/4 animate-pulse rounded-xl bg-[var(--color-border)]" />
          <div className="mb-6 h-4 w-32 animate-pulse rounded-lg bg-[var(--color-border)]" />
          <div className="flex gap-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-11 w-28 animate-pulse rounded-2xl bg-[var(--color-border)]"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ── Error state ── */
  if (isError || !plan) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[var(--color-bg-page)] px-4">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-[var(--color-primary-light)]">
          <MapPin className="h-10 w-10 text-[var(--color-primary)]" />
        </div>
        <h1 className="text-xl font-bold text-[var(--color-text-primary)]">{t("notFound")}</h1>
        <p className="text-center text-sm text-[var(--color-text-tertiary)]">{t("notFoundDesc")}</p>
        <button
          onClick={() => router.push(`/${locale}/plans`)}
          className="rounded-2xl bg-[var(--color-primary)] px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-[var(--color-primary-hover)]"
        >
          {t("backToPlans")}
        </button>
      </div>
    );
  }

  const CategoryIcon = cat!.icon;

  return (
    <div className="min-h-screen bg-[var(--color-bg-page)] pb-20">
      {/* HERO — Full-bleed image */}
      <div className="relative w-full overflow-hidden" style={{ height: "min(56vw, 520px)" }}>
        {plan.image_url ? (
          <Image
            src={plan.image_url}
            alt={plan.titre}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        ) : (
          <div className="absolute inset-0" style={{ backgroundColor: `${cat!.color}20` }} />
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70" />

        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="absolute top-14 left-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 backdrop-blur-md transition-all hover:bg-white active:scale-90 sm:top-5"
          aria-label="Retour"
        >
          <ArrowLeft className="h-5 w-5 text-gray-900" />
        </button>

        {/* More options */}
        <button
          className="absolute top-14 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 backdrop-blur-md transition-all hover:bg-white active:scale-90 sm:top-5"
          aria-label="Plus d'options"
        >
          <MoreHorizontal className="h-5 w-5 text-gray-900" />
        </button>

      </div>

      {/* CONTENT CARD */}
      <div
        className="relative z-10 -mt-6 rounded-t-3xl bg-[var(--color-bg-card)] pt-10 shadow-xl"
        style={{ minHeight: "calc(100vh - min(56vw, 520px) - 90px)" }}
      >
        <div className="absolute left-5 top-0 z-20 -translate-y-1/2 sm:left-6 lg:left-14 xl:left-20">
          <span
            className="inline-flex items-center gap-1 rounded-full border bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-primary)] shadow-sm"
            style={{ borderColor: cat!.color, color: cat!.color }}
          >
            <CategoryIcon size={12} strokeWidth={2.5} />
            {cat!.label}
          </span>
        </div>
        <div className="mx-auto max-w-2xl px-5 pb-16">

          {/* Title + location */}
          <div className="mb-6">
            <h1 className="text-2xl leading-tight font-bold tracking-tight text-[var(--color-text-primary)] sm:text-3xl">
              {plan.titre}
            </h1>
            <div className="mt-2 flex items-center gap-1.5 text-sm text-[var(--color-text-tertiary)]">
              <MapPin size={14} className="text-[var(--color-primary)]" />
              <span className="font-medium">{plan.ville}</span>
            </div>
          </div>

          {/* Action pills row */}
          <div className="mb-6 flex items-center gap-2">
            {/* Boost */}
            <motion.button
              onClick={handleBoost}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "flex flex-1 min-w-0 items-center justify-center gap-1 rounded-full px-3 py-2 text-xs font-semibold whitespace-nowrap transition-all border",
                boosted
                  ? "bg-[var(--color-primary)] border-[var(--color-primary)] text-white"
                  : "border border-[var(--color-border)] bg-[var(--color-bg-surface)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)]"
              )}
            >
              <Zap size={12} className={cn("transition-all", boosted && "fill-white")} />
              <span className="leading-none">{boostCount} {t("boosts")}</span>
            </motion.button>

            {/* Favorite */}
            <motion.button
              onClick={handleFavorite}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "flex flex-1 items-center justify-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold transition-all border",
                favorited
                  ? "border-red-200 bg-red-50 text-red-500"
                  : "border border-[var(--color-border)] bg-[var(--color-bg-surface)] text-[var(--color-text-secondary)] hover:border-red-200"
              )}
            >
              <Heart size={14} className={cn("transition-all", favorited && "fill-red-500")} />
              <span>{favorited ? t("addedFav").split(" ")[0] : t("favorite")}</span>
            </motion.button>

            {/* Share */}
            <motion.button
              onClick={() => setShowShare(true)}
              whileTap={{ scale: 0.95 }}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-surface)] px-3 py-2 text-sm font-semibold text-[var(--color-text-tertiary)] transition-all hover:border-[var(--color-border-strong)]"
            >
              <Share2 size={14} />
              <span>{t("share")}</span>
            </motion.button>
          </div>

          {/* Author section */}
          {plan.author && (
            <div className="mb-6 flex items-center justify-between rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-4">
              <div className="flex items-center gap-3">
                <Avatar src={plan.author.avatar_url} name={plan.author.nom} size={46} />
                <div>
                  <p className="text-sm font-bold text-[var(--color-text-primary)]">
                    {plan.author.nom}
                  </p>
                  <p className="text-xs text-[var(--color-text-tertiary)]">{t("creator")}</p>
                </div>
              </div>
              <motion.button
                onClick={() => {
                  setFollowing((f) => !f);
                  toast.success(following ? t("unfollowed") : t("followed"));
                }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  "rounded-full px-5 py-2 text-sm font-semibold transition-all",
                  following
                    ? "border border-[var(--color-border)] bg-[var(--color-bg-card)] text-[var(--color-text-secondary)]"
                    : "bg-[var(--color-primary)] text-white shadow-md hover:bg-[var(--color-primary-hover)]"
                )}
              >
                {following ? t("following") : t("follow")}
              </motion.button>
            </div>
          )}

          {/* Description */}
          <section className="mb-8">
            <h2 className="mb-3 text-lg font-bold text-[var(--color-text-primary)]">
              {t("description")}
            </h2>
            <p className="text-sm leading-7 text-[var(--color-text-secondary)]">
              {plan.description}
            </p>
          </section>

          {/* COMMENTS SECTION */}
          <section id="comments" className="mb-6">
            <h2 className="mb-4 text-lg font-bold text-[var(--color-text-primary)]">
              {t("comments")} <span className="text-[var(--color-text-tertiary)]">({totalCommentCount})</span>
            </h2>

            {/* Comments list */}
            {commentsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-3">
                    <div className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-[var(--color-border)]" />
                    <div className="flex-1 space-y-2">
                      <div className="h-16 animate-pulse rounded-2xl bg-[var(--color-border)]" />
                      <div className="h-3 w-20 animate-pulse rounded-full bg-[var(--color-border)]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : comments.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-10 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-bg-surface)]">
                  <MessageCircle size={24} className="text-[var(--color-text-tertiary)]" />
                </div>
                <p className="text-sm font-medium text-[var(--color-text-secondary)]">
                  {t("beFirst")}
                </p>
                <p className="text-xs text-[var(--color-text-tertiary)]">{t("beFirstDesc")}</p>
              </div>
            ) : (
              <div className="space-y-5">
                <AnimatePresence>
                  {visibleComments.map((comment, i) => (
                    <motion.div
                      key={comment.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <CommentItem comment={comment} planId={planId} />
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Show more */}
                {comments.length > 3 && (
                  <button
                    onClick={() => setShowAllComments((s) => !s)}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[var(--color-border)] py-3 text-sm font-semibold text-[var(--color-text-secondary)] transition-all hover:border-[var(--color-border-strong)] hover:text-[var(--color-text-primary)]"
                  >
                    {showAllComments ? (
                      <>
                        <ChevronUp size={16} />
                        {t("showLess")}
                      </>
                    ) : (
                      <>
                        <ChevronDown size={16} />
                        {t("showAll", { count: totalCommentCount })}
                      </>
                    )}
                  </button>
                )}
              </div>
            )}
          </section>
        </div>
      </div>

      {/* FIXED BOTTOM BAR */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--color-border)] bg-[var(--color-bg-card)]/95 px-4 py-3 backdrop-blur-md">
        <div className="mx-auto max-w-2xl">
          <div className="flex items-center gap-3">
            <Avatar src="https://i.pravatar.cc/150?img=68" name="Vous" size={36} />
            <div className="flex flex-1 items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-surface)] px-4 py-2.5 transition-all focus-within:border-[var(--color-primary)] focus-within:bg-[var(--color-bg-card)]">
              <input
                ref={commentInputRef}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmitComment()}
                placeholder={t("writeComment")}
                className="flex-1 bg-transparent text-sm text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-tertiary)]"
              />
              <motion.button
                onClick={handleSubmitComment}
                disabled={!commentText.trim() || addComment.isPending}
                whileTap={{ scale: 0.9 }}
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-all",
                  commentText.trim()
                    ? "text-[var(--color-primary)]"
                    : "text-[var(--color-text-tertiary)]"
                )}
              >
                <Send size={16} className={commentText.trim() ? "" : "opacity-50"} />
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* SHARE SHEET MODAL */}
      <AnimatePresence>
        {showShare && plan && <ShareSheet plan={plan} onClose={() => setShowShare(false)} t={t} />}
      </AnimatePresence>
    </div>
  );
}