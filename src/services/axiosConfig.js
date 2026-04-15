// PATH: src/services/axiosConfig.js
import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8001/api",
    headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        // optional chain au lieu de error.response && error.response.status
        const status = error.response?.status;

        console.error("Erreur API Laravel :", status, error.response?.data);

        if (status === 401) {
            const tokenExistait = !!localStorage.getItem('token');
            if (tokenExistait) {
                localStorage.removeItem('token');
                localStorage.removeItem('utilisateur');
                // globalThis au lieu de window (fix SonarQube portability)
                globalThis.location.href = '/';
            }
        }

        return Promise.reject(error);
    }
);

export default api;
