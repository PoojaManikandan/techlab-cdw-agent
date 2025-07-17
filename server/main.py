import os
from dotenv import load_dotenv

from fastapi import FastAPI
from fastapi import Response
from fastapi.responses import JSONResponse

from typing import List

from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

from pydantic.functional_validators import BeforeValidator
from typing_extensions import Annotated

load_dotenv()

app = FastAPI(
    title="CDW ECommerce API",
    summary="API for managing CDW e-commerce operations"
)
mongodb_url = os.environ["MONGODB_URL"]
client = MongoClient(mongodb_url, server_api=ServerApi('1'))
db = client.cdw_warehouse
products_collection = db.get_collection("products")


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
    
