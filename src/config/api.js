export const NEWS_API_KEY = '5fdaf5faacc5487ba390a31542682174'; // Replace with your actual API key
export const NEWS_API_URL = 'https://newsapi.org/v2';
export const FOOTBALL_API_KEY = 'f00425d6ab39e5ba6b1a5f56c3595364';

// Export the API URL based on environment
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// You can add other API-related configuration here
export const API_ENDPOINTS = {
    users: '/api/users',
    clubs: '/api/clubs',
    discussions: '/api/discussions',
    events: '/api/events'
}; 