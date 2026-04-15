from datetime import datetime, timedelta
from jose import jwt, JWTError
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from app.configuracion import ajustes

esquema_oauth2 = OAuth2PasswordBearer(tokenUrl="/api/autenticacion/login")

def crear_token(datos: dict) -> str:
    payload = datos.copy()
    expiracion = datetime.utcnow() + timedelta(minutes=ajustes.minutos_expiracion_token)
    payload.update({"exp": expiracion})
    return jwt.encode(payload, ajustes.secreto_jwt, algorithm=ajustes.algoritmo_jwt)

def obtener_usuario_actual(token: str = Depends(esquema_oauth2)):
    try:
        payload = jwt.decode(token, ajustes.secreto_jwt, algorithms=[ajustes.algoritmo_jwt])
        usuario_id = payload.get("sub")
        if not usuario_id:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token inválido")
        return usuario_id
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token inválido")