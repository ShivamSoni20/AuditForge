// API Configuration
// In production (Vercel), API is at root /api
// In development, API is at localhost:3001
export const API_URL = import.meta.env.VITE_API_URL || '';

export const config = {
  apiUrl: API_URL,
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
};

export default config;
