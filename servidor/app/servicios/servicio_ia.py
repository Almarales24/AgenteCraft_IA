import json
from groq import Groq
from typing import Dict, Any
from app.configuracion import ajustes

class ServicioIA:
    def __init__(self):
        pass

    async def analizar_datos(self, estadisticas: Dict[str, Any], parametros_agente: str) -> Dict[str, Any]:
        """
        Llama al modelo de Groq para interpretar las estadisticas y generar
        diapositivas con puntos y notas del orador.
        """
        try:
            client = Groq(api_key=ajustes.groq_api_key)
            
            prompt_contexto = (
                f"Eres un experto analista de datos. Te pasare estadisticas de un dataset y tu "
                f"deberás generar un reporte profesional de varias diapositivas.\n"
                f"Parametros adicionales para el enfoque del reporte: {parametros_agente}\n\n"
                f"Aquí están las estadisticas de los datos: \n{json.dumps(estadisticas, indent=2)}\n\n"
                f"Debes devolver tu respuesta EXCLUSIVAMENTE en un formato JSON valido sin ningun texto adicional. El formato es:\n"
                f"{{\n"
                f"  \"resumen_general\": \"Un string con el resumen\",\n"
                f"  \"diapositivas\": [\n"
                f"    {{\n"
                f"      \"titulo\": \"...\",\n"
                f"      \"puntos\": [\"punto 1\", \"punto 2\"],\n"
                f"      \"notas_orador\": \"Notas detalladas para que el presentador lea o explique durante esta diapositiva\"\n"
                f"    }}\n"
                f"  ]\n"
                f"}}"
            )

            chat_completion = client.chat.completions.create(
                messages=[
                    {
                        "role": "user",
                        "content": prompt_contexto,
                    }
                ],
                model="llama-3.3-70b-versatile",  # Modelo actualizado y soportado por Groq
                temperature=0.5,
                response_format={"type": "json_object"}
            )
            
            respuesta = chat_completion.choices[0].message.content
            return json.loads(respuesta)
        except Exception as e:
            raise ValueError(f"Error en el analisis de IA: {str(e)}")

servicio_ia = ServicioIA()