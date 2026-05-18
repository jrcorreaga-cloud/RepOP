// Toda la magia de pegarle a la API va acá. Centralizamos el fetch para no repetir código tonto.
export const fetchHelloWorld = async () => {
    try {
        // En producción esto usaría una variable de entorno, ej import.meta.env.VITE_API_URL
        const res = await fetch("http://localhost:8000/api/hello");
        if (!res.ok) throw new Error("Ups, algo falló en el server");
        return await res.json();
    } catch (error) {
        console.error("Oh no:", error);
        return { mensaje: "¡Houston, tenemos un problema de conexión con el backend! 😵" };
    }
};