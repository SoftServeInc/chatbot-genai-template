import argparse
import os
import sys

from modules.apps.api import run_app_api
{%- if cookiecutter.enable_web_ui %}
from modules.apps.web import run_app_web
{%- endif %}
from modules.common import init_common, init_app, run_common

from backend import create_terraform_backend
from helpers import ENVS_DIR


def main() -> None:
    # If the first argument is `create-terraform-backend`, then we need to initiate the terraform backend creation
    if len(sys.argv) > 1 and sys.argv[1] == "create-terraform-backend":
        create_terraform_backend()
        return

    # Get the names of the available environments from the `envs` directory
    envs = [
        name
        for name in os.listdir(ENVS_DIR)
        if not name.startswith("_") and os.path.isdir(os.path.join(ENVS_DIR, name))
    ]

    # Configure the parser to accept the appropriate arguments
    parser = argparse.ArgumentParser(description="Deploy app to AWS.")
    parser.add_argument(
        "action",
        type=str,
        choices=["init", "plan", "apply", "destroy"],
        help="The action to perform.",
    )
    parser.add_argument(
        "--env",
        type=str,
        choices=envs,
        required=True,
        help="The environment to deploy to.",
    )
    parser.add_argument(
        "--app",
        type=str,
        choices=["api", "web"],
        help="The name of the application to deploy.",
    )
    parser.add_argument(
        "--update-code",
        action="store_true",
        help="Not only infrastructure, but application code will be also updated as part of the deployment (applicable only when '--app {api,web}').",
    )
    parser.add_argument(
        "--migrate",
        action="store_true",
        help="Whether to run DB migrations after deployment (applicable only when '--app api').",
    )
    parser.add_argument(
        "--common",
        action="store_true",
        help="Deploy the common infrastructure."
    )
    {%- if cookiecutter.terraform_cloud_provider == "aws" %}
    parser.add_argument(
        "--profile",
        type=str,
        help="The name of the AWS profile to use.",
    )
    {%- endif %}

    argv = sys.argv[1:]
    terragrunt_options = []

    # Split the arguments into the ones for this script and the ones for terragrunt
    if "--" in argv:
        dasdash = argv.index("--")
        terragrunt_options = argv[dasdash+1:]
        argv = argv[:dasdash]

    # Parse the arguments
    args = parser.parse_args(argv)

    {%- if cookiecutter.terraform_cloud_provider == "aws" %}
    if args.profile:
        os.environ["AWS_PROFILE"] = args.profile
    {%- endif %}

    common = args.common
    app = (args.app or '').lower()
    env = args.env.lower()
    action = args.action.lower()
    migrate = args.migrate and action != "destroy"
    update_code = args.update_code and action != "destroy"

    # Validate that --app and --common are not specified together
    if app and common:
        parser.error("You cannot specify both --app and --common.")

    # Validate that either --app or --common is specified
    if not app and not common:
        parser.error("You must specify either --app or --common.")

    if update_code and action == "destroy":
        parser.error("You cannot specify --update-code when destroying the infrastructure.")

    if update_code and not app:
        parser.error("You can specify --update-code only when deploying an app.")

    # Validate that --migrate is specified only for --app api
    if migrate and app != "api":
        parser.error("You can only run DB migrations for `api` app.")

    if action == "init":
        init_common(env, terragrunt_options)
        if app:
            init_app(env, app, terragrunt_options)
        return

    if common:
        run_common(env, action, terragrunt_options)
        return

    # Initialize the terraform state for the common infrastructure because apps depend on it
    init_common(env, only_if_not_initialized=True)
    # Initialize the terraform state for the app
    init_app(env, app, only_if_not_initialized=True)

    if app == "api":
        run_app_api(env, action, terragrunt_options, update_code, migrate)
    {%- if cookiecutter.enable_web_ui %}
    elif app == "web":
        run_app_web(env, action, terragrunt_options, update_code)
    {%- endif %}


main()