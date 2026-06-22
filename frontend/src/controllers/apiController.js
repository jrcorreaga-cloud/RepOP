import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

export function setAuthToken(token) {
    if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        try {
            localStorage.setItem("token", token);
        } catch (e) {}
    } else {
        delete api.defaults.headers.common["Authorization"];
        try {
            localStorage.removeItem("token");
        } catch (e) {}
    }
}

export function clearAuthToken() {
    delete api.defaults.headers.common["Authorization"];
    try {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    } catch (e) {}
}

const handleAxiosError = (err) => {
    if (err.response && err.response.data) {
        const data = err.response.data;
        throw new Error(data.detail || data.message || JSON.stringify(data));
    }
    throw err;
};

export const loginDemo = async (credentials) => {
    try {
        const res = await api.post("/api/auth/login", credentials);
        return res.data;
    } catch (err) {
        handleAxiosError(err);
    }
};

export const registerUser = async (userData) => {
    try {
        const res = await api.post("/api/auth/register", userData);
        return res.data;
    } catch (err) {
        handleAxiosError(err);
    }
};

export const checkStatus = async () => {
    try {
        const res = await api.get("/api/status", { headers: { "X-API-KEY": "demo-health-key" } });
        return res.data;
    } catch (err) {
        handleAxiosError(err);
    }
};

/** Obtiene los datos completos del perfil del usuario autenticado. */
export const getUserProfile = async () => {
    try {
        const res = await api.get("/api/auth/me");
        return res.data;
    } catch (err) {
        handleAxiosError(err);
    }
};

/** Actualiza los campos editables del perfil (nombre, teléfono). */
export const updateUserProfile = async (profileData) => {
    try {
        const res = await api.put("/api/auth/profile", profileData);
        return res.data;
    } catch (err) {
        handleAxiosError(err);
    }
};