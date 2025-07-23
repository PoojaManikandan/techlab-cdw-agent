from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi import Query
from typing import List

from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from models.products import Product, CartProduct
from models.cart import Cart, AddToCartRequest
from models.order import Order
import os
import requests
import config

app = FastAPI(
    title="CDW ECommerce API",
    summary="API for managing CDW e-commerce operations"
)

frontend_origin = os.environ.get("FRONTEND_ORIGIN", "http://localhost:3000")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_origin, "*"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = MongoClient(config.MONGODB_URL, server_api=ServerApi('1'))
db = client.cdw_warehouse
products_collection = db.get_collection("products")


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
        order_dict = order.dict()
        db.orders.insert_one(order_dict)
        return Order(**order_dict)
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

