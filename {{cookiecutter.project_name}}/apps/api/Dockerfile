# Copyright 2024 SoftServe Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

ARG PYTHON_VERSION=3.11.7

###################
# STAGE: builder
###################

FROM python:${PYTHON_VERSION}-bookworm AS builder

ENV DEBIAN_FRONTEND=noninteractive\
    PIP_NO_BUILD_ISOLATION=no \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /code
RUN touch README.md

{%- if cookiecutter.pip == "poetry" %}

ARG POETRY_VERSION=1.7.1
RUN pip install poetry==$POETRY_VERSION

ENV POETRY_NO_INTERACTION=1 \
    POETRY_VIRTUALENVS_IN_PROJECT=1 \
    POETRY_VIRTUALENVS_CREATE=1 \
    POETRY_CACHE_DIR="/tmp/poetry_cache"

COPY pyproject.toml poetry.lock ./

# Leverages Buildkit cache mount, which instructs Buildkit to mount and manage a folder for caching reasons
# However, cache mounts are not CI friendly at the moment, as Buildkit doesn’t allow you controlling the storage location of the cache.
# See this GitHub issue: https://github.com/moby/buildkit/issues/1512
RUN --mount=type=cache,target=$POETRY_CACHE_DIR poetry run pip install --upgrade pip && \
  poetry install --without dev --no-root --no-directory

{%- elif cookiecutter.pip == "pip" %}

RUN python -m venv ./.venv
ENV PATH="/code/.venv/bin:$PATH"
RUN pip install --upgrade pip && pip install wheel

# install requirements
COPY pyproject.toml .
RUN pip install . && pip uninstall -y {{ cookiecutter.__api_package_name }}

{%- endif %}

###################
# STAGE: runner
###################

FROM python:${PYTHON_VERSION}-slim-bookworm as runner

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    VIRTUAL_ENV="/code/.venv" \
    PATH="/code/.venv/bin:$PATH" \
    PYTHONPATH="/code/{{ cookiecutter.__api_package_name }}:$PYTHONPATH"

EXPOSE 3000
WORKDIR /code/{{ cookiecutter.__api_package_name }}

COPY --from=builder ${VIRTUAL_ENV} ${VIRTUAL_ENV}

# Run initialization script that downloads and caches model tokenizers
RUN python -c "from langchain_core.language_models.base import get_tokenizer; get_tokenizer()"

COPY . /code/{{ cookiecutter.__api_package_name }}/

# Remove project metadata and dependencies files as they are not needed in the running container
{%- if cookiecutter.pip == "poetry" %}

RUN rm -rf pyproject.toml poetry.lock

{%- elif cookiecutter.pip == "pip" %}

RUN rm -rf pyproject.toml

{%- endif %}

CMD ["uvicorn", "{{ cookiecutter.__api_package_name }}.server:app", "--host", "0.0.0.0", "--port", "3000", "--log-config", "./uvicorn-logging-config.yaml"]
