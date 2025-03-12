import axios from "axios";

// Use environment variable with fallback for the API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.kitsunee.me/v2/hianime';

// Force local API usage for search functionality
const USE_LOCAL_API = true;

// Create a special instance for local API calls
const localApi = axios.create({
    baseURL: '',
    timeout: 30000, // Increased timeout for scraping operations
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
    console.log(`Using local API for search: "${query}"`);
    return localApi.get(`/api/search?q=${encodeURIComponent(query)}`);
};

// Special method to handle search suggestions
export const getSearchSuggestions = async (query: string) => {
    console.log(`Using local API for suggestions: "${query}"`);
    return localApi.get(`/api/search/suggestion?q=${encodeURIComponent(query)}`);
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