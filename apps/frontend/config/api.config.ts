/**
 * API Configuration
 * Centralized configuration for API endpoints and settings
 */

export const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api',
  timeout: 30000,
  endpoints: {
    auth: {
      register: '/auth/register',
      login: '/auth/login',
      logout: '/auth/logout',
      refresh: '/auth/refresh',
      me: '/auth/me',
    },
    users: {
      me: '/users/me',
      updateMe: '/users/me',
      getById: (id: string) => `/users/${id}`,
    },
  },
} as const;

export type ApiConfig = typeof API_CONFIG;

