import { useEffect, useMemo, useRef, useState } from "react";
import { loginDemo, checkStatus, registerUser, setAuthToken, clearAuthToken } from "../controllers/apiController";
import { UserProfile } from "../models/userProfileModel";
import "../styles/login.css";

const MAIN_NAV_ITEMS = [
    { label: "Moradias", target: "moradias" },
    { label: "Todas as Repúblicas", target: "todas-as-republicas" },
    { label: "Sobre Ouro Preto", target: "sobre-ouro-preto" },
    { label: "Meu Perfil", target: "meu-perfil" },
];

const USER_MENU_ITEMS = [
    { label: "Meu Perfil", target: "meu-perfil" },
    { label: "Favoritos", target: "favoritos" },
    { label: "Configurações", target: "configuracoes" },
];

export default function HomeView() {
    const [mode, setMode] = useState("login");
    const [authUser, setAuthUser] = useState(null);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [formData, setFormData] = useState({
        email: "demo@repop.com",
        password: "repop123",
    });
    const [registerData, setRegisterData] = useState({
        nombre: "",
        correo: "",
        contrasenia: "",
        confirmPassword: "",
        telefono: "",
        rol: "",
    });
    const [status, setStatus] = useState({ type: "idle", message: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [backendStatus, setBackendStatus] = useState("Verificando conexión con backend...");
    const userMenuRef = useRef(null);
    const [profileEditMode, setProfileEditMode] = useState(false);
    const [profileFormData, setProfileFormData] = useState({ name: "", phone: "" });

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

    useEffect(() => {
        try {
            const token = localStorage.getItem("token");
            const userString = localStorage.getItem("user");
            if (token && userString) {
                setAuthToken(token);
                setAuthUser(JSON.parse(userString));
            }
        } catch (e) {
            // ignore
        }
    }, []);

    useEffect(() => {
        const handleDocumentClick = (event) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setUserMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleDocumentClick);

        return () => {
            document.removeEventListener("mousedown", handleDocumentClick);
        };
    }, []);

    const isUfopEmail = useMemo(
        () => registerData.correo.trim().toLowerCase().endsWith("@aluno.ufop.edu.br"),
        [registerData.correo]
    );

    const userInitials = useMemo(() => {
        if (!authUser?.name) {
            return "R";
        }

        const nameParts = authUser.name.trim().split(/\s+/).filter(Boolean);
        const firstInitial = nameParts[0]?.[0] ?? "R";
        const secondInitial = nameParts[1]?.[0] ?? authUser.name.trim()[1] ?? "";

        return `${firstInitial}${secondInitial}`.toUpperCase();
    }, [authUser]);

    const userProfile = useMemo(() => UserProfile.fromAuthUser(authUser), [authUser]);

    const scrollToSection = (target) => {
        const section = document.getElementById(target);

        if (section) {
            section.scrollIntoView({ behavior: "smooth", block: "start" });
        }

        setUserMenuOpen(false);
    };

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
            // persist token + user
            if (response.access_token) {
                setAuthToken(response.access_token);
            }
            try {
                localStorage.setItem("user", JSON.stringify(response.user));
            } catch (e) {}

            setAuthUser(response.user);
            setUserMenuOpen(false);
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

        const requiredFields = ["nombre", "correo", "contrasenia", "confirmPassword", "rol"];
        const hasEmptyField = requiredFields.some((field) => !registerData[field].trim());

        if (hasEmptyField) {
            setStatus({ type: "error", message: "Completa todos los campos obligatorios para registrarte." });
            setIsSubmitting(false);
            return;
        }

        if (registerData.contrasenia !== registerData.confirmPassword) {
            setStatus({ type: "error", message: "Las contraseñas no coinciden." });
            setIsSubmitting(false);
            return;
        }

        try {
            const userData = {
                nombre: registerData.nombre,
                correo: registerData.correo,
                contrasenia: registerData.contrasenia,
                telefono: registerData.telefono || null,
                rol: registerData.rol,
            };

            const response = await registerUser(userData);
            setStatus({
                type: "success",
                message: `${response.nombre}, tu cuenta fue creada exitosamente. Ahora puedes iniciar sesión.`,
            });
            setMode("login");
        } catch (error) {
            setStatus({ type: "error", message: error.message });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleLogout = () => {
        setAuthUser(null);
        setUserMenuOpen(false);
        setProfileEditMode(false);
        clearAuthToken();
        try {
            localStorage.removeItem("user");
        } catch (e) {}
        setStatus({ type: "idle", message: "Sesión cerrada. Puedes volver a ingresar." });
    };

    const handleProfileEditToggle = () => {
        if (!profileEditMode) {
            setProfileFormData({
                name: authUser?.name || "",
                phone: authUser?.phone || "",
            });
        }
        setProfileEditMode((prev) => !prev);
    };

    const handleProfileFormChange = (event) => {
        const { name, value } = event.target;
        setProfileFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleProfileSave = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);

        try {
            const updatedUser = {
                ...authUser,
                name: profileFormData.name.trim() || authUser.name,
                phone: profileFormData.phone.trim(),
            };
            setAuthUser(updatedUser);
            try {
                localStorage.setItem("user", JSON.stringify(updatedUser));
            } catch (e) {}
            setProfileEditMode(false);
            setStatus({ type: "success", message: "Perfil atualizado com sucesso." });
        } catch (error) {
            setStatus({ type: "error", message: error.message });
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderAuthShell = () => (
        <main className="app-shell">
            <header className="app-header">
                <div className="app-header__inner">
                    <a className="app-header__brand" href="#moradias" onClick={(event) => event.preventDefault()}>
                        <img className="app-header__logo" src="/images/logo.png" alt="Logo de RepOP" />
                        <span className="app-header__brand-text">
                            <strong>RepOP</strong>
                            <span>Moradias em Ouro Preto</span>
                        </span>
                    </a>

                    <nav className="app-header__nav" aria-label="Navegación principal">
                        {MAIN_NAV_ITEMS.map((item) => (
                            <button
                                key={item.target}
                                type="button"
                                className="app-header__nav-link"
                                onClick={() => scrollToSection(item.target)}
                            >
                                {item.label}
                            </button>
                        ))}
                    </nav>

                    <div className="app-header__actions">
                        <button
                            type="button"
                            className="app-header__profile-link"
                            onClick={() => scrollToSection("meu-perfil")}
                        >
                            Meu Perfil
                        </button>

                        <div className="user-menu" ref={userMenuRef}>
                            <button
                                type="button"
                                className="user-menu__trigger"
                                aria-haspopup="menu"
                                aria-expanded={userMenuOpen}
                                onClick={() => setUserMenuOpen((current) => !current)}
                            >
                                <span className="user-menu__avatar" aria-hidden="true">
                                    {userInitials}
                                </span>
                                <span className="user-menu__copy">
                                    <strong>{authUser?.name ?? "Usuário logado"}</strong>
                                    <span>Conta ativa</span>
                                </span>
                            </button>

                            {userMenuOpen ? (
                                <div className="user-menu__panel" role="menu" aria-label="Menu del usuario">
                                    {USER_MENU_ITEMS.map((item) => (
                                        <button
                                            key={item.target}
                                            type="button"
                                            className="user-menu__item"
                                            onClick={() => scrollToSection(item.target)}
                                            role="menuitem"
                                        >
                                            {item.label}
                                        </button>
                                    ))}
                                    <button
                                        type="button"
                                        className="user-menu__item user-menu__item--danger"
                                        onClick={handleLogout}
                                        role="menuitem"
                                    >
                                        Sair
                                    </button>
                                </div>
                            ) : null}
                        </div>
                    </div>
                </div>
            </header>

            <div className="dashboard-page">
                <section className="dashboard-hero">
                    <div className="dashboard-hero__copy">
                        <span className="dashboard-hero__eyebrow">Sessão iniciada</span>
                        <h1>Encontre repúblicas com navegação rápida e um header sempre visível.</h1>
                        <p>
                            Agora tu tens acesso à barra superior com navegação, avatar e opções da conta sem perder o contexto ao fazer scroll.
                        </p>
                    </div>

                    <div className="dashboard-hero__stats">
                        <article>
                            <strong>24</strong>
                            <span>Moradias ativas</span>
                        </article>
                        <article>
                            <strong>8</strong>
                            <span>Favoritos guardados</span>
                        </article>
                        <article>
                            <strong>3</strong>
                            <span>Novas oportunidades</span>
                        </article>
                    </div>
                </section>

                <section className="dashboard-section" id="moradias">
                    <div className="dashboard-section__header">
                        <span>Moradias</span>
                        <h2>Oportunidades em destaque</h2>
                    </div>

                    <div className="dashboard-cards dashboard-cards--feature">
                        <article className="dashboard-card dashboard-card--featured">
                            <span className="dashboard-card__tag">Próximo ao centro</span>
                            <h3>República Horizonte</h3>
                            <p>Vagas para estudantes, ambiente tranquilo e regras claras para convivência.</p>
                        </article>
                        <article className="dashboard-card">
                            <h3>Casa das Ladeiras</h3>
                            <p>Quartos individuais, internet estável e perfil ideal para quem estuda à noite.</p>
                        </article>
                        <article className="dashboard-card">
                            <h3>Solar do Pilar</h3>
                            <p>Espaço compartilhado com boa mobilidade e preferência para calouros.</p>
                        </article>
                    </div>
                </section>

                <section className="dashboard-section" id="todas-as-republicas">
                    <div className="dashboard-section__header">
                        <span>Todas as Repúblicas</span>
                        <h2>Catálogo geral para comparar opções</h2>
                    </div>

                    <div className="dashboard-list">
                        <article>
                            <strong>República Aurora</strong>
                            <span>Centro histórico · 2 vagas · banho quente</span>
                        </article>
                        <article>
                            <strong>República Mineira</strong>
                            <span>Bauxita · 1 vaga · ambiente silencioso</span>
                        </article>
                        <article>
                            <strong>República Acácia</strong>
                            <span>Rosário · 4 vagas · área de estudos</span>
                        </article>
                        <article>
                            <strong>República Libertas</strong>
                            <span>Ouro Preto inteiro · 3 vagas · pets permitidos</span>
                        </article>
                    </div>
                </section>

                <section className="dashboard-section dashboard-section--split" id="sobre-ouro-preto">
                    <div className="dashboard-section__header">
                        <span>Sobre Ouro Preto</span>
                        <h2>Contexto da cidade para tua busca</h2>
                    </div>

                    <div className="dashboard-info-grid">
                        <article className="dashboard-info-card">
                            <h3>Mobilidade</h3>
                            <p>Distâncias curtas, ladeiras exigentes e rotas que mudam a escolha ideal de moradia.</p>
                        </article>
                        <article className="dashboard-info-card">
                            <h3>Vida universitária</h3>
                            <p>Ouro Preto concentra tradição, eventos e rotina estudantil intensa ao longo do ano.</p>
                        </article>
                        <article className="dashboard-info-card">
                            <h3>Decisão segura</h3>
                            <p>Comparar regras, custos e localização é o caminho mais rápido para fechar a república certa.</p>
                        </article>
                    </div>
                </section>

                <section className="dashboard-section dashboard-section--profile" id="meu-perfil">
                    <div className="dashboard-section__header">
                        <span>Meu Perfil</span>
                        <h2>Informações da conta</h2>
                    </div>

                    <article className="profile-hero-card">
                        <div className="profile-hero-card__left">
                            <div className="profile-hero-card__avatar" aria-hidden="true">
                                {userProfile?.initials || userInitials}
                            </div>
                            <div className="profile-hero-card__info">
                                <strong>{authUser?.name ?? "Usuário logado"}</strong>
                                <span className="profile-hero-card__email">{authUser?.email ?? formData.email}</span>
                                <div className="profile-hero-card__badges">
                                    <span className="profile-badge profile-badge--role">
                                        {userProfile?.roleIcon} {userProfile?.roleLabel || authUser?.role || "Sem função"}
                                    </span>
                                    {userProfile?.isUfopEmail ? (
                                        <span className="profile-badge profile-badge--ufop">✓ UFOP Verificado</span>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                        <div className="profile-hero-card__right">
                            {!profileEditMode ? (
                                <button type="button" className="profile-btn profile-btn--edit" onClick={handleProfileEditToggle}>
                                    ✎ Editar perfil
                                </button>
                            ) : null}
                        </div>
                    </article>

                    {!profileEditMode ? (
                        <div className="profile-details-grid">
                            <div className="profile-detail-item">
                                <span className="profile-detail-item__label">Nome completo</span>
                                <span className="profile-detail-item__value">{authUser?.name || "—"}</span>
                            </div>
                            <div className="profile-detail-item">
                                <span className="profile-detail-item__label">Email</span>
                                <span className="profile-detail-item__value">{authUser?.email || "—"}</span>
                            </div>
                            <div className="profile-detail-item">
                                <span className="profile-detail-item__label">Telefone</span>
                                <span className="profile-detail-item__value">{authUser?.phone || "Não informado"}</span>
                            </div>
                            <div className="profile-detail-item">
                                <span className="profile-detail-item__label">Função</span>
                                <span className="profile-detail-item__value">{userProfile?.roleIcon} {userProfile?.roleLabel || "—"}</span>
                            </div>
                            <div className="profile-detail-item profile-detail-item--wide">
                                <span className="profile-detail-item__label">Membro desde</span>
                                <span className="profile-detail-item__value">{userProfile?.formattedRegistrationDate || "—"}</span>
                            </div>
                        </div>
                    ) : (
                        <form className="profile-edit-form" onSubmit={handleProfileSave}>
                            <div className="profile-edit-form__grid">
                                <label className="profile-edit-form__field">
                                    <span>Nome completo</span>
                                    <input
                                        type="text"
                                        name="name"
                                        value={profileFormData.name}
                                        onChange={handleProfileFormChange}
                                        placeholder="Seu nome completo"
                                        autoComplete="name"
                                    />
                                </label>
                                <label className="profile-edit-form__field">
                                    <span>Telefone</span>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={profileFormData.phone}
                                        onChange={handleProfileFormChange}
                                        placeholder="+55 31 99999-9999"
                                        autoComplete="tel"
                                    />
                                </label>
                            </div>
                            <div className="profile-edit-form__actions">
                                <button type="submit" className="profile-btn profile-btn--save" disabled={isSubmitting}>
                                    {isSubmitting ? "Salvando..." : "Salvar alterações"}
                                </button>
                                <button type="button" className="profile-btn profile-btn--cancel" onClick={handleProfileEditToggle}>
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    )}

                    <div className="profile-quick-actions" id="favoritos">
                        <button type="button" className="dashboard-action" onClick={() => setStatus({ type: "success", message: "Abrindo favoritos no protótipo." })}>
                            ★ Favoritos
                        </button>
                        <button type="button" className="dashboard-action" id="configuracoes" onClick={() => setStatus({ type: "success", message: "Abrindo configurações no protótipo." })}>
                            ⚙ Configurações
                        </button>
                        <button type="button" className="dashboard-action dashboard-action--danger" onClick={handleLogout}>
                            Encerrar sessão
                        </button>
                    </div>
                </section>

                <div className={`status-box status-box--${status.type}`} aria-live="polite">
                    {status.message}
                </div>
            </div>
        </main>
    );

    return (
        authUser ? (
            renderAuthShell()
        ) : (
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
                                <button type="button" className="login-form__secondary" onClick={() => setMode("register")}>
                                    Registrarme
                                </button>
                            </form>
                        ) : (
                            <form className="login-form login-form--register" onSubmit={handleRegisterSubmit}>
                                <label>
                                    Nombre completo
                                    <input
                                        type="text"
                                        name="nombre"
                                        value={registerData.nombre}
                                        onChange={handleRegisterChange}
                                        placeholder="Tu nombre completo"
                                        autoComplete="name"
                                    />
                                </label>

                                <label>
                                    Correo electrónico
                                    <input
                                        type="email"
                                        name="correo"
                                        value={registerData.correo}
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

                                <label>
                                    Teléfono (opcional)
                                    <input
                                        type="tel"
                                        name="telefono"
                                        value={registerData.telefono}
                                        onChange={handleRegisterChange}
                                        placeholder="+55 31 99999-9999"
                                        autoComplete="tel"
                                    />
                                </label>

                                <fieldset className="rol-fieldset">
                                    <legend>Rol</legend>
                                    <div className="rol-options">
                                        <label>
                                            <input
                                                type="radio"
                                                name="rol"
                                                value="dueño"
                                                checked={registerData.rol === "dueño"}
                                                onChange={handleRegisterChange}
                                            />
                                            Dueño (quiero alquilar)
                                        </label>
                                        <label>
                                            <input
                                                type="radio"
                                                name="rol"
                                                value="buscador"
                                                checked={registerData.rol === "buscador"}
                                                onChange={handleRegisterChange}
                                            />
                                            Buscador (quiero alquilar)
                                        </label>
                                    </div>
                                </fieldset>

                                <div className="login-form__grid">
                                    <label>
                                        Contraseña
                                        <input
                                            type="password"
                                            name="contrasenia"
                                            value={registerData.contrasenia}
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

                                <button type="button" className="login-form__secondary" onClick={() => setMode("login")}>
                                    Ya tengo cuenta
                                </button>
                            </form>
                        )}
                    </div>

                    <div className={`status-box status-box--${status.type}`} aria-live="polite">
                        {status.message}
                    </div>
                </section>
            </main>
        )
    );
}