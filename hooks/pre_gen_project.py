# This hook is run after questions, but before template process; the current working directory is the root of the generated project.
# It allows to validate the user input and reject the generation if it is invalid.

import re
import sys

PROJECT_NAME_REGEX = r"^[-a-zA-Z][-a-zA-Z0-9]+$"
project_name = "{{cookiecutter.project_name}}"
if not re.match(PROJECT_NAME_REGEX, project_name):
    print(f"ERROR: The project name ({project_name}) is not valid. Please do not use a _ and use - instead")
    # Exit to cancel project
    sys.exit(1)

DATABASE_NAME_REGEX = r"^[_a-zA-Z][_a-zA-Z0-9]+$"
database_name = "{{cookiecutter.database_name}}"
if not re.match(DATABASE_NAME_REGEX, database_name):
    print(f"ERROR: The database name ({database_name}) is not valid. Please do not use a - and use _ instead")
    # Exit to cancel project
    sys.exit(1)
