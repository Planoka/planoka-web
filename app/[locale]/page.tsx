"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import {
  Search,
  MapPin,
  ArrowRight,
  Sparkles,
  Star,
  Share2,
  Compass,
  Zap,
  Heart,
  Globe,
  ChevronDown,
} from "lucide-react";
import { CategoryPills } from "@/components/feed/CategoryPills";
import { PlanCard } from "@/components/plans/PlanCard";
import { getPlansWithDetails, getFeaturedPlans } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const features = [
  {
    icon: Compass,
    title: "Explorez",
    desc: "Découvrez des centaines de bons plans vérifiés près de chez vous : restaurants, sorties, loisirs et services.",
  },
  {
    icon: Zap,
    title: "Boosts",
    desc: "Boostez les plans que vous aimez et aidez-les à gagner en visibilité auprès de la communauté.",
  },
  {
    icon: Heart,
    title: "Favoris",
    desc: "Sauvegardez vos plans préférés et constituez votre propre collection d'adresses incontournables.",
  },
  {
    icon: Share2,
    title: "Partage",
    desc: "Partagez vos découvertes avec vos amis sur WhatsApp, Instagram, X et bien plus encore.",
  },
  {
    icon: Star,
    title: "Recommandations",
    desc: "Recevez des suggestions personnalisées basées sur vos centres d'intérêt et votre ville.",
  },
  {
    icon: Globe,
    title: "Local",
    desc: "100% camerounais : des bons plans qui célèbrent la richesse et la diversité de notre pays.",
  },
];

const stats = [
  { value: "500+", label: "Bons plans publiés" },
  { value: "10K+", label: "Utilisateurs actifs" },
  { value: "50+", label: "Villes couvertes" },
  { value: "8", label: "Catégories" },
];

