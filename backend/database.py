import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# Get database URL from environment variable
DATABASE_URL = os.getenv("DATABASE_URL")

# Fallback (optional, for local development)
if not DATABASE_URL:
    DATABASE_URL = "sqlite:///./rental.db"

# Fix for PostgreSQL URL (Render gives postgres:// but SQLAlchemy needs postgresql://)
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

# Create engine
engine = create_engine(
    DATABASE_URL,
    connect_args={
        "check_same_thread": False} if "sqlite" in DATABASE_URL else {}
)

# Session
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base model
Base = declarative_base()

# Dependency (used in routes)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
