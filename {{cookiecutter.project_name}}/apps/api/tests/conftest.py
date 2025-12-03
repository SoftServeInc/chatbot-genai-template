"""
Shared test fixtures for the application.

These fixtures focus on providing test data that matches the expected contracts,
not on internal implementation details.
"""

import os
# Set environment variables BEFORE any application imports
# This ensures they're available when modules are loaded during test collection
from .default_env import DEFAULT_TEST_ENV

for key, value in DEFAULT_TEST_ENV.items():
    os.environ.setdefault(key, value)

from typing import AsyncGenerator
from uuid import uuid4

import pytest
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine
from sqlmodel.ext.asyncio.session import AsyncSession

from {{cookiecutter.__api_package_name}}.models.chat import Chat
from {{cookiecutter.__api_package_name}}.models.message import Message, MessageSegment
from {{cookiecutter.__api_package_name}}.models.user import User

# =============================================================================
# Database Fixtures
# =============================================================================


@pytest.fixture(scope="function")
async def db_session() -> AsyncGenerator[AsyncSession, None]:
    """
    Create a database session for testing using local PostgreSQL.
    Creates a fresh engine per test to avoid event loop conflicts.
    """
    from {{cookiecutter.__api_package_name}}.common.environ import env_str

    database_url = "".join(
        [
            "postgresql+asyncpg://",
            env_str("DB_USERNAME", "postgres"),
            ":",
            env_str("DB_PASSWORD", "postgres"),
            "@",
            f"{env_str('DB_HOST', 'localhost')}:{env_str('DB_PORT', '5432')}",
            "/",
            env_str("DB_NAME", "{{ cookiecutter.database_name }}"),
            f"?ssl={env_str('DB_SSL_MODE', 'prefer')}",
        ]
    )

    engine = create_async_engine(database_url, echo=False)
    sessionmaker = async_sessionmaker(
        engine, class_=AsyncSession, expire_on_commit=False
    )

    async with sessionmaker() as session:
        yield session
        # Rollback any changes made during the test
        await session.rollback()

    await engine.dispose()


# =============================================================================
# User Fixtures
# =============================================================================


@pytest.fixture
def sample_user() -> User:
    """A sample user object matching the User contract."""
    return User(
        id="test-user-123",
        username="testuser",
        first_name="Test",
        last_name="User",
    )


@pytest.fixture
def sample_user_id() -> str:
    """A sample user ID."""
    return "test-user-123"


# =============================================================================
# Chat & Message Fixtures
# =============================================================================


@pytest.fixture
def sample_chat_id():
    """A sample chat UUID."""
    return uuid4()


@pytest.fixture
def sample_chat(sample_user_id, sample_chat_id) -> Chat:
    """A sample chat object matching the Chat contract."""
    return Chat(
        id=sample_chat_id,
        user_id=sample_user_id,
        title="Test Chat",
        messages=[],
    )


@pytest.fixture
def sample_message(sample_chat_id) -> Message:
    """A sample message object matching the Message contract."""
    return Message(
        id=uuid4(),
        chat_id=sample_chat_id,
        role="user",  # type: ignore[arg-type]
        segments=[MessageSegment.text("Hello, this is a test message")],
    )


@pytest.fixture
def sample_assistant_message(sample_chat_id) -> Message:
    """A sample assistant message object."""
    return Message(
        id=uuid4(),
        chat_id=sample_chat_id,
        role="assistant",  # type: ignore[arg-type]
        segments=[MessageSegment.text("Hello! How can I help you today?")],
    )


@pytest.fixture
def sample_message_history(sample_chat_id) -> list[Message]:
    """A sample conversation history with multiple messages."""
    return [
        Message(
            id=uuid4(),
            chat_id=sample_chat_id,
            role="user",  # type: ignore[arg-type]
            segments=[MessageSegment.text("Hello!")],
        ),
        Message(
            id=uuid4(),
            chat_id=sample_chat_id,
            role="assistant",  # type: ignore[arg-type]
            segments=[MessageSegment.text("Hi there! How can I help?")],
        ),
        Message(
            id=uuid4(),
            chat_id=sample_chat_id,
            role="user",  # type: ignore[arg-type]
            segments=[MessageSegment.text("What's the weather like?")],
        ),
    ]


# =============================================================================
# Auth Fixtures
# =============================================================================


@pytest.fixture
def users_yaml_content() -> str:
    """YAML content for test users file."""
    return """
- id: "test-user-123"
  username: "testuser"
  password: "testpass123"
  first_name: "Test"
  last_name: "User"
- id: "admin-user-456"
  username: "admin"
  password: "adminpass456"
  first_name: "Admin"
  last_name: "User"
"""


@pytest.fixture
def users_file(tmp_path, users_yaml_content) -> str:
    """Create a temporary users.yaml file for testing."""
    users_file = tmp_path / "users.yaml"
    users_file.write_text(users_yaml_content)
    return str(users_file)


