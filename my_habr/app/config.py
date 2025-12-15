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