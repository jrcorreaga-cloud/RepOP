import { useEffect, useMemo, useState } from "react";
import { loginDemo, checkStatus } from "../controllers/apiController";
import "../styles/login.css";

export default function HomeView() {
    const [mode, setMode] = useState("login");
    const [formData, setFormData] = useState({
        email: "demo@repop.com",
        password: "repop123",
    });
    const [registerData, setRegisterData] = useState({
        name: "",
        lastName: "",
        email: "",
        gender: "",
        password: "",
        confirmPassword: "",
    });
    const [status, setStatus] = useState({ type: "idle", message: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [backendStatus, setBackendStatus] = useState("Verificando conexión con backend...");

    useEffect(() => {
        const checkBackend = async () => {
            try {
                const response = await checkStatus();
                setBackendStatus(response.message);
            } catch (error) {
                setBackendStatus("No se pudo conectar al backend");
            }
        };
        checkBackend();
    }, []);

    const isUfopEmail = useMemo(
        () => registerData.email.trim().toLowerCase().endsWith("@aluno.ufop.edu.br"),
        [registerData.email]
    );

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((current) => ({
            ...current,
            [name]: value,
        }));
    };

    const handleRegisterChange = (event) => {
        const { name, value } = event.target;
        setRegisterData((current) => ({
            ...current,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        setStatus({ type: "idle", message: "" });

        try {
            const response = await loginDemo(formData);
            setStatus({ type: "success", message: response.message });
        } catch (error) {
            setStatus({ type: "error", message: error.message });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRegisterSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        setStatus({ type: "idle", message: "" });

        const requiredFields = ["name", "lastName", "email", "gender", "password", "confirmPassword"];
        const hasEmptyField = requiredFields.some((field) => !registerData[field].trim());

        if (hasEmptyField) {
            setStatus({ type: "error", message: "Completa todos los campos para registrarte." });
            setIsSubmitting(false);
            return;
        }

        if (registerData.password !== registerData.confirmPassword) {
            setStatus({ type: "error", message: "Las contraseñas no coinciden." });
            setIsSubmitting(false);
            return;
        }

        const trustNote = isUfopEmail
            ? "Correo UFOP detectado. Tu cuenta tendrá distintivo de confianza."
            : "Registro demo listo. Luego conectamos el backend y la base de datos.";

        setStatus({
            type: "success",
            message: `${registerData.name} ${registerData.lastName}, tu registro demo fue preparado. ${trustNote}`,
        });
        setIsSubmitting(false);
    };

    return (
        <main className="login-shell">
            <section className="login-hero">
                <div className="hero-copy">
                    <div className="hero-title-row">
                        <h1>Encuentra tu república sin ruido, con una experiencia limpia desde el primer clic.</h1>
                        <img className="hero-logo" src="/images/logo.png" alt="Logo de RepOP" />
                    </div>
                    <p className="hero-description">Acceso simple para entrar o crear una cuenta, con un diseño claro y sin ruido visual.</p>
                </div>
            </section>

            <section className="backend-check">
                <p>Estado del backend: {backendStatus}</p>
            </section>

            <section className="login-card">
                <div key={mode} className={`auth-view auth-view--${mode}`}>
                    <div className="login-card__header">
                        <h2>{mode === "login" ? "Inicia sesión en RepOP" : "Crear cuenta"}</h2>
                    </div>

                    {mode === "login" ? (
                        <form className="login-form" onSubmit={handleSubmit}>
                        <label>
                            Correo electrónico
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="tu@correo.com"
                                autoComplete="email"
                            />
                        </label>

                        <label>
                            Contraseña
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                autoComplete="current-password"
                            />
                        </label>

                        <button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Ingresando..." : "Entrar al panel"}
                        </button>
                        <button type="button" className="login-form__secondary" onClick={() => setMode("register")}>Registrarme</button>
                    </form>
                    ) : (
                        <form className="login-form login-form--register" onSubmit={handleRegisterSubmit}>
                            <div className="login-form__grid">
                                <label>
                                    Nombre
                                    <input
                                        type="text"
                                        name="name"
                                        value={registerData.name}
                                        onChange={handleRegisterChange}
                                        placeholder="Tu nombre"
                                        autoComplete="given-name"
                                    />
                                </label>

                                <label>
                                    Apellidos
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={registerData.lastName}
                                        onChange={handleRegisterChange}
                                        placeholder="Tus apellidos"
                                        autoComplete="family-name"
                                    />
                                </label>
                            </div>

                            <label>
                                Correo electrónico
                                <input
                                    type="email"
                                    name="email"
                                    value={registerData.email}
                                    onChange={handleRegisterChange}
                                    placeholder="tu@correo.com"
                                    autoComplete="email"
                                />
                                {isUfopEmail ? (
                                    <span className="ufop-badge">Correo UFOP verificado</span>
                                ) : (
                                    <span className="ufop-badge ufop-badge--subtle">
                                        Si usas @aluno.ufop.edu.br aparecerá distintivo de confianza
                                    </span>
                                )}
                            </label>

                            <fieldset className="gender-fieldset">
                                <legend>Género</legend>
                                <div className="gender-options">
                                    <label>
                                        <input
                                            type="radio"
                                            name="gender"
                                            value="masculino"
                                            checked={registerData.gender === "masculino"}
                                            onChange={handleRegisterChange}
                                        />
                                        Masculino
                                    </label>
                                    <label>
                                        <input
                                            type="radio"
                                            name="gender"
                                            value="femenino"
                                            checked={registerData.gender === "femenino"}
                                            onChange={handleRegisterChange}
                                        />
                                        Femenino
                                    </label>
                                    <label>
                                        <input
                                            type="radio"
                                            name="gender"
                                            value="otro"
                                            checked={registerData.gender === "otro"}
                                            onChange={handleRegisterChange}
                                        />
                                        Otro
                                    </label>
                                </div>
                            </fieldset>

                            <div className="login-form__grid">
                                <label>
                                    Contraseña
                                    <input
                                        type="password"
                                        name="password"
                                        value={registerData.password}
                                        onChange={handleRegisterChange}
                                        placeholder="••••••••"
                                        autoComplete="new-password"
                                    />
                                </label>

                                <label>
                                    Confirmar contraseña
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={registerData.confirmPassword}
                                        onChange={handleRegisterChange}
                                        placeholder="••••••••"
                                        autoComplete="new-password"
                                    />
                                </label>
                            </div>

                            <button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Registrando..." : "Crear cuenta"}
                            </button>

                            <button type="button" className="login-form__secondary" onClick={() => setMode("login")}>Ya tengo cuenta</button>
                        </form>
                    )}
                </div>

                <div className={`status-box status-box--${status.type}`} aria-live="polite">
                    {status.message}
                </div>
            </section>
        </main>
    );
}