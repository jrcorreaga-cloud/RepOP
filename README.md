# 🏘️ Buscador de Repúblicas en Ouro Preto (Nombre por definir)

## 📖 Descripción del Proyecto

Este proyecto es una plataforma web (actualmente en desarrollo) enfocada en centralizar y facilitar la búsqueda de alojamiento estudiantil y particular en la histórica ciudad universitaria de Ouro Preto. La aplicación sirve como un puente directo entre personas que necesitan un lugar donde morar y las repúblicas que tienen cupos disponibles.

## ⚠️ El Problema

Encontrar una "república" (residencia de estudiantes) ideal en Ouro Preto suele ser un proceso caótico. Históricamente, la información se dispersa en grupos de redes sociales, carteles en la calle o el boca a boca. Esto genera:
- **Para el buscador:** Estrés, pérdida de tiempo y dificultad para comparar opciones (precios, reglas, ubicación).
- **Para los dueños/moradores:** Dificultad para visibilizar su república y llenar rápidamente los cuartos o vacantes (vagas) libres, lo que puede afectar la economía de la casa.

## ✨ Flujo y Características Principales

1. **Para los Usuarios (Buscadores):**
   - Registro y creación de cuenta en la plataforma.
   - Búsqueda y filtrado de repúblicas disponibles en Ouro Preto.
   - Visualización de información clave (fotos, reglas, costos y vagas disponibles).

2. **Para Dueños / Representantes de Repúblicas:**
   - Registro como administrador de una república.
   - Perfil de la casa: posibilidad de darse a conocer, listar características y ambiente.
   - **Gestión de vagas:** Publicar en tiempo real si tienen cuartos o cupos habilitados para atraer inquilinos de manera rápida.

## 🛠️ Stack Tecnológico (Arquitectura MVC)

- **Backend:** FastAPI (Python)
- **Frontend:** React + Vite (JavaScript)
- **Base de Datos:** MySQL
- **Contenedores:** Docker y Docker Compose para facilitar despliegues y pruebas.

---

## 🚀 Guía de Inicio Rápido (Localhost)

Para levantar el proyecto en tu máquina local:

### 1. Levantar el Backend (FastAPI)
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```
*La API estará documentada y corriendo en: `http://localhost:8000/docs`*

### 2. Levantar el Frontend (React)
Abre otra terminal y ejecuta:
```bash
cd frontend
npm install
npm run dev
```
*La UI estará disponible en: `http://localhost:5173`*

## Cuadro Kanban
