// API Configuration for different environments
type Environment = 'development' | 'production';

interface ApiConfig {
  BASE_URL: string;
  FRONTEND_URL: string;
}

const API_CONFIG: Record<Environment, ApiConfig> = {
  development: {
    BASE_URL: 'http://localhost:3000/api',
    FRONTEND_URL: 'http://localhost:5174'
  },
  production: {
    BASE_URL: process.env.VITE_API_URL || 'https://your-backend.railway.app/api',
    FRONTEND_URL: process.env.VITE_FRONTEND_URL || 'https://your-frontend.vercel.app'
  }
};

const environment = (process.env.NODE_ENV as Environment) || 'development';
const config = API_CONFIG[environment];

export default config;
