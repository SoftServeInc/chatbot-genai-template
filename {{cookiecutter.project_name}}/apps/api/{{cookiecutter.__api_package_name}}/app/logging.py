"""Logging configurations for the application."""

import logging
import sys

__all__ = ["_"]
_ = None

LOG_FORMAT = "%(asctime)s.%(msecs)03d | %(levelname)s | %(name)s | %(message)s"
LOG_DATE_FORMAT = "%Y-%m-%d %H:%M:%S"


def init_logging():
    """Initialize the logging configuration for the application"""
    stream_handler = logging.StreamHandler(sys.stdout)
    stream_handler.setFormatter(logging.Formatter(LOG_FORMAT, datefmt=LOG_DATE_FORMAT))

    logger = logging.getLogger()

    for handler in logger.handlers:
        logger.removeHandler(handler)

    logger.addHandler(stream_handler)
    logger.setLevel(logging.DEBUG)

    # Suppress the more verbose modules
    logging.getLogger("__main__").setLevel(logging.DEBUG)
    logging.getLogger("asyncio").setLevel(logging.INFO)
    logging.getLogger("botocore").setLevel(logging.WARN)
    logging.getLogger("aiobotocore").setLevel(logging.WARN)
    logging.getLogger("openai").setLevel(logging.INFO)
    logging.getLogger("urllib3").setLevel(logging.INFO)
    logging.getLogger("httpx").setLevel(logging.INFO)
    logging.getLogger("httpcore").setLevel(logging.INFO)
    logging.getLogger("uvicorn.access").addFilter(HealthCheckFilter())


class HealthCheckFilter(logging.Filter):
    """Filter to suppress health check logs"""

    def filter(self, record: logging.LogRecord) -> bool:
        if not isinstance(record.args, tuple) or len(record.args) < 3:
            return True

        method = record.args[1]
        uri = record.args[2]

        return not (method in ("GET", "OPTIONS", "HEAD") and uri in ("/", "/v1/ping", "/v1/noop"))


init_logging()
