// API Types matching Django backend exactly

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  role: 'designer' | 'client' | 'artisan';
  bio: string;
  location: string;
  profile_image: string;
  is_verified: boolean;
  business_name: string;
}

export interface Project {
  id: number;
  user: number;
  name: string;
  description: string;
  client_name: string;
  start_date: string | null;
  end_date: string | null;
  tasks_count: number;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: number;
  project: number;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'done';
  due_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface Moodboard {
  id: number;
  project: number;
  title: string;
  description: string;
  items: MoodboardItem[];
  items_count: number;
  created_at: string;
  updated_at: string;
}

export interface MoodboardItem {
  id: number;
  moodboard: number;
  image: string | null;
  x: number;
  y: number;
  width: number;
  height: number;
  created_at: string;
  updated_at: string;
}

export interface ServiceCategory {
  id: number;
  name: string;
  description: string;
  icon: string;
}

export interface ArtisanProfile {
  id: number;
  user: number;
  user_name: string;
  user_email: string;
  business_name: string;
  description: string;
  services: ServiceCategory[];
  experience_level: 'beginner' | 'intermediate' | 'expert' | 'master';
  years_of_experience: number;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  country: string;
  website: string;
  instagram: string;
  facebook: string;
  is_available: boolean;
  is_featured: boolean;
  average_rating: string;
  total_reviews: number;
  total_projects: number;  hourly_rate: string | null;
  min_project_budget: string | null;
  portfolio: PortfolioItem[];
  reviews: Review[];
  created_at: string;
  updated_at: string;
}

export interface ArtisanProfileList {
  id: number;
  user_name: string;
  business_name: string;
  description: string;
  services: ServiceCategory[];
  city: string;
  state: string;
  is_available: boolean;
  average_rating: string;
  total_reviews: number;
  total_projects: number;
  hourly_rate: string | null;
  created_at: string;
}

export interface PortfolioItem {
  id: number;
  title: string;
  description: string;
  image: string | null;
  project_date: string | null;
  client_name: string;
  created_at: string;
}

export interface Review {
  id: number;
  artisan: number;
  reviewer: number;
  reviewer_name: string;
  reviewer_username: string;
  project: number | null;
  rating: number;
  title: string;
  comment: string;
  professionalism: number | null;
  quality_of_work: number | null;
  timeliness: number | null;
  communication: number | null;
  created_at: string;
  updated_at: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  password2: string;
  first_name: string;
  last_name: string;
  phone?: string;
  role: 'designer' | 'client' | 'artisan';
  bio?: string;
  location?: string;
  business_name?: string;
}
