"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Star, ChevronLeft, ChevronRight, X, Quote, MapPin, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

type Review = {
  id: number;
  name: string;
  avatar: string;
  city: string;
  rating: number;
  text: string;
  planTitle: string;
  planCity: string;
  date: string;
  verified: boolean;
};

const REVIEWS: Review[] = [
  {
    id: 1,
    name: "Aimée N.",
    avatar: "https://i.pravatar.cc/150?img=1",
    city: "Douala",
    rating: 5,
    text: "Planoka m'a fait découvrir des pépites incroyables dans mon quartier ! Le meilleur ndolé de Douala, je ne l'aurais jamais trouvé sans cette app.",
    planTitle: "Chez Mama Ngono — Ndolé spécial",
    planCity: "Douala",
    date: "Il y a 2 jours",
    verified: true,
  },
  {
    id: 2,
    name: "Samuel K.",
    avatar: "https://i.pravatar.cc/150?img=3",
    city: "Yaoundé",
    rating: 5,
    text: "J'ai économisé plus de 50 000 FCFA grâce aux promotions trouvées sur Planoka. L'appli est indispensable pour vivre à Yaoundé !",
    planTitle: "Soldes d'été — 50% sur tout le stock",
    planCity: "Yaoundé",
    date: "Il y a 5 jours",
    verified: true,
  },
  {
    id: 3,
    name: "Chantal M.",
    avatar: "https://i.pravatar.cc/150?img=5",
    city: "Bamenda",
    rating: 4,
    text: "Les recommandations sont vraiment personnalisées. J'adore pouvoir booster les plans que je trouve géniaux et les partager avec mes amis.",
    planTitle: "Concert Africain au Centre Culturel",
    planCity: "Bamenda",
    date: "Il y a 1 semaine",
    verified: true,
  },
  {
    id: 4,
    name: "Paul E.",
    avatar: "https://i.pravatar.cc/150?img=8",
    city: "Douala",
    rating: 5,
    text: "Enfin une app 100% camerounaise qui marche ! Interface super clean, les plans sont vérifiés et la communauté est très active.",
    planTitle: "Escape Game — Défi au Centre Ville",
    planCity: "Douala",
    date: "Il y a 3 jours",
    verified: true,
  },
  {
    id: 5,
    name: "Brigitte T.",
    avatar: "https://i.pravatar.cc/150?img=9",
    city: "Limbe",
    rating: 5,
    text: "Grâce à Planoka, j'ai trouvé un coiffeur à domicile de qualité à prix doux. Les avis des autres utilisateurs m'ont convaincue !",
    planTitle: "Coiffure tresses à domicile",
    planCity: "Limbe",
    date: "Il y a 4 jours",
    verified: true,
  },
  {
    id: 6,
    name: "Jean-Pierre L.",
    avatar: "https://i.pravatar.cc/150?img=11",
    city: "Garoua",
    rating: 4,
    text: "Les séances de yoga en plein air, c'est grâce à Planoka que je les ai découvertes. Maintenant je n'y manque plus jamais !",
    planTitle: "Séance de yoga en plein air",
    planCity: "Garoua",
    date: "Il y a 6 jours",
    verified: false,
  },
];

