import datetime

__all__ = ("utcnow",)

def utcnow() -> datetime.datetime:
    """Return the current UTC time."""
    return datetime.datetime.now(datetime.timezone.utc)
