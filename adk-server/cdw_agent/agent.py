from google.adk.agents.llm_agent import Agent

root_agent = Agent(
    model='gemini-2.5-flash',
    name='QA_Agent',
    instruction="You are a helpful agent that answers questions",
)