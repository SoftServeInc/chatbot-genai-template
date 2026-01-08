<!--
  CHANGELOG
  =========
  This file records notable changes to the Chatbot GenAI Template.

  Convention:
  - New, unreleased changes go under the "Unreleased" section.
  - Once a release is cut, move items from "Unreleased" into a new version section.
  - Group entries with short, action-oriented descriptions (e.g. "feat", "fix", "chore", "docs").
-->

## Unreleased

## 2.1.0 - 2025-12-22

- **feat(rag)**: Add full Retrieval-Augmented Generation support and update template. Introduce complete RAG functionality to the chatbot template. Key changes include:
  - document upload/management endpoints,
  - semantic search,
  - RAG-enabled chat assistant and retriever components,
  - RAG settings (replacing `enable_pgvector` with `enable_rag`),
  - consolidated migrations,
  - PostgreSQL image updated to pgvector 0.8.0 on PG17.
  - Includes comprehensive documentation updates and test coverage.

## 2.0.0 - 2025-12-05

- **chore**: Modernized the LangChain stack by upgrading to LangChain 1.x and refreshing related dependencies for better stability and long-term support.
- **chore**: Migrated the template to Pydantic 2.x and aligned validation and configuration patterns.
- **chore**: Improved template quality by adding contract tests for the Cookiecutter template to keep generated projects consistent and functional.
- **feat**: Refined the AI conversation assistant (`conversation_assistant.py`) to match the new dependency stack and improve maintainability.

## 1.0.0 - 2024-09-03

- **feat**: Initial release of the Chatbot GenAI Cookiecutter template.
- **feat**: Provide backend-only or backend + React UI scaffolding for building chatbot and virtual assistant projects.
- **feat**: Integrate LLM support (Azure OpenAI, Google Vertex AI, Amazon Bedrock) and infrastructure templates for major cloud providers.
- **feat**: Offer a batteries-included dev setup with Docker-based local environment, PostgreSQL, optional Keycloak, and a basic conversational UI.
