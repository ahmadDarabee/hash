"""Domain errors. Use cases raise these; the API layer maps them to HTTP."""


class DomainError(Exception):
    def __init__(self, message: str, code: str = "domain_error") -> None:
        self.message = message
        self.code = code
        super().__init__(message)


class NotFoundError(DomainError):
    def __init__(self, message: str = "Resource not found") -> None:
        super().__init__(message, "not_found")


class ConflictError(DomainError):
    def __init__(self, message: str = "Resource already exists") -> None:
        super().__init__(message, "conflict")


class ValidationError(DomainError):
    def __init__(self, message: str = "Invalid input") -> None:
        super().__init__(message, "validation_error")


class AuthenticationError(DomainError):
    def __init__(self, message: str = "Authentication failed", code: str = "authentication_error") -> None:
        super().__init__(message, code)


class AuthorizationError(DomainError):
    def __init__(self, message: str = "Not allowed") -> None:
        super().__init__(message, "authorization_error")
