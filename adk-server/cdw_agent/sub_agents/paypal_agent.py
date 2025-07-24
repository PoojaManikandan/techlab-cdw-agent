from google.adk.agents.llm_agent import Agent
from .prompt import PAYPAL_AGENT_INSTRUCTION
from cdw_agent.util import get_access_token
from google.adk.tools.mcp_tool.mcp_toolset import MCPToolset, StdioServerParameters






paypal_token = get_access_token()



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
            tool_filter=["create_order", "get_order", "capture_order"],
        )
    ]
)

 