import axios from "axios";

const api = axios.create({
    baseURL: 'https://onivah-backend.onrender.com',
})

export const googleAuth = (code) => api.get(`/auth/google?code=${code}`);
