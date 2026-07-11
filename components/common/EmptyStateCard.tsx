"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";

interface EmptyStateCardProps {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyStateCard({
  title,
  description,
  imageSrc,
  imageAlt = "Mascotte Planoka",
  actionLabel,
  onAction,
  className,
}: EmptyStateCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`mx-auto flex w-full max-w-xl flex-col items-center justify-center gap-8 px-6 py-16 text-center sm:px-8 sm:py-20 ${className ?? ""}`.trim()}
    >
      <Image src={imageSrc} alt={imageAlt} width={280} height={260} className="object-contain sm:h-[300px] sm:w-[320px]" />

      <div className="space-y-3">
        <h3 className="text-3xl font-bold text-[var(--color-text-primary)] sm:text-4xl">{title}</h3>
        <p className="mx-auto max-w-md text-sm leading-6 text-[var(--color-text-tertiary)]">{description}</p>
      </div>

      {actionLabel && onAction ? (
        <Button
          className="rounded-full bg-[var(--color-primary)] px-8 py-3 text-sm font-semibold text-white transition duration-200 hover:brightness-95"
          onClick={onAction}
        >
          {actionLabel}
        </Button>
      ) : null}
    </motion.div>
  );
}
