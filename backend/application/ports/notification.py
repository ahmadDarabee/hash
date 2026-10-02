"""Notification provider port (future)."""

from typing import Protocol


class NotificationProvider(Protocol):
    async def send_email(self, to: str, subject: str, body: str) -> str: ...

    async def send_sms(self, to: str, body: str) -> str: ...

    async def send_whatsapp(self, to: str, body: str) -> str: ...
