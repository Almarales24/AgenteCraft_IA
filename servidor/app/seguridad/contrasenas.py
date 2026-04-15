from passlib.context import CryptContext

contexto = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hashear_contrasena(contrasena: str) -> str:
    return contexto.hash(contrasena)

def verificar_contrasena(contrasena: str, hash: str) -> bool:
    return contexto.verify(contrasena, hash)