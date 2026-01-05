import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const API_KEY = import.meta.env.VITE_API_KEY;

export const client = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
    },
});

client.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

client.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle 401/403 globally if needed
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            // window.location.href = '/login'; // Optional: force redirect
        }
        return Promise.reject(error);
    }
);
