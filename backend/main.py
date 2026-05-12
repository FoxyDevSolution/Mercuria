from fastapi import FastAPI
import models
from database import engine
import products 
import auth # Importamos nuestro nuevo módulo de seguridad

# Intentamos conectar y crear tablas en MySQL
try:
    models.Base.metadata.create_all(bind=engine)
    print("¡Conexión a MySQL exitosa!")
except Exception as e:
    print(f"Error de conexión: {e}")

app = FastAPI(title="Mercuria API")

# --- REGISTRO DE RUTAS (Routers) ---
app.include_router(products.router)
app.include_router(auth.router)

@app.get("/")
def home():
    return {"status": "Running Mercury"}