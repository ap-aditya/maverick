import os
from dotenv import load_dotenv
from sqlmodel import create_engine, SQLModel

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(DATABASE_URL)


def create_db_and_tables():
    try:
        SQLModel.metadata.create_all(engine)
        print("✅ Database initialized successfully")
    except Exception as e:
        print(f"❌ Database initialization failed: {e}")
