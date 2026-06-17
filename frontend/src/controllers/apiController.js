const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

export const loginDemo = async (credentials) => {
    const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.detail ?? "No se pudo iniciar sesión");
    }

    return data;
};