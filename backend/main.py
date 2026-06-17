from typing import Optional
from fastapi import FastAPI, Depends, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.controllers.auth_controller import router as auth_router
from app.controllers.republica_controller import router as republica_router
from sqlalchemy.orm import Session
from app.core.database import get_db, engine, Base
from app.models.usuario_model import Usuario
from app.models.republica_model import Republica

app = FastAPI(title="API Repúblicas - Ouro Preto")

# Permitimos que nuestro amigo el frontend (React) nos hable sin que CORS nos bloquee la vida
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción cambiar por localhost:5173 o dominio real
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Conectamos nuestras rutas
app.include_router(auth_router, prefix="/api/auth")
app.include_router(republica_router, prefix="/api")

def require_status_header(x_api_key: Optional[str] = Header(None, alias="X-API-KEY")):
    if x_api_key != "demo-health-key":
        raise HTTPException(status_code=401, detail="X-API-KEY inválido")
    return x_api_key

@app.get("/api/status")
def read_status(api_key: str = Depends(require_status_header)):
    return {
        "status": "ok",
        "api": "RepOP",
        "message": "Backend conectado con frontend via header basico",
    }

@app.get("/")
def read_root():
    return {"status": "ok", "message": "API está encendida y lista para el login demo."}

Base.metadata.create_all(bind=engine)

@app.get("/api/check-db")
def check_db(db: Session = Depends(get_db)):
    try:
        # Intentamos contar los usuarios para verificar conexión
        count = db.query(Usuario).count()
        return {
            "status": "connected",
            "database": "republicas_db",
            "usuarios_registrados": count
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error de conexión: {str(e)}")
