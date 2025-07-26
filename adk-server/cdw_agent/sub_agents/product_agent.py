import requests
import re
import os
from google.adk.agents.llm_agent import Agent
from google.adk.models.lite_llm import LiteLlm
from ..util import MODEL_GPT_41
from .prompt import PRODUCT_AGENT_INSTRUCTION
import os
from .vectorstore_utils import get_relevant_results

# Now read the value
BASE_URL = os.environ.get("API_GATEWAY_URL")
PRODUCT_LIST_URL = f"{BASE_URL}/products"
PRODUCT_DETAIL_URL = f"{BASE_URL}/products/{{}}"




def fetch_all_products():
    """    
    Fetches all products from the product list URL.
    
    Returns:
        dict: A dictionary containing the list of products if the request is successful, otherwise an error message.
    """
    try:
        response = requests.get(PRODUCT_LIST_URL)
        if response.status_code == 200:
            return response.json()
        else:
            return {"error": f"Failed to fetch products. Status code: {response.status_code}"}
    except Exception as e:
        return {"error": f"Exception occurred: {str(e)}"}

def fetch_product_by_cdw(cdw):
    """
    Fetches product details by CDW.
    
    Args:        
        cdw (str): The CDW of the product to fetch.
    Returns:
        dict: The product details if found, otherwise an error message."""
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


def product_agent_handler(query: str):
    """   
    Handles the product agent requests based on the query.
    Args:
        query (str): The query string containing the product details or action.
    Returns:
        dict: The product details or a list of products if the request is successful, otherwise an error message.
    """
    try:
        cdw_match = re.search(r"(?:details?/)?(\d{5,})", query)
        if cdw_match:
            cdw = cdw_match.group(1)
            return fetch_product_by_cdw(cdw)
        if cdw_match==False:
            return {"error": "Invalid query. Please specify 'list' or a valid cdw/product URL."}
        else:
            return fetch_all_products()
    except Exception as e:
        return {"error": f"Exception occurred: {str(e)}"}
    
def get_product_from_query(query :str):
    """
    Retrieves a list of product dictionaries from the vectorstore based on a search query.

    This function queries the vectorstore using the provided query string, then iterates over the results,
    extracting the 'cdw' field from the metadata of each Document object. For each found product, the function
    fetches the product details by CDW and appends it to a list and returns it.

    Args:
        query (str): The search query to use for retrieving relevant product documents from the vectorstore.

    Returns:
        dict: The product details or a list of products if the request is successful, otherwise an error message.

    Example:
        >>> get_products_from_query("Product search with name or description")
        
    """

    results = get_relevant_results(query, 3)
    cdws = []
    for result in results:
        # result[0] is the Document object, result[0].metadata is a dict containing 'cdw'
        cdw = result[0].metadata.get("cdw")
        cdws.append(cdw)

    
    # fetch product details for each cdw
    products= []
    for cdw in cdws:
        try:
            product = fetch_product_by_cdw(cdw)
            products.append(product)
        except Exception as e:
            return {"error": f"Exception occurred while fetching product by CDW {cdw}: {str(e)}"}
        
    
    # If no products found, return an empty list
    if not products: 
        return {"error": "No products found for the given query."}
    
    # Return the list of products
    return products
        

product_agent = Agent(
    model=LiteLlm(MODEL_GPT_41),
    name='product_agent',
    instruction=PRODUCT_AGENT_INSTRUCTION,
    tools=[product_agent_handler, get_product_from_query]
)