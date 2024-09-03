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
"""FastAPI application entrypoint"""

from contextlib import asynccontextmanager
from typing import Annotated

from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm

from ..auth import authenticator
from ..routers import v1
from .exceptions import UnauthorizedException, exception_handlers
from .schemas import responses
from .settings import settings


@asynccontextmanager
async def lifespan(_: FastAPI):
    """Initialize and dispose the database engine when the app is starting and shutting down"""
    from .db import get_engine

    db_engine = get_engine()
    yield
    await db_engine.dispose()


app = FastAPI(
    lifespan=lifespan,
    title="{{ cookiecutter.__api_project_title }}",
    description=(
        """{{ cookiecutter.project_title }} is a conversational application (a.k.a., a chatbot) built with Generative AI LLMs"""
        """ using the [Langchain](https://python.langchain.com/docs/get_started/introduction) Python framework.

Some useful links: """
        + (
            f"\n - [{{ cookiecutter.__web_project_title|default('Application Web UI', true) }}]({settings.App.Web.url}) - the web interface for the chatbot"
            if settings.App.Web.url
            else ""
        )
        + """
- [Langchain](https://python.langchain.com/docs/get_started/introduction) - the framework used to build the assistants.
- [OpenAI API](https://platform.openai.com/docs/api-reference) - useful to investigate the API for GPT 3.5/4 LLM.
- [OpenAI Tokenizer](https://platform.openai.com/tokenizer) - useful to count the number of tokens in the text.
- [Amazon Bedrock](https://docs.aws.amazon.com/bedrock/latest/userguide/what-is-bedrock.html) - useful to get familiar with the AWS Bedrock, its models and capabilities.
- [Google VertexAI](https://cloud.google.com/vertex-ai/docs/) - useful to get familiar with the Google VertexAI, its models and capabilities.
"""
    ),
    summary="Conversational application built with Generative AI LLMs.",
    version="0.0.0",
    terms_of_service="https://www.softserveinc.com/en-us/terms-and-conditions",
    contact={
        "name": "SoftServe CoE Solutions",
        "url": "https://www.softserveinc.com/",
        "email": "coe-solutions@softserveinc.com",
    },
    license_info={
        "name": "UNLICENSED (proprietary)",
        "url": "https://en.wikipedia.org/wiki/Proprietary_software",
    },
    openapi_tags=[
        {
            "name": "health",
            "description": "Health check endpoints. Used to check if the API is running.",
        },
        {
            "name": "users",
            "description": "Operations with users. The **login** logic is also here.",
        },
        {
            "name": "chats",
            "description": "Manage chats and **converse** with the AI.",
        },
        {
            "name": "messages",
            "description": "Manage chat messages.",
        },
    ],
    openapi_url="/openapi.json",
    docs_url="/swagger-ui",
    redoc_url=None,
    exception_handlers=exception_handlers(),
    responses=responses(422),
)

origins = (
    ["*"]
    if ("*" in settings.App.Web.domains)
    else [
        *[f"https://{domain}" for domain in settings.App.Web.domains],
        *[f"http://{domain}" for domain in settings.App.Web.domains],
        *[f"https://localhost:{port}" for port in settings.App.Web.localhost_ports],
        *[f"http://localhost:{port}" for port in settings.App.Web.localhost_ports],
    ]
)

if origins:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )


@app.get(
    "/",
    tags=["health"],
    responses={
        200: {
            "description": "API is running and ready to serve requests",
            "content": {
                "application/json": {
                    "schema": {
                        "type": "object",
                        "properties": {
                            "data": {
                                "type": "object",
                                "properties": {
                                    "ok": {
                                        "type": "boolean",
                                        "example": "true",
                                        "description": "Always `true` if the API is running",
                                    },
                                },
                                "required": ["ok"],
                            },
                        },
                        "required": ["data"],
                    },
                }
            },
        },
    },
)
def root():
    """Simple status endpoint used to check if the API is running"""
    return {"data": {"ok": True}}


@app.post(
    "/oauth/token",
    tags=["users"],
    responses=(
        responses(401, 422)
        | {
            200: {
                "description": "OAuth2 token endpoint. In the scope of this project this endpoint is needed only to support the Swagger UI authorization flow. The actual login logic for the real users is implemented in the `/users/login` endpoint.",
                "content": {
                    "application/json": {
                        "schema": {
                            "type": "object",
                            "properties": {
                                "access_token": {
                                    "type": "string",
                                    "example": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
                                    "description": "OAuth2 access token",
                                },
                                "token_type": {
                                    "type": "string",
                                    "example": "bearer",
                                    "description": "OAuth2 token type",
                                },
                            },
                            "required": ["access_token", "token_type"],
                        },
                    }
                },
            },
        }
    ),
)
async def oauth_token(request: Annotated[OAuth2PasswordRequestForm, Depends()]):
    """OAuth2 token endpoint used by Swagger UI authorization flow"""
    authenticated = await authenticator.authenticate(request.username, request.password)

    if not authenticated:
        raise UnauthorizedException("Invalid user credentials")

    return {"access_token": authenticated.token, "token_type": "bearer"}


app.include_router(v1)
