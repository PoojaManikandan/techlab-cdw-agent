from google.adk.agents.llm_agent import Agent
from .sub_agents.product_agent import product_agent
from .prompt import ORCHESTRATOR_AGENT_INSTRUCTION

root_agent = Agent(
    model='gemini-2.5-flash',
    name='orchestrator_agent',
    instruction=ORCHESTRATOR_AGENT_INSTRUCTION,
    sub_agents=[product_agent],
)