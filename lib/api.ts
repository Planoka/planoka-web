/**
 * Client API (Axios)
 * 
 * Ce fichier centralise toutes les requêtes HTTP vers le backend.
 * Il configure une instance Axios avec des intercepteurs pour gérer
 * automatiquement l'injection du token d'authentification Clerk et 
 * la gestion globale des erreurs.
 */
import axios from "axios";

// L'URL de base de notre API (définie dans .env.local)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// Création de l'instance Axios principale
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // Timeout de 10 secondes pour éviter les requêtes infinies
});

/** 
 * Intercepteur de Requête
 * 
 * Exécuté AVANT que chaque requête ne quitte le client.
 * Son rôle principal est d'attacher le token JWT de Clerk si l'utilisateur est connecté.
 */
apiClient.interceptors.request.use(
  async (config) => {
    // Vérification : sommes-nous côté client (navigateur) ?
    if (typeof window !== "undefined") {
      // On demande à Clerk le token de session actuel
      const token = await window.Clerk?.session?.getToken();
      if (token) {
        // Injection du token dans le header Authorization
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    // (Note : Côté serveur, le token devra être géré différemment, souvent via auth() de Clerk)
    return config;
  },
  (error) => Promise.reject(error)
);

/** 
 * Intercepteur de Réponse
 * 
 * Exécuté lors de la réception de la réponse du serveur.
 * Permet de centraliser la gestion de certaines erreurs communes.
 */
apiClient.interceptors.response.use(
  (response) => response, // Si tout va bien, on retourne la réponse telle quelle
  (error) => {
    // Erreur 401: Non autorisé / Token invalide
    if (error.response?.status === 401) {
      console.error("Accès non autorisé : Vous devez être connecté.");
      // Clerk gérera généralement la redirection vers le login de son côté
    }
    // Erreur 429: Trop de requêtes (Rate Limiting)
    if (error.response?.status === 429) {
      console.warn("Limite de requêtes atteinte. Veuillez patienter.");
    }
    return Promise.reject(error); // On renvoie l'erreur pour qu'elle puisse être catchée par le composant
  }
);

/** 
 * ==========================================
 * Définition des Endpoints API par entité
 * ==========================================
 */

// Endpoints liés aux Bons Plans
export const plansApi = {
  // Récupérer la liste des plans avec des filtres optionnels
  getAll: (filters?: Record<string, string | number>) =>
    apiClient.get("/api/plans", { params: filters }),

  // Récupérer les détails d'un plan spécifique
  getById: (id: string) => apiClient.get(`/api/plans/${id}`),

  // Créer un nouveau plan (utilise FormData car il y a upload de fichiers image/vidéo)
  create: (data: FormData) =>
    apiClient.post("/api/plans", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  // Modifier un plan partiellement (titre, description)
  update: (id: string, data: Partial<{ titre: string; description: string }>) =>
    apiClient.patch(`/api/plans/${id}`, data),

  // Supprimer un plan
  delete: (id: string) => apiClient.delete(`/api/plans/${id}`),

  // Actions sociales sur un plan
  boost: (id: string) => apiClient.post(`/api/plans/${id}/boost`),
  favorite: (id: string) => apiClient.post(`/api/plans/${id}/favorite`),
  share: (id: string) => apiClient.post(`/api/plans/${id}/share`),

  // Gestion des commentaires
  getComments: (id: string) => apiClient.get(`/api/plans/${id}/comments`),
  addComment: (id: string, contenu: string, parent_id?: string) =>
    apiClient.post(`/api/plans/${id}/comments`, { contenu, parent_id }),

  // Signaler un plan inapproprié
  report: (id: string, raison: string) => apiClient.post(`/api/plans/${id}/report`, { raison }),
};

// Endpoints liés au Flux (Feed) style TikTok
export const feedApi = {
  // Obtenir les plans recommandés pour l'utilisateur actuel
  getRecommended: () => apiClient.get("/api/feed/recommended"),
};

// Endpoints liés aux Utilisateurs
export const usersApi = {
  // Obtenir le profil de l'utilisateur connecté
  getMe: () => apiClient.get("/api/users/me"),
  // Obtenir un utilisateur par son ID
  getById: (id: string) => apiClient.get(`/api/users/${id}`),
  // Obtenir les favoris de l'utilisateur connecté
  getMyFavorites: () => apiClient.get("/api/users/me/favorites"),
  // Mettre à jour les catégories préférées (lors de l'onboarding)
  updateInterests: (categories: string[]) =>
    apiClient.post("/api/users/me/interests", { categories }),
};

// Endpoints liés aux Catégories
export const categoriesApi = {
  getAll: () => apiClient.get("/api/categories"),
};

// Endpoint d'Upload générique
export const uploadApi = {
  uploadMedia: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return apiClient.post("/api/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};

// Endpoints d'Analytics et d'événements (pour affiner l'algorithme du feed)
export const eventsApi = {
  track: (plan_id: string, event_type: string, duration_seconds?: number) =>
    apiClient.post("/api/events", { plan_id, event_type, duration_seconds }),
};
