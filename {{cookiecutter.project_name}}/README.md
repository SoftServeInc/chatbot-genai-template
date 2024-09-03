# 🤖 {{ cookiecutter.project_title }}

_FIXME:_ Add a short description of the project here.

{%- if cookiecutter.__monorepo %}

In terms of structure, this is the mono-repository that is managed using [Nx](https://nx.dev/) build system. A [_monorepo_](https://monorepo.tools/) is a software development strategy in which the code for several projects is stored in the same repository. There are several potential advantages to a monorepo over individual repositories:

1. Ease of code reuse
1. Simplified dependency management
1. Collaboration across teams
1. Large-scale code refactoring
1. Atomic commits

## 📦 Applications and libraries

The repository contains the following applications and libraries:

- [`./apps/api`](./apps/api/README.md) - Backend API server for the chatbot written in [FastAPI](https://fastapi.tiangolo.com/).
- [`./apps/web`](./apps/web/README.md) - Frontend web application for the chatbot written in [React.js](https://reactjs.org/).
- [`./libs/ui`](./libs/ui/README.md) - UI components library (a.k.a UI Kit) for the chatbot written in [React.js](https://reactjs.org/).
- [`./libs/config`](./libs/config/README.md) - Common development tool configurations used across the repository.

{%- else %}

{% include "api-techstack.md" %}

{%- endif %}

## 🦸‍♂️ Postman collection

To make it easier to test the API, the repository contains a [Postman](https://www.postman.com/) collection with all the API endpoints, environment variables, and request examples. You can find it in the [`./postman`](./postman) directory:

- [`./postman/{{ cookiecutter.project_name }}.postman_collection.json`](./postman/{{ cookiecutter.project_name }}.postman_collection.json) - the Postman _collection_ file.
- [`./postman/{{ cookiecutter.project_name }}-local.postman_environment.json`](./postman/{{ cookiecutter.project_name }}-local.postman_environment.json) - the Postman _environment_ file for the local development environment.

{%- if cookiecutter.terraform_cloud_provider != "none" %}

## 🚀 Deployment automation

Apart from the applications and libraries, the repository contains the configuration files and scripts for automated deployment of the developed solution to the **{{ cookiecutter.terraform_cloud_provider }}** cloud provider using [Terraform](https://www.terraform.io/). To see detailed deployment instruction, please, refer to the corresponding directory:

{% if cookiecutter.terraform_cloud_provider == "aws" -%}
- 🌩️ [`./terraform/aws`](./terraform/aws/README.md)
{%- elif cookiecutter.terraform_cloud_provider == "azure" -%}
- 🌩️ [`./terraform/azure`](./terraform/azure/README.md)
{%- elif cookiecutter.terraform_cloud_provider == "gcp" -%}
- 🌩️ [`./terraform/gcp`](./terraform/gcp/README.md)
{%- endif %}

{%- endif %}

## 🛠 Software requirements

{% if cookiecutter.container_engine == "podman" -%}
- [Podman](https://podman.io/docs/installation) or [Podman Dektop](https://podman-desktop.io/downloads) if you are looking for a GUI. Make sure you have installed 4.8.0 or higher version of Podman - it is required to run the local _docker-compose_ environment. Check the version using `podman --version` command. To install the latest version of Podman on Ubuntu, you may need to use [_Debian_ Kubic repository](https://podman.io/docs/installation#debian).
- **IMPORTANT**: If you have _Docker Desktop_ installed and you use SoftServe machine to run the project, but you don't have a Docker license, then you have to remove Docker completely from your machine. You can do that executing the CLI commands mentioned in [this StackOverflow answer](https://stackoverflow.com/a/65468254). Otherwise, it will prevent Docker Compose standalone (see below) from working properly.
- [Docker Compose](https://docs.docker.com/compose/install/standalone/) (standalone), if you don't have Docker installed on your machine (see the previous step). Docker Compose _standalone_ does not require a paid Docker subscription since you do NOT install Docker Desktop. For _Mac OS_ users, unfortunately the official documentation does not mention the instructions to install a standalone version of Docker Compose, but you can do it similarly to the _Linux_ installation instructions, but using a different release asset file, for example:
  ```sh
  # For Mac OS on Intel CPU
  sudo curl -SL https://github.com/docker/compose/releases/download/v2.24.0/docker-compose-darwin-x86_64 -o /usr/local/bin/docker-compose

  # For Mac OS on Apple Silicon CPU
  sudo curl -SL https://github.com/docker/compose/releases/download/v2.24.0/docker-compose-darwin-aarch64 -o /usr/local/bin/docker-compose
  ```
  then make it executable:
  ```sh
  sudo chmod +x /usr/local/bin/docker-compose
  ```
{%- else -%}
- [Docker](https://docs.docker.com/get-docker/) v21.0.0 or higher. Make sure you have a paid Docker subscription if you are using _Docker Desktop_ on MacOS or Windows.
{%- endif %}
- [Python](https://www.python.org/downloads/) v3.11.7. It is recommended (but not required) to use [pyenv](https://github.com/pyenv/pyenv) to manage Python versions.
{%- if cookiecutter.pip == "poetry" %}
- [Poetry](https://python-poetry.org/docs/#installation) v1.6.1 or higher.
{%- endif %}
{%- if cookiecutter.enable_web_ui %}
- [Node.js](https://nodejs.org/en/download/) v21.2.0 or higher (it is recommended to use [nvm](https://github.com/nvm-sh/nvm) to manage Node.js versions)
{%- if cookiecutter.npm == "pnpm" %}
- [pnpm](https://pnpm.io/installation) v9.3.0 or higher, the recommended way to install it is using `corepack`:
  ```sh
  corepack enable
  corepack prepare pnpm@latest --activate
  ```
  or you can do it using [`npm`](https://pnpm.io/installation#using-npm), [Homebrew](https://pnpm.io/installation#using-homebrew) or any other method described in the [installation instructions](https://pnpm.io/installation).
  > **NOTE:** At the moment there is [a known issue](https://github.com/pnpm/pnpm/issues/7303) with the latest version of `pnpm` on Windows getting identified as malware by Windows Defender. If you are using Windows, please ignore the warning and add `pnpm` to the list of exceptions in Windows Defender.
{%- endif %}
{%- endif %}
{%- if cookiecutter.terraform_cloud_provider != "none" %}
- [Terrafom](https://developer.hashicorp.com/terraform/install) v1.6.5 or higher. It is required if you want to run the deployment automation scripts from your local machine or if you intend to edit the terraform configurations.
- [Terragrunt](https://terragrunt.gruntwork.io/docs/getting-started/install/) v0.53.8 or higher. It is required if you want to run the deployment automation scripts from your local machine or if you intend to edit the terraform configurations.
{%- if cookiecutter.terraform_cloud_provider == "aws" %}
- [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html) v2.1.0 or higher. It is required if you want to run the [AWS deployment scripts](./terraform/aws/README.md) from your local machine or if you intend to use Amazon Bedrock service as an LLM provider (see, [./apps/api/.env](./apps/api/.env) file for LLM configurations).
{%- elif cookiecutter.terraform_cloud_provider == "azure" %}
- [Azure CLI](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli) v2.55.0 or higher. It is required only if you want to run the [Azure deployment scripts](./terraform/azure/README.md).
{%- elif cookiecutter.terraform_cloud_provider == "gcp" %}
- [Google Cloud CLI](https://cloud.google.com/sdk/docs/install-sdk) v457.0.0 or higher. It is required only if you want to run the [GCP deployment scripts](./terraform/gcp/README.md) from your local machine or if you intend to use Vertex AI service as an LLM provider (see, [./apps/api/.env](./apps/api/.env) file for LLM configurations).
{%- endif %}
{%- endif %}

## 🏃‍♂️ How to run it locally

1. Clone this repository.
1. Go to the project's root directory.
1. _If you use **`pyenv`**_: Run `pyenv install` to install the correct Python version.
1. _If you use **`pyenv`**_: Run `pyenv local` to use the correct Python version.

{%- if cookiecutter.enable_web_ui %}
1. _If you use **`nvm`**_: Run `nvm install` to install the correct Node.js version.
1. _If you use **`nvm`**_: Run `nvm use` to use the correct Node.js version.
1. Run `{{ cookiecutter.npm }} install` to install all the project's dependencies. On Windows, you shoul run this command in the terminal launched  "_as Administrator_", otherwise `{{ cookiecutter.npm }}` won't be able to create symbolic links.
{%- if cookiecutter.auth == "keycloak" %}
1. Add initial Keycloak users to the [`./apps/api/docker-compose.keycloak-realm.json`](./apps/api/docker-compose.keycloak-realm.json) file (see for the `"users"` key).
{%- elif cookiecutter.auth == "local" %}
1. Add whatever users you want to the [`./apps/api/users.yaml`](./apps/api/users.yaml) file.
{%- endif %}
1. Fill in the required environment variables in the [`./apps/api/.env`](./apps/api/.env) file.
1. Fill in the required environment variables in the [`./apps/web/.env`](./apps/web/.env) file.
1. Run `{{ cookiecutter.__npm_run }} compose:bootstrap` to bootstrap the local docker (podman) compose environment that runs the PostgreSQL database.
1. Run `{{ cookiecutter.__npm_run }} start:dev` to start applications in development mode.
1. Open [http://localhost:3000](http://localhost:3000) with your browser to see the API up and running.
1. Open [http://localhost:3000/swagger-ui](http://localhost:3000/swagger-ui) with your browser to see the API documentation.
1. Open [http://localhost:3030](http://localhost:3030) with your browser to see the Web UI up and running.
{%- if cookiecutter.auth == "keycloak" %}
1. Open [http://localhost:8000/admin/app/console/](http://localhost:8000/admin/app/console/) with your browser to see the Keycloak admin console for the application realm. The default admin credentials are `admin`/`admin`.
{%- endif %}

### 📕 If you want to run UI Storybook

1. Run `{{ cookiecutter.__npx }} nx run ui:storybook:start` to start [Storybook](https://storybook.js.org/) in the development mode.
1. Open [http://localshost:3033](http://localshost:3033) to preview UI components.

{%- else %}
1. Run `python run install` to install all the project's dependencies.
{%- if cookiecutter.auth == "keycloak" %}
1. Add initial Keycloak users to the [`./docker-compose.keycloak-realm.json`](./docker-compose.keycloak-realm.json) file (see for the `"users"` key).
{%- elif cookiecutter.auth == "local" %}
1. Add whatever users you want to the [`./users.yaml`](./users.yaml) file.
{%- endif %}
1. Fill in the required environment variables in the [`./.env`](./.env) file.
1. Run `python run compose:bootstrap` - this command will spin up the Docker Compose local environment. Particularly, it will start a container with a PostgreSQL database and execute the database migrations.
1. Run `python run start:dev` to start the API server in development mode.
1. Now the development API server is running on [http://localhost:3000](http://localhost:3000) and it will automatically reload if you change any of the source files.
1. The API documentation is available at [http://localhost:3000/swagger-ui](http://localhost:3000/swagger-ui).
{%- if cookiecutter.auth == "keycloak" %}
1. The Keycloak admin console is available at [http://localhost:8000/admin/app/console/](http://localhost:8000/admin/app/console/). The default admin credentials are `admin`/`admin`.
{%- endif %}

{%- endif %}

{%- if cookiecutter.__monorepo %}

## 📜 Available CLI commands

- `{{ cookiecutter.__npm_run }} compose:up` - start up the local docker-compose environment.{% if cookiecutter.container_engine == "podman" %} Keep in mind that if you use Podman on MacOS or Windows, sometimes the Podman VM may get stuck and you will need to restart it manually using the `podman machine stop && podman machine start` command. {%- endif %}
- `{{ cookiecutter.__npm_run }} compose:down` - shut down the local docker-compose environment.
- `{{ cookiecutter.__npm_run }} compose:remove` - shut down, and remove containers and volumes of the local docker-compose environment.
- `{{ cookiecutter.__npm_run }} compose:bootstrap` - clean-up, re-configure, and re-start the local environment from scratch.
- `{{ cookiecutter.__npm_run }} start:dev` - starts all applications in development mode.
- `{{ cookiecutter.__npm_run }} start` - starts all applications in production mode.
- `{{ cookiecutter.__npm_run }} build` - builds all applications.
- `{{ cookiecutter.__npm_run }} clean` - removes all previously generated build files and caches.
- `{{ cookiecutter.__npm_run }} test` - run unit tests for all applications and libraries.
- `{{ cookiecutter.__npm_run }} lint` - run code linting for all applications and libraries.
- `{{ cookiecutter.__npm_run }} lint:fix` - run code linting and try to fix the detected problems for all applications and libraries.
- `{{ cookiecutter.__npm_run }} format` - format the code according to `prettier` configurations for JS applications and libraries.
- `{{ cookiecutter.__npm_run }} deps:remove` - remove all installed dependencies (`node_module`, `.venv`) for all applications and libraries.
- `{{ cookiecutter.__npm_run }} deps:reinstall` - remove and reinstall dependencies for all applications and libraries.
- `{{ cookiecutter.__npm_run }} deps:update` - remove installed python and npm dependencies, remove `{{ cookiecutter.__npm_lock }}`{% if cookiecutter.pip == "poetry" %} and `poetry.lock`{% endif %}, and reinstall dependencies for all applications and libraries; as a result of this command all project dependencies will be updated to the latest possible versions according to the version constraints specified in `package.json` and `pypoject.yaml` files.

As you might notice, most of the above commands are executed for all applications and libraries at once. However, sometimes you may want to run a command for a specific application or a library. To do that use the syntax:

```sh
{{ cookiecutter.__npx }} nx run "<application_or_library_name>:<command>"
```

For example:

- `{{ cookiecutter.__npx }} nx run api:migration:upgrade` - run migrations for the `api` application.
- `{{ cookiecutter.__npx }} nx run api:lint` - run code linting for the `api` application.
- `{{ cookiecutter.__npx }} nx run web:build` - build the `web` application.
- `{{ cookiecutter.__npx }} nx run ui:storybook:build` - build [Storybook](https://storybook.js.org/) for the `ui` application.

{%- else %}

{% include "api-commands.md" %}

{% include "api-structure.md" %}

{%- endif %}

## 🪝 Git hooks

{%- if cookiecutter.__monorepo %}

The repository is configured to use 🐾 [husky](https://typicode.github.io/husky/#/) to manage Git hooks. Currently, the following hooks are configured:

1. [`.husky/pre-commit`](.husky/pre-commit):
   - run code linting and formatting for all staged files, trying to fix the detected problems automatically. Under the hood, it uses [lint-staged](https://github.com/lint-staged/lint-staged) package.
1. [`.husky/pre-push`](.husky/pre-push):
   - run code linting for all applications and libraries.
   - run unit tests for all applications and libraries.

{%- else %}

The repository is configured to use 🅿️ [pre-commit](https://pre-commit.com/) to manage Git hooks. In fact, `pre-commit` module supports many different types of git hooks (not just pre-commit). At the moment it configures `pre-commit` and `pre-push` hooks to run unit tests, linting and formatting of python code. See the [`.pre-commit-config.yaml`](.pre-commit-config.yaml) file for more details. Also, please refer to the [pre-commit documentation](https://pre-commit.com/) to learn how to use it.

{%- endif %}

Feel free to add, disable or modify the git hooks according to your needs.
