# app/routers/auth.py
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from passlib.context import CryptContext
import uuid

from ..schemas import UserAuth, UserResponse, TokenResponse
from ..models import User
from ..dependencies import get_current_user, get_db
from ..exceptions import UserExistsException, AuthenticationException, AppException
from ..config import logger
from fastapi.security import OAuth2PasswordRequestForm

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

router = APIRouter(prefix="", tags=["Аутентификация"])

@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Регистрация нового пользователя"
)
def register(data: UserAuth, db: Session = Depends(get_db)):
    try:
        logger.info(f"📝 Регистрация пользователя: {data.username}")
        
        existing_user = db.query(User).filter(User.username == data.username).first()
        if existing_user:
            raise UserExistsException(data.username)
        
        hashed = pwd_context.hash(data.password)
        new_user = User(username=data.username, hashed_password=hashed)
        
        db.add(new_user)
        db.flush()
        
        logger.info(f"✅ Пользователь зарегистрирован: {data.username} (ID: {new_user.id})")
        
        return UserResponse(
            id=new_user.id,
            username=new_user.username,
            created_at=new_user.created_at
        )
        
    except UserExistsException:
        raise
    except IntegrityError as e:
        logger.error(f"❌ Ошибка целостности при регистрации: {str(e)}")
        raise AppException("Пользователь уже существует или ошибка базы данных", 400)
    except Exception as e:
        logger.error(f"❌ Неожиданная ошибка при регистрации: {str(e)}")
        raise AppException("Ошибка регистрации", 500)

@router.post(
    "/login",
    response_model=TokenResponse,
    summary="Вход пользователя"
)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    try:
        logger.info(f"🔐 Попытка входа: {form_data.username}")
        
        user = db.query(User).filter(User.username == form_data.username).first()
        
        if not user:
            logger.warning(f"⚠️ Пользователь не найден: {form_data.username}")
            raise AuthenticationException()
        
        if not pwd_context.verify(form_data.password, str(user.hashed_password)):
            logger.warning(f"⚠️ Неверный пароль для пользователя: {form_data.username}")
            raise AuthenticationException()
        
        new_token = str(uuid.uuid4())
        user.token = new_token
        db.commit()
        
        logger.info(f"✅ Успешный вход: {form_data.username}")
        
        return TokenResponse(
            access_token=new_token,
            username=user.username
        )
        
    except AuthenticationException:
        raise
    except Exception as e:
        logger.error(f"❌ Ошибка при входе: {str(e)}")
        raise AppException("Ошибка входа", 500)

@router.get("/users/me", response_model=UserResponse)
def get_me(user: User = Depends(get_current_user)):
    return UserResponse.from_orm(user)