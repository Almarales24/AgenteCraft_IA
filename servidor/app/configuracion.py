from pydantic_settings import BaseSettings

class Ajustes(BaseSettings):
    entorno: str = "desarrollo"
    depuracion: bool = True
    url_base_datos: str = "sqlite:///./agentecraft.db"
    secreto_jwt: str = "cambiar_esto"
    algoritmo_jwt: str = "HS256"
    minutos_expiracion_token: int = 30
    groq_api_key: str = ""
    origenes_cors: str = "http://localhost:3000"

    class Config:
        env_file = ".env"
        extra = "ignore"

ajustes = Ajustes()
