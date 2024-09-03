import os

from callbacks import callbacks
from helpers import (
    exec,
    exec_terragrunt,
    join,
    get_app_state_outputs,
    ENVS_DIR,
    PROJECT_ROOT,
)


def run_app_web(env: str, action: str, terragrunt_options: list[str], update_code: bool) -> None:
    directory = join(ENVS_DIR, env, "apps", "web")
    is_applying = action == 'apply'

    exec_terragrunt(directory, action, terragrunt_options)

    if update_code:
        update_app_code_web(env, is_applying)

    if is_applying:
        outputs = get_app_state_outputs(env, "web")
        print("--------------------")
        print(f"Web UI URL: {outputs['url']}")


def update_app_code_web(env: str, is_applying: bool):
    os.chdir(PROJECT_ROOT)

    if not os.environ.get('VITE_API_BASE_URL', ''):
        api_outputs = get_app_state_outputs(env, 'api')
        api_url = api_outputs.get('url', 'http://localhost:3000')
        os.environ['VITE_API_BASE_URL'] = f'{api_url}/v1'

    # Install dependencies and build the web app
    exec(["{{ cookiecutter.npm }}", "install", "--ignore-scripts"])
    exec(["{{ cookiecutter.__npx }}", "nx", "run", "web:build", "--mode", env])

    if is_applying:
        source_dir = join(PROJECT_ROOT, "apps", "web", "dist")
        callbacks.upload_web_app_code(get_app_state_outputs(env, 'web'), source_dir)
