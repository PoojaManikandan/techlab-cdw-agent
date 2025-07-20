from pydantic import BaseModel
from typing import List

from models.products import CartProduct

class Cart(BaseModel):
    products: List[CartProduct]
    total_price: float
    number_of_items: int
    user_id: str

    def add_product(self, product: CartProduct):
        for i, existing_product in enumerate(self.products):
            if existing_product.product.cdw == product.product.cdw:
                new_quantity = existing_product.quantity + product.quantity
                # Adjust total_price and number_of_items by removing old, adding new
                self.total_price -= existing_product.quantity * float(existing_product.product.price)
                self.number_of_items -= existing_product.quantity
                if new_quantity > 0:
                    existing_product.quantity = new_quantity
                    self.total_price += new_quantity * float(existing_product.product.price)
                    self.number_of_items += new_quantity
                else:
                    # Remove product from cart
                    self.products.pop(i)
                return
        if product.quantity > 0:
            self.products.append(product)
            self.total_price += product.quantity * float(product.product.price)
            self.number_of_items += product.quantity
        

class AddToCartRequest(BaseModel):
    cdw: str
    quantity: int
