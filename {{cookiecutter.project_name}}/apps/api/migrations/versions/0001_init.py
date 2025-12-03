"""init

Revision ID: 0001
Revises:
Create Date: 2023-11-27 15:23:23.631157

"""
{%- if cookiecutter.enable_rag %}
from pgvector.sqlalchemy import Vector
{%- endif %}
from typing import Sequence, Union

import sqlalchemy as sa
import sqlmodel
from alembic import op
from sqlalchemy.dialects import postgresql
from sqlalchemy.types import UUID

# revision identifiers, used by Alembic.
revision: str = "0001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "chats",
        sa.Column("id", UUID(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("modified_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("user_id", sqlmodel.sql.sqltypes.AutoString(), nullable=False),
        sa.Column("title", sqlmodel.sql.sqltypes.AutoString(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_chats_created_at"), "chats", ["created_at"], unique=False)

    op.create_table(
        "messages",
        sa.Column("id", UUID(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("modified_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("chat_id", UUID(), nullable=False),
        sa.Column(
            "role",
            postgresql.ENUM("USER", "ASSISTANT", name="message_role"),
            nullable=False,
        ),
        sa.Column("segments", postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.Column("in_progress", sa.Boolean(), nullable=False),
        sa.Column("feedback_rating", sa.Integer(), nullable=False),
        sa.Column(
            "feedback_comment",
            sqlmodel.sql.sqltypes.AutoString(),
            nullable=False,
        ),
        sa.ForeignKeyConstraint(
            ["chat_id"],
            ["chats.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_messages_created_at"), "messages", ["created_at"], unique=False)

    op.create_table(
        "terms_versions",
        sa.Column("id", UUID(), nullable=False),
        sa.Column("url", sqlmodel.sql.sqltypes.AutoString(), nullable=False),
        sa.Column("published_at", sa.DateTime(timezone=True), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(
        op.f("ix_terms_versions_published_at"),
        "terms_versions",
        ["published_at"],
        unique=False,
    )
    op.create_index(op.f("ix_terms_versions_url"), "terms_versions", ["url"], unique=False)
    op.create_table(
        "terms_version_agreements",
        sa.Column("terms_version_id", UUID(), nullable=False),
        sa.Column("user_id", sqlmodel.sql.sqltypes.AutoString(), nullable=False),
        sa.Column("agreed_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(
            ["terms_version_id"],
            ["terms_versions.id"],
        ),
        sa.PrimaryKeyConstraint("terms_version_id", "user_id"),
    )

    {%- if cookiecutter.enable_rag %}
    # RAG-specific tables and columns
    # Ensure vector extension is enabled
    op.execute("CREATE EXTENSION IF NOT EXISTS vector")

    # Add rag_enabled column to chats table
    op.add_column("chats", sa.Column("rag_enabled", sa.Boolean(), nullable=False, server_default=sa.false()))

    # Default embedding dimensions (Azure OpenAI text-embedding-ada-002)
    # This should match RAG_EMBEDDING_DIMENSIONS environment variable
    EMBEDDING_DIMENSIONS = 1536

    op.create_table(
        "rag_documents",
        sa.Column("id", UUID(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("modified_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("title", sqlmodel.sql.sqltypes.AutoString(length=255), nullable=False),
        sa.Column("filename", sqlmodel.sql.sqltypes.AutoString(length=255), nullable=False),
        sa.Column("content_type", sqlmodel.sql.sqltypes.AutoString(length=100), nullable=False),
        sa.Column("content", sqlmodel.sql.sqltypes.AutoString(), nullable=False),
        sa.Column("doc_metadata", postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column("embedding", Vector(EMBEDDING_DIMENSIONS), nullable=True),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_rag_documents_created_at"), "rag_documents", ["created_at"], unique=False)
    op.create_index(op.f("ix_rag_documents_title"), "rag_documents", ["title"], unique=False)

    # Create HNSW index for fast vector similarity search
    # Using cosine distance operator
    op.execute("""
        CREATE INDEX ix_rag_documents_embedding_hnsw
        ON rag_documents
        USING hnsw (embedding vector_cosine_ops)
        WITH (m = 16, ef_construction = 64)
    """)
    {%- endif %}


def downgrade() -> None:
    {%- if cookiecutter.enable_rag %}
    op.drop_index("ix_rag_documents_embedding_hnsw", table_name="rag_documents")
    op.drop_index(op.f("ix_rag_documents_title"), table_name="rag_documents")
    op.drop_index(op.f("ix_rag_documents_created_at"), table_name="rag_documents")
    op.drop_table("rag_documents")
    op.drop_column("chats", "rag_enabled")
    {%- endif %}

    op.drop_table("terms_version_agreements")
    op.drop_index(op.f("ix_terms_versions_url"), table_name="terms_versions")
    op.drop_index(op.f("ix_terms_versions_published_at"), table_name="terms_versions")
    op.drop_table("terms_versions")
    op.drop_index(op.f("ix_messages_created_at"), table_name="messages")
    op.drop_table("messages")
    op.drop_index(op.f("ix_chats_created_at"), table_name="chats")
    op.drop_table("chats")

