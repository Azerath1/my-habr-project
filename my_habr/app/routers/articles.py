# app/routers/articles.py
from fastapi import APIRouter, Depends, Body, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from typing import List

from ..schemas import ArticleCreate, ArticleResponse
from ..models import Article, User
from ..dependencies import get_db, get_current_user
from ..exceptions import AppException
from ..config import logger

router = APIRouter(prefix="/articles", tags=["Статьи"])

@router.post(
    "",
    response_model=ArticleResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Создание новой статьи"
)
def add_article(
    data: ArticleCreate = Body(...),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        logger.info(f"📝 Создание статьи: '{data.title}' от {user.username}")
        
        if len(data.title) > 200:
            logger.warning(f"⚠️ Слишком длинный заголовок: {len(data.title)} символов")
            raise AppException("Заголовок слишком длинный (максимум 200 символов)", 400)
        
        new_article = Article(
            title=data.title,
            content=data.content,
            author_name=user.username
        )
        
        db.add(new_article)
        db.flush()
        
        logger.info(f"✅ Статья создана: ID {new_article.id}")
        
        return ArticleResponse(
            id=new_article.id,
            title=new_article.title,
            content=new_article.content,
            author_name=new_article.author_name,
            created_at=new_article.created_at,
            updated_at=new_article.updated_at
        )
        
    except SQLAlchemyError as e:
        logger.error(f"❌ Ошибка базы данных при создании статьи: {str(e)}")
        raise AppException("Ошибка сохранения статьи", 500)
    except Exception as e:
        logger.error(f"❌ Неожиданная ошибка при создании статьи: {str(e)}")
        raise AppException("Ошибка создания статьи", 500)

@router.get(
    "",
    response_model=List[ArticleResponse],
    summary="Получение списка статей"
)
def list_articles(db: Session = Depends(get_db)):
    try:
        logger.info("📚 Получение списка статей")
        
        articles = db.query(Article).order_by(Article.created_at.desc()).all()
        
        logger.info(f"📊 Найдено статей: {len(articles)}")
        
        return [
            ArticleResponse(
                id=article.id,
                title=article.title,
                content=article.content,
                author_name=article.author_name,
                created_at=article.created_at,
                updated_at=article.updated_at
            )
            for article in articles
        ]
        
    except SQLAlchemyError as e:
        logger.error(f"❌ Ошибка базы данных при получении статей: {str(e)}")
        raise AppException("Ошибка получения статей", 500)

@router.get(
    "/{article_id}",
    response_model=ArticleResponse,
    summary="Получение статьи по ID"
)
def get_article(article_id: int, db: Session = Depends(get_db)):
    try:
        logger.info(f"🔍 Поиск статьи с ID: {article_id}")
        
        article = db.query(Article).filter(Article.id == article_id).first()
        
        if not article:
            logger.warning(f"⚠️ Статья не найдена: ID {article_id}")
            raise AppException("Статья не найдена", 404)
        
        logger.info(f"✅ Статья найдена: {article.title}")
        
        return ArticleResponse(
            id=article.id,
            title=article.title,
            content=article.content,
            author_name=article.author_name,
            created_at=article.created_at,
            updated_at=article.updated_at
        )
        
    except AppException:
        raise
    except Exception as e:
        logger.error(f"❌ Ошибка при получении статьи {article_id}: {str(e)}")
        raise AppException("Ошибка получения статьи", 500)