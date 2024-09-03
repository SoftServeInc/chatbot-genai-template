The technologies used in this project are:

- [FastAPI](https://fastapi.tiangolo.com/) - a modern, high-performance, web framework for building APIs with Python.
- [PostgreSQL](https://www.postgresql.org/) - the application uses it as a database to store chats, messages, and other data.
{%- if cookiecutter.enable_pgvector %}
- [pgvector](https://github.com/pgvector/pgvector) - a PostgreSQL extension for storing vector embeddings and running similarity search.
{%- endif %}
- [SQLModel](https://sqlmodel.tiangolo.com/) - an asynchronous SQL query builder and ORM for Python based on [SQLAlchemy](https://docs.sqlalchemy.org/en/20/).
- [Alembic](https://alembic.sqlalchemy.org/en/latest/) - a lightweight database migration tool for usage with SQLAlchemy.
- [Pydantic](https://pydantic-docs.helpmanual.io/) - a data validation and settings management using Python type annotations.
- [Langchain](https://python.langchain.com/docs/) - a framework for developing applications powered by language models.

The following tools are used to maintain the code quality:

- [Pytest](https://docs.pytest.org/) - a testing framework for Python.
- [Black](https://black.readthedocs.io/en/stable/) - a code formatter.
- [isort](https://pycqa.github.io/isort/) - a utility/library to sort imports alphabetically, and automatically separated into sections.
- [Flake8](https://flake8.pycqa.org/en/latest/) - a tool for style guide enforcement.
- [PyLint](https://www.pylint.org/) - a source code, bug, and quality checker.
{%- if cookiecutter.enable_mypy %}
- [MyPy](https://mypy.readthedocs.io/en/stable/) - a static type checker.
{%- endif %}

{#- trim new lines -#}
