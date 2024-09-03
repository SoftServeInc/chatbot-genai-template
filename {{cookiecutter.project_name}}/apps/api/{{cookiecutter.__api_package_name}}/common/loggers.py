"""Custom logger adapters"""

from logging import Logger, LoggerAdapter
from typing import Any, MutableMapping

LogArgs = MutableMapping[str, Any]


class PrefixedLogger(LoggerAdapter[Logger]):
    """Logger adapter to add a custom prefix to all messages"""

    def __init__(self, logger: Logger, prefix: str = "") -> None:
        super().__init__(logger)
        self.prefix = prefix

    def process(self, message: str, args: LogArgs) -> tuple[str, LogArgs]:
        """Add the prefix to the log message"""
        if self.prefix:
            return (f"{self.prefix} {message}", args)

        return (message, args)
