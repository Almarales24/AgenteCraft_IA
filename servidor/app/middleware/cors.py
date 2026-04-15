from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.configuracion import ajustes

def configurar_cors(aplicacion: FastAPI):
    origenes = ajustes.origenes_cors.split(",")
    aplicacion.add_middleware(
        CORSMiddleware,
        allow_origins=origenes,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
