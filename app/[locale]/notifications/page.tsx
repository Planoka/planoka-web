"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { formatDistanceToNow } from "date-fns";
import { fr, enUS } from "date-fns/locale";
import { Bell, Zap, MessageCircle, Info, Check, ArrowLeft } from "lucide-react";
import { useStore } from "@/store/useStore";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import type { NotificationType } from "@/types";

const ICONS: Record<NotificationType, React.ReactNode> = {
  boost: <Zap size={16} className="fill-[var(--color-primary)] text-[var(--color-primary)]" />,
  comment: <MessageCircle size={16} className="text-blue-500" />,
  system: <Info size={16} className="text-green-500" />,
};

export default function NotificationsPage() {
  const t = useTranslations("notifications");
  const locale = useLocale();
  const router = useRouter();
  const dateLocale = locale === "fr" ? fr : enUS;

  const notifications = useStore((s) => s.notifications);
  const markAsRead = useStore((s) => s.markNotificationAsRead);
  const markAllAsRead = useStore((s) => s.markAllNotificationsAsRead);

  // Mark all as read when leaving the page? No, let the user click them or use the mark all button.

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 md:py-10">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="flex h-10 w-10 items-center justify-center rounded-full text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-bg-surface)] hover:text-[var(--color-text-primary)] md:hidden"
            aria-label="Back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
            {t("title", { fallback: "Notifications" })}
          </h1>
        </div>
        {notifications.some((n) => !n.is_read) && (
          <button
            onClick={markAllAsRead}
            className="flex items-center gap-1.5 rounded-full bg-[var(--color-bg-surface)] px-4 py-2 text-sm font-medium text-[var(--color-text-secondary)] shadow-sm transition-colors hover:bg-[var(--color-bg-card)] hover:text-[var(--color-primary)]"
          >
            <Check size={16} />
            <span className="hidden sm:inline">
              {t("markAllAsRead", { fallback: "Tout marquer comme lu" })}
            </span>
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-bg-surface)] text-[var(--color-text-tertiary)]">
            <Bell size={32} />
          </div>
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
            {t("emptyTitle", { fallback: "Aucune notification" })}
          </h2>
          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
            {t("emptyDesc", {
              fallback: "Vous n'avez pas de nouvelles notifications pour le moment.",
            })}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {notifications.map((notif) => {
            const isUnread = !notif.is_read;
            const timeAgo = formatDistanceToNow(new Date(notif.created_at), {
              addSuffix: true,
              locale: dateLocale,
            });

            const href = notif.plan_id ? `/${locale}/plans/${notif.plan_id}` : "#";

            return (
              <Link
                key={notif.id}
                href={href}
                onClick={() => markAsRead(notif.id)}
                className={cn(
                  "relative flex items-start gap-4 rounded-2xl border p-4 transition-all hover:border-[var(--color-primary)]/30 hover:shadow-md",
                  isUnread
                    ? "border-[var(--color-primary)]/20 bg-[var(--color-primary)]/5"
                    : "border-[var(--color-border)] bg-[var(--color-bg-card)]"
                )}
              >
                {/* Unread dot indicator */}
                {isUnread && (
                  <span className="absolute top-4 left-2 h-2 w-2 rounded-full bg-[var(--color-primary)]" />
                )}

                {/* Avatar / Icon */}
                <div className="relative shrink-0">
                  {notif.sender ? (
                    <div className="relative h-12 w-12 overflow-hidden rounded-full border border-[var(--color-border)] bg-[var(--color-bg-surface)]">
                      {notif.sender.avatar_url ? (
                        <Image
                          src={notif.sender.avatar_url}
                          alt={notif.sender.nom}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <span className="flex h-full w-full items-center justify-center font-bold text-[var(--color-text-secondary)]">
                          {notif.sender.nom.charAt(0)}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-bg-surface)]">
                      <Bell size={20} className="text-[var(--color-text-secondary)]" />
                    </div>
                  )}
                  {/* Small Type Icon overlay */}
                  <div className="absolute -right-1 -bottom-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-white shadow-sm dark:border-[var(--color-bg-card)] dark:bg-[var(--color-bg-card)]">
                    {ICONS[notif.type]}
                  </div>
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-[var(--color-text-primary)]">
                    {notif.sender && <span className="mr-1 font-bold">{notif.sender.nom}</span>}
                    {notif.content}
                  </p>
                  {notif.plan && (
                    <p className="mt-1 line-clamp-1 text-sm font-medium text-[var(--color-text-secondary)]">
                      {notif.plan.titre}
                    </p>
                  )}
                  <p className="mt-2 text-xs text-[var(--color-text-tertiary)]">{timeAgo}</p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
