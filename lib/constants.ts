export const CATEGORIES = [
  { slug: "restauration", color: "#E8610A", icon: "UtensilsCrossed" },
  { slug: "loisirs", color: "#7C3AED", icon: "Gamepad2" },
  { slug: "sorties", color: "#059669", icon: "Music" },
  { slug: "shopping", color: "#DC2626", icon: "ShoppingBag" },
  { slug: "services", color: "#2563EB", icon: "Briefcase" },
  { slug: "sante", color: "#DB2777", icon: "Heart" },
  { slug: "education", color: "#D97706", icon: "BookOpen" },
  { slug: "sport", color: "#0891B2", icon: "Dumbbell" },
] as const;

export const CAMEROON_CITIES = [
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
];

export const MAX_IMAGE_SIZE = 10 * 1024 * 1024; /** 10 Mo */
export const MAX_VIDEO_SIZE = 100 * 1024 * 1024; /** 100 Mo */
export const MAX_VIDEO_DURATION = 180; /** 3 minutes */
export const MIN_VIDEO_DURATION = 3; /** 3 secondes */

export const FEED_PAGE_SIZE = 12;
export const RECOMMENDATION_CACHE_TTL = 10 * 60; /** 10 minutes */
