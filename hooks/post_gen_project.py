# This hook is run after the project generation; the current working directory is the root of the generated project.
# It allows to perform additional actions after the project generation.

import re
from os import remove, listdir
from os.path import join, realpath, curdir
from shutil import rmtree, move

PROJECT_DIRECTORY = realpath(curdir)


def move_file(src: list[str], dst: list[str]) -> None:
    move(join(PROJECT_DIRECTORY, *src), join(PROJECT_DIRECTORY, *dst))


def remove_file(*filepath: str) -> None:
    remove(join(PROJECT_DIRECTORY, *filepath))


def remove_tree(*filepath: str) -> None:
    rmtree(join(PROJECT_DIRECTORY, *filepath))


def cleanup_terraform() -> None:
    CLOUD_PROVIDERS = ["aws", "azure", "gcp"]
    selected_cloud_provider = "{{ cookiecutter.terraform_cloud_provider }}"

    if selected_cloud_provider == "none":
        remove_tree("terraform")
        return

    for cloud_provider in CLOUD_PROVIDERS:
        if selected_cloud_provider != cloud_provider:
            remove_tree("terraform", cloud_provider)
            remove_file("terraform", "__run__", "callbacks", f"{cloud_provider}_callbacks.py")

    move_file(["terraform", "__run__"], ["terraform", selected_cloud_provider, "run"])
    move_file(["terraform", "README.md"], ["terraform", selected_cloud_provider, "README.md"])

    if "{{ cookiecutter.auth }}" != "keycloak":
        remove_tree("terraform", selected_cloud_provider, "modules", "apps", "api", "keycloak")
        remove_file("terraform", selected_cloud_provider, "modules", "apps", "api", "keycloak.tf")


def cleanup_api() -> None:
    if "{{ cookiecutter.__monorepo }}" == "True":
        # For monorepo projects husky is used to setup git hooks instead of pre-commit
        remove_file("apps", "api", ".pre-commit-config.yaml")
    else:
        # For API-only projects only the root README.md is needed, because the api-specific README.md is for monorepo projects
        remove_file("apps", "api", "README.md")

    if "{{ cookiecutter.pip }}" != "poetry":
        remove_file("apps", "api", "poetry.lock")
        remove_file("apps", "api", "poetry.toml")

    # Remove unused authenticators
    if "{{ cookiecutter.auth }}" != "dummy":
        remove_file("apps", "api", "{{ cookiecutter.__api_package_name }}", "auth", "dummy_authenticator.py")

    if "{{ cookiecutter.auth }}" != "keycloak":
        remove_file("apps", "api", "{{ cookiecutter.__api_package_name }}", "auth", "keycloak_authenticator.py")
        remove_file("apps", "api", "docker-compose.keycloak-realm.json")

    if "{{ cookiecutter.auth }}" != "local":
        remove_file("apps", "api", "{{  cookiecutter.__api_package_name }}", "auth", "local_authenticator.py")
        remove_file("apps", "api", "users.yaml.example")


def cleanup_web() -> None:
    if "{{ cookiecutter.enable_web_ui }}" == "True":
        # Delete npm dependencies lock for unused package manager
        if "{{ cookiecutter.npm }}" == "pnpm":
            remove_file("package-lock.json")
        else:
            remove_file("pnpm-lock.yaml")
            remove_file("pnpm-workspace.yaml")
        return

    selected_cloud_provider = "{{ cookiecutter.terraform_cloud_provider }}"

    if  selected_cloud_provider != "none":
        remove_tree("terraform", selected_cloud_provider, "modules", "apps", "web")
        remove_tree("terraform", selected_cloud_provider, "envs", "dev", "apps", "web")
        remove_tree("terraform", selected_cloud_provider, "envs", "qa", "apps", "web")
        remove_tree("terraform", selected_cloud_provider, "envs", "prod", "apps", "web")
        remove_file("terraform", selected_cloud_provider, "envs", "_env", "apps", "web.hcl")
        remove_file("terraform", "package.json")

    remove_tree("libs")
    remove_tree(".husky")
    remove_file(".vscode", "extensions.json")
    remove_file(".nvmrc")
    remove_file(".prettierrc")
    remove_file(".prettierignore")
    remove_file("nx.json")
    remove_file("package.json")
    remove_file("package-lock.json")
    remove_file("pnpm-lock.yaml")
    remove_file("pnpm-workspace.yaml")

    remove_file("apps", "api", "package.json")

    for file in listdir(join("apps", "api")):
        move_file(["apps", "api", file], [file])

    remove_tree("apps")


def render_postman_collection() -> None:
    filename = join("postman", "{{ cookiecutter.project_name }}.postman_collection.json")

    with open(filename, "rt") as file:
        content = file.read()
        content = re.sub(r"{{ '{{' }}\s*cookiecutter\.project_name\s*{{ '}}' }}", "{{ cookiecutter.project_name }}", content)
        content = re.sub(r"{{ '{{' }}\s*cookiecutter\.project_title\s*{{ '}}' }}", "{{ cookiecutter.project_title }}", content)

    with open(filename, "w") as file:
        file.write(content)


if __name__ == "__main__":
    cleanup_terraform()
    cleanup_api()
    cleanup_web()
    render_postman_collection()
