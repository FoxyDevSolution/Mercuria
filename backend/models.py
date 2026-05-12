from sqlalchemy import Column, Integer, String, DECIMAL, Enum, ForeignKey, TIMESTAMP, Text, Date
from sqlalchemy.sql import func
from database import Base

class Usuario(Base):
    __tablename__ = "Usuario"
    # Usamos ID en mayúsculas para coincidir con tu SQL
    ID = Column(Integer, primary_key=True, index=True)
    Nombre = Column(String(100))
    # Usamos Enum para restringir los roles como en tu base de datos
    Rol = Column(Enum('Admin', 'Vendedor'))

class MateriaPrima(Base):
    __tablename__ = "MateriaPrima"
    ID = Column(Integer, primary_key=True, index=True)
    Tipo = Column(String(50))
    Color = Column(String(30))
    Talle = Column(String(10))
    CantidadStock = Column(Integer)
    # Este campo se llena solo con la hora actual al crear o actualizar
    FechaActualizacion = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())

class Estampa(Base):
    __tablename__ = "Estampa"
    ID = Column(Integer, primary_key=True, index=True)
    Nombre = Column(String(100))
    Descripcion = Column(Text)
    Stock = Column(Integer)
    FechaCreacion = Column(Date)

class ProductoVenta(Base):
    __tablename__ = "ProductoVenta"
    ID = Column(Integer, primary_key=True, index=True)
    Tipo = Column(String(50))
    PrecioVenta = Column(DECIMAL(10, 2))
    CostoProduccion = Column(DECIMAL(10, 2))
    StockVenta = Column(Integer)