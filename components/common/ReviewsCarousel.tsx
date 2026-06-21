"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { Star, ChevronLeft, ChevronRight, X, Quote, MapPin, BadgeCheck, Pen, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
  {
    id: 7,
    name: "Marie-Claire B.",
    avatar: "https://i.pravatar.cc/150?img=16",
    city: "Bafoussam",
    rating: 5,
    text: "Le poulet DG de Maman Rachel est une tuerie ! Merci Planoka pour cette découverte. Mon nouveau resto préféré.",
    planTitle: "Poulet DG chez Maman Rachel",
    planCity: "Bafoussam",
    date: "Il y a 1 jour",
    verified: true,
  },
  {
    id: 8,
    name: "Olivier N.",
    avatar: "https://i.pravatar.cc/150?img=12",
    city: "Kribi",
    rating: 5,
    text: "La soirée jazz au bord de mer était magique. Planoka m'a permis de réserver directement. Service au top !",
    planTitle: "Soirée Jazz au Bord de Mer",
    planCity: "Kribi",
    date: "Il y a 2 semaines",
    verified: true,
  },
  {
    id: 9,
    name: "Sandrine F.",
    avatar: "https://i.pravatar.cc/150?img=20",
    city: "Yaoundé",
    rating: 4,
    text: "L'atelier codage pour enfants est génial. Mon fils adore ! Il veut maintenant devenir développeur. Merci Planoka.",
    planTitle: "Atelier codage pour enfants",
    planCity: "Yaoundé",
    date: "Il y a 3 jours",
    verified: true,
  },
  {
    id: 10,
    name: "Thierry M.",
    avatar: "https://i.pravatar.cc/150?img=14",
    city: "Douala",
    rating: 5,
    text: "Le tournoi de football inter-quartier a rassemblé tout le monde. Planoka est devenu incontournable dans notre quartier.",
    planTitle: "Tournoi de football inter-quartier",
    planCity: "Douala",
    date: "Il y a 1 semaine",
    verified: false,
  },
  {
    id: 11,
    name: "Carine A.",
    avatar: "https://i.pravatar.cc/150?img=23",
    city: "Edéa",
    rating: 5,
    text: "Les brochettes de bœuf à la Place de la Liberté sont incroyables. Sauce piquante maison, c'est le feu ! Je recommande à 100%.",
    planTitle: "Brochettes de bœuf — Place de la Liberté",
    planCity: "Edéa",
    date: "Il y a 4 jours",
    verified: true,
  },
  {
    id: 12,
    name: "Dieudonné K.",
    avatar: "https://i.pravatar.cc/150?img=15",
    city: "Douala",
    rating: 4,
    text: "L'abonnement salle de sport à -50% est une vraie pépite. Salle moderne, coach sympa. Je recommande !",
    planTitle: "Abonnement salle de sport -50%",
    planCity: "Douala",
    date: "Il y a 5 jours",
    verified: true,
  },
  {
    id: 13,
    name: "Esther W.",
    avatar: "https://i.pravatar.cc/150?img=25",
    city: "Yaoundé",
    rating: 5,
    text: "Le marché artisanal m'a permis de trouver des bijoux uniques en perles. Planoka connecte vraiment les gens aux bonnes adresses.",
    planTitle: "Marché artisanal — Bijoux et tissus",
    planCity: "Yaoundé",
    date: "Il y a 2 jours",
    verified: true,
  },
  {
    id: 14,
    name: "Gilles P.",
    avatar: "https://i.pravatar.cc/150?img=18",
    city: "Limbe",
    rating: 5,
    text: "La bibliothèque mobile est une super idée. Mes enfants lisent enfin plus souvent grâce aux ateliers Planoka.",
    planTitle: "Bibliothèque mobile — Livres gratuits",
    planCity: "Limbe",
    date: "Il y a 1 semaine",
    verified: false,
  },
  {
    id: 15,
    name: "Joséphine T.",
    avatar: "https://i.pravatar.cc/150?img=26",
    city: "Douala",
    rating: 5,
    text: "Le afterwork chez Sandra est l'endroit parfait pour se détendre. Cocktails -40% et ambiance lounge. Merci Planoka !",
    planTitle: "Afterwork — Terrasse Chez Sandra",
    planCity: "Douala",
    date: "Il y a 3 jours",
    verified: true,
  },
];

