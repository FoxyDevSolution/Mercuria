from sqlalchemy import create_engine, event
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Usamos la contraseña que funcionó
SQLALCHEMY_DATABASE_URL = "mysql+mysqlconnector://root:root123@localhost:3306/mercuria"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Listener para asegurar que el trigger existe después de que el motor conecta
@event.listens_for(engine, "connect")
def receive_connect(dbapi_connection, connection_record):
    cursor = dbapi_connection.cursor()
    # SQL simplificado sin DELIMITER para ejecución directa
    # Primero eliminamos si existe para poder recrearlo
    cursor.execute("DROP TRIGGER IF EXISTS After_Insert_RegistroProduccion")
    
    # Definimos el trigger
    trigger_sql = """
    CREATE TRIGGER After_Insert_RegistroProduccion
    AFTER INSERT ON RegistroProduccion
    FOR EACH ROW
    BEGIN
        DECLARE v_ExistingQuantity INT;
        DECLARE v_ExistingUnitCost DECIMAL(10,2);
        DECLARE v_NewTotalQuantity INT;
        DECLARE v_NewAverageUnitCost DECIMAL(10,2);

        SELECT StockVenta, CostoProduccion INTO v_ExistingQuantity, v_ExistingUnitCost
        FROM ProductoVenta
        WHERE ID = NEW.ID_ProductoVenta;

        SET v_NewTotalQuantity = v_ExistingQuantity + NEW.Cantidad;

        IF v_NewTotalQuantity > 0 THEN
            SET v_NewAverageUnitCost = ((v_ExistingQuantity * IFNULL(v_ExistingUnitCost, 0)) + NEW.CostoTotalLote) / v_NewTotalQuantity;
        ELSE
            SET v_NewAverageUnitCost = NEW.CostoTotalLote / NEW.Cantidad;
        END IF;

        UPDATE ProductoVenta
        SET CostoProduccion = v_NewAverageUnitCost
        WHERE ID = NEW.ID_ProductoVenta;
    END
    """
    try:
        cursor.execute(trigger_sql)
    except Exception as e:
        print(f"Trigger creation failed: {e}")
    finally:
        cursor.close()

