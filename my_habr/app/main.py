# app/main.py
import uuid
import traceback
from datetime import datetime

from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from .config import logger
from .exceptions import AppException
from .routers import auth, articles, system

app = FastAPI(
    title="Simple Habr API",
    description="""
    ## 🚀 API для блога Habr-like
    
    ### Основные возможности:
    - 👤 **Регистрация и аутентификация пользователей**
    - 📝 **Создание и чтение статей**
    - 🔒 **Защита эндпоинтов с помощью JWT**
    - 📊 **Детальное логирование операций**
    
    ### Технологический стек:
    - **FastAPI** - современный фреймворк
    - **SQLAlchemy** - ORM для работы с БД
    - **Argon2** - безопасное хеширование паролей
    - **Pydantic** - валидация данных
    """,
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Middleware для логирования запросов
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = datetime.now()
    request_id = str(uuid.uuid4())
    
    logger.info(f"📥 Request: {request.method} {request.url} - ID: {request_id}")
    
    try:
        response = await call_next(request)
        process_time = (datetime.now() - start_time).total_seconds() * 1000
        
        logger.info(
            f"📤 Response: {request.method} {request.url} - "
            f"Status: {response.status_code} - "
            f"Time: {process_time:.2f}ms - ID: {request_id}"
        )
        
        return response
    except Exception as e:
        process_time = (datetime.now() - start_time).total_seconds() * 1000
        logger.error(
            f"❌ Error: {request.method} {request.url} - "
            f"Exception: {type(e).__name__}: {str(e)} - "
            f"Time: {process_time:.2f}ms - ID: {request_id}"
        )
        logger.debug(traceback.format_exc())
        raise

# Глобальный обработчик исключений
@app.exception_handler(AppException)
async def app_exception_handler(request: Request, exc: AppException):
    logger.error(f"AppException: {exc.message} (status: {exc.status_code})")
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": True,
            "message": exc.message,
            "timestamp": datetime.now().isoformat(),
            "path": request.url.path,
        }
    )

@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    logger.warning(f"HTTPException: {exc.detail} (status: {exc.status_code})")
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": True,
            "message": exc.detail,
            "timestamp": datetime.now().isoformat(),
            "path": request.url.path,
        }
    )

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    error_details = {
        "error_type": type(exc).__name__,
        "error_message": str(exc),
    }
    
    logger.critical(f"Unhandled exception: {error_details}")
    logger.debug(f"Traceback: {traceback.format_exc()}")
    
    return JSONResponse(
        status_code=500,
        content={
            "error": True,
            "message": "Внутренняя ошибка сервера",
            "timestamp": datetime.now().isoformat(),
            "request_id": str(uuid.uuid4()),
            "path": request.url.path,
        }
    )

# Добавляем роутеры
app.include_router(auth.router)
app.include_router(articles.router)
app.include_router(system.router)

if __name__ == "__main__":
    import uvicorn
    
    logger.info("🚀 Запуск Simple Habr API...")
    print("""
    ╔══════════════════════════════════════════════════════════╗
    ║                    SIMPLE HABR API                       ║
    ╠══════════════════════════════════════════════════════════╣
    ║ 📍 Доступные адреса:                                    ║
    ║                                                          ║
    ║   • 📄 Документация:  http://localhost:8000/docs        ║
    ║   • 📖 ReDoc:         http://localhost:8000/redoc       ║
    ║   • ❤️  Здоровье:     http://localhost:8000/health      ║
    ║                                                          ║
    ║ 📝 Логи: app.log                                      ║
    ╚══════════════════════════════════════════════════════════╝
    """)
    
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        log_level="info"
    )