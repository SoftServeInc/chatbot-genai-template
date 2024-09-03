import os
from datetime import datetime, timezone

from callbacks import callbacks
from helpers import (
    DOCKER,
    ENVS_DIR,
    PROJECT_NAME,
    PROJECT_ROOT,
    exec,
    exec_terragrunt,
    get_app_state_outputs,
    get_common_state_outputs,
    get_current_commit_hash,
    is_windows,
    join,
)


def run_app_api(env: str, action: str, terragrunt_options: list[str], update_code: bool, migrate: bool) -> None:
    directory = join(ENVS_DIR, env, "apps", "api")
    is_applying = action == "apply"
    is_destroying = action == "destroy"

    if is_destroying:
        image_tag = "none"
    elif update_code:
        image_tag = update_app_code_api(env, action)
    else:
        prev_outputs = get_app_state_outputs(env, "api")
        image_tag = prev_outputs.get("image", ":latest").split(":")[-1]

    os.environ["TF_VAR_image_tag"] = image_tag

    exec_terragrunt(directory, action, terragrunt_options)

    if migrate and is_applying:
        migrate_app_api(env)

    if is_applying:
        outputs = get_app_state_outputs(env, "api")
        print("--------------------")
        print(f"API URL: {outputs['url']}")
        print(f"API Swagger UI: {outputs['url_swagger']}")
        {%- if cookiecutter.auth == "keycloak" %}
        print(f"Keycloak URL: {outputs.get('url_keycloak', 'N/A')}")
        {%- endif %}


def update_app_code_api(env: str, is_applying: bool) -> str:
    image_path = {% if cookiecutter.__monorepo %}join(PROJECT_ROOT, "apps", "api"){% else %}PROJECT_ROOT{% endif %}
    image_name = f"localhost/{% if cookiecutter.__monorepo %}{PROJECT_NAME}-api{% else %}{PROJECT_NAME}{% endif %}-amd64"
    image_tag = f"{datetime.now(timezone.utc).strftime('%Y%m%d%H%M%S')}-{get_current_commit_hash()}"

    os.chdir(image_path)
    exec([DOCKER, "build", "--platform", "linux/amd64", "--tag", f"{image_name}:{image_tag}", "."])

    if not is_applying:
        return image_tag

    common_outputs = get_common_state_outputs(env)
    if not common_outputs:
        print("--------------------")
        print("Cannot publish `api` docker image because `common` infrastructure is not deployed and Docker repository does not exist.")
        exit(1)

    image_repo = callbacks.prepare_api_image_repository(common_outputs)

    exec([DOCKER, "tag", f"{image_name}:{image_tag}", f"{image_repo}:{image_tag}"])
    exec([DOCKER, "tag", f"{image_name}:{image_tag}", f"{image_repo}:latest"])
    exec([DOCKER, "push", f"{image_repo}:{image_tag}"])
    exec([DOCKER, "push", f"{image_repo}:latest"])

    return image_tag


def migrate_app_api(env: str) -> None:
    outputs = get_app_state_outputs(env, "api")
    db: dict[str, str] = outputs["db"]

    if not db["is_public"]:
        print("--------------------")
        print("Skipping api DB migration because DB is not public - you need to run it manually, connecting to the DB from the bastion host.")
        return

    os.environ["DB_HOST"] = db["host"]
    os.environ["DB_PORT"] = str(db["port"])
    os.environ["DB_NAME"] = db["name"]
    os.environ["DB_USERNAME"] = db["username"]
    os.environ["DB_PASSWORD"] = callbacks.get_api_db_password(outputs)
    os.environ["DB_SSL_MODE"] = db.get("ssl_mode", "prefer")

    os.chdir({% if cookiecutter.__monorepo %}join(PROJECT_ROOT, "apps", "api"){% else %}PROJECT_ROOT{% endif %})
    alembic = join(".venv", "Scripts" if is_windows() else "bin", "alembic")

    exec(["poetry", "install", "--no-root"])
    exec([alembic, "upgrade", "head"])

