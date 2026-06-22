// Modelo frontend para el perfil de usuario.
// Encapsula los datos que vienen del backend y ofrece helpers para la vista.

export class UserProfile {
    constructor({ id = null, name = "", email = "", role = "", phone = "", registrationDate = null } = {}) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.phone = phone;
        this.registrationDate = registrationDate;
    }

    /** Iniciales del usuario para el avatar (máximo 2 caracteres). */
    get initials() {
        if (!this.name) return "R";
        const parts = this.name.trim().split(/\s+/).filter(Boolean);
        const first = parts[0]?.[0] ?? "R";
        const second = parts[1]?.[0] ?? this.name.trim()[1] ?? "";
        return `${first}${second}`.toUpperCase();
    }

    /** Etiqueta legible del rol (portugués). */
    get roleLabel() {
        const labels = {
            dueño: "Proprietário",
            buscador: "Buscador de moradia",
        };
        return labels[this.role] || this.role || "Não definido";
    }

    /** Icono emoji representativo del rol. */
    get roleIcon() {
        return this.role === "dueño" ? "🏠" : "🔍";
    }

    /** true si el correo pertenece al dominio UFOP. */
    get isUfopEmail() {
        return this.email.trim().toLowerCase().endsWith("@aluno.ufop.edu.br");
    }

    /** Fecha de registro formateada en portugués brasileño. */
    get formattedRegistrationDate() {
        if (!this.registrationDate) return "Não disponível";
        const date = new Date(this.registrationDate);
        return date.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
    }

    /**
     * Crea una instancia de UserProfile a partir del objeto authUser
     * que devuelve el endpoint de login.
     */
    static fromAuthUser(authUser) {
        if (!authUser) return null;
        return new UserProfile({
            id: authUser.id,
            name: authUser.name,
            email: authUser.email,
            role: authUser.role,
            phone: authUser.phone || "",
            registrationDate: authUser.registrationDate || null,
        });
    }

    /** Payload listo para enviar al endpoint PUT de actualización. */
    toUpdatePayload() {
        return {
            nombre: this.name,
            telefono: this.phone || null,
        };
    }
}