function ReviewCard({ review, onClick }: { review: Review; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="flex-shrink-0 w-[280px] sm:w-[320px] cursor-pointer snap-start"
    >
      <div className="h-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-5 transition-all hover:shadow-lg hover:border-[var(--color-primary)]/20 active:scale-[0.98]">
        <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-primary-light)]">
          <Quote className="h-4 w-4 text-[var(--color-primary)]" />
        </div>

        <div className="mb-2 flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={cn(
                "h-4 w-4",
                i < review.rating ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"
              )}
            />
          ))}
        </div>

        <p className="text-sm leading-relaxed text-[var(--color-text-secondary)] line-clamp-3">
          {review.text}
        </p>

        <div className="mt-3 rounded-xl bg-[var(--color-bg-surface)] p-3">
          <p className="text-xs font-medium text-[var(--color-text-primary)] truncate">{review.planTitle}</p>
          <div className="mt-1 flex items-center gap-1 text-[11px] text-[var(--color-text-tertiary)]">
            <MapPin className="h-3 w-3" />
            <span>{review.planCity}</span>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-3">
          <div className="relative h-9 w-9 overflow-hidden rounded-full bg-[var(--color-bg-surface)]">
            <Image src={review.avatar} alt={review.name} width={36} height={36} className="h-full w-full object-cover" loading="lazy" />
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
    </div>
  );
}

function ReviewModal({ review, onClose }: { review: Review; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 100, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 100, scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="w-full sm:max-w-md max-h-[85vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-bg-surface)] text-[var(--color-text-tertiary)]">
          <X className="h-4 w-4" />
        </button>

        <div className="mb-4 flex items-center gap-4">
          <div className="relative h-14 w-14 overflow-hidden rounded-full bg-[var(--color-bg-surface)]">
            <Image src={review.avatar} alt={review.name} width={56} height={56} className="h-full w-full object-cover" loading="lazy" />
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

        <div className="mb-4 flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className={cn("h-5 w-5", i < review.rating ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200")} />
          ))}
          <span className="ml-2 text-sm font-medium text-[var(--color-text-secondary)]">{review.rating}/5</span>
        </div>

        <p className="text-base leading-relaxed text-[var(--color-text-secondary)]">{review.text}</p>

        <div className="mt-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-4">
          <p className="text-sm font-semibold text-[var(--color-text-primary)]">{review.planTitle}</p>
          <div className="mt-1 flex items-center gap-1 text-sm text-[var(--color-text-tertiary)]">
            <MapPin className="h-3.5 w-3.5" />
            <span>{review.planCity}</span>
          </div>
        </div>

        <p className="mt-4 text-xs text-[var(--color-text-tertiary)]">{review.date}</p>
      </motion.div>
    </motion.div>
  );
}

function WriteReviewModal({ onClose }: { onClose: () => void }) {
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (rating === 0 || !name.trim() || !text.trim()) return;
    setSubmitted(true);
    setTimeout(() => onClose(), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 100, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 100, scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="w-full sm:max-w-md max-h-[85vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-[var(--color-text-primary)]">Laisser un avis</h3>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-bg-surface)] text-[var(--color-text-tertiary)]">
            <X className="h-4 w-4" />
          </button>
        </div>

        {submitted ? (
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="py-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-success)]/10">
              <Send className="h-8 w-8 text-[var(--color-success)]" />
            </div>
            <h4 className="text-lg font-bold text-[var(--color-text-primary)]">Merci pour votre avis !</h4>
            <p className="mt-1 text-sm text-[var(--color-text-secondary)]">Votre retour aide la communauté Planoka.</p>
          </motion.div>
        ) : (
          <>
            {/* Rating */}
            <div className="mb-5">
              <p className="mb-2 text-sm font-medium text-[var(--color-text-primary)]">Votre note</p>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(0)}
                    onClick={() => setRating(star)}
                    className="transition-transform hover:scale-110 active:scale-95"
                  >
                    <Star className={cn("h-8 w-8 transition-colors", (hoveredStar || rating) >= star ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200")} />
                  </button>
                ))}
                {rating > 0 && <span className="ml-2 text-sm text-[var(--color-text-tertiary)]">{rating}/5</span>}
              </div>
            </div>

            {/* Name */}
            <div className="mb-4">
              <p className="mb-2 text-sm font-medium text-[var(--color-text-primary)]">Votre nom</p>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Marie K."
                className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] px-4 py-3 text-sm text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-tertiary)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all"
              />
            </div>

            {/* Review text */}
            <div className="mb-6">
              <p className="mb-2 text-sm font-medium text-[var(--color-text-primary)]">Votre avis</p>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Partagez votre expérience avec Planoka..."
                rows={4}
                className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] px-4 py-3 text-sm text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-tertiary)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all resize-none"
              />
            </div>

            <Button
              onClick={handleSubmit}
              disabled={rating === 0 || !name.trim() || !text.trim()}
              className="w-full rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-hover)] text-white hover:brightness-90 disabled:opacity-40"
            >
              <Send className="mr-2 h-4 w-4" />
              Envoyer mon avis
            </Button>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}

