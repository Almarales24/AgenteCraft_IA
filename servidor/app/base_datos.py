from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from app.configuracion import ajustes

motor = create_engine(ajustes.url_base_datos)
SesionLocal = sessionmaker(autocommit=False, autoflush=False, bind=motor)
Base = declarative_base()

def obtener_sesion():
    sesion = SesionLocal()
    try:
        yield sesion
    finally:
        sesion.close()