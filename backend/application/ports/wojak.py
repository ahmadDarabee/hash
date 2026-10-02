"""Wojak chatbot port. v1 is rule-based intents; an LLM adapter can be swapped in later."""

from dataclasses import dataclass
from typing import Protocol


@dataclass(frozen=True, slots=True)
class ChatReply:
    intent: str
    state: str


class WojakChatService(Protocol):
    async def reply(self, message: str) -> ChatReply: ...
