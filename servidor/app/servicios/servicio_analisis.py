import pandas as pd
import io
import json

class ServicioAnalisis:
    async def procesar_csv(self, contenido_archivo: bytes):
        try:
            # Leer el CSV en pandas
            df = pd.read_csv(io.BytesIO(contenido_archivo))
            
            # Obtener informacion basica
            columnas = df.columns.tolist()
            num_filas = len(df)
            
            # Tipos de datos
            tipos = df.dtypes.astype(str).to_dict()
            
            # Resumen estadistico para columnas numericas
            stats_numericas = {}
            if len(df.select_dtypes(include=['number']).columns) > 0:
                desc = df.describe().to_dict()
                stats_numericas = desc
                
            # Muestra de datos (primeras 5 filas) para previsualizacion
            muestra = df.head(5).to_dict(orient="records")
            
            # Convertir a JSON dict
            resumen = {
                "num_filas": num_filas,
                "columnas": columnas,
                "tipos_datos": tipos,
                "estadisticas": stats_numericas,
                "muestra": muestra
            }
            return resumen
        except Exception as e:
            raise ValueError(f"Error procesando el archivo CSV: {str(e)}")

servicio_analisis = ServicioAnalisis()
