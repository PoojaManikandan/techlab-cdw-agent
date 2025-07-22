import os
from dotenv import load_dotenv


from fastapi import Depends, FastAPI, HTTPException ,status
from fastapi.middleware.cors import CORSMiddleware
from fastapi import Response
from fastapi.responses import JSONResponse

from typing import List

from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

from pydantic.functional_validators import BeforeValidator
from typing_extensions import Annotated
import requests
from fastapi.security import OAuth2PasswordRequestForm

from auth import create_access_token
from deps import get_current_user
from passlib.context import CryptContext

load_dotenv()

PAYPAL_CLIENT_ID = os.getenv('PAYPAL_CLIENT_ID')
PAYPAL_CLIENT_SECRET = os.getenv('PAYPAL_CLIENT_SECRET')

app = FastAPI(
    title="CDW ECommerce API",
    summary="API for managing CDW e-commerce operations"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

mongodb_url = os.environ["MONGODB_URL"]
client = MongoClient(mongodb_url, server_api=ServerApi('1'))
db = client.cdw_warehouse
products_collection = db.get_collection("products")
users_collection = db.get_collection("users")


# Represents an ObjectId field in the database.
# It will be represented as a `str` on the model so that it can be serialized to JSON.
PyObjectId = Annotated[str, BeforeValidator(str)]

from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class ProductSpec(BaseModel):
    label: str
    value: str

class ProductResponse(BaseModel):
    mongo_id: str = Field(..., alias="_id")
    name: str
    mfg: str
    cdw: str
    imageUrl: str
    availability: str
    availabilityText: str
    price: str
    specs: List[ProductSpec]
    id: str
class User(BaseModel):
    username: str
    password: str

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def get_user_util(username: str):
    try:
        user = users_collection.find_one({"username": username})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        user["_id"] = str(user["_id"]) 
        return user
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def authenticate_user(username: str, password: str):
    user = get_user_util(username)
    if not user or not pwd_context.verify(password, user["password"]):
        return False
    return user

@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/check-mongo")
def check_mongo_connection():
    try:
        db.command("ping")
        return {"status": "success", "message": "MongoDB connection established."}
    except Exception as e:
        return {"status": "error", "message": str(e)}
    

@app.get("/products", response_model=List[ProductResponse])
def get_products():
    try:
        products = []
        for product in products_collection.find({}):
            product["_id"] = str(product["_id"])
            products.append(ProductResponse(**product))
        return products
    except Exception as e:
        return JSONResponse(status_code=500, content={"status": "error", "message": str(e)})



@app.get("/products/{product_id}", response_model=ProductResponse)
def get_product(product_id: str):
    try:
        product = products_collection.find_one({"id": product_id})
        if product:
            product["_id"] = str(product["_id"])
            return ProductResponse(**product)
        else:
            return JSONResponse(status_code=404, content={"status": "error", "message": "Product not found"})
    except Exception as e:
        return JSONResponse(status_code=500, content={"status": "error", "message": str(e)})
    
def get_paypal_access_token():
    response = requests.post(
        "https://api-m.sandbox.paypal.com/v1/oauth2/token",
        auth=(PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET),
        headers={"Accept": "application/json"},
        data={"grant_type": "client_credentials"},
    )
    return response.json()["access_token"]

@app.post("/api/paypal/capture-order/{order_id}")
def capture_order(order_id: str):
    access_token = get_paypal_access_token()
    res = requests.post(
        f"https://api-m.sandbox.paypal.com/v2/checkout/orders/{order_id}/capture",
        headers={"Authorization": f"Bearer {access_token}"}
    )
    return res.json()


@app.post("/login")
async def login(data: User):
    user = authenticate_user(data.username, data.password)
    if not user:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Bad credentials",
                            headers={"WWW-Authenticate": "Bearer"})
    token = create_access_token({"sub": user["username"]})
    return {"access_token": token, "token_type": "bearer"}

@app.post("/signup")
def signup(user: User):
    try:
        existing_user = users_collection.find_one({"username": user.username})
        if existing_user:
            raise HTTPException(status_code=400, detail="User already exists")

        hashed_password = pwd_context.hash(user.password)

        user_data = {
            "username": user.username,
            "password": hashed_password
        }

        
        users_collection.insert_one(user_data)

        return {"status": "success", "message": "User created successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/protected")
async def protected_route(current_user: str = Depends(get_current_user)):
    return {"message": f"Hello, {current_user}! You’re authenticated "}