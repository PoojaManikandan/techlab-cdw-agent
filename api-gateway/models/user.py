from pydantic import BaseModel
from typing import List

class User(BaseModel):
    username: str
    password: str

class LogoutRequest(BaseModel):
    user_id: str
    session_id: str

class MessagePart(BaseModel):
    text: str

class NewMessage(BaseModel):
    role: str
    parts: List[MessagePart]

class AgentRequest(BaseModel):
    appName: str
    userId: str
    sessionId: str
    newMessage: NewMessage 