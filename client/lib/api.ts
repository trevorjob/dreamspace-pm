import axios from 'axios';
import type {
  User,
  Project,
  Task,
  Moodboard,
  MoodboardItem,
  ServiceCategory,
  ArtisanProfile,
  ArtisanProfileList,
  PortfolioItem,
  Review,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
} from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await axios.post(`${API_URL}/auth/refresh/`, {
            refresh: refreshToken,
          });
          const { access } = response.data;
          localStorage.setItem('access_token', access);
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post('/auth/login/', data);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<User> => {
    const response = await api.post('/users/', data);
    return response.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get('/users/me/');
    return response.data;
  },
};

// Projects API
export const projectsAPI = {
  getAll: async (): Promise<Project[]> => {
    const response = await api.get('/projects/');
    // Handle paginated response
    return Array.isArray(response.data) ? response.data : response.data.results || [];
  },

  getById: async (id: number): Promise<Project> => {
    const response = await api.get(`/projects/${id}/`);
    return response.data;
  },

  create: async (data: Partial<Project>): Promise<Project> => {
    const response = await api.post('/projects/', data);
    return response.data;
  },

  update: async (id: number, data: Partial<Project>): Promise<Project> => {
    const response = await api.patch(`/projects/${id}/`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/projects/${id}/`);
  },
};

// Tasks API
export const tasksAPI = {
  getAll: async (projectId?: number): Promise<Task[]> => {
    const response = await api.get('/tasks/', {
      params: projectId ? { project: projectId } : {},
    });
    // Handle paginated response
    return Array.isArray(response.data) ? response.data : response.data.results || [];
  },

  create: async (data: Partial<Task>): Promise<Task> => {
    const response = await api.post('/tasks/', data);
    return response.data;
  },

  update: async (id: number, data: Partial<Task>): Promise<Task> => {
    const response = await api.patch(`/tasks/${id}/`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/tasks/${id}/`);
  },
};

// Moodboards API
export const moodboardsAPI = {
  getAll: async (projectId?: number): Promise<Moodboard[]> => {
    const response = await api.get('/moodboards/', {
      params: projectId ? { project: projectId } : {},
    });
    // Handle paginated response
    return Array.isArray(response.data) ? response.data : response.data.results || [];
  },

  getById: async (id: number): Promise<Moodboard> => {
    const response = await api.get(`/moodboards/${id}/`);
    return response.data;
  },

  create: async (data: Partial<Moodboard>): Promise<Moodboard> => {
    const response = await api.post('/moodboards/', data);
    return response.data;
  },

  update: async (id: number, data: Partial<Moodboard>): Promise<Moodboard> => {
    const response = await api.patch(`/moodboards/${id}/`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/moodboards/${id}/`);
  },
};

// Moodboard Items API
export const moodboardItemsAPI = {
  getAll: async (moodboardId?: number): Promise<MoodboardItem[]> => {
    const response = await api.get('/moodboard-items/', {
      params: moodboardId ? { moodboard: moodboardId } : {},
    });
    // Handle paginated response
    return Array.isArray(response.data) ? response.data : response.data.results || [];
  },

  create: async (data: FormData): Promise<MoodboardItem> => {
    const response = await api.post('/moodboard-items/', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  update: async (id: number, data: Partial<MoodboardItem>): Promise<MoodboardItem> => {
    const response = await api.patch(`/moodboard-items/${id}/`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/moodboard-items/${id}/`);
  },
};

// Service Categories API
export const serviceCategoriesAPI = {
  getAll: async (): Promise<ServiceCategory[]> => {
    const response = await api.get('/service-categories/');
    // Handle paginated response
    return Array.isArray(response.data) ? response.data : response.data.results || [];
  },
};

// Artisans API
export const artisansAPI = {
  getAll: async (params?: {
    service?: number;
    city?: string;
    state?: string;
    experience?: string;
    available?: boolean;
    featured?: boolean;
    min_rating?: number;
    search?: string;
  }): Promise<ArtisanProfileList[]> => {
    const response = await api.get('/artisans/', { params });
    // Handle paginated response
    return Array.isArray(response.data) ? response.data : response.data.results || [];
  },

  getById: async (id: number): Promise<ArtisanProfile> => {
    const response = await api.get(`/artisans/${id}/`);
    return response.data;
  },

  getMyProfile: async (): Promise<ArtisanProfile> => {
    const response = await api.get('/artisans/my-profile/');
    return response.data;
  },

  create: async (data: Partial<ArtisanProfile>): Promise<ArtisanProfile> => {
    const response = await api.post('/artisans/', data);
    return response.data;
  },

  update: async (id: number, data: Partial<ArtisanProfile>): Promise<ArtisanProfile> => {
    const response = await api.patch(`/artisans/${id}/`, data);
    return response.data;
  },
};

// Portfolio API
export const portfolioAPI = {
  getAll: async (artisanId?: number): Promise<PortfolioItem[]> => {
    const response = await api.get('/portfolio/', {
      params: artisanId ? { artisan: artisanId } : {},
    });
    // Handle paginated response
    return Array.isArray(response.data) ? response.data : response.data.results || [];
  },

  create: async (data: FormData): Promise<PortfolioItem> => {
    const response = await api.post('/portfolio/', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/portfolio/${id}/`);
  },
};

// Reviews API
export const reviewsAPI = {
  getAll: async (artisanId?: number): Promise<Review[]> => {
    const response = await api.get('/reviews/', {
      params: artisanId ? { artisan: artisanId } : {},
    });
    // Handle paginated response
    return Array.isArray(response.data) ? response.data : response.data.results || [];
  },

  create: async (data: Partial<Review>): Promise<Review> => {
    const response = await api.post('/reviews/', data);
    return response.data;
  },
};

// Unified API export
const apiClient = {
  auth: authAPI,
  projects: projectsAPI,
  tasks: tasksAPI,
  moodboards: moodboardsAPI,
  moodboardItems: moodboardItemsAPI,
  serviceCategories: serviceCategoriesAPI,
  artisans: artisansAPI,
  portfolio: portfolioAPI,
  reviews: reviewsAPI,
};

// Named export for compatibility
export { apiClient as api };

// Default export
export default apiClient;
