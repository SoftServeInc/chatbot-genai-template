"""Settings module to store all configuration variables passed to the application via environment variables"""

# pylint: disable=missing-class-docstring
from ..common.environ import env_bool, env_int, env_str
from ..common.utils import parse_csv_string, rgetattr

__all__ = ["settings", "check_required_settings"]


class Settings:
    class App:
        env = env_str("APP_ENV", "dev")
        api_key = env_str("APP_API_KEY", "")

        class Web:
            domains = parse_csv_string(env_str("APP_WEB_DOMAINS", ""))
            localhost_ports = [int(port) for port in parse_csv_string(env_str("APP_WEB_LOCALHOST_PORTS", ""))]
            url = ""  # it is initialized dynamically below

    class Auth:
        provider = env_str("AUTH_PROVIDER", "{{ cookiecutter.auth }}")

        {%- if cookiecutter.auth == "local" %}

        class Local:
            users_path = env_str("AUTH_LOCAL_USERS_PATH", "")
            jwt_secret = env_str("AUTH_LOCAL_JWT_SECRET", "*********")
            jwt_ttl = env_int("AUTH_LOCAL_JWT_TTL", 86400)

        {%- elif cookiecutter.auth == "keycloak" %}

        class Keycloak:
            realm_name = env_str("AUTH_KEYCLOAK_REALM_NAME", "")
            server_url = env_str("AUTH_KEYCLOAK_SERVER_URL", "")
            client_id = env_str("AUTH_KEYCLOAK_CLIENT_ID", "")
            client_secret = env_str("AUTH_KEYCLOAK_CLIENT_SECRET", "")

        {%- endif %}

    class Terms:
        admin_usernames = parse_csv_string(env_str("TERMS_ADMIN_USERNAMES", ""))

    class LLM:
        provider: str = env_str("LLM_PROVIDER", "openai")
        verbose: bool = env_bool("LLM_VERBOSE", False)
        text_max_tokens: int = env_int("LLM_TEXT_MAX_TOKENS", 4096)
        chat_max_tokens: int = env_int("LLM_CHAT_MAX_TOKENS", 4096)

    class Azure:
        class OpenAI:
            api_key: str = env_str("AZURE_OPENAI_API_KEY", "")
            api_version: str = env_str("AZURE_OPENAI_API_VERSION", "2023-05-15")

            endpoint: str = env_str("AZURE_OPENAI_ENDPOINT", "")
            chat_model: str = env_str("AZURE_OPENAI_CHAT_MODEL", "gpt-4")
            chat_deployment: str = env_str("AZURE_OPENAI_CHAT_DEPLOYMENT", "")
            text_model: str = env_str("AZURE_OPENAI_TEXT_MODEL", "gpt-4")
            text_deployment: str = env_str("AZURE_OPENAI_TEXT_DEPLOYMENT", "")
            embedding_model: str = env_str("AZURE_OPENAI_TEXT_MODEL", "text-embedding-ada-002")
            embedding_deployment: str = env_str("AZURE_OPENAI_EMBEDDING_DEPLOYMENT", "")

            request_timeout: int = env_int("AZURE_OPENAI_REQUEST_TIMEOUT", 60)

    class AWS:
        profile: str = env_str("AWS_PROFILE", "")
        region: str = env_str("AWS_DEFAULT_REGION", "")
        # we get aws_secret_access_key and aws_access_key_id here but actually we don't use them in the code
        # because when those environment variables are set, boto3 will automatically use them (unless AWS_PROFILE is set)
        access_key_id: str = env_str("AWS_ACCESS_KEY_ID", "")
        secret_access_key: str = env_str("AWS_SECRET_ACCESS_KEY", "")

        class Bedrock:
            chat_model_id: str = env_str("AWS_BEDROCK_CHAT_MODEL_ID", "anthropic.claude-v2")
            text_model_id: str = env_str("AWS_BEDROCK_TEXT_MODEL_ID", "amazon.titan-text-express-v1")
            embedding_model_id: str = env_str("AWS_BEDROCK_EMBEDDING_MODEL_ID", "amazon.titan-embed-text-v1")

    class GCP:
        project: str = env_str("GCP_PROJECT", "")
        location: str = env_str("GCP_LOCATION", "us-central1")
        service_account_key_path: str = env_str("GCP_SERVICE_ACCOUNT_KEY_PATH", "")

        class VertexAI:
            chat_model_name: str = env_str("GCP_VERTEXAI_CHAT_MODEL_NAME", "chat-bison")
            text_model_name: str = env_str("GCP_VERTEXAI_TEXT_MODEL_NAME", "text-bison")
            embedding_model_name: str = env_str("GCP_VERTEXAI_EMBEDDING_MODEL_NAME", "textembedding-gecko")


_Web = Settings.App.Web
if _Web.domains:
    _Web.url = f"https://{_Web.domains[0]}"
elif _Web.localhost_ports:
    _Web.url = f"http://localhost:{_Web.localhost_ports[0]}"


settings = Settings()


def check_required_settings(required: list[str], settings_prefix: str = "") -> None:
    """Check if all required settings are set"""
    prefix = f"{settings_prefix}." if settings_prefix else ""

    for key in required:
        if rgetattr(settings, f"{prefix}{key}", None) is None:
            raise ValueError(f"Missing required setting {prefix}{key}")
