# 🍪 Cookiecutter questions

When you run [`cookiecutter`](https://cookiecutter.readthedocs.io/en/stable/) CLI generator for the current template repository it will ask you a bunch of questions. The answers to these questions will be used to generate the project from the template. The last part of each question is the default value specified in parentheses. You can either accept the default value by pressing `Enter` or provide your own value.

Below you can find the list of questions that will be asked and the description of each question:

---

```
[1/11] 👀 Project title (human readable) (Example Chatbot):
```
a human readable title of the project that will be used in the documentation headings and other places. The default and the example value is `Example Chatbot`.

---

```
[2/11] 🎫 Project name (kebab-case) (example-chatbot):
```
a name of the project that will be used in the generated project directory name, Docker Compose project name and other places. By default, the generator takes the human readable project title and converts it to kebab-case. For example, if you provided `Example Chatbot` as the project title, then the default value for this question will be `example-chatbot`. Only lowercase letters, numbers, and dashes are allowed in the project name.

---

```
[3/11] 💿 PostgreSQL database name (snake_case) (example_chatbot):
```
a name of the PostgreSQL database that will be used in the generated project. By default, the generator takes the kebab-case project name and converts it to snake_case. For example, if you provided `example-chatbot` as the project name, then the default value for this question will be `example_chatbot`. Only lowercase letters, numbers, and underscores are allowed in the database name.

---

```
[4/11] 🏹 Enable PostgreSQL vector extension [y/n] (n):
```
whether to enable [pgvector](https://github.com/pgvector/pgvector) extension for the generated project. If your answer `y` (i.e., yes) then the `pgvector` PostgreSQL extension will be enabled and the generated project will be configured to use it. The default value is `n` (i.e., no).

---

```
[5/11] 🚨 Enable MyPy type checking [y/n] (y):
```
whether to enable [MyPy](https://mypy.readthedocs.io/en/stable/) type checking for the Backend API source code of the generated project. If your answer `y` (i.e., yes) then the `mypy` type checking will be enabled and the generated project will be configured to use it. The default value is `y`.

---

```
[6/11] 🐍 Python dependencies management:
  1 - poetry (recommended 👍)
  2 - pip
  Choose from [1/2] (1):
```
which Python dependencies management tool to use for the generated project. If you choose `1` (i.e., poetry) then the generated project will be configured to use [Poetry](https://python-poetry.org/) for managing Python dependencies. If you choose `2` (i.e., pip) then the generated project will be configured to use `pip` for managing Python dependencies. The default value is `1`. In general, it is recommended to use Poetry as it is a more modern and feature-rich tool that offers a lockfile to ensure repeatable installs.

---

```
[7/11] 🎡 Do you need Web UI? [y/n] (y):
```
whether you need to generate a Web UI application for the project. If your answer `y` (i.e., yes) then the generated project will be a [monorepo](https://monorepo.tools/) containing both Backend API and Web UI applications. If your answer `n` (i.e., no) then the generated project will be a single application containing only Backend API. The default value is `y`.

---

```
[8/11] 📦 Node.js package manager (if Web UI is enabled):
  1 - pnpm (fast, recommended 👍)
  2 - npm (slow... ⏳)
  Choose from [1/2] (1):
```
which Node.js package manager to use for the generated project. If you choose `1` (i.e., pnpm) then the generated project will be configured to use [pnpm](https://pnpm.io/) for managing Node.js dependencies. If you choose `2` (i.e., npm) then the generated project will be configured to use `npm` for managing Node.js dependencies. The default value is `1`. In general, it is recommended to use pnpm as it is a fast, disk space-efficient package manager and especially great for monorepos.

---

```
[9/11] 🧠 LLM provider:
  1 - Azure OpenAI (GPT-3.5, GPT-4, etc.)
  2 - Google Vertex AI (Gemini Pro, PaLM 2, etc.)
  3 - Amazon Bedrock (Anthropic Claude 2, LLaMA 2, Amazon Titan, etc.)
  Choose from [1/2/3] (1):
```
which LLM provider to use for the generated project. If you choose `1` then the generated project will be configured to use [Azure OpenAI](https://azure.microsoft.com/en-us/services/cognitive-services/openai-text-generation/), if you choose `2` then the generated project will be configured to use [Google Vertex AI](https://cloud.google.com/vertex-ai/docs/general/overview), if you choose `3` then the generated project will be configured to use [Amazon Bedrock](https://aws.amazon.com/bedrock/) for LLM capabilities. The default value is `1`. Keep in mind that you will still be able to switch to a different LLM provider later on, but the generated project will be initially configured to use the provider you choose here.

---

```
[10/11] 🚢 Container engine:
  1 - Docker (if you have a paid subscription 💰)
  2 - Podman (free, open-source 🆓)
  Choose from [1/2] (1):
```
which container engine to use for the generated project. If you choose `1` then the generated project will be configured to use [Docker](https://www.docker.com/) as a container engine, if you choose `2` then the generated project will be configured to use [Podman](https://podman.io/) as a container engine. The default value is `1`. Usually, you will want to use Docker as it is more popular and mature, but it requires a paid subscription to be able to use Docker Desktop on Mac and Windows. Podman, on the other hand, is free and open-source, but maybe not as mature and battle-tested as Docker.

---

```
[11/11] 🚀 Deployment cloud provider:
  1 - AWS (ECS, Fargate, RDS for PostgreSQL, S3, etc.)
  2 - GCP (Cloud Run, Cloud SQL for PostgreSQL, Cloud Storage, etc.)
  3 - Azure (Container Apps, PostgreSQL Flexible Server, Blob Storage, etc.)
  4 - I don't need to deploy 🚧
  Choose from [1/2/3/4] (1):
```
which cloud provider to use for the generated project. If you choose `1` then the generated project will be configured to use [AWS](https://aws.amazon.com/) as a cloud provider, if you choose `2` then the generated project will be configured to use [GCP](https://cloud.google.com/) as a cloud provider, if you choose `3` then the generated project will be configured to use [Azure](https://azure.microsoft.com/en-us/) as a cloud provider. If you choose `4` then the generated project will be configured to not use any cloud provider and will **not** contain any deployment configurations and you will either need to deploy the project on your own or run it locally. The default value is `1`.
