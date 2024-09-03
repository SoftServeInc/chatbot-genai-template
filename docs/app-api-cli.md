# 📜 API application CLI commands

The following CLI commands are available in the API application directory:

- `python run clean` - cleans up the project's `__pycache__` directories as well as `.mypy_cache` and `.pytest_cache`.
- `python run lint` - runs all the linters and code formatters in check mode.
- `python run lint:fix` - runs all the linters and code formatters in fix mode (i.e. it will fix the issues that can be fixed automatically).
- `python run build` - build production-ready Docker image.
- `python run test` - run the unit tests using the `pytest` test runner.
- `python run compose:up` - spin up the Docker Compose local environment. Particularly, it will start a container with a PostgreSQL database.
- `python run compose:down` - stop the Docker Compose local environment.
- `python run compose:remove` - stop and remove all the resources (containers, volumes, networks) of the Docker Compose local environment.
- `python run compose:bootstrap` - spin up the Docker Compose local environment and execute the database migrations.
- `python run start` - run the docker container with API server using the production-ready Docker image previously built with `python run build`.
- `python run start:dev` - run the docker container with the API server on the host machine in development mode - i.e. it will track the changes in the source code and restart the server automatically.
- `python run migration:upgrade [revision]` - run the database migrations using Alembic. If the `revision` argument is not provided, it will run all the migrations (i.e., `head` revision will be used by default).
- `python run migration:downgrade [revision]` - downgrade the database migrations using Alembic. If the `revision` argument is not provided, it will downgrade the database to the previous revision (i.e., `-1`).
- `python run migration:generate [name]` - generate a new database migration using Alembic. The `name` argument is required and it should be a short descriptive name of the migration. For example, `python run migration:generate add_user_table` will generate a new migration file with the name `<hash>_add_user_table.py` in the [`./migrations/versions`](./migrations/versions/) directory.

## 🛎️ Adding a new CLI command

It is easy enough to add a new CLI command to the application. The only thing you need to do is to go to the `./run/commands` file and add a new function there that should be named as the CLI command you want to add. For example, if you want to add a new CLI command `python run hello-world`, you need to add the following function to the `./run/commands` file:

```python
def hello_world():
    print("Hello world!")
```

Then you can run it from the command line:

```sh
python run hello-world
```

You can also add a new CLI command that accepts arguments. For example, let's add a new CLI command `python run hello --name <name>` that will print `Hello <name>!`:

```python
def hello(name: str):
    print(f"Hello {name}!")
```

Then you can run it from the command line:

```sh
# call the command using the named argument
python run hello --name "John"

# call the command using the positional argument
python run hello "John"
```

To see more examples of CLI commands, please refer to the [./run/commands.py](./run/commands.py) file where all the existing CLI commands are defined.
