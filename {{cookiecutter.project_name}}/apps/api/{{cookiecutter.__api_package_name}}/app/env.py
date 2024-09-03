"""Load .env file or .env.{APP_ENV} file if it exists"""

from os import environ, path

__all__ = ["_"]
_ = None


def init_dotenv():
    """Load environment variables from .env or .env.{APP_ENV}"""

    current_env = environ.get("APP_ENV", "")
    dotenv_file = path.dirname(path.abspath(__file__ + "/../../")) + "/.env"
    dotenv_file_specific = (dotenv_file + "." + current_env) if current_env else ""

    if dotenv_file_specific and path.exists(dotenv_file_specific):
        _load_dotenv_file(dotenv_file_specific)
    elif path.exists(dotenv_file):
        _load_dotenv_file(dotenv_file)


def _load_dotenv_file(file: str) -> None:
    """Load a specific .env file"""
    import dotenv

    dotenv.load_dotenv(file, verbose=True)


init_dotenv()
