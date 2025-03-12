from typing import Optional
from pydantic import BaseModel

class UserData(BaseModel):
    username: str
    email: str
    password: str

class LoginData(BaseModel):
    username: str
    password: str