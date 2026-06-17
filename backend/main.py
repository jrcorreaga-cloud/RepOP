from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.controllers.republica_controller import router as republica_router

app = FastAPI(title="API Repúblicas")

# Permitimos que nosso amigo frontend (React) nos fale sem que o CORS nos bloqueie a vida
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Em produção, trocar por localhost:5173 ou domínio real
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Conectamos nossas rotas
app.include_router(republica_router, prefix="/api")

@app.get("/")
def read_root():
    return {"status": "ok", "message": "API está ligada!"}