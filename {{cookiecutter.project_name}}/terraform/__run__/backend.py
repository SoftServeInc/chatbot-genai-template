from callbacks import callbacks
from helpers import (
    render_terragrunt_config,
    ENVS_DIR,
)


def create_terraform_backend() -> None:
    terragrunt_locals = render_terragrunt_config(ENVS_DIR).get("locals", {})
    callbacks.create_terraform_backend(terragrunt_locals)
