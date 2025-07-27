import os
import httpx
import random
from fastapi import FastAPI, Depends, HTTPException, Request, status
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from pymongo.server_api import ServerApi
from passlib.context import CryptContext
from models.user import User,LogoutRequest
from auth.auth import create_access_token
from auth.deps import get_current_user
from dotenv import load_dotenv
load_dotenv()

# Env vars
PRODUCT_SERVER_URL = os.getenv("PRODUCT_SERVER_URL")
ADK_SERVER_URL = os.getenv("ADK_SERVER_URL")
FRONTEND_ORIGIN = os.getenv("FRONTEND_ORIGIN")
MONGO_URL = os.getenv("MONGODB_URL")
ADK_APP_NAME = os.getenv("ADK_APP_NAME")

# App
app = FastAPI(title="ECommerce API Gateway")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_ORIGIN, "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB setup
client = MongoClient(MONGO_URL, server_api=ServerApi('1'))
db = client.cdw_warehouse
users_collection = db.get_collection("users")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# ==========================
# Helper Functions
# ==========================
def get_user_util(username: str):
    try:
        user = users_collection.find_one({"username": username})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return user
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {e}")

def authenticate_user(username: str, password: str):
    user = get_user_util(username)
    if not user or not pwd_context.verify(password, user["password"]):
        return False
    return user

def generate_unique_4_digit_id():
    while True:
        uid = random.randint(1000, 9999)
        if not users_collection.find_one({"user_id": str(uid)}):
            return str(uid)

# ==========================
# Routes
# ==========================

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/signup")
def signup(user: User):
    try:
        if users_collection.find_one({"username": user.username}):
            raise HTTPException(status_code=400, detail="User already exists")

        user_data = {
            "user_id": generate_unique_4_digit_id(),
            "username": user.username,
            "password": pwd_context.hash(user.password),
        }

        users_collection.insert_one(user_data)
        return {"status": "success", "message": "User created"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Signup failed: {e}")

@app.post("/login")
async def login(user: User, request: Request):
    try:
        auth_user = authenticate_user(user.username, user.password)
        if not auth_user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        user_id = auth_user["user_id"]
        token = create_access_token({"sub":  user_id})

        # Call ADK service to create a session
        async with httpx.AsyncClient() as client:
            adk_res = await client.post(
                f"{ADK_SERVER_URL}/apps/{ADK_APP_NAME}/users/{user_id}/sessions",
            )
            adk_res.raise_for_status()
            adk_session = adk_res.json()
        
        return {
            "access_token": token,
            "token_type": "bearer",
            "session_id": adk_session["id"],
            "adk_app_name": adk_session["appName"],
            "user_id": user_id
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Login failed: {e}")
    
@app.post("/logout")
async def logout(request: Request, payload: LogoutRequest):
    try:
        async with httpx.AsyncClient() as client:
            res = await client.delete(
                f"{ADK_SERVER_URL}/apps/{ADK_APP_NAME}/users/{payload.user_id}/sessions/{payload.session_id}",
            )
            res.raise_for_status()
        return {"status": "logged out"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Logout failed: {e}")

@app.get("/protected")
def protected(current_user: str = Depends(get_current_user)):
    return {"message": f"Hello {current_user}, you're authenticated!"}

# ==========================
# Proxy Routes
# ==========================

@app.get("/products")
async def proxy_products():
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{PRODUCT_SERVER_URL}/products")
            response.raise_for_status()
            return response.json()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch products: {e}")

@app.get("/cart/{user_id}")
async def proxy_get_cart(user_id: str, current_user: str = Depends(get_current_user)):
    if current_user != user_id:
        print(f"Current user: {current_user}, Requested user: {user_id}")
        raise HTTPException(status_code=403, detail="Forbidden")
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{PRODUCT_SERVER_URL}/cart/{user_id}")
            response.raise_for_status()
            return response.json()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get cart: {e}")

@app.post("/cart/{user_id}")
async def proxy_add_to_cart(user_id: str, request: Request, current_user: str = Depends(get_current_user)):
    if current_user != user_id:
        print(f"Current user: {current_user}, Requested user: {user_id}")
        raise HTTPException(status_code=403, detail="Forbidden")
    try:
        body = await request.json()
        async with httpx.AsyncClient() as client:
            response = await client.post(f"{PRODUCT_SERVER_URL}/cart/{user_id}", json=body)
            response.raise_for_status()
            return response.json()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to add to cart: {e}")

@app.get("/order")
async def proxy_get_order(user_id: str = None, order_id: str = None, current_user: str = Depends(get_current_user)):
    if user_id and user_id != current_user:
        raise HTTPException(status_code=403, detail="Forbidden")
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{PRODUCT_SERVER_URL}/order", params={"user_id": user_id, "order_id": order_id})
            response.raise_for_status()
            return response.json()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch order: {e}")

@app.post("/order")
async def proxy_create_order(request: Request, current_user: str = Depends(get_current_user)):
    try:
        body = await request.json()
        async with httpx.AsyncClient() as client:
            response = await client.post(f"{PRODUCT_SERVER_URL}/order", json=body)
            response.raise_for_status()
            return response.json()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create order: {e}")

@app.put("/order/{order_id}")
async def proxy_update_order(order_id: str, request: Request, current_user: str = Depends(get_current_user)):
    try:
        body = await request.json()
        async with httpx.AsyncClient() as client:
            response = await client.put(f"{PRODUCT_SERVER_URL}/order/{order_id}", json=body)
            response.raise_for_status()
            return response.json()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update order: {e}")

@app.post("/api/paypal/capture-order/{order_id}")
async def proxy_capture_paypal(order_id: str):
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(f"{PRODUCT_SERVER_URL}/api/paypal/capture-order/{order_id}")
            response.raise_for_status()
            return response.json()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to capture PayPal order: {e}")

@app.post("/run")
async def proxy_agent_ask(request: Request):
    try:
        body = await request.json()
        print(body)
        async with httpx.AsyncClient() as client:
            response = await client.post(f"{ADK_SERVER_URL}/run", json=body)
            response.raise_for_status()
            return response.json()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Agent request failed: {e}")