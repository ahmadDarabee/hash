import logging
from typing import Dict
from pydantic import BaseModel 

logger = logging.getLogger(__name__)

class Token (BaseModel):
    access_token: str
    token_type: str 

class User (BaseModel):
    id: int 
    full_name: str
    email: str
    user_name: str
    is_disabled: bool
    roles: Dict[str, str]={}