export function ReviewsCarousel() {
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [showWriteModal, setShowWriteModal] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Duplicate reviews for infinite scroll illusion
  const allReviews = [...REVIEWS, ...REVIEWS];

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", checkScroll, { passive: true });
    checkScroll();
    return () => el.removeEventListener("scroll", checkScroll);
  }, [checkScroll]);

  // Auto-scroll
  useEffect(() => {
    if (!isAutoPlaying) return;
    const el = scrollRef.current;
    if (!el) return;

    const interval = setInterval(() => {
      if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 10) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: 320, behavior: "smooth" });
      }
    }, 3500);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const scroll = (direction: "left" | "right") => {
    setIsAutoPlaying(false);
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: direction === "left" ? -320 : 320, behavior: "smooth" });
  };

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
            {/* Nav arrows — desktop only */}
            {canScrollLeft && (
              <button
                onClick={() => scroll("left")}
                className="absolute -left-2 top-1/2 -translate-y-1/2 z-10 hidden sm:flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-bg-card)] shadow-lg border border-[var(--color-border)] hover:bg-[var(--color-bg-surface)] transition-colors"
              >
                <ChevronLeft className="h-5 w-5 text-[var(--color-text-primary)]" />
              </button>
            )}
            {canScrollRight && (
              <button
                onClick={() => scroll("right")}
                className="absolute -right-2 top-1/2 -translate-y-1/2 z-10 hidden sm:flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-bg-card)] shadow-lg border border-[var(--color-border)] hover:bg-[var(--color-bg-surface)] transition-colors"
              >
                <ChevronRight className="h-5 w-5 text-[var(--color-text-primary)]" />
              </button>
            )}

            {/* Cards — horizontal scroll */}
            <div
              ref={scrollRef}
              className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-2"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              onMouseEnter={() => setIsAutoPlaying(false)}
              onMouseLeave={() => setIsAutoPlaying(true)}
            >
              {allReviews.map((review, i) => (
                <ReviewCard
                  key={`${review.id}-${i}`}
                  review={review}
                  onClick={() => setSelectedReview(review)}
                />
              ))}
            </div>

            {/* Gradient fade edges */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-[var(--color-bg-page)] to-transparent sm:w-16" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-[var(--color-bg-page)] to-transparent sm:w-16" />
          </div>

          {/* Write review button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-8 flex justify-center"
          >
            <Button
              onClick={() => setShowWriteModal(true)}
              className="gap-2 rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-hover)] px-6 py-2.5 text-sm font-medium text-white shadow-md shadow-[var(--color-primary)]/20 hover:brightness-90"
            >
              <Pen className="h-4 w-4" />
              Laisser un avis
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Modals */}
      <AnimatePresence>
        {selectedReview && (
          <ReviewModal review={selectedReview} onClose={() => setSelectedReview(null)} />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showWriteModal && (
          <WriteReviewModal onClose={() => setShowWriteModal(false)} />
        )}
      </AnimatePresence>
    </>
  );
}