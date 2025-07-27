import os

import uvicorn
from fastapi import FastAPI,Query
from google.adk.cli.fast_api import get_fast_api_app
from pydantic import BaseModel

class SessionRequest(BaseModel):
    app_name: str
    user_id: str
# Get the directory where main.py is located
AGENT_DIR = os.path.dirname(os.path.abspath(__file__))

# allowed origins for CORS
ALLOWED_ORIGINS = ["*"]

# Set web=True if you intend to serve a web interface, False otherwise
SERVE_WEB_INTERFACE = True

# Call the function to get the FastAPI app instance
# Ensure the agent directory name ('capital_agent') matches your agent folder
app: FastAPI = get_fast_api_app(
    agents_dir=AGENT_DIR,
    allow_origins=ALLOWED_ORIGINS,
    web=SERVE_WEB_INTERFACE,
)

if __name__ == "__main__":
    # Use the PORT environment variable provided by Cloud Run, defaulting to 8080
    uvicorn.run(app, host="0.0.0.0", port=int(os.environ.get("PORT", 8000)))