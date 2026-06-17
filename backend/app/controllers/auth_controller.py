# Rutas de autenticación demo. Por ahora solo sirven para maquillar el flujo de login.

from fastapi import APIRouter, HTTPException

from app.models.republica_model import LoginRequest, LoginResponse

router = APIRouter()


@router.post("/login", response_model=LoginResponse)
def login(payload: LoginRequest):
    email = payload.email.strip()
    password = payload.password.strip()

    if not email or not password:
        raise HTTPException(status_code=400, detail="Email y contraseña son obligatorios")

    display_name = email.split("@")[0].replace(".", " ").replace("_", " ").title()

    return LoginResponse(
        access_token="demo-token-repop",
        token_type="bearer",
        user={
            "name": display_name,
            "email": email,
            "role": "explorador",
        },
        message="Login demo exitoso. Pronto conectaremos autenticación real.",
    )