# 📟 {{ cookiecutter.__api_project_title }}

The API backend application written in Python.{% if cookiecutter.pip == "poetry" %} As described in the [main README.md](../../README.md), the project requires you to have [Poetry](https://python-poetry.org/docs/#installation) installed globally.{% endif %}

{% include "api-techstack.md" -%}

## 🏃‍♂️ How to run it locally

1. Go to the project's [root](../..) directory.
1. _If you use **`pyenv`**_: Run `pyenv install` to install the correct Python version.
1. _If you use **`pyenv`**_: Run `pyenv local` to use the correct Python version.
1. Run `{{ cookiecutter.npm }} install` to install all the project's dependencies.
1. Add whatever users you want to the [`./users.yaml`](./users.yaml) file.
1. Fill in the required environment variables in the [`./.env`](./.env) file.
1. Run `{{ cookiecutter.__npm_run }} compose:bootstrap` - this command will spin up the Docker Compose local environment. Particularly, it will start a container with a PostgreSQL database and execute the database migrations.
1. Run the application:
   - If you want to run the API together with Web UI application, then run `{{ cookiecutter.__npm_run }} start:dev`
   - If you want to run the API application separately, then run `{{ cookiecutter.__npx }} nx run api:start:dev`
1. Now the development API server is running on [http://localhost:3000](http://localhost:3000) and it will automatically reload if you change any of the source files.
1. The API documentation is available at [http://localhost:3000/swagger-ui](http://localhost:3000/swagger-ui).

{% include "api-commands.md" %}

{% include "api-structure.md" %}
