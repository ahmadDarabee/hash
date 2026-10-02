"""Rule-based Wojak chatbot (v1 intents, no LLM).

Text is NOT returned from here — only an intent and a suggested reactive state.
The frontend maps intents to localized lines in its i18n files.
"""

from application.ports.wojak import ChatReply

# Keywords are matched as substrings of the lowercased message.
_KEYWORDS: dict[str, list[str]] = {
    "greeting": [
        "hi", "hello", "hey", "salam", "marhaba", "yo",
        "مرحبا", "سلام", "اهلا", "هلا", "هاي",
    ],
    "help": [
        "help", "what can you do", "how do you work", "menu",
        "مساعدة", "ساعد", "ماذا تفعل", "كيف تعمل",
    ],
    "product": [
        "product", "detergent", "soap", "sanitizer", "degreaser", "cleaning",
        "منتج", "منظف", "صابون", "معقم", "مزيل", "تنظيف",
    ],
    "sds": [
        "sds", "msds", "safety data sheet", "safety sheet", "datasheet",
        "ورقة بيانات السلامة", "صحيفة السلامة", "سلامة",
    ],
    "pricing": [
        "price", "pricing", "cost", "quote", "discount", "how much",
        "سعر", "تسعير", "تكلفة", "عرض سعر", "خصم", "بكم",
    ],
    "contact": [
        "contact", "phone", "email", "call", "reach", "location", "address",
        "اتصال", "تواصل", "هاتف", "بريد", "عنوان", "موقع",
    ],
}

_INTENT_STATE: dict[str, str] = {
    "greeting": "happy",
    "help": "idle",
    "product": "excited",
    "sds": "idle",
    "pricing": "excited",
    "contact": "happy",
    "fallback": "confused",
}


class RuleBasedWojakChatService:
    async def reply(self, message: str) -> ChatReply:
        text = message.lower()
        for intent, keywords in _KEYWORDS.items():
            if any(keyword in text for keyword in keywords):
                return ChatReply(intent=intent, state=_INTENT_STATE[intent])
        return ChatReply(intent="fallback", state=_INTENT_STATE["fallback"])
