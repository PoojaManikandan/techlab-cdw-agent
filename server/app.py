from fastapi import Depends, FastAPI, HTTPException ,status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi import Query
from typing import List

from pydantic import BaseModel
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from models.products import Product, CartProduct
from models.cart import Cart, AddToCartRequest
from models.order import Order
from models.user import User
from models.quote import Quote, AddToQuoteRequest, QuoteProduct

from pydantic.functional_validators import BeforeValidator
from typing_extensions import Annotated
import requests

import config
from auth import create_access_token
from deps import get_current_user
from passlib.context import CryptContext
import random

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

client = MongoClient(config.MONGODB_URL, server_api=ServerApi('1'))
db = client.cdw_warehouse
products_collection = db.get_collection("products")
users_collection = db.get_collection("users")

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
    

@app.get("/products", response_model=List[Product])
def get_products():
    try:
        products = []
        for product in products_collection.find({}):
            products.append(Product(**product))
        return products
    except Exception as e:
        return JSONResponse(status_code=500, content={"status": "error", "message": str(e)})


@app.get("/products/{cdw}", response_model=Product)
def get_product_by_cdw(cdw: str):
    try:
        product = products_collection.find_one({"cdw": cdw})
        if product:
            return Product(**product)
        else:
            return JSONResponse(status_code=404, content={"status": "error", "message": "Product not found"})
    except Exception as e:
        return JSONResponse(status_code=500, content={"status": "error", "message": str(e)})
    

@app.get("/cart/{user_id}", response_model=Cart)
def get_cart(user_id: str):
    try:
        cart = db.cart.find_one({"user_id": user_id})
        if not cart:
            return JSONResponse(status_code=404, content={"status": "error", "message": "Cart not found"})
        return cart
    except Exception as e:
        return JSONResponse(status_code=500, content={"status": "error", "message": str(e)})
    

@app.post("/cart/{user_id}", response_model=Cart)
def add_to_cart(user_id: str, body: AddToCartRequest):
    cdw = body.cdw
    quantity = body.quantity
    try:
        product = products_collection.find_one({"cdw": cdw})
        if not product:
            return JSONResponse(status_code=404, content={"status": "error", "message": "Product not found"})
        
        cart = db.cart.find_one({"user_id": user_id})
        if not cart:
            cart_obj = Cart(products=[], total_price=0.0, number_of_items=0, user_id=user_id)
        else:
            cart_obj = Cart(**cart)

        cart_product = CartProduct(quantity=quantity, product=Product(**product))

        cart_obj.add_product(cart_product)

        db.cart.update_one({"user_id": user_id}, {"$set": cart_obj.dict()}, upsert=True)

        return cart_obj
    except Exception as e:
        return JSONResponse(status_code=500, content={"status": "error", "message": str(e)})
    


@app.get("/quote/{user_id}", response_model=List[Quote])
def get_quotes(user_id: str):
    try:
        quotes = list(db.quotes.find({"user_id": user_id}))
        if not quotes:
            return JSONResponse(status_code=404, content={"status": "error", "message": "No quotes found for this user"})
        return [Quote(**quote) for quote in quotes]
    except Exception as e:
        return JSONResponse(status_code=500, content={"status": "error", "message": str(e)})
    

@app.get("/quote/{user_id}/{quote_id}", response_model=Quote)
def get_quote(user_id: str, quote_id: str):
    try:
        quote = db.quotes.find_one({"user_id": user_id, "quote_id": quote_id})
        if not quote:
            return JSONResponse(status_code=404, content={"status": "error", "message": "Quote not found"})
        return Quote(**quote)
    except Exception as e:
        return JSONResponse(status_code=500, content={"status": "error", "message": str(e)})


