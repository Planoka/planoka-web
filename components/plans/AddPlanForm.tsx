"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import confetti from "canvas-confetti";
import {
  Video,
  X,
  MapPin,
  Crosshair,
  Loader2,
  Sparkles,
  Camera,
  Image as ImageIcon,
  ChevronDown,
  Check,
  AlertCircle,
  UtensilsCrossed,
  Gamepad2,
  Music,
  ShoppingBag,
  Briefcase,
  Heart,
  BookOpen,
  Dumbbell,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  addPlanSchema,
  type AddPlanFormData,
  TITLE_MAX,
  DESCRIPTION_MAX,
  DESCRIPTION_MIN,
  MAX_IMAGE_SIZE,
  MAX_VIDEO_SIZE,
  VALID_CAMEROON_CITIES_LIST,
} from "@/lib/validations/plan";
import { CATEGORIES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useCreatePlan, useCreatePlanMock } from "@/hooks/useCreatePlan";

/* ─── Media Type ─── */
type MediaPreview = {
  file: File;
  url: string;
  type: "image" | "video";
};

/* ─── Constants ─── */
const USE_MOCK = true;

/* ─── Category Config ─── */
const CATEGORY_META: Record<string, { color: string; icon: React.ElementType; slug: string }> = {
  "cat-1": { color: "#E8610A", icon: UtensilsCrossed, slug: "restauration" },
  "cat-2": { color: "#7C3AED", icon: Gamepad2, slug: "loisirs" },
  "cat-3": { color: "#059669", icon: Music, slug: "sorties" },
  "cat-4": { color: "#DC2626", icon: ShoppingBag, slug: "shopping" },
  "cat-5": { color: "#2563EB", icon: Briefcase, slug: "services" },
  "cat-6": { color: "#DB2777", icon: Heart, slug: "sante" },
  "cat-7": { color: "#D97706", icon: BookOpen, slug: "education" },
  "cat-8": { color: "#0891B2", icon: Dumbbell, slug: "sport" },
};

