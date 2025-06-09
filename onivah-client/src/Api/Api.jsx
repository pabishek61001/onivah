// adminAxios.js
import axios from 'axios';

// Base API URL
export const apiUrl = 'http://localhost:4000';

// Axios instance with dynamic token
const adminAxios = axios.create({
    baseURL: `http://localhost:4000/admin`,
});

adminAxios.interceptors.request.use((config) => {
    const token = sessionStorage.getItem('admin_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default adminAxios;
