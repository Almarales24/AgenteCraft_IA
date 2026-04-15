from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
from app.base_datos import Base

class Agente(Base):
    __tablename__ = "agentes"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    nombre = Column(String, nullable=False)
    descripcion = Column(Text)
    instrucciones = Column(Text)
    modelo = Column(String, default="llama-3.3-70b-versatile")
    activo = Column(Boolean, default=True)
    creado_en = Column(DateTime(timezone=True), server_default=func.now())
    actualizado_en = Column(DateTime(timezone=True), onupdate=func.now())

    propietario_id = Column(String, ForeignKey("usuarios.id"), nullable=False)
    propietario = relationship("Usuario", back_populates="agentes")
    conversaciones = relationship("Conversacion", back_populates="agente")