@app.post("/quote/{user_id}", response_model=Quote)
def add_to_quote(user_id: str, body: AddToQuoteRequest):
    try:
        quote_products = body.products
        quoted_price = body.quoted_price

        products = []
        total_price = 0.0
        number_of_items = 0
        for product in quote_products:
            product_data = products_collection.find_one({"cdw": product.cdw})
            if not product_data:
                return JSONResponse(status_code=404, content={"status": "error", "message": f"Product with CDW {product.cdw} not found"})
            
            cart_product = CartProduct(
                quantity=product.quantity,
                product=Product(**product_data)
            )
            products.append(cart_product)
            total_price += cart_product.quantity * float(product_data["price"])
            number_of_items += cart_product.quantity
            

        quote_id = "quote-" + str(random.randint(1000, 9999))  # Generate a random quote ID
        quote = Quote(
            quote_id=quote_id,
            user_id=user_id,
            quoted_price=quoted_price,
            status="pending",
            products=products,
            total_price=total_price,
            number_of_items=number_of_items
        )

        db.quotes.insert_one(quote.dict())
        return quote
    except Exception as e:
        return JSONResponse(status_code=500, content={"status": "error", "message": str(e)})



@app.get("/order", response_model=List[Order])
def get_order(user_id: str = Query(None), order_id: str = Query(None)):
    try:
        if order_id:
            order = db.orders.find_one({"order_id": order_id})
            if not order:
                return JSONResponse(status_code=404, content={"status": "error", "message": "Order not found"})
            return [Order(**order)]
        elif user_id:
            orders = list(db.orders.find({"user_id": user_id}))
            if not orders:
                return JSONResponse(status_code=404, content={"status": "error", "message": "No orders found for this user"})
            return [Order(**order) for order in orders]
        else:
            return JSONResponse(status_code=400, content={"status": "error", "message": "Either user_id or order_id must be provided as a query parameter."})
    except Exception as e:
        return JSONResponse(status_code=500, content={"status": "error", "message": str(e)})
    

@app.post("/order", response_model=Order)
def create_order(order: Order):
    try:
        print( f"Creating order: {order}")
        order_dict = order.dict()
        db.orders.insert_one(order_dict)
        return Order(**order_dict)
    except Exception as e:
        print(f"Error creating order: {str(e)}")
        return JSONResponse(status_code=500, content={"status": "error", "message": str(e)})
class UpdateStatusRequest(BaseModel):
    status: str
@app.put("/order/{order_id}", response_model=Order)
def update_order_status(order_id: str, request: UpdateStatusRequest):
    try:
        # Check if the order exists
        existing_order = db.orders.find_one({"order_id": order_id})
        if not existing_order:
            return JSONResponse(status_code=404, content={"status": "error", "message": "Order not found"})
        
        # Update only the status field
        result = db.orders.update_one({"order_id": order_id}, {"$set": {"status": request.status}})
        if result.matched_count == 0:
            return JSONResponse(status_code=404, content={"status": "error", "message": "Order not found"})
        
        # Return the updated order
        existing_order["status"] = request.status  # Update the status in the local object
        return Order(**existing_order)
    except Exception as e:
        return JSONResponse(status_code=500, content={"status": "error", "message": str(e)})

def get_paypal_access_token():
    response = requests.post(
        "https://api-m.sandbox.paypal.com/v1/oauth2/token",
        auth=(config.PAYPAL_CLIENT_ID, config.PAYPAL_CLIENT_SECRET),
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

def generate_unique_4_digit_id(users_collection):
    unique = False
    user_id = None

    while not unique:
        user_id = random.randint(1000, 9999)
        existing_user = users_collection.find_one({"user_id": user_id})
        if not existing_user:
            unique = True

    return user_id

@app.post("/signup")
def signup(user: User):
    try:
        existing_user = users_collection.find_one({"username": user.username})
        if existing_user:
            raise HTTPException(status_code=400, detail="User already exists")

        hashed_password = pwd_context.hash(user.password)

        user_data = {
            "user_id": str(generate_unique_4_digit_id(users_collection)),
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

