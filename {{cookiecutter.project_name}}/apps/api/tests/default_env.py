"""
Default environment variables for testing.

These defaults are applied before any application modules are imported
to ensure they're available during test collection and module loading.
"""

DEFAULT_TEST_ENV = {
    # Database configuration
    "DB_NAME": "{{ cookiecutter.database_name }}",
    "DB_USERNAME": "postgres",
    "DB_PASSWORD": "postgres",
    "DB_HOST": "localhost",
    "DB_PORT": "5432",
    "DB_SSL_MODE": "prefer",
    "DB_ECHO": "false",
    # LLM Provider configuration (fake credentials for testing)
    "LLM_PROVIDER": "openai",
    "LLM_MODEL": "gpt-4",
    "LLM_TEMPERATURE": "0.7",
    "AZURE_OPENAI_API_KEY": "fake-key-for-testing",
    "AZURE_OPENAI_ENDPOINT": "https://fake-endpoint.openai.azure.com/",
    "AZURE_OPENAI_API_VERSION": "2024-02-15-preview",
    "AZURE_OPENAI_DEPLOYMENT": "gpt-4",
    "AZURE_OPENAI_EMBEDDING_DEPLOYMENT": "text-embedding-ada-002",
}
