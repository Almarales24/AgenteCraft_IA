from fastapi import APIRouter

enrutador = APIRouter()

@enrutador.get("/salud")
def verificar_salud():
    return {"estado": "activo"}
