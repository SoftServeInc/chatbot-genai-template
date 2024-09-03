locals {
  // Load the relevant env.hcl file based on where terragrunt was invoked.
  // This works because find_in_parent_folders always works at the context of the child configuration.
  env = read_terragrunt_config(find_in_parent_folders("env.hcl")).locals.env

  // Set to "" if you don't have a domain name yet
  domain_name = "" // "api.${local.env}.example.com"

  {%- if cookiecutter.auth == "keycloak" %}

  // Set to "" if you don't have a domain name yet
  keycloak_domain_name = "" // "keycloak.${local.env}.example.com"

  {%- endif %}
}

terraform {
  source = "${path_relative_from_include()}/../../../modules/apps/api"
}

dependency "common" {
  config_path  = "../../common"
  skip_outputs = true
}

{% if cookiecutter.enable_web_ui -%}

dependency "web" {
  config_path  = "../web"
  mock_outputs = { domain_name = "" }
  enabled      = true
}

{% endif -%}

inputs = {
  env         = local.env
  domain_name = local.domain_name

  db_name            = "{{ cookiecutter.database_name }}"
  db_enable_pgvector = {{ "true" if cookiecutter.enable_pgvector else "false" }}

  {%- if cookiecutter.auth == "keycloak" %}

  keycloak_image_tag = "24.0.5"
  keycloak_hostname  = local.keycloak_domain_name

  {%- endif %}

  container_app_env_vars = {
    APP_ENV         = local.env
    APP_WEB_DOMAINS = {% if cookiecutter.enable_web_ui %}can(dependency.web) ? dependency.web.outputs.domain_name : {% endif %}""

    AUTH_PROVIDER = "{{ cookiecutter.auth }}"

    {%- if cookiecutter.auth == "local" %}

    AUTH_LOCAL_USERS_PATH = "./users.yaml"
    AUTH_LOCAL_JWT_SECRET = "SECRET:api-auth-local-jwt-secret"
    AUTH_LOCAL_JWT_TTL    = "86400"

    {%- endif %}

    DB_ECHO = "false"

    LLM_VERBOSE         = "false"
    LLM_PROVIDER        = "{{ cookiecutter.llm_provider }}"
    LLM_CHAT_MAX_TOKENS = "4096"
    LLM_TEXT_MAX_TOKENS = "4096"

    # AZURE_OPENAI_* environment variables may be removed if not using Azure OpenAI service
    AZURE_OPENAI_API_KEY         = "SECRET:api-azure-openai-api-key"
    AZURE_OPENAI_API_VERSION     = "2023-05-15"
    AZURE_OPENAI_ENDPOINT        = "SECRET:api-azure-openai-endpoint"
    AZURE_OPENAI_CHAT_MODEL      = "gpt-3.5-turbo"
    AZURE_OPENAI_CHAT_DEPLOYMENT = "SECRET:api-azure-openai-chat-deployment"
    AZURE_OPENAI_TEXT_MODEL      = "gpt-3.5-turbo"
    AZURE_OPENAI_TEXT_DEPLOYMENT = "SECRET:api-azure-openai-text-deployment"
    AZURE_OPENAI_REQUEST_TIMEOUT = "60"

    # AWS_BEDROCK_* environment variables may be removed if not using AWS Bedrock service
    AWS_BEDROCK_CHAT_MODEL_ID = "anthropic.claude-3-sonnet-20240229-v1:0"
    AWS_BEDROCK_TEXT_MODEL_ID = "anthropic.claude-v2:1"

    # GCP_* environment variables may be removed if not using GCP and Vertex AI service
    GCP_PROJECT                  = "[project-id]" // FIXME: Replace with your GCP project ID
    GCP_SERVICE_ACCOUNT_KEY_PATH = "./gcp-service-account-key.json"
    GCP_LOCATION                 = "us-central1"
    GCP_VERTEXAI_CHAT_MODEL_NAME = "chat-bison"
    GCP_VERTEXAI_TEXT_MODEL_NAME = "text-bison"
  }
}
