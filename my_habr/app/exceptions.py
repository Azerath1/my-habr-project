# app/exceptions.py
class AppException(Exception):
    def __init__(self, message: str, status_code: int = 500):
        self.message = message
        self.status_code = status_code
        super().__init__(message)

class UserExistsException(AppException):
    def __init__(self, username: str):
        super().__init__(f"Пользователь '{username}' уже существует", 400)

class AuthenticationException(AppException):
    def __init__(self, message: str = "Неверные учетные данные"):
        super().__init__(message, 401)