from os import environ
from os.path import exists, join

from helpers import (
    DOCKER_IMAGE,
    DOCKER_PLATFORM,
    PACKAGE_NAME,
    {%- if cookiecutter.pip == "pip" or not cookiecutter.__monorepo %}
    activate_venv,
    {%- endif %}
    adjust_vscode_settings,
    copy_example_file,
    exec,
    {%- if cookiecutter.enable_mypy %}
    remove_mypy_cache,
    {%- endif %}
    {%- if cookiecutter.pip == "pip" %}
    remove_package_build,
    {%- endif %}
    remove_pycache,
    remove_pytest_cache,
)


def install() -> None:
    print("Copying example files...")
    {%- if cookiecutter.auth == "local" %}
    copy_example_file("users.yaml")
    {%- endif %}
    copy_example_file(".env")

    {%- if cookiecutter.pip == "poetry" %}

    print("Installing dependencies...")
    exec("poetry", "lock", "--no-update")
    exec("poetry", "install", "--no-root")

    {%- elif cookiecutter.pip == "pip" %}

    print("Creating virtual environment...")
    activate_venv(create_if_not_exists=True)

    print("Installing dependencies...")
    exec("pip", "install", ".[dev]", "--disable-pip-version-check")
    remove_package_build()

    {%- endif %}

    {%- if not cookiecutter.__monorepo %}

    if exists(".git"):
        {%- if cookiecutter.pip != "pip" %}
        activate_venv()
        {%- endif %}
        print("Installing git hooks...")
        exec("pre-commit", "install", "--install-hooks")

    {%- endif %}

    print("Adjusting .vscode/settings.json")
    adjust_vscode_settings()


def clean() -> None:
    {% if cookiecutter.enable_mypy -%}

    print("Removing .mypy_cache directory...")
    remove_mypy_cache()

    {% endif -%}

    print("Removing __pycache__ directories...")
    remove_pycache()

    print("Removing .pytest_cache directory...")
    remove_pytest_cache()


def test() -> None:
    print("Running unit tests...")
    exec("pytest", "./tests")


def test_coverage() -> None:
    print("Running unit tests with coverage...")
    exec(
        "pytest",
        "--cov-report=term-missing",
        "--cov-report=html",
        "--cov-report=json",
        "--cov-report=lcov",
        f"--cov=./{PACKAGE_NAME}",
        "./tests",
    )


def lint() -> None:
    print("Linting source code...")
    exec("isort", "./run", f"./{PACKAGE_NAME}", "--check-only")
    exec("black", "./run", f"./{PACKAGE_NAME}", "--check")
    exec("pylint", "--rcfile=.pylintrc", f"./{PACKAGE_NAME}")
    exec("flake8", f"./{PACKAGE_NAME}")
    {%- if cookiecutter.enable_mypy %}
    exec("mypy", f"./{PACKAGE_NAME}")
    {%- endif %}


def lint_fix() -> None:
    print("Linting source code and fixing...")
    exec("isort", "./run", f"./{PACKAGE_NAME}")
    exec("black", "./run", f"./{PACKAGE_NAME}")
    exec("pylint", "--rcfile=.pylintrc", f"./{PACKAGE_NAME}")
    exec("flake8", f"./{PACKAGE_NAME}")
    {%- if cookiecutter.enable_mypy %}
    exec("mypy", f"./{PACKAGE_NAME}")
    {%- endif %}


def lint_staged(*files: str) -> None:
    print("Linting and fixing staged sources...")
    exec("isort", *files)
    exec("black", *files)


def build() -> None:
    print(f"Building Docker image...")
    exec(
        "{{ cookiecutter.container_engine }}",
        "build",
        "--platform",
        DOCKER_PLATFORM,
        "--tag",
        DOCKER_IMAGE,
        "--file",
        "Dockerfile",
        ".",
    )


def compose_up() -> None:
    print("Launching Docker Compose environment...")
    exec("{{ cookiecutter.container_engine }}", "compose", "up", "--no-recreate", "--quiet-pull", "--wait", "--detach")


def compose_down() -> None:
    print("Stopping Docker Compose environment...")
    exec("{{ cookiecutter.container_engine }}", "compose", "stop")


def compose_remove() -> None:
    print("Removing Docker Compose environment...")
    exec("{{ cookiecutter.container_engine }}", "compose", "down", "--volumes", "--remove-orphans")


def compose_bootstrap() -> None:
    compose_remove()
    compose_up()
    migration_upgrade()


def start() -> None:
    print(f"Starting Docker container...")
    exec(
        "{{ cookiecutter.container_engine }}",
        "run",
        "--rm",
        "--network",
        "host",
        "--env-file",
        ".env",
        "-p",
        f"127.0.0.1:{environ.get('APP_LOCALHOST_PORT', '3000')}:3000/tcp",
        DOCKER_IMAGE,
    )


def start_dev() -> None:
    print(f"Starting development server...")
    exec(
        "uvicorn",
        f"{PACKAGE_NAME}.server:app",
        "--host",
        "127.0.0.1",
        "--port",
        environ.get("APP_LOCALHOST_PORT", "3000"),
        "--log-config",
        "./uvicorn-logging-config.yaml",
        "--reload",
    )


def migration_upgrade(revision: str = "head") -> None:
    print(f"Upgrading database migration...")
    exec("alembic", "upgrade", revision)


def migration_downgrade(revision: str = "-1") -> None:
    print(f"Downgrading database migration...")
    exec("alembic", "downgrade", revision)


def migration_generate(message: str) -> None:
    print(f"Generating database migration...")
    exec("alembic", "revision", "--autogenerate", "-m", message)
