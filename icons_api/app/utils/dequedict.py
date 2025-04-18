from __future__ import annotations

from typing import TypeVar

__all__ = ("DequeDict",)

K = TypeVar("K")
V = TypeVar("V")


class DequeDict(dict[K, V]):
    """ "A dictionary with a maximum length that removes the oldest item when the limit is reached."""

    def __init__(self, *args, maxlen: int = 0, **kwargs):
        self._maxlen = maxlen
        super().__init__(*args, **kwargs)

    def __setitem__(self, key: K, value: V) -> None:
        dict.__setitem__(self, key, value)
        if self._maxlen > 0:
            if len(self) > self._maxlen:
                self.pop(next(iter(self)))
