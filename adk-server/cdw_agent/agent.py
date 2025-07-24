from google.adk.agents.llm_agent import Agent
from .sub_agents.product_agent import product_agent
from .sub_agents.cart_agent import cart_agent
from .sub_agents.order_agent import order_agent
from .sub_agents.paypal_agent import paypal_agent
from .prompt import ORCHESTRATOR_AGENT_INSTRUCTION

root_agent = Agent(
    model='gemini-2.5-flash',
    name='orchestrator_agent',
    instruction=ORCHESTRATOR_AGENT_INSTRUCTION,
    sub_agents=[product_agent, cart_agent, order_agent, paypal_agent],
)