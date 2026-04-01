export interface AIModel {
  id: string;
  name: string;
  lab: string;
  description: string;
  tags: string[];
  contextWindow: number;
  inputPrice: number;
  outputPrice: number;
  rating: number;
  reviews: number;
  isNew: boolean;
  isFeatured: boolean;
  category: string;
  imageUrl?: string;
}

export interface AgentTemplate {
  id: string;
  name: string;
  description: string;
  model: string;
  tags: string[];
  icon: string;
}

export interface ResearchItem {
  id: string;
  date: number;
  month: string;
  source: string;
  title: string;
  summary: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface Session {
  id: string;
  userId: string;
  createdAt: string;
  expiresAt: string;
  deviceInfo: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  name: string;
}

export interface AuthTokens {
  accessToken: string;
  user: User;
}
