from fastapi import FastAPI, Request, Depends, HTTPException, status
from typing import Annotated, Optional
import password_strength

# from ..dependencies.auth import (



# )

import logging 

logger= logging.getLogger(__name__)


router = FastAPI()

@router.post("/")
async def login(request: Request)->str:
    return "hiii"




