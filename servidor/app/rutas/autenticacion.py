from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.base_datos import obtener_sesion
from app.esquemas.usuario import UsuarioRegistro, UsuarioLogin, UsuarioRespuesta, Token
from app.modelos.usuario import Usuario
from app.seguridad.contrasenas import hashear_contrasena, verificar_contrasena
from app.seguridad.jwt import crear_token

enrutador = APIRouter()

@enrutador.post("/registro", response_model=UsuarioRespuesta)
def registrar(datos: UsuarioRegistro, sesion: Session = Depends(obtener_sesion)):
    existente = sesion.query(Usuario).filter(Usuario.correo == datos.correo).first()
    if existente:
        raise HTTPException(status_code=400, detail="Correo ya registrado")
    usuario = Usuario(
        nombre=datos.nombre,
        correo=datos.correo,
        contrasena_hash=hashear_contrasena(datos.contrasena)
    )
    sesion.add(usuario)
    sesion.commit()
    sesion.refresh(usuario)
    return usuario

@enrutador.post("/login", response_model=Token)
def login(datos: UsuarioLogin, sesion: Session = Depends(obtener_sesion)):
    usuario = sesion.query(Usuario).filter(Usuario.correo == datos.correo).first()
    if not usuario or not verificar_contrasena(datos.contrasena, usuario.contrasena_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Credenciales incorrectas")
    token = crear_token({"sub": usuario.id})
    return {"token_acceso": token}