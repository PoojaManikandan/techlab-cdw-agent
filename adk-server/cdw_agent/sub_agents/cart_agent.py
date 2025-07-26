import requests, re, os
from google.adk.models.lite_llm import LiteLlm
from .prompt import CART_AGENT_INSTRUCTION
from ..util import MODEL_GPT_41
from google.adk.agents.llm_agent import Agent

# Now read the value
BASE_URL = os.environ.get("API_GATEWAY_URL")
PRODUCT_DETAIL_URL = f"{BASE_URL}/products/{{}}"
CART_URL = f"{BASE_URL}/cart/{{}}"

def get_user_id():
    # Placeholder for user ID retrieval logic
    # This function should return the user ID based on the session or context
    return "1234"


def get_product_quantity(query, cdw):
    """
    Determines the quantity of a product based on the query string.
    Args:
        query (str): The input query string.
        cdw (str): The product's CDW.
    Returns:
        int: The quantity of the product to add or remove from the cart."""
    query_lower = query.lower()
    if 'remove' in query_lower:
        match = re.search(r'(\d+)\s*items?', query_lower)
        return -int(match.group(1)) if match else -1
    else:
        match = re.search(r'(\d+)\s*items?', query_lower)
        return int(match.group(1)) if match else 1


# Helper function to fetch a single product by cdw
def fetch_product_by_cdw(cdw):
    """
    Fetches product details by cdw.
    
    Args:        
        cdw (str): The CDW of the product to fetch.
    Returns:
        dict: The product details if found, otherwise an error message.    
    """
    try:
        response = requests.get(PRODUCT_DETAIL_URL.format(cdw))
        if response.status_code == 200:
            return response.json()
        elif response.status_code == 404:
            return {"error": "Product not found for cdw: {}".format(cdw)}
        else:
            return {"error": f"Failed to fetch product. Status code: {response.status_code}"}
    except Exception as e:
        return {"error": f"Exception occurred: {str(e)}"}


def get_product_id(query):
     """
     Extracts the product ID (CDW) from the query string.
     
     Args:
         query (str): The input query string.
     Returns:
         str: The product ID (CDW) if found, otherwise an error message.
     """
     try:
        cdw_match = re.search(r"(?:details?/)?(\d{5,})", query)
        if cdw_match:
            cdw = cdw_match.group(1)
            product = fetch_product_by_cdw(cdw)
            if 'error' not in product:
                return product['cdw']
            else:
                return {"error": product['error']}
        else:
            return {"error": "Invalid product id. Please specify a valid cdw/product URL."}
     except Exception as e:
        return {"error": f"Exception occurred: {str(e)}"}


# Handler for adding and removing items to the cart
def post_cart_agent_handler(query: str):
    """
    Adds or removes items from the user's cart based on the query.
    Args:
        query (str): The query string containing the product details and action (add/remove).
    Returns:
        dict: The updated cart details or an error message if the request fails."""
    try:
        cdw = get_product_id(query)
        if 'error' in cdw:
            return cdw
        payload = {
            "cdw": cdw,
            "quantity": get_product_quantity(query, cdw)
        }
        # Assuming query contains product details to add to the cart
        response = requests.post(CART_URL.format(get_user_id()), json=payload)
        if response.status_code == 200:
            return response.json()
        elif response.status_code == 404:
            return {"error": "Cart not found for user ID: {}".format(get_user_id())}
        else:
            return {"error": f"Failed to update cart. Status code: {response.status_code}"}
    except Exception as e:
        return {"error": f"Exception occurred: {str(e)}"}


def get_cart(query: str):
    """
    Retrieves the user's cart details.
    Args:
        query (str): The query string containing the user ID or other parameters.
    Returns:
        dict: The cart details or an error message if the request fails.
    """
    try:
        user_id = get_user_id()
        response = requests.get(CART_URL.format(user_id))
        if response.status_code == 200:
            return response.json()
        elif response.status_code == 404:
            return {"error": "Cart not found for user ID: {}".format(user_id)}
        else:
            return {"error": f"Failed to fetch cart. Status code: {response.status_code}"}
    except Exception as e:
        return {"error": f"Exception occurred: {str(e)}"}


# Handler for getting the cart
def get_cart_agent_handler(query: str):
    """
    Retrieves the user's cart details based on the query.
    Args:
        query (str): The query string containing the user ID or other parameters.
    Returns:
        dict: The cart details or an error message if the request fails.
    """
    try:
        response = get_cart(query)
        return response
    except Exception as e:
        return {"error": f"Exception occurred: {str(e)}"}
    

cart_agent = Agent(
    model=LiteLlm(MODEL_GPT_41),
    name='cart_agent',
    instruction=CART_AGENT_INSTRUCTION,
    tools=[get_cart_agent_handler, post_cart_agent_handler]
)
