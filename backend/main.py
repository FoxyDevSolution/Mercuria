from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import models
from database import engine
from products import router_mp, router_estampas, router_productos, router_produccion
import auth

# Intentamos conectar y crear tablas
try:
    models.Base.metadata.create_all(bind=engine)
    print("¡Conexión a la base de datos exitosa!")
except Exception as e:
    print(f"Error de conexión: {e}")

app = FastAPI(title="Mercuria API")

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Tu frontend local
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- REGISTRO DE RUTAS (Routers) ---
app.include_router(router_mp)
app.include_router(router_estampas)
app.include_router(router_productos)
app.include_router(router_produccion)
app.include_router(auth.router)

@app.get("/")
def home():
    return {"status": "Running Mercury"}
