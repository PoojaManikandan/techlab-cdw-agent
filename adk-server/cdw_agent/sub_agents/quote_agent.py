from google.adk.agents.llm_agent import Agent

# from .prompt import QUOTE_AGENT_INSTRUCTION
import vectorstore_utils

import requests, re

QUOTE_URL = "http://localhost:8080/quote/{}"
QUOTE_BY_ID_URL = "http://localhost:8080/quote/{}/{}"
PRODUCT_DETAIL_URL = "http://localhost:8080/products/{}"


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


# # Helper function to fetch a single product by cdw
# def fetch_product_by_cdw(cdw):
#     try:
#         response = requests.get(PRODUCT_DETAIL_URL.format(cdw))
#         if response.status_code == 200:
#             return response.json()
#         elif response.status_code == 404:
#             return {"error": "Product not found for cdw: {}".format(cdw)}
#         else:
#             return {"error": f"Failed to fetch product. Status code: {response.status_code}"}
#     except Exception as e:
#         return {"error": f"Exception occurred: {str(e)}"}


# def get_quantity_from_query(cdw):



# def get_product_ids_from_query(query):
#     """
#     Retrieves a list of product dictionaries from the vectorstore based on a search query.

#     This function queries the vectorstore using the provided query string, then iterates over the results,
#     extracting the 'cdw' field from the metadata of each Document object. For each found product, it creates
#     a dictionary with the product's 'cdw' (product ID) and a default 'quantity' of 1. The function returns
#     a list of these product dictionaries.

#     Args:
#         query (str): The search query to use for retrieving relevant product documents from the vectorstore.

#     Returns:
#         list[dict]: A list of product dictionaries, each with keys:
#             - 'cdw' (str): The product ID (CDW number) extracted from the metadata.
#             - 'quantity' (int): The default quantity, set to 1.

#     Example:
#         >>> get_products_from_query("Products that has cdw 3036583")
#         [{'cdw': '3036583', 'quantity': 1}, ...]
#     """
#     results = vectorstore_utils.get_relevant_results(query)
#     product_ids = []
#     for result in results:
#         # result[0] is the Document object, result[0].metadata is a dict containing 'cdw'
#         cdw = result[0].metadata.get("cdw")
#         if cdw:
#             product = {
#                 "cdw": cdw,
#                 "quantity": 0
#             }
#             product_ids.append(product)
#     return product_ids


# def create_quote_handler(query: str):
#     try:
#         products = get_products_from_query(query)
#         quoted_price = get_quoted_price_from_query(query)

#         payload = {
#             "products" : products,
#             "quoted_price": quoted_price
#         }

#         response = requests.post(QUOTE_URL, json=payload)
#         if response.status_code == 200:
#             return response.json()
#         elif response.status_code == 404:
#             return {"error": "Cart not found for user ID: {}".format(get_user_id())}
#         else:
#             return {"error": f"Failed to update cart. Status code: {response.status_code}"}
#     except Exception as e:
#         return {"error": f"Exception occurred: {str(e)}"}



quote_agent = Agent(
    name="quote_agent",
    model='gemini-2.5-flash',
    instruction=QUOTE_AGENT_INSTRUCTION,
    tools=[create_quote_handler, get_quote_handler]
)
