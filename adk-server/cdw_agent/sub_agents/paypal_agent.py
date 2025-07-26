from google.adk.agents.llm_agent import Agent
from .prompt import PAYPAL_AGENT_INSTRUCTION
from cdw_agent.util import get_access_token
from google.adk.tools.mcp_tool.mcp_toolset import MCPToolset, StdioServerParameters
import requests, os, json

ORDER_URL = os.getenv("SERVER_URL") + "/order/{}"



paypal_token = get_access_token()


def order_status_update_handler(order_id:str,payment_order_status:str):
  """ This executes strictly after the paypal_agent.pay_order everytime for Updating the status of an order not the payment order.
  Args:
      order_id (str): The ID of the order to update and this is not from paypal_agent.get_order and this is the order id of order_agent.
      payment_order_status (str): The new status of the payment order.
  """
  payload = json.dumps({
      "status": payment_order_status
    })
  headers = {
      'Content-Type': 'application/json'
    }

  response = requests.request("PUT", ORDER_URL.format(order_id), headers=headers, data=payload)
  return response.json()


paypal_agent = Agent(
        model="gemini-2.5-flash", 
        name='paypal_agent',
        instruction=PAYPAL_AGENT_INSTRUCTION,
        tools=[MCPToolset(
            connection_params=StdioServerParameters(
                command="npx",
                args=[
                    "-y",
                    "@paypal/mcp",
                    "--tools=orders.create,orders.get,orders.capture",
                    f"--access-token={paypal_token}",
                ],
            ),
            tool_filter=["create_order", "get_order", "pay_order"],
        ),
        order_status_update_handler
    ]
)

 