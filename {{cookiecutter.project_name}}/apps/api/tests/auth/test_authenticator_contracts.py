"""
Contract tests for the Authenticator interface.

These tests define the behavioral contract that ANY authenticator implementation
must satisfy, as defined by AbstractAuthenticator:

1. authenticate(username, password) -> Authenticated | None
2. verify_user(token) -> User | None
3. verify_user_id(token) -> str | None

Tests focus on WHAT the authenticator does, not HOW it does it.
Implementation details (JWT, password hashing, etc.) may change.
"""

from unittest.mock import patch

import pytest

from {{ cookiecutter.__api_package_name }}.auth.local_authenticator import LocalAuthenticator
from {{ cookiecutter.__api_package_name }}.auth.abstract_authenticator import Authenticated
from {{ cookiecutter.__api_package_name }}.models.user import User


class TestAuthenticatorContract:
    """
    Contract tests for authenticator implementations.

    These tests verify the public interface behavior that must remain
    stable across implementation changes.
    """

    @pytest.fixture
    def authenticator(self, users_file):
        """Provide an authenticator instance with test configuration."""
        # Patch the settings object directly (it's already loaded at import time)
        with patch("{{ cookiecutter.__api_package_name }}.auth.local_authenticator.settings") as mock_settings:
            mock_settings.Auth.Local.users_path = users_file
            mock_settings.Auth.Local.jwt_secret = "test-secret-key-for-testing"
            mock_settings.Auth.Local.jwt_ttl = 3600

            auth = LocalAuthenticator()
            yield auth

    @pytest.fixture
    def valid_credentials(self) -> tuple[str, str]:
        """Valid username and password for testing."""
        return ("testuser", "testpass123")

    @pytest.fixture
    def invalid_password_credentials(self) -> tuple[str, str]:
        """Valid username but wrong password."""
        return ("testuser", "wrongpassword")

    @pytest.fixture
    def nonexistent_user_credentials(self) -> tuple[str, str]:
        """Username that doesn't exist."""
        return ("nonexistent", "anypassword")

    # =========================================================================
    # authenticate() Contract
    # =========================================================================

    async def test_authenticate_valid_credentials_returns_authenticated(
        self, authenticator, valid_credentials
    ):
        """
        Contract: Valid credentials return an Authenticated object
        containing a User and a token string.
        """
        username, password = valid_credentials
        result = await authenticator.authenticate(username, password)

        assert result is not None
        assert isinstance(result, Authenticated)
        assert isinstance(result.user, User)
        assert result.user.username == username
        assert isinstance(result.token, str)
        assert len(result.token) > 0

    async def test_authenticate_wrong_password_returns_none(
        self, authenticator, invalid_password_credentials
    ):
        """
        Contract: Correct username but wrong password returns None.
        """
        username, password = invalid_password_credentials
        result = await authenticator.authenticate(username, password)

        assert result is None

    async def test_authenticate_nonexistent_user_returns_none(
        self, authenticator, nonexistent_user_credentials
    ):
        """
        Contract: Non-existent username returns None.
        """
        username, password = nonexistent_user_credentials
        result = await authenticator.authenticate(username, password)

        assert result is None

    # =========================================================================
    # verify_user() Contract
    # =========================================================================

    async def test_verify_user_valid_token_returns_user(
        self, authenticator, valid_credentials
    ):
        """
        Contract: A valid token (from authenticate) can be verified
        to retrieve the User object.
        """
        username, password = valid_credentials
        auth_result = await authenticator.authenticate(username, password)
        assert auth_result is not None

        user = await authenticator.verify_user(auth_result.token)

        assert user is not None
        assert isinstance(user, User)
        assert user.id == auth_result.user.id
        assert user.username == username

    async def test_verify_user_invalid_token_returns_none(self, authenticator):
        """
        Contract: An invalid/malformed token returns None.
        """
        user = await authenticator.verify_user("invalid.token.string")

        assert user is None

    async def test_verify_user_empty_token_returns_none(self, authenticator):
        """
        Contract: An empty token returns None.
        """
        user = await authenticator.verify_user("")

        assert user is None

    # =========================================================================
    # verify_user_id() Contract
    # =========================================================================

    async def test_verify_user_id_valid_token_returns_id(
        self, authenticator, valid_credentials
    ):
        """
        Contract: A valid token returns the user's ID string.
        """
        username, password = valid_credentials
        auth_result = await authenticator.authenticate(username, password)
        assert auth_result is not None

        user_id = await authenticator.verify_user_id(auth_result.token)

        assert user_id is not None
        assert isinstance(user_id, str)
        assert user_id == auth_result.user.id

    async def test_verify_user_id_invalid_token_returns_none(self, authenticator):
        """
        Contract: An invalid token returns None.
        """
        user_id = await authenticator.verify_user_id("invalid.token.string")

        assert user_id is None

    # =========================================================================
    # Token Consistency Contract
    # =========================================================================

    async def test_token_is_consistent_for_same_user(
        self, authenticator, valid_credentials
    ):
        """
        Contract: Tokens for the same user should be verifiable
        (though they may differ between authenticate calls).
        """
        username, password = valid_credentials

        # Get two tokens
        result1 = await authenticator.authenticate(username, password)
        result2 = await authenticator.authenticate(username, password)

        assert result1 is not None
        assert result2 is not None

        # Both tokens should be verifiable
        user1 = await authenticator.verify_user(result1.token)
        user2 = await authenticator.verify_user(result2.token)

        assert user1 is not None
        assert user2 is not None
        assert user1.id == user2.id
