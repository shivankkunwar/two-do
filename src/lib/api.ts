import axios from "axios";

// Fallback to localhost if no env variable is set
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
})

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if(token) config.headers.Authorization = `Bearer ${token}`;
    return config;
})

api.interceptors.response.use((response) => {
    return response;
}, async (error) => {
    const { status, config } = error.response ?? {};

    // Don't retry on rate limit errors to avoid spamming
    if (status === 429) {
        return Promise.reject(error);
    }

    // Only attempt refresh on 401 and if we haven't already retried
    if (status === 401 && !config._retry) {
        config._retry = true; // Mark this request as retried to prevent loops
        
        try {
            const { data } = await api.post("/auth/refresh");
            localStorage.setItem("token", data.token);
            config.headers.Authorization = `Bearer ${data.token}`;
            return api(config); // Retry the original request once
        } catch (refreshError) {
            // Refresh failed, clear token and redirect to login
            localStorage.removeItem("token");
            window.location.href = "/login";
            return Promise.reject(refreshError);
        }
    }
    
    return Promise.reject(error);
})