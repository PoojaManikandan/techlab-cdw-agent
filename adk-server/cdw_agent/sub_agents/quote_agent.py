from google.adk.agents.llm_agent import Agent

from .prompt import QUOTE_AGENT_INSTRUCTION
import requests, re, os
from pydantic import BaseModel
from typing import List

QUOTE_URL = os.getenv("SERVER_URL") + "/quote/{}"
QUOTE_BY_ID_URL = os.getenv("SERVER_URL") + "/quote/{}/{}"
PRODUCT_DETAIL_URL = os.getenv("SERVER_URL") + "/products/{}"

class QuoteProduct(BaseModel):
    cdw: str
    quantity: int


class AddToQuoteRequest(BaseModel):
    products: List[QuoteProduct]
    quoted_price: float


def get_user_id():
    # Placeholder for user ID retrieval logic
    # This function should return the user ID based on the session or context
    return "1234"

def get_quote_handler(query: str):
    """
    Retrieves quote information for a user based on the provided query string.

    This function attempts to extract a quote ID from the input query using a regular expression. If a quote ID is found,
    it fetches the details for that specific quote for the current user by making a GET request to the quote API endpoint.
    If no quote ID is found in the query, it fetches the list of all quotes for the user. The function handles HTTP responses
    and returns the JSON data if successful, or an error message if the request fails or if an exception occurs.

    Args:
        query (str): The input query string, which may contain a quote ID to look up.

    Returns:
        dict: The JSON response from the quote API if successful, or a dictionary containing an error message.

    Error Handling:
        - Returns an error message if the API returns a 404 (no quotes found for the user).
        - Returns an error message for any other non-200 status code.
        - Catches and returns any exceptions that occur during the process.

    Example:
        >>> get_quote_handler("Show me quote-5678")
        { ...quote details... }

        >>> get_quote_handler("Show all my quotes")
        [ ...list of quotes... ]
    """
    try:
        user_id = get_user_id()
        match = re.search(r"quote-(\d+)", query, re.IGNORECASE)
        if match:
            quote_id = match.group(0)
            response = requests.get(QUOTE_BY_ID_URL.format(user_id, quote_id))
        else:
            response = requests.get(QUOTE_URL.format(user_id))

        if response.status_code == 200:
            return response.json()
        elif response.status_code == 404:
            return {"error": "No Quotes found for user : {}".format(user_id)}
        else:
            return {"error": f"Failed to fetch product. Status code: {response.status_code}"}
    except Exception as e:
        return {"error": f"Exception occurred: {str(e)}"}


def create_quote_handler(addToQuoteRequest: AddToQuoteRequest):
    """
    Creates a quote for the products specified in the request.

    This function processes a list of products to create a quote. It extracts the product details from the request,
    constructs a payload, and sends it to the quote API endpoint to create a new quote. The function handles HTTP responses
    and returns the JSON data if successful, or an error message if the request fails or if an exception occurs.

    Args:
        addToQuoteRequest (dict or AddToQuoteRequest): The request containing products and quoted price.

    Returns:
        dict: The JSON response from the quote API if successful, or a dictionary containing an error message.
    """
    payload = {
        "products": addToQuoteRequest["products"],
        "quoted_price": addToQuoteRequest["quoted_price"]
    }
    try:
        user_id = get_user_id()
        headers = {'Content-Type': 'application/json'}
        response = requests.post(QUOTE_URL.format(user_id), json=payload, headers=headers)

        if response.status_code == 200:
            return response.json()
        else:
            return {"error": f"Failed to create quote. Status code: {response.status_code}"}
    except Exception as e:
        return {"error": f"Exception occurred: {str(e)}"}   
 

quote_agent = Agent(
    name="quote_agent",
    model="gemini-2.5-flash",
    instruction=QUOTE_AGENT_INSTRUCTION,
    tools=[create_quote_handler, get_quote_handler]
)
