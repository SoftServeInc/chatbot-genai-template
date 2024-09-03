"""Database connection and session management"""

from functools import cache
from typing import AsyncGenerator
{% if cookiecutter.enable_pgvector %}
from asyncpg.connection import Connection
from pgvector.asyncpg import register_vector
from sqlalchemy import AdaptedConnection, event, util
{%- endif %}
from sqlalchemy.ext.asyncio import AsyncEngine, async_sessionmaker, create_async_engine
from sqlmodel.ext.asyncio.session import AsyncSession

from ..common.environ import env_bool, env_str
{% if cookiecutter.terraform_cloud_provider == 'gcp' %}
GCP_CLOUDSQL = env_str("DB_INSTANCE_CONNECTION_NAME", "")  # GCP Cloud SQL instance connection name
{%- endif %}
DATABASE_URL = "".join(
    [
        "postgresql+asyncpg://",
        env_str("DB_USERNAME", "postgres"),
        ":",
        env_str("DB_PASSWORD", "postgres"),
        "@",
        {% if cookiecutter.terraform_cloud_provider == 'gcp' %}"" if GCP_CLOUDSQL else {% endif %}f"{env_str('DB_HOST', 'localhost')}:{env_str('DB_PORT', '5432')}",
        "/",
        env_str("DB_NAME", None),
        f"?ssl={env_str('DB_SSL_MODE', 'prefer')}",
        {%- if cookiecutter.terraform_cloud_provider == 'gcp' %}
        "" if not GCP_CLOUDSQL else f"&host=/cloudsql/{GCP_CLOUDSQL}/.s.PGSQL.5432",
        {%- endif %}
    ]
)


@cache
def get_engine() -> AsyncEngine:
    """Create an asynchronous database engine"""
    engine = create_async_engine(DATABASE_URL, echo=env_bool("DB_ECHO", False), future=True)
    {%- if cookiecutter.enable_pgvector %}
    event.listen(engine.pool, "connect", _enable_vector_for_connection)
    {%- endif %}
    return engine


{%- if cookiecutter.enable_pgvector %}


def _enable_vector_for_connection(conn: AdaptedConnection, _):
    """Enable pgvector for a database connection"""
    asyncpg_connection: Connection = conn._connection  # pylint: disable=protected-access
    util.await_only(register_vector(asyncpg_connection))


{%- endif %}


async def get_session() -> AsyncGenerator[AsyncSession, None]:
    """Get a new database session"""
    sessionmaker = create_sessionmaker()

    async with sessionmaker() as session:
        yield session


def create_sessionmaker():
    """Create a new async session maker"""
    return async_sessionmaker(get_engine(), class_=AsyncSession, expire_on_commit=False)
