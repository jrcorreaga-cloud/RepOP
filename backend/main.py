from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.controllers.republica_controller import router as republica_router

app = FastAPI(title="API Repúblicas")

# Permitimos que nuestro amigo el frontend (React) nos hable sin que CORS nos bloquee la vida
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción cambiar por localhost:5173 o dominio real
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Conectamos nuestras rutas
app.include_router(republica_router, prefix="/api")

@app.get("/")
def read_root():
    return {"status": "ok", "message": "API está encendida!"}