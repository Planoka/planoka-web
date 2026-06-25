/**
 * PLANOKA — Types TypeScript partagés
 */

export type Locale = "fr" | "en";
export type Theme = "light" | "dark" | "system";
export type UserRole = "user" | "moderator" | "admin";
export type PlanStatus = "pending" | "active" | "rejected" | "archived";
export type EventType = "view" | "boost" | "favorite" | "share" | "comment";
export type ReportReason = "spam" | "contenu_inapproprie" | "fausse_info" | "autre";
export type ReportStatus = "pending" | "resolved" | "dismissed";
export type MediaType = "image" | "video" | "none";

/**  ---- Catégories ---- */
export interface Category {
  id: string;
  nom_fr: string;
  nom_en: string;
  slug: string;
  icone: string;
  couleur: string;
}

/** ---- Utilisateur ----  */
export interface User {
  id: string;
  clerk_id: string;
  nom: string;
  email: string;
  avatar_url: string;
  role: UserRole;
  langue: Locale;
  theme: Theme;
  ville: string | null;
  created_at: string;
  updated_at: string;
}

/** ---- Plans ----  */
export interface Plan {
  id: string;
  user_id: string;
  categorie_id: string;
  titre: string;
  description: string;
  ville: string;
  image_url: string | null;
  video_url: string | null;
  media_type: MediaType;
  boosts_count: number;
  comments_count: number;
  shares_count: number;
  status: PlanStatus;
  is_featured: boolean;
    created_at: string;
    updated_at: string;


    /** Géolocalisation */
    latitude?: number | null;
    longitude?: number | null;

    /** Relations */
    author?: User;
    category?: Category;
    is_boosted?: boolean; /** si l'utilisateur courant a booster */
    is_favorited?: boolean; /** si l'utilisateur courant a mis en favoris */
}

/** ---- Commentaire ----  */
export interface Comment {
  id: string;
  plan_id: string;
  user_id: string;
  parent_id: string | null;
  contenu: string;
  created_at: string;
  author?: User;
  replies?: Comment[];
}

/** ---- Bost ---- */
export interface Boost {
  id: string;
  plan_id: string;
  user_id: string;
  created_at: string;
}

/** ---- Favori ---- */
export interface Favorite {
  id: string;
  user_id: string;
  plan_id: string;
  created_at: string;
}

/** ---- Événement comportemental ---- */
export interface UserEvent {
  plan_id: string;
  event_type: EventType;
  duration_seconds?: number;
}

/** ---- API Responses ---- */
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

/** ---- Filtres Feed ---- */
export interface FeedFilters {
  categorie?: string;
  ville?: string;
  search?: string;
  page?: number;
  limit?: number;
  sort?: "recent" | "boosted" | "recommended";
}