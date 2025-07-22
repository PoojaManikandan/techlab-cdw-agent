from pydantic import BaseModel
from typing import List
from enum import Enum

from models.products import CartProduct

class BillingAddress(BaseModel):
    name: str
    address1: str
    city: str
    state: str
    country: str
    zip_code: str

class ShippingAddress(BaseModel):
    name: str
    address1: str
    city: str
    state: str
    country: str
    zip_code: str


class OrderStatus(str, Enum):
    pending = "pending"
    paid = "paid"
    shipped = "shipped"
    delivered = "delivered"
    returned = "returned"

class Order(BaseModel):
    order_id: str
    products: List[CartProduct]
    total_price: float
    number_of_items: int
    user_id: str
    name: str
    email_id: str
    estimated_delivery: str
    tracking_link: str
    status: str
    billing_address: BillingAddress
    shipping_address: ShippingAddress
