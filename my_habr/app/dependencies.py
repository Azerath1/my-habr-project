# app/dependencies.py
from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from .models import SessionLocal, User
from .config import logger
from .exceptions import AuthenticationException

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def get_db():
    db = SessionLocal()
    try:
        yield db
        db.commit()
    except Exception as e:
        db.rollback()
        raise
    finally:
        db.close()

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        if not token:
            logger.warning("No token provided")
            raise AuthenticationException("Токен не предоставлен")
        
        user = db.query(User).filter(User.token == token).first()
        
        if not user:
            logger.warning(f"User not found for token: {token[:10]}...")
            raise AuthenticationException("Неверный токен")
        
        logger.info(f"User authenticated: {user.username}")
        return user
    except AuthenticationException:
        raise
    except Exception as e:
        logger.error(f"Error in get_current_user: {str(e)}")
        raise AuthenticationException("Ошибка аутентификации")