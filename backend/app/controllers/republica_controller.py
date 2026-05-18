# Ey, acá ponemos las rutas del sistema de búsqueda. ¡Cuidado con romper los endpoints!

from fastapi import APIRouter

router = APIRouter()

@router.get("/hello")
def say_hello():
    return {"mensaje": "¡Hola Mundo! El backend en FastAPI está vivo y coleando 🚀"}