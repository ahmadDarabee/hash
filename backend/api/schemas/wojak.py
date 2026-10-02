"""Wojak chat schemas."""

from pydantic import BaseModel


class ChatRequest(BaseModel):
    message: str


class ChatResponse(BaseModel):
    intent: str
    state: str
