"""No-op notification provider (future email/SMS/WhatsApp gateways)."""


class NoopNotificationProvider:
    async def send_email(self, to: str, subject: str, body: str) -> str:
        raise NotImplementedError("Email notifications are not implemented yet.")

    async def send_sms(self, to: str, body: str) -> str:
        raise NotImplementedError("SMS notifications are not implemented yet.")

    async def send_whatsapp(self, to: str, body: str) -> str:
        raise NotImplementedError("WhatsApp notifications are not implemented yet.")
