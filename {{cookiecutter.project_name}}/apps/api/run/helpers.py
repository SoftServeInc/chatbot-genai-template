import json
import os
import platform
import shutil
import subprocess
import sys
from os.path import join

APP_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PACKAGE_NAME = "{{ cookiecutter.__api_package_name }}"
PROJECT_NAME = "{{ cookiecutter.project_name }}"

CPU_ARCH = "arm64" if platform.machine() in ("aarch64", "arm64") else "amd64"
DOCKER_IMAGE = f"localhost/{PROJECT_NAME}{% if cookiecutter.__monorepo %}-api{% endif %}-{CPU_ARCH}:latest"
DOCKER_PLATFORM = f"linux/{CPU_ARCH}"


def start_process(cmd: list[str]) -> subprocess.Popen:
    print(">> " + " ".join(cmd))
    return subprocess.Popen(cmd, stdout=sys.stdout, stderr=sys.stderr, stdin=sys.stdin)


def exec(*cmd: str, allow_failure: bool = False) -> None:
    process = start_process(cmd)

    try:
        process.wait()
    except KeyboardInterrupt:
        # Let the child process exit gracefully
        process.wait()
        exit(0)

    if process.returncode and not allow_failure:
        # The command failed, so exit with the same error code
        exit(process.returncode)


def exec_multiple(*cmds: list[str], allow_failure: bool = False) -> None:
    processes: list[subprocess.Popen] = []

    for cmd in cmds:
        processes.append(start_process(cmd))

    try:
        for process in processes:
            process.wait()
    except KeyboardInterrupt:
        # Let the child processes exit gracefully
        for process in processes:
            process.wait()
        exit(0)

    if not allow_failure:
        for process in processes:
            if process.returncode:
                # One of the commands failed, so exit with the same error code
                exit(process.returncode)


def go_to_app_dir() -> None:
    os.chdir(APP_DIR)


def is_windows() -> bool:
    return os.name == "nt"


def activate_venv(create_if_not_exists: bool = False) -> bool:
    if not os.path.exists(".venv"):
        if create_if_not_exists:
            exec("python", "-m", "venv", ".venv")
        else:
            return False

    venv_bin_dir = join(APP_DIR, ".venv", "Scripts" if is_windows() else "bin")
    venv_lib_dir = join(APP_DIR, ".venv", "Lib" if is_windows() else "lib")

    venv_lib_subdirs = os.listdir(venv_lib_dir)
    venv_site_packages = join(
        (
            join(venv_lib_dir, venv_lib_subdirs[0])
            if len(venv_lib_subdirs) == 1 and venv_lib_subdirs[0].startswith("python")
            else venv_lib_dir
        ),
        "site-packages",
    )

    # Add the venv bin directory to the PATH
    os.environ["PATH"] = f"{venv_bin_dir}{os.pathsep}{os.environ['PATH']}"
    # Add the venv site-packages directory to the PYTHONPATH
    os.environ["PYTHONPATH"] = f"{venv_site_packages}{os.pathsep}{os.environ.get('PYTHONPATH', '')}"
    # Add the venv site-packages directory to the sys.path
    sys.path.insert(0, venv_site_packages)

    go_to_app_dir()
    return True


def adjust_vscode_settings() -> None:
    vscode_dir = join(APP_DIR, {% if cookiecutter.__monorepo %}"..", "..", {% endif %}".vscode")
    vscode_settings_src = join(vscode_dir, "settings.json.example")
    vscode_settings_dst = join(vscode_dir, "settings.json")

    if not os.path.isfile(vscode_settings_dst):
        # Either copy the example file or create an empty one
        if os.path.isfile(vscode_settings_src):
            shutil.copy(vscode_settings_src, vscode_settings_dst)
        else:
            with open(vscode_settings_dst, "wt+") as file:
                json.dump({}, file, indent=2, sort_keys=True)

    # Update the python settings
    with open(vscode_settings_dst, "rt+") as file:
        base_path = {% if cookiecutter.__monorepo %}join(".", "apps", "api"){% else %}"."{% endif %}
        python_path = join(base_path, ".venv", "Scripts\\python.exe" if is_windows() else "bin/python")

        vscode_settings = json.load(file)
        vscode_settings["python.defaultInterpreterPath"] = python_path
        vscode_settings["python.analysis.extraPaths"] = [base_path]

        file.seek(0)
        json.dump(vscode_settings, file, indent=2, sort_keys=True)


def load_dotenv() -> None:
    from dotenv import load_dotenv

    dotenv_path = join(APP_DIR, ".env")
    load_dotenv(dotenv_path)


def copy_example_file(base_filename: str) -> None:
    example_filename = f"{base_filename}.example"

    if os.path.isfile(example_filename) and not os.path.isfile(base_filename):
        shutil.copy(example_filename, base_filename)


def remove_mypy_cache() -> None:
    shutil.rmtree(join(APP_DIR, ".mypy_cache"), ignore_errors=True)


def remove_pycache() -> None:
    import glob

    for dir in glob.glob(join(APP_DIR, "**", "__pycache__"), recursive=True):
        shutil.rmtree(dir)


def remove_pytest_cache() -> None:
    shutil.rmtree(join(APP_DIR, ".pytest_cache"), ignore_errors=True)


{%- if cookiecutter.pip == "pip" %}


def remove_package_build() -> None:
    # Remove the build artifacts
    shutil.rmtree(join(APP_DIR, f"{PACKAGE_NAME}.egg-info"), ignore_errors=True)
    shutil.rmtree(join(APP_DIR, f"build"), ignore_errors=True)

    # Remove the package from the venv site-packages
    exec("pip", "uninstall", "-y", PACKAGE_NAME)


{%- endif %}
