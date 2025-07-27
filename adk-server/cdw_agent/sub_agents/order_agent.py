from itertools import product
import requests, os, email
from google.adk.agents.llm_agent import Agent
from google.adk.models.lite_llm import LiteLlm
from .prompt import ORDER_AGENT_INSTRUCTION
from ..util import MODEL_GPT_41
import random
from pydantic import ValidationError


# Now read the value
BASE_URL = os.environ.get("SERVER_URL")
ORDER_LIST_URL = f"{BASE_URL}/order"
CART_URL = f"{BASE_URL}/cart/{{}}"
USER_URL= f"{BASE_URL}/user/{{}}"

def get_user_name(user_id: str):

    response = requests.get(USER_URL.format(user_id))
    if response.status_code == 200:
        return response.json().get("username")
    return None
def get_user_email(user_id: str):

    response = requests.get(USER_URL.format(user_id))
    if response.status_code == 200:
        return response.json().get("user_email")
    return None

def get_order_by_user_handler(user_id: str):
    """
    Fetch order by user ID.

    Args:
        user_id (str): The ID of the user whose orders are to be fetched.

    Returns:
        dict or None: A dictionary containing the order details if the request is successful, otherwise None.
    """
    response = requests.get(ORDER_LIST_URL, params={"user_id": user_id})
    if response.status_code == 200:
        return response.json()
    return None

def get_order_by_id_handler(order_id: str):
    """
    Fetch order by order ID.

    Args:
        order_id (str): The ID of the order to be fetched.

    Returns:
        dict or None: A dictionary containing the order details if the request is successful, otherwise None.
    """
    
    response = requests.get(ORDER_LIST_URL, params={"order_id": order_id})
    
    if response.status_code == 200:
        return response.json()
    return None

def get_cart(query: str,user_id: str):
    try:
        response = requests.get(CART_URL.format(user_id))
        if response.status_code == 200:
            return response.json()
        elif response.status_code == 404:
            return {"error": "Cart not found for user ID: {}".format(user_id)}
        else:
            return {"error": f"Failed to fetch cart. Status code: {response.status_code}"}
    except Exception as e:
        return {"error": f"Exception occurred: {str(e)}"}

def generate_unique_5_digit_id():
    unique = False
    user_id = None

    while not unique:
        user_id = random.randint(10000, 99999)
        existing_user = requests.get(ORDER_LIST_URL, params={"user_id": user_id})
        if not existing_user:
            unique = True

    return user_id


def create_order_from_cart_handler(query: str,user_id: str) -> dict:
    """
    Create an order from the user's cart.

    Args:
        query (str): The query string containing the user ID or other parameters but this is for overwriting the user ID by default this is not required.
        user_id (str): The user ID for which to create the order it will be in the payload.
    Returns:
        dict: A dictionary containing the order details or an exception message.
    """
    try:
        cart = get_cart(query,user_id)
        if 'error' in cart:
            return cart

        name = get_user_name(user_id)
        email_id = get_user_email(user_id)
        products = cart.get("products", [])

        number_of_items = 0
        total_price = 0.0

        for product in products:
            qty = product.get("quantity", 0)
            price = product.get("product", {}).get("price", 0.0)
            number_of_items += qty
            total_price += qty * price

        order_payload = {
            "user_id": user_id,
            "products": products,
            "number_of_items": number_of_items,
            "total_price": round(total_price, 2),
            "name": name,
            "email_id": email_id,
            "estimated_delivery": "within 5-7 business days",
            "tracking_link": "",
            "status": "pending",
            "billing_address": {
                "name": name,
                "address1": "12, Girwood",
                "city": "NYC city",
                "state": "NY",
                "country": "US",
                "zip_code": "638002"
            },
            "shipping_address": {
                "name": name,
                "address1": "12, Girwood",
                "city": "NYC city",
                "state": "NY",
                "country": "US",
                "zip_code": "638002"
            },
            "order_id": str(generate_unique_5_digit_id())
        }

        
        response = requests.post(ORDER_LIST_URL, json=order_payload)
        if response.status_code == 200:
            return response.json()
        else:
            return {
                "error": f"Failed to create order. Status code: {response.status_code}",
                "response_body": response.text  # Helpful for debugging
            }

    except Exception as e:
        return {"error": f"Exception occurred: {str(e)}"}

order_agent = Agent(
    model=LiteLlm(MODEL_GPT_41),
    name='order_agent',
    instruction=ORDER_AGENT_INSTRUCTION,
    tools=[get_order_by_user_handler,get_order_by_id_handler,
           create_order_from_cart_handler],
    output_key="order_agent_response",
)