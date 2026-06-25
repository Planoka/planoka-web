"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "motion/react";
import { X, MessageCircle, Send } from "lucide-react";
import { getCommentsByPlanId } from "@/lib/mock-data";
import { formatDistanceToNow } from "date-fns";
import { fr, enUS } from "date-fns/locale";
import { useLocale } from "next-intl";
import type { Plan } from "@/types";

interface DiscoverCommentsSheetProps {
  plan: Plan | null;
  onClose: () => void;
}

export function DiscoverCommentsSheet({ plan, onClose }: DiscoverCommentsSheetProps) {
  const t = useTranslations("explore");
  const locale = useLocale();
  const dateLocale = locale === "fr" ? fr : enUS;
  
  const [newComments, setNewComments] = useState<ReturnType<typeof getCommentsByPlanId>>([]);
  const [prevPlanId, setPrevPlanId] = useState(plan?.id);
  const [newCommentText, setNewCommentText] = useState("");

  if (plan?.id !== prevPlanId) {
    setPrevPlanId(plan?.id);
    setNewComments([]);
  }

  const comments = plan ? [...newComments, ...getCommentsByPlanId(plan.id)] : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    // Simulate adding comment
    const comment = {
      id: `new-${Date.now()}`,
      plan_id: plan?.id || "",
      user_id: "current-user",
      content: newCommentText,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user: {
        id: "current-user",
        nom: "Vous",
        prenom: "",
        avatar_url: null
      }
    };
    
    setNewComments([comment, ...newComments]);
    setNewCommentText("");
  };

  return (
    <AnimatePresence>
      {plan && (
        <>
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[2000] bg-black/60 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Bottom Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-x-0 bottom-0 z-[2001] flex max-h-[85vh] min-h-[50vh] flex-col rounded-t-[32px] bg-[var(--color-bg-primary)] shadow-2xl md:left-1/2 md:w-[500px] md:-translate-x-1/2"
            role="dialog"
            aria-modal="true"
            aria-labelledby="comments-title"
          >
            {/* Header */}
            <div className="relative flex items-center justify-center border-b border-[var(--color-border)] p-4">
              <h2 id="comments-title" className="text-lg font-bold text-[var(--color-text-primary)]">
                {comments.length} {t("comments")}
              </h2>
              <button
                onClick={onClose}
                className="absolute right-4 flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-bg-surface)] text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-20">
              {comments.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center text-[var(--color-text-tertiary)]">
                  <MessageCircle size={40} className="mb-3 opacity-20" />
                  <p>Soyez le premier à commenter !</p>
                </div>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    {/* Avatar */}
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-[var(--color-bg-surface)]">
                      {comment.user?.avatar_url ? (
                        <Image src={comment.user.avatar_url} alt="" fill className="object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center font-bold text-[var(--color-text-secondary)]">
                          {comment.user?.nom?.charAt(0) || "U"}
                        </div>
                      )}
                    </div>
                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-[var(--color-text-primary)]">
                          {comment.user?.nom}
                        </span>
                        <span className="text-xs text-[var(--color-text-tertiary)]">
                          {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true, locale: dateLocale })}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Input Footer */}
            <div className="absolute bottom-0 left-0 right-0 border-t border-[var(--color-border)] bg-[var(--color-bg-primary)] p-4">
              <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Ajouter un commentaire..."
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  className="flex-1 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-surface)] px-4 py-2 text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-primary)]"
                />
                <button
                  type="submit"
                  disabled={!newCommentText.trim()}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] text-white disabled:opacity-50"
                >
                  <Send size={16} className="ml-1" />
                </button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
