"""Wojak chat use case. Delegates to the swappable chat service.

The v1 service is rule-based intents; an LLM adapter can replace it without
changing this use case or the router.
"""

from application.ports.wojak import ChatReply, WojakChatService


class WojakChat:
    def __init__(self, service: WojakChatService) -> None:
        self._service = service

    async def execute(self, message: str) -> ChatReply:
        return await self._service.reply(message)
