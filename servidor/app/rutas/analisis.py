from fastapi import APIRouter, File, UploadFile, HTTPException, Depends
from pydantic import BaseModel
from typing import Dict, Any, List
from fastapi.responses import Response
from app.servicios.servicio_analisis import servicio_analisis
from app.servicios.servicio_ia import servicio_ia
from app.servicios.servicio_reportes import servicio_reportes

enrutador = APIRouter()

# Eschemas Pydantic
class PeticionAnalisis(BaseModel):
    estadisticas: Dict[str, Any]
    parametros_agente: str

class PeticionReporte(BaseModel):
    analisis_ia: Dict[str, Any]

@enrutador.post("/subir")
async def subir_csv(archivo: UploadFile = File(...)):
    """ Endpoint para subir un archivo CSV y generar estadisticas basicas """
    if not archivo.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="El archivo no es CSV")
    
    contenido = await archivo.read()
    try:
        resultado = await servicio_analisis.procesar_csv(contenido)
        return {"datos": resultado}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@enrutador.post("/analizar")
async def analizar_estadisticas(peticion: PeticionAnalisis):
    """ Envia estadisticas a Groq para generar slides """
    try:
        analisis = await servicio_ia.analizar_datos(
            peticion.estadisticas, 
            peticion.parametros_agente
        )
        return {"analisis": analisis}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@enrutador.post("/reporte-pptx")
async def generar_reporte_pptx(peticion: PeticionReporte):
    """ Genera PPTX dadas las diapositivas calculadas por IA """
    try:
        contenido_pptx = servicio_reportes.generar_pptx(peticion.analisis_ia)
        # Devolver como un archivo de descarga
        return Response(
            content=contenido_pptx, 
            media_type="application/vnd.openxmlformats-officedocument.presentationml.presentation",
            headers={"Content-Disposition": "attachment; filename=reporte_profesional.pptx"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
