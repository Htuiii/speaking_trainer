import os
from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import Optional
from datetime import datetime, timedelta
import jwt
import bcrypt


# ========== СОЗДАНИЕ ПРИЛОЖЕНИЯ ==========
app = FastAPI(title="Speaking Trainer API Gateway")

client_origin = os.getenv("CLIENT_ORIGIN", "http://localhost:3000")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[client_origin],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ========== НАСТРОЙКИ АВТОРИЗАЦИИ ==========
SECRET_KEY = "your-super-secret-key-change-this-in-production"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 часа


security = HTTPBearer()

# Временная "база данных" (потом замените на настоящую)
fake_users_db = {}

# ========== МОДЕЛИ ДАННЫХ ==========
class UserRegister(BaseModel):
    email: str
    username: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

# ========== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ==========
def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Создает JWT токен"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Получает текущего пользователя из JWT токена"""
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        user = fake_users_db.get(email)
        if user is None:
            raise HTTPException(status_code=401, detail="User not found")
        return {"email": email, "user": user}
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

# ========== ТЕСТОВЫЕ ЭНДПОИНТЫ ==========
@app.get("/health")
async def health_check():
    return {"ok": True, "service": "api-gateway"}

@app.get("/api/status")
async def status():
    return {"ready": True, "message": "API Gateway is ready"}

# ========== ЭНДПОИНТЫ АВТОРИЗАЦИИ ==========
@app.post("/auth/register", response_model=TokenResponse)
async def register(user: UserRegister):
    """Регистрация нового пользователя"""
    # Проверяем, существует ли пользователь
    if user.email in fake_users_db:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Создаём пользователя
    hashed_password = hash_password(user.password)
    fake_users_db[user.email] = {
        "email": user.email,
        "username": user.username,
        "hashed_password": hashed_password
    }
    
    # Создаём токен
    access_token = create_access_token(
        data={"sub": user.email},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    
    return {"access_token": access_token}

@app.post("/auth/login", response_model=TokenResponse)
async def login(user: UserLogin):
    """Вход существующего пользователя"""
    # Проверяем пользователя
    db_user = fake_users_db.get(user.email)
    if not db_user or not verify_password(user.password, db_user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Создаём токен
    access_token = create_access_token(
        data={"sub": user.email},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    
    return {"access_token": access_token}

@app.get("/auth/me")
async def get_current_user_info(current_user = Depends(get_current_user)):
    """Получение информации о текущем пользователе"""
    user_data = current_user["user"]
    return {
        "email": user_data["email"],
        "username": user_data["username"]
    }