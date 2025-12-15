# app/schemas.py
from pydantic import BaseModel, Field
from datetime import datetime

class UserAuth(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    password: str = Field(..., min_length=6, max_length=100)
    
    class Config:
        schema_extra = {
            "example": {
                "username": "test_user",
                "password": "test_password"
            }
        }

class ArticleCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    content: str = Field(..., min_length=10)
    
    class Config:
        schema_extra = {
            "example": {
                "title": "Моя первая статья",
                "content": "Содержание моей замечательной статьи..."
            }
        }

class ArticleResponse(BaseModel):
    id: int
    title: str
    content: str
    author_name: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class UserResponse(BaseModel):
    id: int
    username: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    username: str

class HealthResponse(BaseModel):
    status: str
    timestamp: datetime
    database: str
    version: str = "1.0.0"