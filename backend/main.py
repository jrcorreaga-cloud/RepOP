from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db, engine, Base
from app.models.usuario_model import Usuario
from app.models.republica_model import Republica

app = FastAPI(title="API Repúblicas - Ouro Preto")

Base.metadata.create_all(bind=engine)

@app.get("/")
def read_root():
    return {"status": "ok", "message": "API de Repúblicas encendida"}

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
