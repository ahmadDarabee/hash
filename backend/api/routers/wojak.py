"""Wojak chatbot endpoint (rule-based intents)."""

from fastapi import APIRouter, Depends

from api.deps import get_wojak_chat
from api.schemas.wojak import ChatRequest, ChatResponse

router = APIRouter(prefix="/wojak", tags=["wojak"])


@router.post("/chat", response_model=ChatResponse)
async def chat(body: ChatRequest, use_case=Depends(get_wojak_chat)) -> ChatResponse:
    reply = await use_case.execute(body.message)
    return ChatResponse(intent=reply.intent, state=reply.state)
