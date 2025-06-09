// adminAxios.js
import axios from 'axios';

// Base API URL
export const apiUrl = 'https://onivah-backend.onrender.com';

// Axios instance with dynamic token
const adminAxios = axios.create({
    baseURL: `https://onivah-backend.onrender.com/admin`,
});

adminAxios.interceptors.request.use((config) => {
    const token = sessionStorage.getItem('admin_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default adminAxios;
