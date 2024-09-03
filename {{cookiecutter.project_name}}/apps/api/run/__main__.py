import inspect
import os
import sys
from typing import Callable

import commands
from helpers import activate_venv, load_dotenv


def parse_command() -> Callable:
    if len(sys.argv) < 2:
        print("No command provided")
        exit(1)

    command_name = sys.argv[1].replace("-", "_").replace(":", "_")
    command_dict = commands.__dict__

    if command_name not in command_dict:
        print(f"Unknown command: {command_name}")
        exit(1)

    return command_dict[command_name]


def parse_command_args() -> tuple[dict[str, str], list[str]]:
    args_named = {}
    args_positional = []

    arg_index = 2

    while arg_index < len(sys.argv):
        arg = sys.argv[arg_index]

        # If the argument starts with "--", it's a named argument
        if arg.startswith("--"):
            arg = arg[2:]

            # the value can be provided as --key=value or --key value
            if "=" in arg:
                key, value = arg.split("=", 1)
            else:
                key = arg
                if arg_index + 1 < len(sys.argv) and not sys.argv[arg_index + 1].startswith("--"):
                    arg_index += 1
                    value = sys.argv[arg_index]
                else:
                    value = True

            args_named[key.replace("-", "_")] = value

        # otherwise it's a positional argument
        else:
            args_positional.append(arg)

        arg_index += 1

    return (args_named, args_positional)


def main() -> None:
    # make sure we are in the root directory of the API project
    os.chdir(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

    cmd = parse_command()
    cmd_args_named, cmd_args_positional = parse_command_args()

    # get the names of arguments of the command and their default values
    arg_spec = inspect.getfullargspec(cmd)
    arg_names = arg_spec.args
    arg_has_varargs = arg_spec.varargs is not None
    arg_defaults = {}

    if arg_spec.defaults is not None:
        arg_defaults = dict(zip(arg_names[-len(arg_spec.defaults) :], arg_spec.defaults))

    # make sure no unknown arguments are provided
    for arg in cmd_args_named:
        if arg not in arg_names:
            print(f"Unknown named argument: --{arg.replace('_', '-')}")
            exit(1)

    # make sure all required arguments are provided unless they have a default value set
    for arg in arg_names:
        if arg not in cmd_args_named:
            if cmd_args_positional:
                cmd_args_named[arg] = cmd_args_positional.pop(0)
            elif arg in arg_defaults:
                cmd_args_named[arg] = arg_defaults[arg]
            else:
                print(f"Missing required argument: --{arg.replace('_', '-')}")
                exit(1)

    if cmd_args_positional and not arg_has_varargs:
        print(f"Unknown positional arguments: {' '.join(cmd_args_positional)}")
        exit(1)

    if cmd.__name__ != "install":
        activate_venv()
        load_dotenv()

    cmd(*cmd_args_positional, **cmd_args_named)


main()
