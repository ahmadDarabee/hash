"""i18n helpers.

DECISION: the backend stores and returns both language fields (name_en/name_ar
etc.) and does not translate; this helper only selects a display value by
language where a single localized string is needed.
"""

from domain.enums import Language


def pick(en_value: str, ar_value: str, language: Language) -> str:
    return ar_value if language == Language.AR else en_value
