from fastapi import FastAPI
from app.configuracion import ajustes
from app.middleware.cors import configurar_cors
from app.middleware.manejo_errores import configurar_manejo_errores
from app.rutas import autenticacion, agentes, conversaciones, salud, analisis

aplicacion = FastAPI(title="AgenteCraft IA", version="1.0.0")

configurar_cors(aplicacion)
configurar_manejo_errores(aplicacion)

@aplicacion.on_event("startup")
def crear_tablas():
    pass # Base.metadata.create_all(bind=motor) - Deshabilitado temp para no necesitar BD si no es requerida ahora

aplicacion.include_router(salud.enrutador)
aplicacion.include_router(autenticacion.enrutador, prefix="/api/autenticacion", tags=["autenticacion"])
aplicacion.include_router(agentes.enrutador, prefix="/api/agentes", tags=["agentes"])
aplicacion.include_router(conversaciones.enrutador, prefix="/api/conversaciones", tags=["conversaciones"])
aplicacion.include_router(analisis.enrutador, prefix="/api/analisis", tags=["analisis"])