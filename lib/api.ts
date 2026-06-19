import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

/** Intercepteur pour ajouter le token Clerk automatiquement */
apiClient.interceptors.request.use(
  /** On récupère le token via window.__clerk en client-side
   * En server-side on utilise auth() de Clerk directement */
  async (config) => {
    if (typeof window !== "undefined") {
      const token = await window.Clerk?.session?.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/** Intercepteur pour gérer les erreurs globalement */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      /** Non authentifié — Clerk gère la redirection */
      console.error("Unauthorized");
    }
    if (error.response?.status === 429) {
      console.warn("Rate limit atteint. Réessayez dans quelques instants.");
    }
    return Promise.reject(error);
  }
);

/** ---- API Functions ---- */

export const plansApi = {
  getAll: (filters?: Record<string, string | number>) =>
    apiClient.get("/api/plans", { params: filters }),

  getById: (id: string) => apiClient.get(`/api/plans/${id}`),

  create: (data: FormData) =>
    apiClient.post("/api/plans", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  update: (id: string, data: Partial<{ titre: string; description: string }>) =>
    apiClient.patch(`/api/plans/${id}`, data),

  delete: (id: string) => apiClient.delete(`/api/plans/${id}`),

  boost: (id: string) => apiClient.post(`/api/plans/${id}/boost`),

  favorite: (id: string) => apiClient.post(`/api/plans/${id}/favorite`),

  share: (id: string) => apiClient.post(`/api/plans/${id}/share`),

  getComments: (id: string) => apiClient.get(`/api/plans/${id}/comments`),

  addComment: (id: string, contenu: string, parent_id?: string) =>
    apiClient.post(`/api/plans/${id}/comments`, { contenu, parent_id }),

  report: (id: string, raison: string) => apiClient.post(`/api/plans/${id}/report`, { raison }),
};

export const feedApi = {
  getRecommended: () => apiClient.get("/api/feed/recommended"),
};

export const usersApi = {
  getMe: () => apiClient.get("/api/users/me"),
  getById: (id: string) => apiClient.get(`/api/users/${id}`),
  getMyFavorites: () => apiClient.get("/api/users/me/favorites"),
  updateInterests: (categories: string[]) =>
    apiClient.post("/api/users/me/interests", { categories }),
};

export const categoriesApi = {
  getAll: () => apiClient.get("/api/categories"),
};

export const uploadApi = {
  uploadMedia: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return apiClient.post("/api/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};

export const eventsApi = {
  track: (plan_id: string, event_type: string, duration_seconds?: number) =>
    apiClient.post("/api/events", { plan_id, event_type, duration_seconds }),
};
