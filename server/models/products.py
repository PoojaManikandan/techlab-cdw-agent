from pydantic import BaseModel, Field
from typing import List


class ProductSpec(BaseModel):
    label: str
    value: str


class Product(BaseModel):
    name: str
    mfg: str
    cdw: str
    imageUrl: str
    availability: str
    availabilityText: str
    price: float
    specs: List[ProductSpec]
    id: str


class CartProduct(BaseModel):
    quantity: int
    product: Product

