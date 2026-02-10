import axios from 'axios';

// Create an Axios instance
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://mima-server.onrender.com',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Admin auth token might be stored differently, but reusing logic for now
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('MIMA_ADMIN_TOKEN') || localStorage.getItem('MIMA_TOKEN');
        if (token) {
            config.headers['x-auth-token'] = token;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
