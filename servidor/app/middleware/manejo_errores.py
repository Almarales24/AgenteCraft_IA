from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

def configurar_manejo_errores(aplicacion: FastAPI):
    @aplicacion.exception_handler(Exception)
    async def manejador_error_generico(solicitud: Request, error: Exception):
        return JSONResponse(status_code=500, content={"detalle": str(error)})
