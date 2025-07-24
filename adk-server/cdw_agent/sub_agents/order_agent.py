import requests
import re
from google.adk.agents.llm_agent import Agent
from .prompt import ORDER_AGENT_INSTRUCTION

ORDER_LIST_URL = "http://localhost:8080/order"

def get_order_by_user(user_id: str):
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

def get_order_by_id(order_id: str):
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



order_agent = Agent(
    model='gemini-2.5-flash',
    name='order_agent',
    instruction=ORDER_AGENT_INSTRUCTION,
    tools=[get_order_by_user,get_order_by_id]
)