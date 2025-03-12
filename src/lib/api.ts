import axios from "axios";

// Use environment variable with fallback for the API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.kitsunee.me/v2/hianime';
const USE_LOCAL_API = process.env.NODE_ENV === 'production';

// Create a special instance for local API calls
const localApi = axios.create({
    baseURL: '',
    timeout: 15000,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
});

// Create the main API instance
export const api = axios.create({
    baseURL: API_URL,
    timeout: 15000,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
});

// Special method to handle search requests
export const getSearchResults = async (query: string) => {
    if (USE_LOCAL_API) {
        console.log(`Using local API for search: "${query}"`);
        return localApi.get(`/api/search?q=${encodeURIComponent(query)}`);
    } else {
        try {
            // Try the external API first
            return await api.get('/search', { params: { q: query } });
        } catch (error) {
            // If the external API fails, fallback to local API
            console.warn('External API failed for search, falling back to local API:', error);
            return localApi.get(`/api/search?q=${encodeURIComponent(query)}`);
        }
    }
};

// Special method to handle search suggestions
export const getSearchSuggestions = async (query: string) => {
    if (USE_LOCAL_API) {
        console.log(`Using local API for suggestions: "${query}"`);
        return localApi.get(`/api/search/suggestion?q=${encodeURIComponent(query)}`);
    } else {
        try {
            // Try the external API first
            return await api.get('/search/suggestion', { params: { q: query } });
        } catch (error) {
            // If the external API fails, fallback to local API
            console.warn('External API failed for suggestions, falling back to local API:', error);
            return localApi.get(`/api/search/suggestion?q=${encodeURIComponent(query)}`);
        }
    }
};

// Add request interceptor for debugging in development
if (process.env.NODE_ENV === 'development') {
    api.interceptors.request.use(request => {
        console.log('API Request:', request.method, request.url, request.params);
        return request;
    });
    
    api.interceptors.response.use(
        response => {
            return response;
        },
        error => {
            console.error('API Error:', error.response?.status, error.response?.data || error.message);
            return Promise.reject(error);
        }
    );
}