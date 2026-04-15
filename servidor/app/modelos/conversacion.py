from sqlalchemy import Column, String, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
from app.base_datos import Base

class Conversacion(Base):
    __tablename__ = "conversaciones"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    titulo = Column(String)
    mensajes = Column(JSON, default=list)
    creado_en = Column(DateTime(timezone=True), server_default=func.now())
    actualizado_en = Column(DateTime(timezone=True), onupdate=func.now())

    agente_id = Column(String, ForeignKey("agentes.id"), nullable=False)
    agente = relationship("Agente", back_populates="conversaciones")