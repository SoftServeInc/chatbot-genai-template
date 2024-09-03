from helpers import (
    init_terragrunt,
    exec_terragrunt,
    join,
    ENVS_DIR,
)


def init_common(env: str, terragrunt_options: list[str] = None, *, only_if_not_initialized: bool = False) -> None:
    init_terragrunt(join(ENVS_DIR, env, "common"), terragrunt_options, only_if_not_initialized=only_if_not_initialized)


def init_app(env: str, app: str, terragrunt_options: list[str] = None, *, only_if_not_initialized: bool = False) -> None:
    init_terragrunt(join(ENVS_DIR, env, "apps", app), terragrunt_options, only_if_not_initialized=only_if_not_initialized)


def run_common(env: str, action: str, terragrunt_options: list[str] = None) -> None:
    exec_terragrunt(join(ENVS_DIR, env, "common"), action, terragrunt_options or [])