export default function HomePage() {
  const t = useTranslations("feed");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const allPlans = useMemo(() => getPlansWithDetails(), []);
  const featuredPlans = useMemo(() => getFeaturedPlans(), []);

  const filteredPlans = useMemo(() => {
    if (!selectedCategory) return allPlans;
    const catMap: Record<string, string> = {
      restauration: "cat-1",
      loisirs: "cat-2",
      sorties: "cat-3",
      shopping: "cat-4",
      services: "cat-5",
      sante: "cat-6",
      education: "cat-7",
      sport: "cat-8",
    };
    return allPlans.filter((p) => p.categorie_id === catMap[selectedCategory]);
  }, [selectedCategory, allPlans]);

  return (
    <div className="min-h-screen">
      {/* ═══ HERO SECTION ═══ */}
      <section className="relative overflow-hidden pt-12 pb-16 sm:pt-20">
        {/* Background decoration */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-[var(--color-primary)]/5 blur-3xl" />
          <div className="absolute -top-20 -right-40 h-80 w-80 rounded-full bg-[var(--color-primary)]/5 blur-3xl" />
          <div className="absolute bottom-0 left-1/2 h-px w-1/2 -translate-x-1/2 bg-gradient-to-r from-transparent via-[var(--color-primary)]/20 to-transparent" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col-reverse items-center gap-12 lg:flex-row lg:justify-between">
            {/* Text Content */}
            <div className="flex-1 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-[var(--color-primary)]/20 bg-[var(--color-primary-light)] px-4 py-1.5 text-xs font-medium text-[var(--color-primary)]"
              >
                <Sparkles className="h-3.5 w-3.5" />
                La première plateforme de bons plans au Cameroun
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-4xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-5xl lg:text-6xl"
              >
                Les meilleurs plans
                <span className="text-[var(--color-primary)]"> près de chez vous</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mx-auto mt-4 max-w-xl text-base text-[var(--color-text-secondary)] sm:text-lg lg:mx-0"
              >
                {t("subtitle")}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mx-auto mt-8 flex max-w-md items-center gap-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)] px-4 py-2.5 shadow-sm transition-all focus-within:border-[var(--color-primary)] focus-within:ring-2 focus-within:ring-[var(--color-primary)]/20 lg:mx-0"
              >
                <Search className="h-5 w-5 text-[var(--color-text-tertiary)]" />
                <input
                  type="text"
                  placeholder="Rechercher un bon plan, une ville..."
                  className="flex-1 bg-transparent text-sm text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-tertiary)]"
                />
                <kbd className="hidden rounded-md border border-[var(--color-border)] px-1.5 py-0.5 text-[10px] text-[var(--color-text-tertiary)] sm:inline">
                  ⌘K
                </kbd>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start"
              >
                <Button
                  size="lg"
                  className="gap-2 rounded-full bg-[var(--color-primary)] px-8 text-base hover:brightness-90"
                >
                  Explorer les plans
                  <ChevronDown className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="lg" className="gap-2 rounded-full px-8 text-base">
                  En savoir plus
                </Button>
              </motion.div>
            </div>

            {/* Mascot Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="relative flex-1"
            >
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="relative mx-auto h-64 w-64 sm:h-80 sm:w-80 lg:h-[450px] lg:w-[450px]"
              >
                <Image
                  src="/images/mascot.png"
                  alt="Planoka Mascot"
                  fill
                  className="object-contain drop-shadow-2xl"
                  priority
                />
              </motion.div>
              {/* Floating elements around mascot */}
              <motion.div
                animate={{ y: [0, -10, 0], rotate: [0, 10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute top-10 right-10 rounded-2xl bg-white p-3 shadow-xl lg:right-20"
              >
                <Heart className="h-6 w-6 fill-red-500 text-red-500" />
              </motion.div>
              <motion.div
                animate={{ y: [0, 15, 0], rotate: [0, -10, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute bottom-10 left-10 rounded-2xl bg-white p-3 shadow-xl lg:left-20"
              >
                <Zap className="h-6 w-6 fill-yellow-500 text-yellow-500" />
              </motion.div>
            </motion.div>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mx-auto mt-12 grid max-w-2xl grid-cols-2 gap-4 sm:grid-cols-4"
          >
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)]/50 px-4 py-4 text-center backdrop-blur-sm"
              >
                <p className="text-2xl font-bold text-[var(--color-primary)]">{stat.value}</p>
                <p className="mt-0.5 text-xs text-[var(--color-text-tertiary)]">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══ FEATURED PLANS ═══ */}
      {featuredPlans.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-[var(--color-text-primary)]">
              <Sparkles className="mr-2 inline h-5 w-5 text-[var(--color-primary)]" />
              <span className="relative">
                <svg
                  width="219"
                  height="24"
                  viewBox="0 0 219 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-primary absolute inset-x-0 inset-y-5 -bottom-1 w-full"
                >
                  <path
                    d="M0.5 2H218L21 12.5H182.5L48.5 21.5H151"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></path>
                </svg>
                <span className="relative">{t("featured")}</span>
              </span>
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {featuredPlans.map((plan, i) => (
              <div key={plan.id} className={i === 0 ? "sm:col-span-2 sm:row-span-2" : ""}>
                <PlanCard plan={plan} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ═══ FEATURES SECTION ═══ */}
      <section className="border-t border-[var(--color-border)] bg-[var(--color-bg-card)]/50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold text-[var(--color-text-primary)] sm:text-3xl">
              Pourquoi choisir Planoka ?
            </h2>
            <p className="mt-3 text-[var(--color-text-secondary)]">
              Tout ce dont vous avez besoin pour découvrir et partager les meilleurs bons plans au
              Cameroun.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.3 }}
                className="group rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-6 transition-all hover:border-[var(--color-primary)]/30 hover:shadow-md"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-primary-light)] text-[var(--color-primary)] transition-colors group-hover:bg-[var(--color-primary)] group-hover:text-white">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-base font-semibold text-[var(--color-text-primary)]">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-tertiary)]">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PLANS GRID (Pinterest Masonry) ═══ */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-[var(--color-text-primary)]">
              {selectedCategory ? "Plans filtrés" : t("latest")}
            </h2>
            <p className="mt-0.5 text-sm text-[var(--color-text-tertiary)]">
              {filteredPlans.length} plan{filteredPlans.length !== 1 ? "s" : ""} disponibles
            </p>
          </div>
        </div>

        <CategoryPills selected={selectedCategory} onSelect={setSelectedCategory} />

        {/* Pinterest masonry layout */}
        <div className="mt-6 columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4">
          {filteredPlans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </div>

        {filteredPlans.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-bg-surface)]">
              <MapPin className="h-8 w-8 text-[var(--color-text-tertiary)]" />
            </div>
            <p className="text-[var(--color-text-secondary)]">{t("empty")}</p>
          </div>
        )}

        {filteredPlans.length > 0 && (
          <div className="mt-10 flex justify-center">
            <Button variant="outline" size="lg" className="gap-2 rounded-full">
              {t("loadMore")}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </section>

      {/* ═══ DOWNLOAD SECTION ═══ */}
      <section className="border-t border-[var(--color-border)] bg-[var(--color-bg-card)]/50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-8 lg:flex-row lg:justify-between">
            <div className="max-w-lg text-center lg:text-left">
              <h2 className="text-2xl font-bold text-[var(--color-text-primary)] sm:text-3xl">
                <span className="relative">
                <svg
                  width="219"
                  height="24"
                  viewBox="0 0 219 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-primary absolute inset-x-0 inset-y-9 -bottom-1 w-full"
                >
                  <path
                    d="M0.5 2H218L21 12.5H182.5L48.5 21.5H151"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></path>
                </svg>
                <span className="relative">Téléchargez </span>
              </span>
              l&apos;application
              </h2>
              <p className="mt-7 text-[var(--color-text-secondary)]">
                Disponible sur iOS et Android. Accédez à tous les bons plans où que vous soyez,
                recevez des notifications et partagez en un clic.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3 lg:justify-start">
                <a
                  href="#"
                  className="flex items-center gap-2.5 rounded-xl bg-[var(--color-text-primary)] px-5 py-3 text-white transition-all hover:opacity-90"
                >
                  <svg className="h-6 w-6 dark:text-black" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                  </svg>
                  <div className="text-left dark:text-black">
                    <p className="text-[10px] opacity-80">Télécharger sur</p>
                    <p className="text-sm font-semibold">App Store</p>
                  </div>
                </a>
                <a
                  href="#"
                  className="flex items-center gap-2.5 rounded-xl bg-[var(--color-text-primary)] px-5 py-3 text-white transition-all hover:opacity-90"
                >
                  <svg className="h-6 w-6 dark:text-black" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.921V2.735a1 1 0 0 1 .609-.921zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.199l2.807 1.626a1 1 0 0 1 0 1.732l-2.807 1.626L15.206 12l2.492-2.492zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z" />
                  </svg>
                  <div className="text-left dark:text-black">
                    <p className="text-[10px] opacity-80">Disponible sur</p>
                    <p className="text-sm font-semibold">Google Play</p>
                  </div>
                </a>
              </div>
            </div>
            <div className="relative">
              <div className="flex gap-4">
                <div className="h-80 w-44 rounded-3xl border-4 border-[var(--color-border)] bg-[var(--color-bg-card)] p-2 shadow-xl">
                  <div className="flex h-full w-full items-center justify-center rounded-2xl bg-[var(--color-primary-light)]">
                    <Image
                      src="/images/ios.png"
                      alt="Download app"
                      width={100}
                      height={100}
                      className="h-auto w-auto"
                    />
                  </div>
                </div>
                <div className="mt-8 h-80 w-44 rounded-3xl border-4 border-[var(--color-border)] bg-[var(--color-bg-card)] p-2 shadow-xl">
                  <div className="flex h-full w-full items-center justify-center rounded-2xl bg-[var(--color-primary-light)]">
                    <Image
                      src="/images/android.png"
                      alt="Download app"
                      width={100}
                      height={100}
                      className="h-auto w-auto"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CTA SECTION ═══ */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-[var(--color-primary)] px-8 py-12 text-center sm:px-16">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white/5 to-transparent" />
            <h2 className="relative text-2xl font-bold text-white sm:text-3xl">
              Prêt à découvrir les meilleurs plans ?
            </h2>
            <p className="relative mx-auto mt-3 max-w-md text-white/80">
              Rejoignez la communauté Planoka et ne manquez plus aucun bon plan près de chez vous.
            </p>
            <div className="relative mt-6 flex flex-wrap justify-center gap-3">
              <Button
                size="lg"
                className="rounded-full bg-white px-8 text-[var(--color-primary)] hover:bg-white/90"
              >
                Commencer maintenant
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="rounded-full border-white/30 px-8 text-[var(--color-primary)] hover:bg-white/10 dark:text-black"
              >
                En savoir plus
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
