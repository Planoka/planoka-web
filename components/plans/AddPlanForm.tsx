"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "motion/react";
import {
  Video,
  X,
  MapPin,
  Crosshair,
  Loader2,
  Sparkles,
  Camera,
  ChevronDown,
  Check,
  AlertCircle,
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
const CATEGORY_META: Record<string, { color: string; icon: string; slug: string }> = {
  "cat-1": { color: "#E8610A", icon: "🍽", slug: "restauration" },
  "cat-2": { color: "#7C3AED", icon: "🎮", slug: "loisirs" },
  "cat-3": { color: "#059669", icon: "🎵", slug: "sorties" },
  "cat-4": { color: "#DC2626", icon: "🛍", slug: "shopping" },
  "cat-5": { color: "#2563EB", icon: "💼", slug: "services" },
  "cat-6": { color: "#DB2777", icon: "❤️", slug: "sante" },
  "cat-7": { color: "#D97706", icon: "📚", slug: "education" },
  "cat-8": { color: "#0891B2", icon: "🏋️", slug: "sport" },
};

export function AddPlanForm() {
  const t = useTranslations("form");
  const tCat = useTranslations("categories");
  const createPlan = useCreatePlan();
  const createPlanMock = useCreatePlanMock();

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

  /* ─── Form Step ─── */
  const [step, setStep] = useState(0);

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
    c.toLowerCase().includes(citySearch.toLowerCase()),
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
    [media, setValue],
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
      { enableHighAccuracy: true, timeout: 10000 },
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
    [setValue],
  );

  /* ─── Handle Category Select ─── */
  const selectCategory = useCallback(
    (catId: string) => {
      setValue("categorie_id", catId);
    },
    [setValue],
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

  /* ─── Steps ─── */
  const steps = [
    { key: "basics", label: "Informations" },
    { key: "category", label: "Catégorie" },
    { key: "media", label: "Média" },
    { key: "location", label: "Localisation" },
  ];

  const canProceed = () => {
    switch (step) {
      case 0:
        return watchedTitre.length >= 5 && watchedDescription.length >= 20;
      case 1:
        return !!watchedCategory;
      case 2:
        return true;
      case 3:
        return true;
      default:
        return false;
    }
  };

  const inputClass = (hasError?: boolean) =>
    cn(
      "h-12 w-full rounded-xl border bg-[var(--color-bg-surface)] px-4 text-sm text-[var(--color-text-primary)] outline-none transition-all placeholder:text-[var(--color-text-tertiary)]",
      hasError
        ? "border-[var(--color-danger)] ring-2 ring-[var(--color-danger)]/20"
        : "border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20",
    );

  const labelClass = "mb-2 block text-sm font-semibold text-[var(--color-text-primary)]";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-0">
      {/* ═══ HEADER ═══ */}
      <section className="relative overflow-hidden border-b border-[var(--color-border)] bg-[var(--color-bg-card)] pt-8 pb-6 sm:pt-12 sm:pb-8">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-32 -left-32 h-64 w-64 rounded-full bg-[var(--color-primary)]/5 blur-3xl" />
          <div className="absolute -top-16 -right-32 h-64 w-64 rounded-full bg-[var(--color-primary)]/5 blur-3xl" />
        </div>

        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-primary-light)]">
              <Sparkles className="h-7 w-7 text-[var(--color-primary)]" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-3xl">
              {t("submit")}
            </h1>
            <p className="mt-2 text-sm text-[var(--color-text-tertiary)]">
              Décrivez votre bon plan et aidez la communauté à découvrir les meilleures adresses
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══ PROGRESS BAR ═══ */}
      <div className="border-b border-[var(--color-border)] bg-[var(--color-bg-card)]">
        <div className="mx-auto max-w-2xl px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between gap-2">
            {steps.map((s, i) => (
              <div key={s.key} className="flex flex-1 items-center gap-2">
                <button
                  type="button"
                  onClick={() => i <= step && setStep(i)}
                  className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold transition-all",
                    i === step
                      ? "bg-[var(--color-primary)] text-white shadow-sm"
                      : i < step
                        ? "bg-[var(--color-primary)]/20 text-[var(--color-primary)]"
                        : "bg-[var(--color-bg-surface)] text-[var(--color-text-tertiary)]",
                  )}
                >
                  {i < step ? <Check className="h-3.5 w-3.5" /> : i + 1}
                </button>
                <span
                  className={cn(
                    "hidden text-xs font-medium sm:block",
                    i === step
                      ? "text-[var(--color-primary)]"
                      : i < step
                        ? "text-[var(--color-text-secondary)]"
                        : "text-[var(--color-text-tertiary)]",
                  )}
                >
                  {s.label}
                </span>
                {i < steps.length - 1 && (
                  <div
                    className={cn(
                      "ml-2 h-px flex-1",
                      i < step ? "bg-[var(--color-primary)]/40" : "bg-[var(--color-border)]",
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ FORM BODY ═══ */}
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <AnimatePresence mode="wait">
          {/* ─── STEP 0: BASIC INFO ─── */}
          {step === 0 && (
            <motion.div
              key="step-0"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              <div>
                <label className={labelClass}>
                  {t("title")}
                  <span className="ml-1 text-[var(--color-danger)]">*</span>
                </label>
                <div className="relative">
                  <input
                    {...register("titre")}
                    placeholder={t("titlePlaceholder")}
                    className={inputClass(!!errors.titre)}
                    maxLength={TITLE_MAX}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-[var(--color-text-tertiary)]">
                    {watchedTitre.length}/{TITLE_MAX}
                  </span>
                </div>
                {errors.titre && (
                  <p className="mt-1.5 flex items-center gap-1 text-xs text-[var(--color-danger)]">
                    <AlertCircle className="h-3 w-3" />
                    {t(errors.titre.message as string) || errors.titre.message}
                  </p>
                )}
              </div>

              <div>
                <label className={labelClass}>
                  {t("description")}
                  <span className="ml-1 text-[var(--color-danger)]">*</span>
                </label>
                <textarea
                  {...register("description")}
                  placeholder={t("descriptionPlaceholder")}
                  className={cn(inputClass(!!errors.description), "min-h-[140px] resize-y py-3 leading-relaxed")}
                  maxLength={DESCRIPTION_MAX}
                />
                <div className="mt-1.5 flex items-center justify-between">
                  {errors.description ? (
                    <p className="flex items-center gap-1 text-xs text-[var(--color-danger)]">
                      <AlertCircle className="h-3 w-3" />
                      {t(errors.description.message as string) || errors.description.message}
                    </p>
                  ) : (
                    <p className="text-xs text-[var(--color-text-tertiary)]">
                      {watchedDescription.length < DESCRIPTION_MIN
                        ? `Encore ${DESCRIPTION_MIN - watchedDescription.length} caractères minimum`
                        : " "}
                    </p>
                  )}
                  <span className="text-[11px] text-[var(--color-text-tertiary)]">
                    {watchedDescription.length}/{DESCRIPTION_MAX}
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {/* ─── STEP 1: CATEGORY ─── */}
          {step === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              <div>
                <label className={labelClass}>
                  {t("category")}
                  <span className="ml-1 text-[var(--color-danger)]">*</span>
                </label>
                <p className="mb-4 text-sm text-[var(--color-text-tertiary)]">
                  Choisissez la catégorie qui correspond le mieux à votre bon plan
                </p>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {CATEGORIES.map((cat, idx) => {
                    const catId = `cat-${idx + 1}`;
                    const meta = CATEGORY_META[catId];
                    const isActive = watchedCategory === catId;
                    return (
                      <button
                        key={catId}
                        type="button"
                        onClick={() => selectCategory(catId)}
                        className={cn(
                          "flex flex-col items-center gap-2 rounded-2xl border-2 p-4 text-center transition-all",
                          isActive
                            ? "border-current shadow-sm"
                            : "border-[var(--color-border)] hover:border-[var(--color-border-strong)] hover:bg-[var(--color-bg-surface)]",
                        )}
                        style={{
                          borderColor: isActive ? meta.color : undefined,
                          backgroundColor: isActive ? `${meta.color}10` : undefined,
                        }}
                      >
                        <span className="text-2xl">{meta.icon}</span>
                        <span
                          className="text-xs font-semibold leading-tight"
                          style={{ color: isActive ? meta.color : undefined }}
                        >
                          {tCat(meta.slug as "restauration" | "loisirs" | "sorties" | "shopping" | "services" | "sante" | "education" | "sport")}
                        </span>
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

              <div>
                <label className={labelClass}>
                  {t("city")}
                  <span className="ml-1 text-[var(--color-danger)]">*</span>
                </label>
                <div className="relative" ref={cityRef}>
                  <div
                    className={cn(
                      inputClass(!!errors.ville),
                      "flex cursor-pointer items-center justify-between",
                    )}
                    onClick={() => setCityOpen(!cityOpen)}
                  >
                    <span className={watchedVille ? "" : "text-[var(--color-text-tertiary)]"}>
                      {watchedVille || t("cityPlaceholder")}
                    </span>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 text-[var(--color-text-tertiary)] transition-transform",
                        cityOpen && "rotate-180",
                      )}
                    />
                  </div>

                  <AnimatePresence>
                    {cityOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.98 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 right-0 z-50 mt-1 overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] shadow-lg"
                      >
                        <div className="p-2">
                          <input
                            value={citySearch}
                            onChange={(e) => setCitySearch(e.target.value)}
                            placeholder="Rechercher une ville..."
                            className="mb-1 h-9 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-surface)] px-3 text-sm outline-none focus:border-[var(--color-primary)]"
                            autoFocus
                          />
                        </div>
                        <div className="max-h-48 overflow-y-auto">
                          {filteredCities.map((city) => (
                            <button
                              key={city}
                              type="button"
                              onClick={() => {
                                selectCity(city);
                              }}
                              className={cn(
                                "flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm transition-colors hover:bg-[var(--color-primary-light)]",
                                watchedVille === city
                                  ? "text-[var(--color-primary)] font-medium"
                                  : "text-[var(--color-text-secondary)]",
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
                              Aucune ville trouvée
                            </p>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                {errors.ville && (
                  <p className="mt-1.5 flex items-center gap-1 text-xs text-[var(--color-danger)]">
                    <AlertCircle className="h-3 w-3" />
                    {t(errors.ville.message as string) || errors.ville.message}
                  </p>
                )}
              </div>
            </motion.div>
          )}

          {/* ─── STEP 2: MEDIA ─── */}
          {step === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              <div>
                <label className={labelClass}>{t("image")}</label>
                <p className="mb-4 text-sm text-[var(--color-text-tertiary)]">
                  Ajoutez une photo pour illustrer votre bon plan (max 10 MB)
                </p>

                {media && mediaType === "image" ? (
                  <div className="relative overflow-hidden rounded-2xl border border-[var(--color-border)]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={media.url}
                      alt="Aperçu"
                      className="h-64 w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeMedia}
                      className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition-all hover:bg-black/80"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex cursor-pointer flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-[var(--color-border)] bg-[var(--color-bg-surface)] py-10 transition-all hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-light)]/50">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-bg-card)]">
                      <Camera className="h-6 w-6 text-[var(--color-primary)]" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-[var(--color-text-primary)]">
                        Cliquez pour ajouter une photo
                      </p>
                      <p className="mt-0.5 text-xs text-[var(--color-text-tertiary)]">
                        PNG, JPG ou WebP
                      </p>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileSelect(e, "image")}
                    />
                  </label>
                )}
              </div>

              <div>
                <label className={labelClass}>{t("video")}</label>
                <p className="mb-4 text-sm text-[var(--color-text-tertiary)]">
                  Ajoutez une vidéo (optionnelle, max 100 MB)
                </p>

                {media && mediaType === "video" ? (
                  <div className="relative overflow-hidden rounded-2xl border border-[var(--color-border)]">
                    <video
                      src={media.url}
                      controls
                      className="h-64 w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeMedia}
                      className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition-all hover:bg-black/80"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex cursor-pointer flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-[var(--color-border)] bg-[var(--color-bg-surface)] py-10 transition-all hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-light)]/50">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-bg-card)]">
                      <Video className="h-6 w-6 text-[var(--color-primary)]" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-[var(--color-text-primary)]">
                        Cliquez pour ajouter une vidéo
                      </p>
                      <p className="mt-0.5 text-xs text-[var(--color-text-tertiary)]">
                        MP4, MOV ou WebM
                      </p>
                    </div>
                    <input
                      ref={videoInputRef}
                      type="file"
                      accept="video/*"
                      className="hidden"
                      onChange={(e) => handleFileSelect(e, "video")}
                    />
                  </label>
                )}
              </div>
            </motion.div>
          )}

          {/* ─── STEP 3: LOCATION ─── */}
          {step === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              <div>
                <label className={labelClass}>
                  Localisation
                  <span className="ml-2 text-xs font-normal text-[var(--color-text-tertiary)]">
                    (optionnelle)
                  </span>
                </label>
                <p className="mb-4 text-sm text-[var(--color-text-tertiary)]">
                  Ajoutez votre position uniquement si vous êtes sur place. Les plans géolocalisés
                  apparaîtront sur la carte interactive de l&apos;explorateur.
                </p>

                {location ? (
                  <div className="space-y-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-success)]/10">
                        <MapPin className="h-5 w-5 text-[var(--color-success)]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[var(--color-text-primary)]">
                          Position capturée
                        </p>
                        <p className="mt-0.5 text-xs text-[var(--color-text-tertiary)]">
                          {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                        </p>
                        {location.accuracy > 0 && (
                          <p className="text-xs text-[var(--color-text-tertiary)]">
                            Précision : {location.accuracy} mètres
                          </p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={removeLocation}
                        className="shrink-0 rounded-full p-1.5 text-[var(--color-text-tertiary)] transition-colors hover:bg-[var(--color-bg-card)] hover:text-[var(--color-danger)]"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={getLocation}
                    disabled={locationLoading}
                    className={cn(
                      "flex w-full flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-[var(--color-border)] bg-[var(--color-bg-surface)] py-10 transition-all",
                      locationLoading
                        ? "opacity-60"
                        : "hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-light)]/50",
                    )}
                  >
                    {locationLoading ? (
                      <Loader2 className="h-8 w-8 animate-spin text-[var(--color-primary)]" />
                    ) : (
                      <>
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-bg-card)]">
                          <Crosshair className="h-6 w-6 text-[var(--color-primary)]" />
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-medium text-[var(--color-text-primary)]">
                            Capturer ma position
                          </p>
                          <p className="mt-0.5 text-xs text-[var(--color-text-tertiary)]">
                            Activez la géolocalisation pour ajouter votre position
                          </p>
                        </div>
                      </>
                    )}
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ═══ NAVIGATION BUTTONS ═══ */}
        <div className="mt-8 flex items-center justify-between gap-3">
          <Button
            type="button"
            variant="ghost"
            size="lg"
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
            className="rounded-xl"
          >
            {t("back")}
          </Button>

          {step < steps.length - 1 ? (
            <Button
              type="button"
              size="lg"
              disabled={!canProceed()}
              onClick={() => setStep(step + 1)}
              className="rounded-xl bg-[var(--color-primary)] text-white hover:brightness-90 disabled:opacity-50"
            >
              Suivant
            </Button>
          ) : (
            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              className="rounded-xl bg-[var(--color-primary)] text-white hover:brightness-90 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Publication...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  {t("submit")}
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </form>
  );
}