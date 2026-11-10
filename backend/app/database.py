
import os
from pathlib import Path

from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# Carpeta local para almacenar SQLite
BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
DATA_DIR.mkdir(exist_ok=True)

# URL de conexión
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    f"sqlite:///{DATA_DIR / 'tasks.db'}"
)

# Motor de conexión
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}
)

# Configuración de sesiones
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# Base para los modelos
Base = declarative_base()


# Obtener una sesión de base de datos
def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()
