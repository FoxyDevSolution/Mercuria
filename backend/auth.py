#Aquí vivirá la lógica para que los usuarios se registren e inicien sesión.

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import models, schemas
from database import get_db

router = APIRouter(
    prefix="/auth",
    tags=["Autenticación"]
)

# 1. REGISTRO: Para crear usuarios (Admin o Vendedor)
@router.post("/register", response_model=schemas.Usuario)
def register_user(usuario: schemas.UsuarioCreate, db: Session = Depends(get_db)):
    # Verificamos si el nombre ya existe
    db_user = db.query(models.Usuario).filter(models.Usuario.Nombre == usuario.Nombre).first()
    if db_user:
        raise HTTPException(status_code=400, detail="El nombre de usuario ya existe")
    
    nuevo_usuario = models.Usuario(Nombre=usuario.Nombre, Rol=usuario.Rol)
    db.add(nuevo_usuario)
    db.commit()
    db.refresh(nuevo_usuario)
    return nuevo_usuario

# 2. LOGIN: Para verificar quién entra
@router.post("/login")
def login(usuario: schemas.UsuarioLogin, db: Session = Depends(get_db)):
    print(f"DEBUG: Intentando loguear usuario: {usuario.Nombre}")
    db_user = db.query(models.Usuario).filter(models.Usuario.Nombre == usuario.Nombre).first()
    
    if not db_user:
        print(f"DEBUG: Usuario {usuario.Nombre} no encontrado en la DB")
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    print(f"DEBUG: Usuario encontrado: {db_user.Nombre}")
    # Devolvemos los datos del usuario para que el Frontend sepa qué mostrar
    return {
        "message": "Login exitoso",
        "usuario": {
            "ID": db_user.ID,
            "Nombre": db_user.Nombre,
            "Rol": db_user.Rol
        }
    }