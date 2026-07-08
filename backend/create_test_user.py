from database import SessionLocal, engine
from models import Usuario, Base

def create_test_user():
    # Create tables first
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        # Check if user already exists
        existing_user = db.query(Usuario).filter(Usuario.Nombre == "admin").first()
        if existing_user:
            print("User 'admin' already exists.")
        else:
            new_user = Usuario(Nombre="admin", Rol="Admin")
            db.add(new_user)
            db.commit()
            print("User 'admin' created successfully.")
    except Exception as e:
        print(f"Error creating user: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    create_test_user()
