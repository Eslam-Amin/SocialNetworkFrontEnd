import axios from 'axios';
import { HOST } from "./global-links"

const axiosInstance = axios.create({
    baseURL: HOST,
    withCredentials: true
});

axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default axiosInstance;
