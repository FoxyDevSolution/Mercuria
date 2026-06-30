from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import models, schemas
from database import get_db
from typing import List

# --- Router para Materia Prima ---
router_mp = APIRouter(prefix="/materia-prima", tags=["Materia Prima"])

@router_mp.get("/", response_model=List[schemas.MateriaPrima])
def read_materia_prima(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(models.MateriaPrima).offset(skip).limit(limit).all()

@router_mp.post("/", response_model=schemas.MateriaPrima)
def create_materia_prima(producto: schemas.MateriaPrimaCreate, db: Session = Depends(get_db)):
    nuevo_producto = models.MateriaPrima(**producto.dict())
    db.add(nuevo_producto)
    db.commit()
    db.refresh(nuevo_producto)
    return nuevo_producto

@router_mp.put("/{producto_id}", response_model=schemas.MateriaPrima)
def update_materia_prima(producto_id: int, producto_actualizado: schemas.MateriaPrimaCreate, db: Session = Depends(get_db)):
    db_producto = db.query(models.MateriaPrima).filter(models.MateriaPrima.ID == producto_id).first()
    if not db_producto:
        raise HTTPException(status_code=404, detail="Materia prima no encontrada")
    for key, value in producto_actualizado.dict().items():
        setattr(db_producto, key, value)
    db.commit()
    db.refresh(db_producto)
    return db_producto

# --- Router para Estampas ---
router_estampas = APIRouter(prefix="/estampas", tags=["Estampas"])

@router_estampas.get("/", response_model=List[schemas.Estampa])
def read_estampas(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(models.Estampa).offset(skip).limit(limit).all()

@router_estampas.post("/", response_model=schemas.Estampa)
def create_estampa(estampa: schemas.EstampaCreate, db: Session = Depends(get_db)):
    nueva_estampa = models.Estampa(**estampa.dict())
    db.add(nueva_estampa)
    db.commit()
    db.refresh(nueva_estampa)
    return nueva_estampa

@router_estampas.put("/{estampa_id}", response_model=schemas.Estampa)
def update_estampa(estampa_id: int, estampa_actualizada: schemas.EstampaCreate, db: Session = Depends(get_db)):
    db_estampa = db.query(models.Estampa).filter(models.Estampa.ID == estampa_id).first()
    if not db_estampa:
        raise HTTPException(status_code=404, detail="Estampa no encontrada")
    for key, value in estampa_actualizada.dict().items():
        setattr(db_estampa, key, value)
    db.commit()
    db.refresh(db_estampa)
    return db_estampa

@router_estampas.delete("/{estampa_id}")
def delete_estampa(estampa_id: int, db: Session = Depends(get_db)):
    db_estampa = db.query(models.Estampa).filter(models.Estampa.ID == estampa_id).first()
    if not db_estampa:
        raise HTTPException(status_code=404, detail="Estampa no encontrada")
    db.delete(db_estampa)
    db.commit()
    return {"message": "Estampa eliminada"}

# --- Router para Productos Venta ---
router_productos = APIRouter(prefix="/productos", tags=["Productos Venta"])

@router_productos.get("/", response_model=List[schemas.ProductoVenta])
def read_productos(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(models.ProductoVenta).offset(skip).limit(limit).all()

@router_productos.post("/", response_model=schemas.ProductoVenta)
def create_producto(producto: schemas.ProductoVentaCreate, db: Session = Depends(get_db)):
    nuevo_producto = models.ProductoVenta(**producto.dict())
    db.add(nuevo_producto)
    db.commit()
    db.refresh(nuevo_producto)
    return nuevo_producto

@router_productos.put("/{producto_id}", response_model=schemas.ProductoVenta)
def update_producto(producto_id: int, producto_actualizado: schemas.ProductoVentaCreate, db: Session = Depends(get_db)):
    db_producto = db.query(models.ProductoVenta).filter(models.ProductoVenta.ID == producto_id).first()
    if not db_producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    for key, value in producto_actualizado.dict().items():
        setattr(db_producto, key, value)
    db.commit()
    db.refresh(db_producto)
    return db_producto

@router_productos.delete("/{producto_id}")
def delete_producto(producto_id: int, db: Session = Depends(get_db)):
    db_producto = db.query(models.ProductoVenta).filter(models.ProductoVenta.ID == producto_id).first()
    if not db_producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    db.delete(db_producto)
    db.commit()
    return {"message": "Producto eliminado"}

# --- Router para Producción ---
router_produccion = APIRouter(prefix="/produccion", tags=["Producción"])

@router_produccion.post("/", response_model=schemas.RegistroProduccion)
def registrar_produccion(produccion: schemas.RegistroProduccionCreate, db: Session = Depends(get_db)):
    # Crear registro
    nuevo_registro = models.RegistroProduccion(**produccion.dict())
    
    # Insertar en la base de datos
    db.add(nuevo_registro)
    db.commit()
    db.refresh(nuevo_registro)
    
    # El trigger en MySQL ya se disparó al hacer commit, 
    # actualizando el CostoProduccion en ProductoVenta.
    
    return nuevo_registro
