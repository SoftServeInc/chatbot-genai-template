-- Database initiazation script

{%- if cookiecutter.enable_pgvector %}

-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

{%- endif %}

{%- if cookiecutter.auth == "keycloak" %}

-- Create keycloak user and schema
CREATE SCHEMA keycloak;

{%- endif %}
