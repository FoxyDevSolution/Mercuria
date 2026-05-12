# Aquí crearemos las funciones para agregar, ver, editar o borrar tus materias primas (CRUD).

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import models, schemas
from database import get_db
from typing import List

# ESTA ES LA LÍNEA QUE FALTA O ESTÁ MAL ESCRITA:
router = APIRouter(
    prefix="/materia-prima",
    tags=["Materia Prima"]
)

# 1. LEER: Obtener toda la lista de materias primas
@router.get("/", response_model=List[schemas.MateriaPrima])
def read_materia_prima(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    productos = db.query(models.MateriaPrima).offset(skip).limit(limit).all()
    return productos

# 2. CREAR: Agregar un nuevo insumo al stock
@router.post("/", response_model=schemas.MateriaPrima)
def create_materia_prima(producto: schemas.MateriaPrimaCreate, db: Session = Depends(get_db)):
    nuevo_producto = models.MateriaPrima(**producto.dict())
    db.add(nuevo_producto)
    db.commit()
    db.refresh(nuevo_producto)
    return nuevo_producto

# 3. LEER UNO: Ver detalles de un insumo específico por ID
@router.get("/{producto_id}", response_model=schemas.MateriaPrima)
def read_una_materia(producto_id: int, db: Session = Depends(get_db)):
    db_producto = db.query(models.MateriaPrima).filter(models.MateriaPrima.ID == producto_id).first()
    if db_producto is None:
        raise HTTPException(status_code=404, detail="Materia prima no encontrada")
    return db_producto

# 4. ELIMINAR: Quitar un insumo del sistema
@router.delete("/{producto_id}")
def delete_materia_prima(producto_id: int, db: Session = Depends(get_db)):
    db_producto = db.query(models.MateriaPrima).filter(models.MateriaPrima.ID == producto_id).first()
    if db_producto is None:
        raise HTTPException(status_code=404, detail="Insumo no encontrado")
    db.delete(db_producto)
    db.commit()
    return {"message": "Input deleted successfully"}

# 5. UPDATE: Modify an existing input
@router.put("/{producto_id}", response_model=schemas.MateriaPrima)
def update_materia_prima(producto_id: int, producto_actualizado: schemas.MateriaPrimaCreate, db: Session = Depends(get_db)):
    db_producto = db.query(models.MateriaPrima).filter(models.MateriaPrima.ID == producto_id).first()
    
    if db_producto is None:
        raise HTTPException(status_code=404, detail="Materia prima no encontrada")

    # Actualizamos los valores campo por campo
    for key, value in producto_actualizado.dict().items():
        setattr(db_producto, key, value)

    db.commit()
    db.refresh(db_producto)
    return db_producto