import requests
import re
from google.adk.agents.llm_agent import Agent
from .prompt import PRODUCT_AGENT_INSTRUCTION
import os
from dotenv import load_dotenv
load_dotenv()


# Now read the value
BASE_URL = os.environ.get("PRODUCT_BASE_URL")
PRODUCT_LIST_URL = f"{BASE_URL}/products"
PRODUCT_DETAIL_URL = f"{BASE_URL}/products/{{}}"

# Helper function to fetch all products
def fetch_all_products():
    try:
        print(f"Fetching all products from {PRODUCT_LIST_URL}")
        response = requests.get(PRODUCT_LIST_URL)
        if response.status_code == 200:
            return response.json()
        else:
            return {"error": f"Failed to fetch products. Status code: {response.status_code}"}
    except Exception as e:
        return {"error": f"Exception occurred: {str(e)}"}

# Helper function to fetch a single product by cdw
def fetch_product_by_cdw(cdw):
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

# Main agent logic
def product_agent_handler(query: str):
    # Check for cdw or product URL in query
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
        

product_agent = Agent(
    model='gemini-2.5-flash',
    name='product_agent',
    instruction=PRODUCT_AGENT_INSTRUCTION,
    tools=[product_agent_handler]
)