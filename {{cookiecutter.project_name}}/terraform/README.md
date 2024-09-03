# 🌩 {{ cookiecutter.__terraform_cloud_provider_title }} Terraform Deployment (IaC)

This directory contains the Terraform configuration files for deploying the application to [{{ cookiecutter.__terraform_cloud_provider_title_long }}]({{ cookiecutter.__terraform_cloud_provider_url }}). The configuration files are organized into two top-level directories:

- `envs` contains the configuration files for the different environments (`dev`, `qa`, `prod`). Under the hood, it uses [Terragrunt](https://terragrunt.gruntwork.io/) to reduce code duplication, modularize configurations, and keep them DRY. Each environment consists of 3 modules deployed to it:

  - `common` - see `modules/common` description below.
  - `api` - see `modules/apps/api` description below.
  {%- if cookiecutter.enable_web_ui %}
  - `web` - see `modules/apps/web` description below.
  {%- endif %}

  Most of the input variables for the modules are templated at the level of the generic environment configuration files [`./envs/_env/`](./envs/_env/). For example, take a look at the `inputs` declared in the [`./envs/_env/apps/api.hcl`](./envs/_env/apps/api.hcl) file. However, you can always create environment-specific configurations by going to `./envs/<env-name>/apps/{{ '{app,web}' if cookiecutter.enable_web_ui else 'api' }}/terragrunt.hcl` or `./envs/<env-name>/common/terragrunt.hcl` and overriding the input variables there. For example, take a look at the [`./envs/dev/apps/api/terragrunt.hcl`](./envs/dev/apps/api/terragrunt.hcl) file.

- `modules` contains the configuration files for the different modules that make up the infrastructure. The modules are reusable and used to deploy the applications to different environments. There are the following modules:
  - `common` contains the deployment configuration files for the common infrastructure. This includes the
  {%- if cookiecutter.terraform_cloud_provider == "aws" %} VPC, Subnets, Security Groups, ECR, ACM Certificates, Route 53 Certificate Verification Records,
  {%- elif cookiecutter.terraform_cloud_provider == "azure" %} Resource Group, Container App Environment, Container Registry, Key Vault,
  {%- elif cookiecutter.terraform_cloud_provider == "gcp" %} Artifact Registry (Docker Repository), Google Certificate Manager (GCM) Certificates, Cloud DNS Zone Verification Records,
  {%- endif %} etc. Take a look at the [`./modules/common/variables.tf`](./modules/common/variables.tf) file to see the list of input variables that can be used to customize and configure the deployment.
  - `apps/api` contains the deployment configuration files for the `api` application. Take a look at the [`./modules/apps/api/variables.tf`](./modules/apps/api/variables.tf) file to see the list of input variables that can be used to customize and configure the deployment.
  {%- if cookiecutter.enable_web_ui %}
  - `apps/web` contains the deployment configuration files for the `web` application. Take a look at the [`./modules/apps/web/variables.tf`](./modules/apps/web/variables.tf) file to see the list of input variables that can be used to customize and configure the deployment.
  {%- endif %}

However, you should not deploy the infrastructure directly using the Terraform/Terragrunt CLI. Instead, you should use the [`run`](./run) script running it from the current directory. The `run` script is a Python script designed to automate the deployment of your application - both infrastructure and code - to the {{ cookiecutter.__terraform_cloud_provider_title }} cloud.

## 🛠 Prerequisites

Before you can deploy the application to {{ cookiecutter.__terraform_cloud_provider_title }}, you must first install the following tools:

- [Terraform](https://www.terraform.io/downloads.html)
- [Terragrunt](https://terragrunt.gruntwork.io/docs/getting-started/install/)
{%- if cookiecutter.terraform_cloud_provider == "aws" %}
- [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html)
{%- elif cookiecutter.terraform_cloud_provider == "azure" %}
- [Azure CLI](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli)
{%- elif cookiecutter.terraform_cloud_provider == "gcp" %}
- [Google Cloud CLI](https://cloud.google.com/sdk/docs/install-sdk)
{%- endif %}
- Other project dependencies, like `python`,{% if cookiecutter.enable_web_ui %} `node.js`, `{{ cookiecutter.npm }}`,{% endif %} `{{ cookiecutter.container_engine }}`, etc. - see [README.md](../../README.md)

### 🔐 {{ cookiecutter.__terraform_cloud_provider_title }} Credentials

{%- if cookiecutter.terraform_cloud_provider == "aws" %}

The `run` script uses the `aws` CLI to interact with AWS. Therefore, you must configure the AWS CLI with your AWS credentials. You can do this by running the `aws configure` command and following the prompts. If you have multiple AWS profiles, you can specify the profile to use by setting the `AWS_PROFILE` environment variable before running the `run` script. For example:

```sh
# Linux / MacOS
export AWS_PROFILE=softserve
```

```powershell
# Windows
$env:AWS_PROFILE = 'softserve'
```

Alternatively, you can specify the profile to use by passing the `--aws-profile` option every time you call the `run` script. For example:

```sh
python run ... --aws-profile softserve
```

{%- elif cookiecutter.terraform_cloud_provider == "azure" %}

The `run` script uses the `az` CLI to interact with Azure. Therefore, you must configure the Azure CLI with your Azure credentials. The easiest way to do this is to run the following command:

```sh
az login
```

which will open a browser window and ask you to log in to your Azure account. After you log in, the credentials will be saved to the `~/.azure/` folder. For convenience, you can also specify the Azure subscription ID to use by default by running the following command:

```sh
az account set --subscription <SUBSCRIPTION_ID>
```

where `<SUBSCRIPTION_ID>` is the UUID of the Azure subscription to use by default. You can find the list of your subscriptions by running the following command:

```sh
az account list --output table
```

Apart from the above, it is recommended to create and use a service principal credentials for Terraform automation, instead of using your personal credentials. To do this, run the following command:

```sh
az ad sp create-for-rbac --display-name <SERVICE_PRINCIPAL_DISPLAY_NAME> --role Contributor --scopes /subscriptions/<SUBSCRIPTION_ID>
```

where `<SERVICE_PRINCIPAL_DISPLAY_NAME>` is the display name of the service principal to create (for example, `acme-chatbot-terraform`) and `<SUBSCRIPTION_ID>` is the UUID of the Azure subscription to use. After the command completes, it will output the following information:

```sh
{
  "appId": "<SERVICE_PRINCIPAL_CLIENT_ID>",
  "displayName": "<SERVICE_PRINCIPAL_DISPLAY_NAME>",
  "password": "<SERVICE_PRINCIPAL_CLIENT_SECRET>",
  "tenant": "<TENANT_ID>"
}
```

Then use the above information to set the following environment variables:

```sh
export ARM_CLIENT_ID=<SERVICE_PRINCIPAL_CLIENT_ID>
export ARM_CLIENT_SECRET=<SERVICE_PRINCIPAL_CLIENT_SECRET>
export ARM_SUBSCRIPTION_ID=<SUBSCRIPTION_ID>
export ARM_TENANT_ID=<TENANT_ID>
```

{%- elif cookiecutter.terraform_cloud_provider == "gcp" %}

The `run` script uses the `gcloud` CLI to interact with GCP. Therefore, you must configure the Google Cloud CLI with your GCP credentials. The easiest way to do this is to run the following commands:

1. `gcloud auth login` - this command obtains your credentials via a web flow and stores them in `~/.config/gcloud/credentials.db`. Now you can run `gcloud` CLI commands from your terminal and it will find your credentials automatically.
1. `gcloud config set project <project-id>` - this command sets the default project for the `gcloud` CLI. Replace `<project-id>` with the ID of your GCP project.
1. `gcloud auth application-default login` - this command obtains your credentials via a web flow and stores them in `~/.config/gcloud/application_default_credentials.json`. Now any code/SDK you run will be able to find the credentials automatically.
1. `gcloud auth application-default set-quota-project <project-id>` - this command sets the default project for the application default credentials. Replace `<project-id>` with the ID of your GCP project.

Alternatively, if you have a service account key file, you can place it to one of the following locations:

- `envs/credentials.json` - will be used by the `run` script to authenticate with GCP for all environments and application deployments.
- `envs/{dev,qa,prod}/credentials.json` - will be used by the `run` script to authenticate with GCP for deployments of all application within the specified environment.
- `envs/{dev,qa,prod}/common/credentials.json` - will be used by the `run` script to authenticate with GCP for deployments of the common infrastructure within the specified environment.
- `envs/{dev,qa,prod}/apps/{{ '{app,web}' if cookiecutter.enable_web_ui else 'api' }}/credentials.json` - will be used by the `run` script to authenticate with GCP for deployments of the specified application within the specified environment.

However, keep in mind that the service account must have the following roles assigned to it:

- `roles/aiplatform.admin`
- `roles/artifactregistry.admin`
- `roles/cloudsql.admin`
- `roles/compute.admin`
- `roles/run.admin`
- `roles/secretmanager.admin`
- `roles/certificatemanager.owner`

{%- endif %}
{%- if cookiecutter.terraform_cloud_provider in ("aws", "gcp") %}

### 🛡 API Secrets

{%- if cookiecutter.terraform_cloud_provider == "aws" %}

Before deploying `api` application, you must first create secrets in AWS Secrets Manager referenced in the `envs/_env/apps/api.hcl` file - look for environment variables there, whose value is `SECRET:<secret-name>:<secret-key>` (if it is a JSON secret) or `SECRET:<secret-name>` (if it is a plain text secret). _For example_, if there are values like:

```sh
AZURE_OPENAI_API_KEY         = "SECRET:/{{ cookiecutter.project_name }}-${local.env}/api/azure-openai:api-key"
AZURE_OPENAI_ENDPOINT        = "SECRET:/{{ cookiecutter.project_name }}-${local.env}/api/azure-openai:endpoint"
AZURE_OPENAI_CHAT_DEPLOYMENT = "SECRET:/{{ cookiecutter.project_name }}-${local.env}/api/azure-openai:chat-deployment"
AZURE_OPENAI_TEXT_DEPLOYMENT = "SECRET:/{{ cookiecutter.project_name }}-${local.env}/api/azure-openai:text-deployment"
```

then to create the secret named `/{{ cookiecutter.project_name }}-dev/api/azure-openai`, you can run the following command:

```sh
aws secretsmanager create-secret \
    --profile softserve \
    --region us-east-1 \
    --name "/{{ cookiecutter.project_name }}-dev/api/azure-openai" \
    --description "Azure OpenAI credentials" \
    --secret-string '{"api-key": "...", "endpoint": "...", "chat-deployment": "...", "text-deployment": "..."}'
```

Also, there may be a reference to a parameter store variable in the `envs/_env/apps/api.hcl` file - look for environment variables there whose value is `PARAMETER:<parameter-name>`. _For example_, if there is a value like:

```sh
GCP_PROJECT = "PARAMETER:/{{ cookiecutter.project_name }}-${local.env}/api/gcp-project"
```

then to create the parameter named `/{{ cookiecutter.project_name }}-dev/api/gcp-project`, you can run the following command:

```sh
aws ssm put-parameter \
    --profile softserve \
    --region us-east-1 \
    --name "/{{ cookiecutter.project_name }}-dev/api/gcp-project" \
    --description "GCP Project ID" \
    --type SecureString \
    --value "<gcp-project-id>"
```

{%- elif cookiecutter.terraform_cloud_provider == "gcp" %}

Before deploying `api` application, you must first create secrets in Google Cloud Secrets Manager referenced in the `envs/_env/apps/api.hcl` file - look for environment variables there, whose value is `SECRET:<secret-name>`. _For example_, if there are values like:

```sh
AZURE_OPENAI_API_KEY         = "SECRET:{{ cookiecutter.project_name }}-${local.env}-api-azure-openai-api-key"
AZURE_OPENAI_ENDPOINT        = "SECRET:{{ cookiecutter.project_name }}-${local.env}-api-azure-openai-endpoint"
AZURE_OPENAI_CHAT_DEPLOYMENT = "SECRET:{{ cookiecutter.project_name }}-${local.env}-api-azure-openai-chat-deployment"
AZURE_OPENAI_TEXT_DEPLOYMENT = "SECRET:{{ cookiecutter.project_name }}-${local.env}-api-azure-openai-text-deployment"
```

then to create the secret named `{{ cookiecutter.project_name }}-dev-api-azure-openai-api-key`, you can run the following command:

```sh
# Linux / MacOS
printf "1111111111111..." | gcloud secrets create {{ cookiecutter.project_name }}-dev-api-azure-openai-api-key \
  --project=<project-id> \
  --replication-policy=user-managed \
  --locations=us-central1 \
  --data-file=-
```

```powershell
# Windows
Write-Output "1111111111111..." | gcloud secrets create {{ cookiecutter.project_name }}-dev-api-azure-openai-api-key \
  --project=<project-id> \
  --replication-policy=user-managed \
  --locations=us-central1 \
  --data-file=-
```

{%- endif %}

{%- endif %}

## 🚦 Terraform variables

You may need to revisit the `terragrunt.hcl` configuration files in the `envs` directory and update the values of the Terraform input variables there:

- [`./envs/terragrunt.hcl`](./envs/terragrunt.hcl) - contains shared input variables for all environments and applications, like
{%- if cookiecutter.terraform_cloud_provider == "aws" %} `region`, `route53_zone_name`, `project`, etc.
{%- elif cookiecutter.terraform_cloud_provider == "azure" %} `region`, `subscription_id`, `project`, `dns_zone_name`, etc.
{%- elif cookiecutter.terraform_cloud_provider == "gcp" %} `region`, `dns_zone_name`, `gcp_project_id`, `project`, etc.
{%- endif %}
- [`./envs/_env/common.hcl`](./envs/_env/common.hcl) and [`./envs/{dev,qa,prod}/common/terragrunt.hcl`](./envs/dev/common/terragrunt.hcl) - contains the input variables for the common infrastructure. Take a look at the [`./modules/common/variables.tf`](./modules/common/variables.tf) file to see the list of input variables that can be used to customize and configure the deployment.
- [`./envs/_env/apps/api.hcl`](./envs/_env/apps/api.hcl) and [`./envs/{dev,qa,prod}/apps/api/terragrunt.hcl`](./envs/dev/apps/api/terragrunt.hcl) - contains the input variables for the `api` application. Take a look at the [`./modules/apps/api/variables.tf`](./modules/apps/api/variables.tf) file to see the list of input variables that can be used to customize and configure the deployment.
{%- if cookiecutter.enable_web_ui %}
- [`./envs/_env/apps/web.hcl`](./envs/_env/apps/web.hcl) and [`./envs/{dev,qa,prod}/apps/web/terragrunt.hcl`](./envs/dev/apps/web/terragrunt.hcl) - contains the input variables for the `web` application. Take a look at the [`./modules/apps/web/variables.tf`](./modules/apps/web/variables.tf) file to see the list of input variables that can be used to customize and configure the deployment.
{%- endif %}

## 🌐 Domain name

{%- if cookiecutter.terraform_cloud_provider == "aws" %}

{%- if cookiecutter.enable_web_ui %}

> **IMPORTANT:** If you don't specify the domain name for the API and Web applications, then you will have to use the ALB load balancer DNS name to access the API and CloudFront distribution DNS name to access the Web application. You can find the DNS names in the Terraform output after the deployment.

{%- else %}

> **IMPORTANT:** If you don't specify the domain name for the API application, then you will have to use the ALB load balancer DNS name to access the the API. You can find the DNS name in the Terraform output after the deployment.

{%- endif %}
>
> However, keep in mind that in this case the API will be accessible via HTTP **only**, because AWS ALB (unlike CloudFront) does not provide a default SSL certificate.
>
> Alternatively, you can enable a self-signed certificate for API ALB via setting `enable_https_self_signed` to `true` in `./envs/_env/apps/api.hcl` file or per environment in `./envs/<env-name>/apps/api/terragrunt.hcl` file. But because the self-signed SSL certificate is used, you will have to disable SSL verification for the ALB domain in your API client (e.g., Postman) or in your browser to be able to access the API - for example, after the successful deployment navigate to `https://<alb-name-id>.us-east-1.elb.amazonaws.com/` in your browser and accept the self-signed certificate.

If you want to use your own domain name, you must first create a Route 53 hosted zone for it. Then the following configurations will need to be done:

1. Go to [`./envs/terragrunt.hcl`](./envs/terragrunt.hcl) and update the value of the `route53_zone_name` variable there to match the name of your hosted zone - for example, set it to `example.com`. This step is needed if you want Terraform to automatically create and manage DNS records for API and Web services deployed to your environment. If you are going to create and manage DNS records manually, you can skip this step.

1. Go to [`./envs/_env/common.hcl`](./envs/_env/common.hcl) and update the value of the `acm_domain_name` variable there - for example, set it to `"${local.env}.example.com"` - this will be the base domain name of the wildcard ACM certificate that will be created per environment. This step is needed if you want the SSL certificate to be automatically created and managed by Terraform. If you are going to create and upload them to ACM manually, you can skip this step.

1. Go to [`./envs/_env/apps/api.hcl`](./envs/_env/apps/api.hcl) and update the value of the `domain_name` variable there - for example, set it to `"api.${local.env}.example.com"` - this will be the domain name of the deployed API service. If you want to use the automatically created ACM certificate, you must use the domain name that matches the wildcard domain name of the ACM certificate created in the previous step. However, if you create and upload the ACM certificate manually, then you should also specify `acm_certificate_arn` input variable with the ARN of the ACM certificate.

{%- if cookiecutter.enable_web_ui %}

1. Go to [`./envs/_env/apps/web.hcl`](./envs/_env/apps/web.hcl) and update the value of the `domain_name` variable there - for example, set it to `"${local.env}.example.com"` - this will be the domain name of the deployed Web application. If you want to use the automatically created ACM certificate, you must use the domain name that matches the wildcard domain name of the ACM certificate created in the previous step. However, if you create and upload the ACM certificate manually, then you should also specify `acm_certificate_arn` input variable with the ARN of the ACM certificate.

{%- endif %}

{%- elif cookiecutter.terraform_cloud_provider == "azure" %}

If you want to use your own domain name, you must first create a Azure DNS zone for it. The DNS zone must be created in the same subscription as the one you are going to use for the deployment and it must belong to the resource group whose name is specified by the `project_resource_group_name` local variable in the [`./envs/terragrunt.hcl`](./envs/terragrunt.hcl) file. Then the following configurations will need to be done:

1. Go to [`./envs/terragrunt.hcl`](./envs/terragrunt.hcl) and update the value of the `dns_zone_name` variable there to match the name of your DNS zone name - for example, set it to `example.com`. This step is needed if you want Terraform to automatically create and manage DNS records for API and Web services deployed to your environment. If you are going to create and manage DNS records manually, you can skip this step.

1. Go to [`./envs/_env/apps/api.hcl`](./envs/_env/apps/api.hcl) and update the value of the `domain_name` variable there - for example, set it to `"api.${local.env}.example.com"` - this will be the domain name of the deployed API service. It must be a subdomain of the DNS zone domain name, if `dns_zone_name` is specified in the `./envs/terragrunt.hcl` file (step 1).

{%- if cookiecutter.enable_web_ui %}

1. Go to [`./envs/_env/apps/web.hcl`](./envs/_env/apps/web.hcl) and update the value of the `domain_name` variable there - for example, set it to `"${local.env}.example.com"` - this will be the domain name of the deployed Web application. It must be a subdomain of the DNS zone domain name, if `dns_zone_name` is specified in the `./envs/terragrunt.hcl` file (step 1).

{%- endif %}

{%- elif cookiecutter.terraform_cloud_provider == "gcp" %}

{%- if cookiecutter.enable_web_ui %}
> **IMPORTANT:** If you don't specify the domain names for the API and Web applications, then you will have to use the public IP address of the ALB to access the API as well as IP addrress of another ALB to access the Web application. You can find the IP addresses of the created ALBs in the Terraform output after the deployment.
{%- else %}
> **IMPORTANT:** If you don't specify the domain name for the API applications, then you will have to use the public IP address of the ALB to access the API. You can find the IP address of the created ALB in the Terraform output after the deployment.
{%- endif %}
>
> However, keep in mind that in this case the {{ 'API and Web applications' if cookiecutter.enable_web_ui else 'API application' }} will be accessible via HTTP only, because ALB does not provide a default SSL certificate.

If you want to use your own domain name, you must first create a Cloud DNS hosted zone for it. Then the following configurations will need to be done:

1. Go to [`./envs/terragrunt.hcl`](./envs/terragrunt.hcl) and update the value of the `dns_zone_name` variable there to match the name of your DNS zone name - for example, set it to `example.com`. This step is needed if you want Terraform to automatically create and manage DNS records for API and Web services deployed to your environment. If you are going to create and manage DNS records manually, you can skip this step.

1. Go to [`./envs/_env/common.hcl`](./envs/_env/common.hcl) and update the value of the `gcm_domain_name` variable there - for example, set it to `"${local.env}.example.com"` - this will be the base domain name of the wildcard certificate created in Google Certificate Manager (GCM) per environment. This step is needed if you want the SSL certificate to be automatically created and managed by Terraform. If you are going to create and upload them to Google Certificate Manager manually, you can skip this step.

1. Go to [`./envs/_env/apps/api.hcl`](./envs/_env/apps/api.hcl) and update the value of the `domain_name` variable there - for example, set it to `"api.${local.env}.example.com"` - this will be the domain name of the deployed API service. If you want to use the automatically created certificate, you must use the domain name that matches the wildcard domain name of the certificate created in the previous step. However, if you create and upload the certificate to Google Certificate Manager manually, then you should also specify `gcm_certificate_id` input variable with the ID of the certificate stored in Google Certificate Manager.

{%- if cookiecutter.enable_web_ui %}

1. Go to [`./envs/_env/apps/web.hcl`](./envs/_env/apps/web.hcl) and update the value of the `domain_name` variable there - for example, set it to `"${local.env}.example.com"` - this will be the domain name of the deployed Web application. If you want to use the automatically created certificate, you must use the domain name that matches the wildcard domain name of the certificate created in the previous step. However, if you create and upload the certificate to Google Certificate Manager manually, then you should also specify `gcm_certificate_id` input variable with the ID of the certificate stored in Google Certificate Manager.

{%- endif %}

{%- endif %}

## 🚀 Initial deployment instructions

After you have fulfilled the prerequisites, you can deploy the application to {{ cookiecutter.__terraform_cloud_provider_title }} by running the `run` script. The first deployment should be done in the following order:

{%- if cookiecutter.terraform_cloud_provider == "azure" %}

1. Unfortunately, Terragrunt does not support [automatic creation of Azure resources](https://terragrunt.gruntwork.io/docs/features/keep-your-remote-state-configuration-dry/#create-remote-state-and-locking-resources-automatically) needed to store Terraform state. However, the `run` script contains the logic allowing to create all required resources automatically. To do this, run the following command:

   ```sh
   python run create-terraform-backend
   ```

   As a result of this command the following resources will be created within Azure subscription specified by the `subscription_id` input variable and in the region specified by the `region` input variable in the `./envs/terragrunt.hcl`:

   - Resource group whose name is specified by the `project_resource_group_name` local variable in the `./envs/terragrunt.hcl` file. If the resource group already exists, it will be used as is.
   - Storage account whose name is specified by the `project_storage_account_name` local variable in the `./envs/terragrunt.hcl` file. If the storage account already exists, it will be used as is.
   - Storage container whose name is specified by the `project_storage_tfstate_container_name` local variable in the `./envs/terragrunt.hcl` file. If the storage container already exists, it will be used as is.

{%- endif %}

1. Deploy the common infrastructure by running the following command:

   ```sh
   python run apply --env <environment> --common
   ```

   Replace `<environment>` with the name of the environment to which you want to deploy. The `--common` option tells the script to deploy the common infrastructure.

   {%- if cookiecutter.terraform_cloud_provider == "azure" %}

   Upon successful deployment of the common infrastructure, the Azure Key Vault resource named `kv-{{ cookiecutter.project_name }}-<environment>` has been created. You should now add the secrets to it which are referenced in the `envs/_env/apps/api.hcl` file - look for environment variables there, whose value is `SECRET:<secret-name>`. _For example_, if there are values like:

   ```sh
   AZURE_OPENAI_API_KEY         = "SECRET:api-azure-openai-api-key"
   AZURE_OPENAI_ENDPOINT        = "SECRET:api-azure-openai-endpoint"
   AZURE_OPENAI_CHAT_DEPLOYMENT = "SECRET:api-azure-openai-chat-deployment"
   AZURE_OPENAI_TEXT_DEPLOYMENT = "SECRET:api-azure-openai-text-deployment"
   ```

   then to create the secret named `api-azure-openai-api-key`, you can run the following command:

   ```sh
   az keyvault secret set \
     --vault-name "kv-{{ cookiecutter.project_name }}-<environment>" \
     --name "api-azure-openai-api-key" \
     --value "1111111111111..."
   ```

   {%- endif %}

{%- if cookiecutter.enable_web_ui %}

1. Deploy the Web UI application infrastructure (without deploying the application _code_ yet) by running the following command:

   ```sh
   python run apply --env <environment> --app web
   ```

   Replace `<environment>` with the name of the environment to which you want to deploy. The `--app web` option tells the script to deploy the Web UI application.

1. Deploy the API application infrastructure and _code_ by running the following command:

   ```sh
   python run apply --env <environment> --app api --update-code --migrate
   ```

   Replace `<environment>` with the name of the environment to which you want to deploy. The `--app api` option tells the script to deploy the API application. The `--update-code` option tells the script to deploy (update) the application code as part of the deployment. The `--migrate` option tells the script to run DB migrations after deployment.

1. Deploy the Web UI application infrastructure and _code_ by running the following command:

   ```sh
   python run apply --env <environment> --app web --update-code
   ```

   Replace `<environment>` with the name of the environment to which you want to deploy. The `--app web` option tells the script to deploy the Web UI application. The `--update-code` option tells the script to deploy (update) the application code as part of the deployment.

{%- else %}

1. Deploy the API application by running the following command:

   ```sh
   python run apply --env <environment> --app api --update-code --migrate
   ```

   Replace `<environment>` with the name of the environment to which you want to deploy. The `--app api` option tells the script to deploy the API application. The `--update-code` option tells the script to deploy (update) the application code as part of the deployment. The `--migrate` option tells the script to run DB migrations after deployment.

{%- endif %}

## 🔄 Subsequent deployments

Thereafter, you can perform subsequent deployments by running the `run` script with the appropriate arguments.

- To deploy the common infrastructure changes, if you have made any updates to the `./modules/common` or `./envs/<environment>/common` configurations, run the following command:

   ```sh
   python run apply --env <environment> --common
   ```

- To deploy the `api` application changes, if you have made any updates to the `./modules/apps/api` or `./envs/<environment>/apps/api` configurations, or to the application source code, run the following command:

   ```sh
   python run apply --env <environment> --app api --update-code --migrate
   ```

   You can omit `--update-code` and `--migrate` options if you have not made any changes to the application source code or database migrations respectively. Keep in mind that `--update-code` option will build the application Docker image and push it to the cloud image repository ({{ cookiecutter.__terraform_cloud_provider_image_registry }}). However, if you use `python run plan ...` instead of `.python run apply ...`, the Docker image will be built but **not** pushed to the cloud image repository.

{%- if cookiecutter.enable_web_ui %}

- To deploy the `web` application changes, if you have made any updates to the `./modules/apps/web` or `./envs/<environment>/apps/web` configurations, or to the application source code, run the following command:

    ```sh
    python run apply --env <environment> --app web --update-code
    ```

    You can omit `--update-code` option if you have not made any changes to the application source code. Keep in mind that `--update-code` option will build the web application assets (i.e., running `{{ cookiecutter.__npm_run }} build` script for it) and push them to the cloud storage ({{ cookiecutter.__terraform_cloud_provider_object_storage }}). However, if you use `python run plan ...` instead of `python run plan apply ...`, the web application assets will be built but **not** pushed to the cloud storage.

{%- endif %}

## 📜 `python run ...` script

You can use the `run` script by invoking it from the command line with the appropriate arguments. The general syntax is:

```sh
python run "<action>" --env "<environment>" [options]
```

To see the list of available actions and options, run the following command:

```sh
python run --help
```

### 🏃 Actions

The `run` script supports three actions:

- `init`: Initialize the Terraform working directory. Usually, you don't need to run this action explicitly, because it is automatically run whenever `plan` or `apply` actions are executed.
- `plan`: Generate and show an execution plan.
- `apply`: Apply the changes required to reach the desired state of the infrastructure and update the latest application code.
- `destroy`: Destroy the application infrastructure.

### 🏔 Environments

The `--env` option is used to specify the environment to which you want to deploy. It should match the name of the environment directory under the `./envs` directory. For example, if you want to deploy to the `dev` environment, you should specify `--env dev`.

### 🕹 Options

The `run` script supports several options:

- `--app`: The name of the application to deploy. {% if cookiecutter.enable_web_ui %}It accepts two values: `api` and `web`{% else %}At the moment it accepts only `api` value{% endif %}. This option is mutually exclusive with `--common`.
- `--update-code`: If specified, the application code will also be updated as part of the deployment. This is applicable only when `--app` is specified and only for `plan` and `apply` actions.
- `--migrate`: If specified, the script will run database migrations after deployment. This is applicable only when `--app api` is specified.
- `--common`: If specified, the script will deploy the common infrastructure. This option is mutually exclusive with `--app`.
{%- if cookiecutter.terraform_cloud_provider == "aws" %}
- `--aws-profile`: The name of the AWS profile to use. If not specified, the default profile will be used or the profile specified in the `AWS_PROFILE` environment variable.
{%- endif %}

Please note that you must specify either `--app` or `--common` but you cannot specify both at the same time.

In addition to the above options, you can also specify any Terraform options. For example, you can specify the `-var` option to override the value of an input variable or `-auto-approve` option to automatically approve the plan without prompting for confirmation. To do this, simply append the Terraform option to the `run` command after the `--` separator. For example:

```sh
python run plan --env dev --app api --update-code --migrate -- -out=api.tfplan

python run apply --env dev --app api --update-code --migrate -- api.tfplan -auto-approve
```
