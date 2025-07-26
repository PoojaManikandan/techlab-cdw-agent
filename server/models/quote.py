from pydantic import BaseModel
from typing import List

from models.products import CartProduct


class Quote(BaseModel):
    quote_id: str
    user_id: str
    quoted_price: float
    status: str
    products: List[CartProduct]
    total_price: float
    number_of_items: int


class QuoteProduct(BaseModel):
    cdw: str
    quantity: int


class AddToQuoteRequest(BaseModel):
    products: List[QuoteProduct]
    quoted_price: float
