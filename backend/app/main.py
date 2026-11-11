
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from app.database import engine

app = FastAPI(
    title="To-Do List API",
    description="The Evolution Challenge - Team 1: Build It",
    version="0.1.0"
)

# Permitir peticiones desde el frontend React
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001"
    ],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"]
)


@app.get("/")
def root():
    return {
        "message": "To-Do List API funcionando correctamente"
    }


@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "service": "todo-api"
    }

@app.get("/health/db")
def database_health():
    with engine.connect() as connection:
        connection.execute(text("SELECT 1"))

    return {
        "status": "ok",
        "database": "SQLite"
    }