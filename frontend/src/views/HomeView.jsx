// Nuestra vista principal. A meterle un poco de estilo para que el usuario no huya.
import { useState, useEffect } from "react";
import { fetchHelloWorld } from "../controllers/apiController";

export default function HomeView() {
    const [mensajeBackend, setMensajeBackend] = useState("Cargando magia del backend...");

    useEffect(() => {
        // Al montar la vista, le pegamos a la API
        fetchHelloWorld().then(data => {
            setMensajeBackend(data.mensaje);
        });
    }, []);

    return (
        <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            fontFamily: "system-ui, -apple-system, sans-serif",
            background: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)",
            color: "#fff"
        }}>
            <div style={{
                padding: "3rem",
                borderRadius: "1rem",
                background: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(10px)",
                boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
                textAlign: "center",
                maxWidth: "500px",
                width: "90%"
            }}>
                <h1 style={{ fontSize: "2.5rem", margin: "0 0 1rem 0", color: "#f8fafc" }}>
                    🏘️ Buscador de Repúblicas
                </h1>
                <p style={{ 
                    fontSize: "1.2rem", 
                    lineHeight: "1.5",
                    margin: "0 0 2rem 0",
                    color: "#e2e8f0" 
                }}>
                    El lugar perfecto para encontrar donde morar. Estamos en plena construcción, pero mira lo que dice el servidor:
                </p>
                
                <div style={{
                    padding: "1rem",
                    borderRadius: "0.5rem",
                    background: "#0f172a",
                    borderLeft: "4px solid #38bdf8",
                    fontFamily: "monospace",
                    fontSize: "1.1rem",
                    wordBreak: "break-word"
                }}>
                    <span style={{ color: "#38bdf8" }}>Backend dice:</span> 
                    <br />
                    <span style={{ color: "#a5b4fc" }}>"{mensajeBackend}"</span>
                </div>
            </div>
        </div>
    );
}