@pytest.fixture
def auth_env_vars(users_file) -> dict[str, str]:
    """Environment variables for auth testing."""
    return {
        "AUTH_LOCAL_USERS_PATH": users_file,
        "AUTH_LOCAL_JWT_SECRET": "test-secret-key-for-testing",
        "AUTH_LOCAL_JWT_TTL": "3600",
    }


# =============================================================================
# Environment Fixtures
# =============================================================================


@pytest.fixture
def clean_env():
    """Provide a clean environment context for testing env functions."""
    original_environ = os.environ.copy()
    yield os.environ
    os.environ.clear()
    os.environ.update(original_environ)


# =============================================================================
# LLM Mocking Fixtures (for LCEL/LangChain 1.x testing)
# =============================================================================


@pytest.fixture
def mock_llm_response():
    """A mock LLM response for testing."""
    return "This is a mocked response from the LLM."


@pytest.fixture
def mock_text_llm(mock_llm_response):
    """
    Mock text LLM for testing without API calls.

    Returns a mock that behaves like a LangChain LLM for LCEL:
    - Has ainvoke() for async calls (returns string directly for LCEL)
    - Has astream() for streaming (yields strings)
    - Has get_num_tokens() for token counting
    - Supports pipe operator (|) for LCEL chains
    """
    from unittest.mock import AsyncMock, MagicMock

    llm = MagicMock()
    # LCEL chains expect ainvoke to return a string directly
    llm.ainvoke = AsyncMock(return_value=mock_llm_response)
    llm.get_num_tokens = MagicMock(return_value=10)

    # Support bind() for stop sequences (used in subject_line_assistant)
    llm.bind = MagicMock(return_value=llm)

    # Mock streaming - yields strings directly
    async def async_generator():
        for word in mock_llm_response.split():
            yield word + " "

    llm.astream = MagicMock(return_value=async_generator())

    return llm


@pytest.fixture
def mock_chat_llm(mock_llm_response):
    """
    Mock chat LLM for testing without API calls.

    Returns a mock that behaves like a LangChain Chat Model for LCEL:
    - Returns strings directly from ainvoke() (LCEL pattern)
    - Has astream() for streaming (yields strings)
    - Has get_num_tokens() for token counting
    - Supports pipe operator (|) for LCEL chains
    """
    from unittest.mock import AsyncMock, MagicMock

    llm = MagicMock()

    # LCEL chains expect ainvoke to return a string directly
    llm.ainvoke = AsyncMock(return_value=mock_llm_response)

    # Mock streaming response - yields strings directly
    async def async_generator():
        for word in mock_llm_response.split():
            yield word + " "

    llm.astream = MagicMock(return_value=async_generator())
    llm.get_num_tokens = MagicMock(return_value=10)

    return llm


@pytest.fixture
def mock_llm_provider(mock_text_llm, mock_chat_llm):
    """
    Mock LLM provider for testing assistants.

    This mocks the {{ cookiecutter.__api_package_name }}.ai.llms.llm_provider module to avoid real API calls.
    """
    from unittest.mock import MagicMock

    provider = MagicMock()
    provider.create_text_llm = MagicMock(return_value=mock_text_llm)
    provider.create_chat_llm = MagicMock(return_value=mock_chat_llm)
    provider.get_max_input_tokens = MagicMock(return_value=4000)
    provider.get_max_output_tokens = MagicMock(return_value=500)
    provider.is_streaming_enabled = MagicMock(return_value=True)

    return provider


# =============================================================================
# Session-level LLM Mocking (handles module-level imports)
# =============================================================================


@pytest.fixture(scope="session", autouse=True)
def mock_llm_provider_for_imports():
    """
    Mock the LLM provider at session level to avoid credential errors during imports.

    Some assistant modules (conversation_assistant, subject_line_assistant) create LLMs
    at module level. This happens at import time before we can mock in individual tests.

    This fixture runs once per session and mocks globally before any imports.

    Updated for LCEL: LLMs return strings directly, not dicts.
    """
    from unittest.mock import AsyncMock, MagicMock, patch

    # Create simple mock LLMs that work with LCEL
    mock_llm = MagicMock()
    mock_llm.get_num_tokens = MagicMock(return_value=10)
    # LCEL chains expect ainvoke to return strings directly
    mock_llm.ainvoke = AsyncMock(return_value="Mocked LCEL response")
    # Support bind() for stop sequences
    mock_llm.bind = MagicMock(return_value=mock_llm)

    # Mock streaming for LCEL
    async def async_generator():
        yield "Mocked "
        yield "LCEL "
        yield "response"
    mock_llm.astream = MagicMock(return_value=async_generator())

    # Create mock provider
    mock_provider = MagicMock()
    mock_provider.create_text_llm = MagicMock(return_value=mock_llm)
    mock_provider.create_chat_llm = MagicMock(return_value=mock_llm)
    mock_provider.get_max_input_tokens = MagicMock(return_value=4000)
    mock_provider.get_max_output_tokens = MagicMock(return_value=500)
    mock_provider.is_streaming_enabled = MagicMock(return_value=True)

    # Patch globally for the entire test session
    with patch("{{ cookiecutter.__api_package_name }}.ai.llms.llm_provider", mock_provider):
        yield mock_provider
