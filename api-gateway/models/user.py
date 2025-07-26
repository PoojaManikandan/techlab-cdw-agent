from pydantic import BaseModel

class User(BaseModel):
    username: str
    password: str

class LogoutRequest(BaseModel):
    user_id: str
    session_id: str