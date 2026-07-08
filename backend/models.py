from sqlalchemy import Column, Integer, String, DECIMAL, Enum, ForeignKey, TIMESTAMP, Text, Date
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

class Usuario(Base):
    __tablename__ = "Usuario"
    ID = Column(Integer, primary_key=True, index=True)
    Nombre = Column(String(100))
    Rol = Column(Enum('Admin', 'Vendedor', name='rol_enum'))
    
    ventas = relationship("Venta", back_populates="usuario")

class MateriaPrima(Base):
    __tablename__ = "MateriaPrima"
    ID = Column(Integer, primary_key=True, index=True)
    Tipo = Column(String(50))
    Color = Column(String(30))
    Talle = Column(String(10))
    CantidadStock = Column(Integer)
    FechaActualizacion = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())
    
    alertas = relationship("AlertaStock", back_populates="materia_prima")
    productos_venta = relationship("MateriaPrimaProductoVenta", back_populates="materia_prima")
    producciones = relationship("RegistroProduccion", back_populates="materia_prima")

class Estampa(Base):
    __tablename__ = "Estampa"
    ID = Column(Integer, primary_key=True, index=True)
    Nombre = Column(String(100))
    Descripcion = Column(Text)
    Stock = Column(Integer)
    FechaCreacion = Column(Date)
    
    productos = relationship("ProductoEstampa", back_populates="estampa")
    producciones = relationship("RegistroProduccion", back_populates="estampa")

class ProductoVenta(Base):
    __tablename__ = "ProductoVenta"
    ID = Column(Integer, primary_key=True, index=True)
    Tipo = Column(String(50))
    PrecioVenta = Column(DECIMAL(10, 2))
    CostoProduccion = Column(DECIMAL(10, 2))
    StockVenta = Column(Integer)
    
    estampas = relationship("ProductoEstampa", back_populates="producto")
    alertas = relationship("AlertaStock", back_populates="producto_venta")
    materias_primas = relationship("MateriaPrimaProductoVenta", back_populates="producto_venta")
    producciones = relationship("RegistroProduccion", back_populates="producto_venta")
    detalles_venta = relationship("DetalleVenta", back_populates="producto_venta")

class ProductoEstampa(Base):
    __tablename__ = "ProductoEstampa"
    ID = Column(Integer, primary_key=True, index=True)
    id_producto = Column(Integer, ForeignKey("ProductoVenta.ID"))
    id_estampa = Column(Integer, ForeignKey("Estampa.ID"))
    
    producto = relationship("ProductoVenta", back_populates="estampas")
    estampa = relationship("Estampa", back_populates="productos")

class RegistroProduccion(Base):
    __tablename__ = "RegistroProduccion"
    ID = Column(Integer, primary_key=True, index=True)
    ID_MateriaPrima = Column(Integer, ForeignKey("MateriaPrima.ID"))
    ID_Estampa = Column(Integer, ForeignKey("Estampa.ID"))
    Cantidad = Column(Integer)
    CostoTotalLote = Column(DECIMAL(10, 2))
    ID_ProductoVenta = Column(Integer, ForeignKey("ProductoVenta.ID"))
    FechaProduccion = Column(TIMESTAMP, server_default=func.now())
    
    materia_prima = relationship("MateriaPrima", back_populates="producciones")
    estampa = relationship("Estampa", back_populates="producciones")
    producto_venta = relationship("ProductoVenta", back_populates="producciones")

class AlertaStock(Base):
    __tablename__ = "AlertaStock"
    ID = Column(Integer, primary_key=True, index=True)
    Tipo = Column(String(50))
    NivelCriticoStock = Column(Integer)
    FechaGeneracion = Column(TIMESTAMP, server_default=func.now())
    ProductoVentaID = Column(Integer, ForeignKey("ProductoVenta.ID"))
    MateriaPrimaID = Column(Integer, ForeignKey("MateriaPrima.ID"))
    
    producto_venta = relationship("ProductoVenta", back_populates="alertas")
    materia_prima = relationship("MateriaPrima", back_populates="alertas")

class MateriaPrimaProductoVenta(Base):
    __tablename__ = "MateriaPrimaProductoVenta"
    ID_MaterialPrima = Column(Integer, ForeignKey("MateriaPrima.ID"), primary_key=True)
    ID_ProductoVenta = Column(Integer, ForeignKey("ProductoVenta.ID"), primary_key=True)
    CantidadUtilizada = Column(DECIMAL(10, 2))
    
    materia_prima = relationship("MateriaPrima", back_populates="productos_venta")
    producto_venta = relationship("ProductoVenta", back_populates="materias_primas")

class Venta(Base):
    __tablename__ = "Venta"
    ID = Column(Integer, primary_key=True, index=True)
    Fecha = Column(TIMESTAMP, server_default=func.now())
    TipoVenta = Column(Enum('Online', 'Presencial', name='tipo_venta_enum'))
    TotalVenta = Column(DECIMAL(10, 2))
    UsuarioID = Column(Integer, ForeignKey("Usuario.ID"))
    
    usuario = relationship("Usuario", back_populates="ventas")
    detalles = relationship("DetalleVenta", back_populates="venta")

class DetalleVenta(Base):
    __tablename__ = "DetalleVenta"
    ID = Column(Integer, primary_key=True, index=True)
    ID_venta = Column(Integer, ForeignKey("Venta.ID"))
    ID_producto_venta = Column(Integer, ForeignKey("ProductoVenta.ID"))
    Cantidad_vendida = Column(Integer)
    FechaVentaRegistro = Column(TIMESTAMP, server_default=func.now())
    
    venta = relationship("Venta", back_populates="detalles")
    producto_venta = relationship("ProductoVenta", back_populates="detalles_venta")
