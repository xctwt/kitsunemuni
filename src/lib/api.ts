import axios from "axios";

// Use environment variable with fallback for the API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.kitsunee.me/v2/hianime';

export const api = axios.create({
    baseURL: API_URL,
    // Add request timeout
    timeout: 15000,
    // Add additional headers if needed
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
})

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