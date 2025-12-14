from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text, func

from ..schemas import HealthResponse
from ..models import engine, User, Article
from ..dependencies import get_db
from ..exceptions import AppException
from ..config import logger
from datetime import datetime

router = APIRouter(tags=["Система"])

@router.get(
    "/health",
    response_model=HealthResponse,
    summary="Проверка работоспособности"
)
def health_check():
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        
        logger.debug("✅ Проверка здоровья: OK")
        return HealthResponse(
            status="healthy",
            timestamp=datetime.now(),
            database="connected"
        )
    except Exception as e:
        logger.error(f"❌ Проверка здоровья не пройдена: {str(e)}")
        return HealthResponse(
            status="unhealthy",
            timestamp=datetime.now(),
            database="disconnected"
        )

@router.get(
    "/api/stats",
    summary="Статистика системы"
)
def get_stats(db: Session = Depends(get_db)):
    try:
        user_count = db.query(func.count(User.id)).scalar() or 0
        article_count = db.query(func.count(Article.id)).scalar() or 0
        
        logger.info(f"📊 Статистика: {user_count} пользователей, {article_count} статей")
        
        return {
            "users": user_count,
            "articles": article_count,
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        logger.error(f"❌ Ошибка получения статистики: {str(e)}")
        raise AppException("Ошибка получения статистики", 500)