#Este archivo sirve para definir qué datos esperamos recibir o enviar (por ejemplo, que para crear un producto necesitamos un nombre y un precio decimal).
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

# --- ESQUEMAS DE USUARIO ---
class UsuarioBase(BaseModel):
    Nombre: str
    Rol: str # 'Admin' o 'Vendedor'

class UsuarioCreate(UsuarioBase):
    pass # Al crear un usuario, pedimos Nombre y Rol

class Usuario(UsuarioBase):
    ID: int

    class Config:
        from_attributes = True


# --- ESQUEMAS DE MATERIA PRIMA ---
class MateriaPrimaBase(BaseModel):
    Tipo: str
    Color: Optional[str] = None
    Talle: Optional[str] = None
    CantidadStock: int

class MateriaPrimaCreate(MateriaPrimaBase):
    pass # Lo que pedimos cuando alguien carga stock nuevo

class MateriaPrima(MateriaPrimaBase):
    ID: int
    FechaActualizacion: Optional[datetime]

    class Config:
        from_attributes = True


# --- ESQUEMAS DE ESTAMPA ---
class EstampaBase(BaseModel):
    Nombre: str
    Descripcion: Optional[str] = None
    Stock: int

class EstampaCreate(EstampaBase):
    pass

class Estampa(EstampaBase):
    ID: int

    class Config:
        from_attributes = True
        

# Scheme for Login
class UsuarioLogin(BaseModel):
    Nombre: str
    # Por ahora usaremos el Nombre como credencial principal