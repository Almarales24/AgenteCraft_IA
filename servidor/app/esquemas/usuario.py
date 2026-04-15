from pydantic import BaseModel, EmailStr

class UsuarioRegistro(BaseModel):
    nombre: str
    correo: EmailStr
    contrasena: str

class UsuarioLogin(BaseModel):
    correo: EmailStr
    contrasena: str

class UsuarioRespuesta(BaseModel):
    id: str
    nombre: str
    correo: str
    activo: bool

    model_config = {"from_attributes": True}

class Token(BaseModel):
    token_acceso: str
    tipo: str = "bearer"