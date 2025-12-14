from sqlalchemy import create_engine, text, inspect
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import Mapped, mapped_column, sessionmaker
from datetime import datetime
from typing import Optional

from .config import DATABASE_URL, logger

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    
    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(unique=True)
    hashed_password: Mapped[str] = mapped_column()
    token: Mapped[Optional[str]] = mapped_column(unique=True, nullable=True)
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)

class Article(Base):
    __tablename__ = "articles"
    
    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column()
    content: Mapped[str] = mapped_column()
    author_name: Mapped[str] = mapped_column()
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(default=datetime.utcnow, onupdate=datetime.utcnow)

def update_database_structure():
    """Обновляет структуру существющей базы данных"""
    inspector = inspect(engine)
    
    if 'users' in inspector.get_table_names():
        existing_columns = [col['name'] for col in inspector.get_columns('users')]
        
        if 'created_at' not in existing_columns:
            logger.info("Добавляем столбец created_at в таблицу users")
            with engine.connect() as conn:
                conn.execute(text("ALTER TABLE users ADD COLUMN created_at DATETIME"))
                conn.commit()
    
    if 'articles' in inspector.get_table_names():
        existing_columns = [col['name'] for col in inspector.get_columns('articles')]
        
        if 'created_at' not in existing_columns:
            logger.info("Добавляем столбец created_at в таблицу articles")
            with engine.connect() as conn:
                conn.execute(text("ALTER TABLE articles ADD COLUMN created_at DATETIME"))
                conn.commit()
        
        if 'updated_at' not in existing_columns:
            logger.info("Добавляем столбец updated_at в таблицу articles")
            with engine.connect() as conn:
                conn.execute(text("ALTER TABLE articles ADD COLUMN updated_at DATETIME"))
                conn.commit()

# Создаем таблицы и обновляем структуру
try:
    Base.metadata.create_all(bind=engine)
    update_database_structure()
    logger.info("База данных успешно создана/обновлена")
except Exception as e:
    logger.error(f"Ошибка при создании/обновлении базы данных: {e}")
    raise