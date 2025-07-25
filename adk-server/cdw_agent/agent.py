from google.adk.agents.llm_agent import Agent
from google.adk.models.lite_llm import LiteLlm
from .util import MODEL_GPT_41
from .sub_agents.product_agent import product_agent
from .sub_agents.cart_agent import cart_agent
from .sub_agents.order_agent import order_agent
from .sub_agents.paypal_agent import paypal_agent
from .sub_agents.quote_agent import quote_agent
from .prompt import ORCHESTRATOR_AGENT_INSTRUCTION
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

root_agent = Agent(
    model=LiteLlm(MODEL_GPT_41),
    name='orchestrator_agent',
    instruction=ORCHESTRATOR_AGENT_INSTRUCTION,
    sub_agents=[product_agent, cart_agent, order_agent, paypal_agent, quote_agent],
)