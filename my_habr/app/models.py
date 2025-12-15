# app/models.py
from sqlalchemy import create_engine, text, inspect
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import Mapped, mapped_column, sessionmaker
from datetime import datetime
from typing import Optional

from .config import DATABASE_URL, logger

# app/config.py
import logging
from datetime import datetime
from dotenv import load_dotenv
import os

load_dotenv()  # Загружаем .env

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

console_handler = logging.StreamHandler()
console_handler.setLevel(logging.INFO)

file_handler = logging.FileHandler('app.log', encoding='utf-8')
file_handler.setLevel(logging.ERROR)

formatter = logging.Formatter(
    '%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)

console_handler.setFormatter(formatter)
file_handler.setFormatter(formatter)

logger.addHandler(console_handler)
logger.addHandler(file_handler)

# --- КЛЮЧЕВОЕ ИСПРАВЛЕНИЕ ---
DATABASE_URL = os.getenv("DATABASE_URL")

if DATABASE_URL is None:
    raise ValueError(
        "Ошибка: переменная окружения DATABASE_URL не найдена!\n"
        "Создайте файл .env в корне проекта my_habr/ и добавьте туда:\n"
        "DATABASE_URL=postgresql+psycopg2://postgres:ваш_пароль@localhost:5432/simple_habr_db"
    )

# Теперь DATABASE_URL — гарантированно str, Pylance доволен

engine = create_engine(DATABASE_URL)
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
    """Обновляет структуру существующей базы данных"""
    inspector = inspect(engine)
    
    if 'users' in inspector.get_table_names():
        existing_columns = [col['name'] for col in inspector.get_columns('users')]
        
        if 'created_at' not in existing_columns:
            logger.info("Добавляем столбец created_at в таблицу users")
            with engine.begin() as conn:
                conn.execute(text("ALTER TABLE users ADD COLUMN created_at DATETIME"))
    
    if 'articles' in inspector.get_table_names():
        existing_columns = [col['name'] for col in inspector.get_columns('articles')]
        
        if 'created_at' not in existing_columns:
            logger.info("Добавляем столбец created_at в таблицу articles")
            with engine.begin() as conn:
                conn.execute(text("ALTER TABLE articles ADD COLUMN created_at DATETIME"))
        
        if 'updated_at' not in existing_columns:
            logger.info("Добавляем столбец updated_at в таблицу articles")
            with engine.begin() as conn:
                conn.execute(text("ALTER TABLE articles ADD COLUMN updated_at DATETIME"))

# Создаем таблицы и обновляем структуру
try:
    Base.metadata.create_all(bind=engine)
    update_database_structure()
    logger.info("База данных успешно создана/обновлена")
except Exception as e:
    logger.error(f"Ошибка при создании/обновлении базы данных: {e}")
    raise