function ReviewCard({ review, onClick }: { review: Review; onClick: () => void }) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="flex-shrink-0 w-[320px] sm:w-[360px] cursor-pointer"
    >
      <div className="h-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-5 transition-all hover:shadow-lg hover:border-[var(--color-primary)]/20">
        {/* Quote icon */}
        <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-primary-light)]">
          <Quote className="h-4 w-4 text-[var(--color-primary)]" />
        </div>

        {/* Rating */}
        <div className="mb-2 flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${
                i < review.rating
                  ? "fill-amber-400 text-amber-400"
                  : "fill-gray-200 text-gray-200"
              }`}
            />
          ))}
        </div>

        {/* Review text */}
        <p className="text-sm leading-relaxed text-[var(--color-text-secondary)] line-clamp-4">
          {review.text}
        </p>

        {/* Plan info */}
        <div className="mt-3 rounded-xl bg-[var(--color-bg-surface)] p-3">
          <p className="text-xs font-medium text-[var(--color-text-primary)] truncate">
            {review.planTitle}
          </p>
          <div className="mt-1 flex items-center gap-1 text-[11px] text-[var(--color-text-tertiary)]">
            <MapPin className="h-3 w-3" />
            <span>{review.planCity}</span>
          </div>
        </div>

        {/* Author */}
        <div className="mt-3 flex items-center gap-3">
          <div className="relative h-9 w-9">
            <Image
              src={review.avatar}
              alt={review.name}
              width={36}
              height={36}
              className="rounded-full object-cover"
            />
            {review.verified && (
              <div className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--color-primary)]">
                <BadgeCheck className="h-3 w-3 text-white" />
              </div>
            )}
          </div>
          <div>
            <p className="text-sm font-semibold text-[var(--color-text-primary)]">{review.name}</p>
            <p className="text-[11px] text-[var(--color-text-tertiary)]">{review.city} &bull; {review.date}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ReviewModal({ review, onClose }: { review: Review; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="relative w-full max-w-md rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-bg-surface)] text-[var(--color-text-tertiary)] transition-colors hover:bg-[var(--color-border)]"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header */}
        <div className="mb-4 flex items-center gap-4">
          <div className="relative h-14 w-14">
            <Image
              src={review.avatar}
              alt={review.name}
              width={56}
              height={56}
              className="rounded-full object-cover"
            />
            {review.verified && (
              <div className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-primary)] ring-2 ring-[var(--color-bg-card)]">
                <BadgeCheck className="h-3 w-3 text-white" />
              </div>
            )}
          </div>
          <div>
            <h3 className="text-lg font-bold text-[var(--color-text-primary)]">{review.name}</h3>
            <p className="text-sm text-[var(--color-text-tertiary)]">{review.city}</p>
          </div>
        </div>

        {/* Rating */}
        <div className="mb-4 flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-5 w-5 ${
                i < review.rating
                  ? "fill-amber-400 text-amber-400"
                  : "fill-gray-200 text-gray-200"
              }`}
            />
          ))}
          <span className="ml-2 text-sm font-medium text-[var(--color-text-secondary)]">
            {review.rating}/5
          </span>
        </div>

        {/* Review text */}
        <p className="text-base leading-relaxed text-[var(--color-text-secondary)]">
          {review.text}
        </p>

        {/* Plan info */}
        <div className="mt-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-4">
          <p className="text-sm font-semibold text-[var(--color-text-primary)]">
            {review.planTitle}
          </p>
          <div className="mt-1 flex items-center gap-1 text-sm text-[var(--color-text-tertiary)]">
            <MapPin className="h-3.5 w-3.5" />
            <span>{review.planCity}</span>
          </div>
        </div>

        {/* Date */}
        <p className="mt-4 text-xs text-[var(--color-text-tertiary)]">
          {review.date}
        </p>
      </motion.div>
    </motion.div>
  );
}

export function ReviewsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % REVIEWS.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + REVIEWS.length) % REVIEWS.length);
  }, []);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(nextSlide, 4000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide]);

  return (
    <>
      <section className="py-16 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-10 flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500"
            >
              <Star className="h-6 w-6 text-white fill-white" />
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-2xl font-bold text-[var(--color-text-primary)] sm:text-3xl"
            >
              Avis de notre communauté
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mt-2 max-w-md text-[var(--color-text-secondary)]"
            >
              Découvrez ce que nos utilisateurs pensent de Planoka
            </motion.p>
          </div>

          {/* Carousel */}
          <div className="relative">
            {/* Navigation arrows */}
            <Button
              variant="outline"
              size="icon"
              className="absolute -left-2 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-[var(--color-bg-card)] shadow-lg hidden sm:flex"
              onClick={() => {
                prevSlide();
                setIsAutoPlaying(false);
              }}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="absolute -right-2 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-[var(--color-bg-card)] shadow-lg hidden sm:flex"
              onClick={() => {
                nextSlide();
                setIsAutoPlaying(false);
              }}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>

            {/* Cards container */}
            <div className="overflow-hidden px-2">
              <motion.div
                className="flex gap-4"
                animate={{ x: `-${currentIndex * (360 + 16)}px` }}
                transition={{ type: "spring", stiffness: 200, damping: 30 }}
              >
                {REVIEWS.map((review) => (
                  <ReviewCard
                    key={review.id}
                    review={review}
                    onClick={() => setSelectedReview(review)}
                  />
                ))}
              </motion.div>
            </div>

            {/* Dots */}
            <div className="mt-8 flex items-center justify-center gap-2">
              {REVIEWS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setCurrentIndex(i);
                    setIsAutoPlaying(false);
                  }}
                  className={`rounded-full transition-all ${
                    i === currentIndex
                      ? "h-2.5 w-2.5 bg-[var(--color-primary)]"
                      : "h-2 w-2 bg-[var(--color-border)]"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Review Modal */}
      <AnimatePresence>
        {selectedReview && (
          <ReviewModal review={selectedReview} onClose={() => setSelectedReview(null)} />
        )}
      </AnimatePresence>
    </>
  );
}