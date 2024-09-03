import json
import os
import subprocess
import sys
from glob import glob
from os.path import dirname, realpath, join

DOCKER = "{{ cookiecutter.container_engine }}"
RUN_DIR = dirname(realpath(sys.modules["__main__"].__file__))
ENVS_DIR = join(dirname(RUN_DIR), "envs")
PROJECT_ROOT = dirname(dirname(dirname(RUN_DIR)))
PROJECT_NAME = "{{ cookiecutter.project_name }}"


def is_windows() -> bool:
    return os.name == "nt"


def is_initialized(directory: str) -> bool:
    return len(glob(join(directory, ".terragrunt-cache", "*", "*", ".terraform", "terraform.tfstate"), recursive=True)) > 0


def get_common_state_outputs(env: str) -> dict[str, str]:
    return get_state_outputs(join(ENVS_DIR, env, "common"))


def get_app_state_outputs(env: str, app: str) -> dict[str, str]:
    return get_state_outputs(join(ENVS_DIR, env, "apps", app))


def get_state_outputs(directory) -> dict[str, str]:
    result = exec_terragrunt(directory, "output", ["-json"], capture_output=True)
    outputs = json.loads(result.stdout.strip())

    return { k: v["value"] for k, v in outputs.items() }


def get_current_commit_hash() -> str:
    result = exec(["git", "rev-parse", "--short", "HEAD"], capture_output=True, allow_failure=True)

    return result.returncode == 0 and result.stdout.strip() or "0000000"


def render_terragrunt_config(directory: str) -> dict[str, dict[str, str]]:
    terragrunt_rendered_json = "terragrunt_rendered.json"
    exec_terragrunt(directory, "render-json", ["--terragrunt-json-out", terragrunt_rendered_json])

    config = json.load(open(os.path.join(directory, terragrunt_rendered_json)))
    os.remove(terragrunt_rendered_json)

    return config


def init_terragrunt(directory: str, terragrunt_options: list[str] = None, *, only_if_not_initialized: bool = False) -> None:
    if only_if_not_initialized and is_initialized(directory):
        return

    exec_terragrunt(directory, "init", terragrunt_options)


def exec_terragrunt(directory: str, action: str, terragrunt_options: list[str], **kwargs) -> subprocess.CompletedProcess:
    {% if cookiecutter.terraform_cloud_provider == "gcp" -%}

    current_dir = directory

    # check whether there is credentials.json file in any directory from the current one u to the envs director
    while current_dir.startswith(ENVS_DIR):
        if os.path.isfile(join(current_dir, "credentials.json")):
            os.environ["USE_GCP_CREDENTIALS_FILE"] = "1"
            break

        current_dir = os.path.dirname(current_dir)

    {% endif -%}

    TF_VAR_PREFIX = "TF_VAR_"
    TF_VARS = {
        k[len(TF_VAR_PREFIX):]: v
        for k, v in os.environ.items()
        if k.startswith(TF_VAR_PREFIX)
    }

    if TF_VARS:
        print("----------------------------")
        print("Additional Terraform inputs:")
        for k, v in TF_VARS.items():
            print(f">> {k} = {v}")
        print()

    os.chdir(directory)
    return exec(["terragrunt", action] + (terragrunt_options or []), **kwargs)


def exec(
    cmd: list[str],
    *,
    redact: list[int] = None, # list of indexes of cmd arguments to redact
    silent: bool = False,
    allow_failure: bool = False,
    capture_output: bool = False,
    **kwargs
) -> subprocess.CompletedProcess:
    redact = redact or []

    print("----------------")
    print("Running command:")
    print(">> " + " ".join(v if i not in redact else "********" for i, v in enumerate(cmd)))
    print("at " + os.getcwd())
    print()

    if not capture_output:
        if silent:
            # capture all output to be able to print it it in case of error
            capture_output = True
        else:
            kwargs["stdout"] = sys.stdout
            kwargs["stderr"] = sys.stderr
            kwargs["stdin"] = sys.stdin

    if capture_output:
        kwargs["stdout"] = subprocess.PIPE
        kwargs["stderr"] = subprocess.PIPE

    kwargs["text"] = True
    process = subprocess.Popen(cmd, **kwargs)

    try:
        if capture_output:
            stdout, stderr = process.communicate()
            result = subprocess.CompletedProcess(cmd, process.returncode, stdout, stderr)
        else:
            process.wait()
            result = subprocess.CompletedProcess(cmd, process.returncode)
    except KeyboardInterrupt:
        # allow the process to finish gracefully
        process.wait()
        exit(0)

    if result.returncode and not allow_failure:
        # print the captured output of the command in case of error
        if capture_output:
            print(result.stdout)
            print(result.stderr, file=sys.stderr)

        # The command failed, so exit with the same error code
        exit(result.returncode)

    return result


def exec_ok(*args, **kwargs) -> bool:
    kwargs["allow_failure"] = True
    kwargs["capture_output"] = True

    result = exec(*args, **kwargs)

    return result.returncode == 0


def exec_text(*args, **kwargs) -> str:
    kwargs["capture_output"] = True
    result = exec(*args, **kwargs)

    return result.stdout.strip()


def exec_json(*args, **kwargs) -> dict:
    kwargs["capture_output"] = True
    result = exec(*args, **kwargs)

    return json.loads(result.stdout.strip())
