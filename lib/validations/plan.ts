import { z } from "zod";

export const TITLE_MIN = 5;
export const TITLE_MAX = 120;
export const DESCRIPTION_MIN = 20;
export const DESCRIPTION_MAX = 2000;

export const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10 MB
export const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100 MB

const VALID_CATEGORY_IDS = [
  "cat-1",
  "cat-2",
  "cat-3",
  "cat-4",
  "cat-5",
  "cat-6",
  "cat-7",
  "cat-8",
] as const;

const VALID_CAMEROON_CITIES = [
  "Douala",
  "Yaoundé",
  "Bamenda",
  "Bafoussam",
  "Garoua",
  "Maroua",
  "Ngaoundéré",
  "Bertoua",
  "Ebolowa",
  "Kumba",
  "Limbe",
  "Kribi",
  "Edéa",
  "Loum",
  "Nkongsamba",
] as const;

export const addPlanSchema = z.object({
  titre: z
    .string()
    .min(1, "validation.titleRequired")
    .min(TITLE_MIN, "validation.titleMin")
    .max(TITLE_MAX, "validation.titleMax"),
  description: z
    .string()
    .min(1, "validation.descriptionRequired")
    .min(DESCRIPTION_MIN, "validation.descriptionMin")
    .max(DESCRIPTION_MAX, "La description ne peut pas dépasser 2000 caractères"),
  categorie_id: z
    .string()
    .min(1, "validation.categoryRequired")
    .refine((val) => (VALID_CATEGORY_IDS as readonly string[]).includes(val), {
      message: "Catégorie invalide",
    }),
  ville: z
    .string()
    .min(1, "validation.cityRequired")
    .refine((val) => (VALID_CAMEROON_CITIES as readonly string[]).includes(val), {
      message: "Ville invalide",
    }),
  image_file: z
    .instanceof(File)
    .nullable()
    .refine(
      (file) => !file || file.size <= MAX_IMAGE_SIZE,
      "L'image ne doit pas dépasser 10 MB",
    )
    .refine(
      (file) => !file || file.type.startsWith("image/"),
      "Le fichier doit être une image",
    ),
  video_file: z
    .instanceof(File)
    .nullable()
    .refine(
      (file) => !file || file.size <= MAX_VIDEO_SIZE,
      "La vidéo ne doit pas dépasser 100 MB",
    )
    .refine(
      (file) => !file || file.type.startsWith("video/"),
      "Le fichier doit être une vidéo",
    ),
  // Location is optional - only if user is at the location
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
  accuracy: z.number().nullable().optional(),
});

export type AddPlanFormData = z.infer<typeof addPlanSchema>;

export const VALID_CATEGORY_IDS_LIST = VALID_CATEGORY_IDS;
export const VALID_CAMEROON_CITIES_LIST = VALID_CAMEROON_CITIES;