export function AddPlanForm() {
  const t = useTranslations("form");
  const tCat = useTranslations("categories");
  const locale = useLocale();
  const router = useRouter();

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdPlanId, setCreatedPlanId] = useState<string | null>(null);

  const handleSuccess = (data: { id: string }) => {
    setCreatedPlanId(data.id);
    setShowSuccessModal(true);
    // Fire confetti
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#E8610A", "#FFFFFF"],
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#E8610A", "#FFFFFF"],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  const createPlan = useCreatePlan({ onSuccess: handleSuccess });
  const createPlanMock = useCreatePlanMock({ onSuccess: handleSuccess });

  /* ─── Form ─── */
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<AddPlanFormData>({
    resolver: zodResolver(addPlanSchema),
    defaultValues: {
      titre: "",
      description: "",
      categorie_id: "",
      ville: "",
      image_file: null,
      video_file: null,
      latitude: null,
      longitude: null,
      accuracy: null,
    },
  });

  const watchedTitre = useWatch({ control, name: "titre" });
  const watchedDescription = useWatch({ control, name: "description" });
  const watchedCategory = useWatch({ control, name: "categorie_id" });
  const watchedVille = useWatch({ control, name: "ville" });

  /* ─── Media State ─── */
  const [media, setMedia] = useState<MediaPreview | null>(null);
  const [mediaType, setMediaType] = useState<"image" | "video" | null>(null);
  const [mediaTab, setMediaTab] = useState<"image" | "video">("image");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  /* ─── City Search ─── */
  const [citySearch, setCitySearch] = useState("");
  const [cityOpen, setCityOpen] = useState(false);
  const cityRef = useRef<HTMLDivElement>(null);

  /* ─── Location State ─── */
  const [locationLoading, setLocationLoading] = useState(false);
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
    accuracy: number;
    label: string;
  } | null>(null);

  /* ─── Close city dropdown on outside click ─── */
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (cityRef.current && !cityRef.current.contains(e.target as Node)) {
        setCityOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  /* ─── Filtered cities ─── */
  const filteredCities = VALID_CAMEROON_CITIES_LIST.filter((c) =>
    c.toLowerCase().includes(citySearch.toLowerCase())
  );

  /* ─── Handle Media Upload ─── */
  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, type: "image" | "video") => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (type === "image" && file.size > MAX_IMAGE_SIZE) {
        toast.error("L'image ne doit pas dépasser 10 MB");
        return;
      }
      if (type === "video" && file.size > MAX_VIDEO_SIZE) {
        toast.error("La vidéo ne doit pas dépasser 100 MB");
        return;
      }

      // Revoke previous URL
      if (media) URL.revokeObjectURL(media.url);

      const url = URL.createObjectURL(file);
      setMedia({ file, url, type });
      setMediaType(type);
      setValue(type === "image" ? "image_file" : "video_file", file);
      setValue(type === "image" ? "video_file" : "image_file", null);
    },
    [media, setValue]
  );

  /* ─── Remove Media ─── */
  const removeMedia = useCallback(() => {
    if (media) URL.revokeObjectURL(media.url);
    setMedia(null);
    setMediaType(null);
    setValue("image_file", null);
    setValue("video_file", null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (videoInputRef.current) videoInputRef.current.value = "";
  }, [media, setValue]);

  /* ─── Get Location ─── */
  const getLocation = useCallback(() => {
    if (!navigator.geolocation) {
      toast.error("La géolocalisation n'est pas supportée par votre navigateur");
      return;
    }

    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: Math.round(pos.coords.accuracy),
          label: `${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`,
        };
        setLocation(loc);
        setValue("latitude", loc.latitude);
        setValue("longitude", loc.longitude);
        setValue("accuracy", loc.accuracy);
        setLocationLoading(false);
        toast.success("Position capturée !");
      },
      (err) => {
        setLocationLoading(false);
        switch (err.code) {
          case err.PERMISSION_DENIED:
            toast.error("Localisation refusée. Vous pouvez publier sans position.");
            break;
          case err.POSITION_UNAVAILABLE:
            toast.error("Position indisponible");
            break;
          case err.TIMEOUT:
            toast.error("Délai de localisation dépassé");
            break;
          default:
            toast.error("Erreur de localisation");
        }
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, [setValue]);

  /* ─── Remove Location ─── */
  const removeLocation = useCallback(() => {
    setLocation(null);
    setValue("latitude", null);
    setValue("longitude", null);
    setValue("accuracy", null);
  }, [setValue]);

  /* ─── Handle City Select ─── */
  const selectCity = useCallback(
    (city: string) => {
      setValue("ville", city);
      setCitySearch(city);
      setCityOpen(false);
    },
    [setValue]
  );

  /* ─── Handle Category Select ─── */
  const selectCategory = useCallback(
    (catId: string) => {
      setValue("categorie_id", catId);
    },
    [setValue]
  );

  /* ─── Submit ─── */
  const onSubmit = async (data: AddPlanFormData) => {
    const formData = new FormData();
    formData.append("titre", data.titre.trim());
    formData.append("description", data.description.trim());
    formData.append("categorie_id", data.categorie_id);
    formData.append("ville", data.ville);

    if (data.image_file) {
      formData.append("image", data.image_file);
      formData.append("media_type", "image");
    } else if (data.video_file) {
      formData.append("video", data.video_file);
      formData.append("media_type", "video");
    } else {
      formData.append("media_type", "none");
    }

    if (data.latitude && data.longitude) {
      formData.append("latitude", data.latitude.toString());
      formData.append("longitude", data.longitude.toString());
      if (data.accuracy) formData.append("accuracy", data.accuracy.toString());
    }

    const mutation = USE_MOCK ? createPlanMock : createPlan;
    mutation.mutate({ formData });
  };

  const onError = (err: Record<string, unknown>) => {
    console.log("Validation errors", err);
    toast.error(t("formError") || "Veuillez remplir tous les champs obligatoires.");
  };

  const pillTabClass = (active: boolean) =>
    cn(
      "flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-all",
      active
        ? "bg-[var(--color-primary)] text-white shadow-sm"
        : "bg-[var(--color-bg-surface)] text-[var(--color-text-secondary)] hover:bg-[var(--color-border)]/60"
    );

  return (
    <>
      <div className="min-h-screen bg-[var(--color-bg-card)] lg:bg-[var(--color-bg-surface)]">
      <form
        onSubmit={handleSubmit(onSubmit, onError)}
        className="mx-auto flex min-h-screen w-full max-w-2xl flex-col bg-[var(--color-bg-card)] lg:my-6 lg:min-h-0 lg:overflow-hidden lg:rounded-3xl lg:border lg:border-[var(--color-border)] lg:shadow-sm"
      >
        {/* ═══ HEADER (fixe, pas d'étapes) ═══ */}
        <div className="sticky top-0 z-40 flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-bg-card)]/95 px-3 py-3 backdrop-blur-sm lg:top-6">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-bg-surface)]"
          >
            <X className="h-5 w-5" />
          </button>
          <h1 className="text-base font-bold text-[var(--color-text-primary)]">
            {t("newPlan") || "Nouveau plan"}
          </h1>
          <Button
            type="submit"
            size="sm"
            disabled={isSubmitting}
            className="rounded-full bg-[var(--color-primary)] px-5 font-bold text-white hover:brightness-90 disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              t("submit") || "Publier"
            )}
          </Button>
        </div>

        {/* ═══ CONTENU (scroll unique, sans étapes) ═══ */}
        <div className="flex-1 pb-10 mt-5">
          {/* ── Onglets Photos / Vidéos ── */}
          <div className="flex gap-2 px-4 pt-4">
            <button
              type="button"
              onClick={() => setMediaTab("image")}
              className={pillTabClass(mediaTab === "image")}
            >
              <ImageIcon className="h-4 w-4" />
              {t("photos") || "Photos"}
            </button>
            <button
              type="button"
              onClick={() => setMediaTab("video")}
              className={pillTabClass(mediaTab === "video")}
            >
              <Video className="h-4 w-4" />
              {t("videos") || "Vidéos"}
            </button>
          </div>

          {/* ── Zone média ── */}
          <div className="px-4 pt-3">
            {media ? (
              <div className="relative flex max-h-[480px] min-h-[220px] w-full items-center justify-center overflow-hidden rounded-2xl bg-[var(--color-bg-surface)]">
                {mediaType === "image" ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={media.url}
                    alt="Aperçu"
                    className="max-h-[480px] w-full object-contain"
                  />
                ) : (
                  <video
                    src={media.url}
                    className="max-h-[480px] w-full object-contain"
                    muted
                    loop
                    autoPlay
                    playsInline
                    controls
                  />
                )}
                <span className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
                  {mediaType === "video" ? (
                    <Video className="h-3 w-3" />
                  ) : (
                    <Camera className="h-3 w-3" />
                  )}
                  {mediaType === "video" ? "Aperçu vidéo" : "Aperçu photo"}
                </span>
                <button
                  type="button"
                  onClick={removeMedia}
                  className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition-all hover:bg-black/80"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <label className="flex h-72 cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-[var(--color-border)] bg-[var(--color-bg-surface)] transition-all hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-light)]/50">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-bg-card)]">
                  {mediaTab === "video" ? (
                    <Video className="h-6 w-6 text-[var(--color-primary)]" />
                  ) : (
                    <Camera className="h-6 w-6 text-[var(--color-primary)]" />
                  )}
                </div>
                <span className="text-sm font-medium text-[var(--color-text-primary)]">
                  {mediaTab === "video" ? t("videoLabel") || "Vidéo" : t("imageLabel") || "Photo"}
                </span>
                <input
                  ref={mediaTab === "video" ? videoInputRef : fileInputRef}
                  type="file"
                  accept={mediaTab === "video" ? "video/*" : "image/*"}
                  className="hidden"
                  onChange={(e) => handleFileSelect(e, mediaTab)}
                />
              </label>
            )}
          </div>

          {/* ── Titre & description (champs sans bordure) ── */}
          <div className="px-4 pt-5">
            <input
              {...register("titre")}
              placeholder={t("titlePlaceholder") || "Un titre accrocheur..."}
              maxLength={TITLE_MAX}
              className="w-full border-none bg-transparent text-xl font-bold text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-tertiary)]/70"
            />
            <div className="mt-0.5 flex items-center justify-between">
              {errors.titre ? (
                <p className="flex items-center gap-1 text-xs text-[var(--color-danger)]">
                  <AlertCircle className="h-3 w-3" />
                  {t(errors.titre.message as string) || errors.titre.message}
                </p>
              ) : (
                <span />
              )}
              <span className="text-[11px] text-[var(--color-text-tertiary)]">
                {watchedTitre.length}/{TITLE_MAX}
              </span>
            </div>

            <textarea
              {...register("description")}
              placeholder={
                t("descriptionPlaceholder") || "Racontez-nous en plus sur ce plan... (optionnel)"
              }
              maxLength={DESCRIPTION_MAX}
              className="mt-2 min-h-[60px] w-full resize-none border-none bg-transparent text-sm leading-relaxed text-[var(--color-text-secondary)] outline-none placeholder:text-[var(--color-text-tertiary)]"
            />
            <div className="flex items-center justify-between">
              {errors.description ? (
                <p className="flex items-center gap-1 text-xs text-[var(--color-danger)]">
                  <AlertCircle className="h-3 w-3" />
                  {t(errors.description.message as string) || errors.description.message}
                </p>
              ) : (
                <p className="text-xs text-[var(--color-text-tertiary)]">
                  {watchedDescription.length < DESCRIPTION_MIN
                    ? t("charsRemaining", { count: DESCRIPTION_MIN - watchedDescription.length })
                    : " "}
                </p>
              )}
              <span className="text-[11px] text-[var(--color-text-tertiary)]">
                {watchedDescription.length}/{DESCRIPTION_MAX}
              </span>
            </div>
          </div>

          {/* ── Panneau bas : ville, catégorie, position ── */}
          <div className="mt-5 space-y-6 rounded-t-3xl bg-[var(--color-bg-surface)] px-4 pt-5 pb-8">
            {/* Ville (pill) */}
            <div className="relative" ref={cityRef}>
              <button
                type="button"
                onClick={() => setCityOpen(!cityOpen)}
                className={cn(
                  "flex items-center gap-2 rounded-full border bg-[var(--color-bg-card)] px-4 py-2.5 text-sm font-medium transition-all",
                  errors.ville
                    ? "border-[var(--color-danger)] text-[var(--color-danger)]"
                    : "border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)]"
                )}
              >
                <MapPin className="h-4 w-4 text-[var(--color-primary)]" />
                {watchedVille || t("cityPlaceholder") || "Lieu / Ville"}
                <ChevronDown
                  className={cn("h-3.5 w-3.5 transition-transform", cityOpen && "rotate-180")}
                />
              </button>

              <AnimatePresence>
                {cityOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 z-50 mt-1 w-64 max-w-[90vw] overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] shadow-lg"
                  >
                    <div className="p-2">
                      <input
                        value={citySearch}
                        onChange={(e) => setCitySearch(e.target.value)}
                        placeholder={t("citySearch") || "Rechercher une ville"}
                        className="mb-1 h-9 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-surface)] px-3 text-sm outline-none focus:border-[var(--color-primary)]"
                        autoFocus
                      />
                    </div>
                    <div className="max-h-48 overflow-y-auto">
                      {filteredCities.map((city) => (
                        <button
                          key={city}
                          type="button"
                          onClick={() => selectCity(city)}
                          className={cn(
                            "flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm transition-colors hover:bg-[var(--color-primary-light)]",
                            watchedVille === city
                              ? "font-medium text-[var(--color-primary)]"
                              : "text-[var(--color-text-secondary)]"
                          )}
                        >
                          <MapPin className="h-3.5 w-3.5 shrink-0" />
                          <span>{city}</span>
                          {watchedVille === city && (
                            <Check className="ml-auto h-4 w-4 text-[var(--color-primary)]" />
                          )}
                        </button>
                      ))}
                      {filteredCities.length === 0 && (
                        <p className="px-4 py-3 text-xs text-[var(--color-text-tertiary)]">
                          {t("noCityFound") || "Aucune ville trouvée"}
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              {errors.ville && (
                <p className="mt-1.5 flex items-center gap-1 text-xs text-[var(--color-danger)]">
                  <AlertCircle className="h-3 w-3" />
                  {t(errors.ville.message as string) || errors.ville.message}
                </p>
              )}
            </div>

            {/* Catégorie (pills) */}
            <div>
              <p className="mb-2 text-xs font-bold tracking-wide text-[var(--color-text-tertiary)]">
                {(t("category") || "Catégorie").toUpperCase()}
              </p>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat, idx) => {
                  const catId = `cat-${idx + 1}`;
                  const meta = CATEGORY_META[catId];
                  const isActive = watchedCategory === catId;
                  const Icon = meta.icon;
                  return (
                    <button
                      key={catId}
                      type="button"
                      onClick={() => selectCategory(catId)}
                      className="flex items-center gap-1.5 rounded-full border-2 px-3.5 py-2 text-sm font-semibold transition-all"
                      style={{
                        borderColor: isActive ? meta.color : "var(--color-border)",
                        backgroundColor: isActive ? `${meta.color}12` : "var(--color-bg-card)",
                        color: isActive ? meta.color : "var(--color-text-secondary)",
                      }}
                    >
                      <Icon className="h-4 w-4" />
                      {tCat(
                        meta.slug as
                          | "restauration"
                          | "loisirs"
                          | "sorties"
                          | "shopping"
                          | "services"
                          | "sante"
                          | "education"
                          | "sport"
                      )}
                    </button>
                  );
                })}
              </div>
              {errors.categorie_id && (
                <p className="mt-2 flex items-center gap-1 text-xs text-[var(--color-danger)]">
                  <AlertCircle className="h-3 w-3" />
                  {t(errors.categorie_id.message as string) || errors.categorie_id.message}
                </p>
              )}
            </div>

            {/* Position GPS (optionnelle) */}
            <div>
              <p className="mb-2 flex items-center gap-2 text-xs font-bold tracking-wide text-[var(--color-text-tertiary)]">
                {(t("location") || "Position").toUpperCase()}
                <span className="font-normal normal-case text-[var(--color-text-tertiary)]">
                  ({t("optional") || "optionnel"})
                </span>
              </p>

              {location ? (
                <div className="flex items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-success)]/10">
                    <MapPin className="h-4 w-4 text-[var(--color-success)]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-[var(--color-text-primary)]">
                      {t("locationSuccess") || "Position capturée"}
                    </p>
                    <p className="truncate text-[11px] text-[var(--color-text-tertiary)]">
                      {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={removeLocation}
                    className="shrink-0 rounded-full p-1.5 text-[var(--color-text-tertiary)] transition-colors hover:bg-[var(--color-bg-surface)] hover:text-[var(--color-danger)]"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={getLocation}
                  disabled={locationLoading}
                  className={cn(
                    "flex items-center gap-2 rounded-full border border-dashed border-[var(--color-border)] bg-[var(--color-bg-card)] px-4 py-2.5 text-sm font-medium text-[var(--color-text-secondary)] transition-all",
                    locationLoading ? "opacity-60" : "hover:border-[var(--color-primary)]"
                  )}
                >
                  {locationLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin text-[var(--color-primary)]" />
                  ) : (
                    <Crosshair className="h-4 w-4 text-[var(--color-primary)]" />
                  )}
                  {t("locationCapture") || "Capturer ma position"}
                </button>
              )}
            </div>
          </div>
        </div>
      </form>
      </div>

      {/* ═══ SUCCESS MODAL ═══ */}
      <AnimatePresence>
        {showSuccessModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 z-[3000] bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="fixed top-1/2 left-1/2 z-[3001] flex w-11/12 max-w-sm -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-3xl bg-[var(--color-bg-card)] p-8 text-center shadow-2xl"
            >
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[var(--color-primary)]/10">
                <Sparkles className="h-10 w-10 text-[var(--color-primary)]" />
              </div>
              <h2 className="mb-2 text-2xl font-bold text-[var(--color-text-primary)]">
                🎉 Plan publié !
              </h2>
              <p className="mb-8 text-[var(--color-text-secondary)]">
                Votre plan est maintenant visible par toute la communauté Planoka.
              </p>
              <Button
                className="w-full rounded-full bg-[var(--color-primary)] py-6 text-base font-bold text-white hover:brightness-110"
                onClick={() => {
                  router.push(`/${locale}/plans/${createdPlanId}`);
                  router.refresh();
                }}
              >
                Super !
              </Button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}