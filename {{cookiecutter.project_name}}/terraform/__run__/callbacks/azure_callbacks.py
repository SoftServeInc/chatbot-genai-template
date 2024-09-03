from helpers import exec, exec_ok, exec_text, exec_json, DOCKER
from .abstract_callbacks import Callbacks


class AzureCallbacks(Callbacks):
    @staticmethod
    def create_terraform_backend(terragrunt_locals: dict[str, str]) -> None:
        region = terragrunt_locals["region"]
        subscription_id = terragrunt_locals["subscription_id"]
        resource_group_name = terragrunt_locals["project_resource_group_name"]
        storage_account_name = terragrunt_locals["project_storage_account_name"]
        storage_container_name = terragrunt_locals["project_storage_tfstate_container_name"]

        # Create resource group if it does not exist
        exists = "true" == exec_text(["az", "group", "exists", "--name", resource_group_name, "--subscription", subscription_id])
        if not exists:
            exec(["az", "group", "create", "--name", resource_group_name, "--location", region, "--subscription", subscription_id])

        # Create storage account if it does not exist
        exists = exec_ok(["az", "storage", "account", "show", "--name", storage_account_name, "--resource-group", resource_group_name, "--subscription", subscription_id, "--output", "tsv", "--query", "id"])
        if not exists:
            info = exec_json(["az", "storage", "account", "check-name", "--name", storage_account_name, "--subscription", subscription_id])

            if not info["nameAvailable"]:
                print(f"ERROR: {info['message']}")
                exit(1)

            exec(["az", "storage", "account", "create", "--name", storage_account_name, "--resource-group", resource_group_name, "--location", region, "--sku", "Standard_LRS", "--subscription", subscription_id])

        # Create storage container if it does not exist
        exists = "true" == exec_text(["az", "storage", "container", "exists", "--name", storage_container_name, "--account-name", storage_account_name, "--subscription", subscription_id, "--output", "tsv", "--query", "exists"])
        if not exists:
            exec(["az", "storage", "container", "create", "--name", storage_container_name, "--account-name", storage_account_name, "--subscription", subscription_id, "--fail-on-exist"])

    @staticmethod
    def prepare_api_image_repository(common_outputs: dict[str, str]) -> None:
        subscription_id = common_outputs["subscription_id"]
        acr_name = common_outputs["acr_name"]
        server = common_outputs["acr_server"]

        password = exec_text(["az", "acr", "login", "--name", acr_name, "--subscription", subscription_id, "--expose-token", "--output", "tsv", "--query", "accessToken"])

        # Login to ACR registry using the previously obtained password (access token)
        exec(
            [DOCKER, "login", "--username", "00000000-0000-0000-0000-000000000000", "--password", password, server],
            redact=[5], # redact password from output (6-th item in the list)
        )

        return f"{server}/api"

    @staticmethod
    def get_api_db_password(api_outputs: dict[str, str]) -> str:
        secret_id = api_outputs["db"]["password_secret_id"]

        return exec_text(["az", "keyvault", "secret", "show", "--id", secret_id, "--output", "tsv", "--query", "value"])

    @staticmethod
    def upload_web_app_code(web_outputs: dict[str, str], source_dir: str) -> None:
        subscription_id = web_outputs["subscription_id"]
        resource_group_name = web_outputs["resource_group_name"]
        storage_account_name = web_outputs["storage_account_name"]
        cdn_profile_name = web_outputs["cdn_profile_name"]
        cdn_endpoint_name = web_outputs["cdn_endpoint_name"]

        exec(["az", "storage", "blob", "sync", "--subscription", subscription_id, "--account-name", storage_account_name, "--source", source_dir, "--container", "$web", "--only-show-errors", "--delete-destination", "true", "--", "--recursive"])
        exec(["az", "cdn", "endpoint", "purge", "--no-wait", "--resource-group", resource_group_name, "--subscription", subscription_id, "--profile-name", cdn_profile_name, "--name", cdn_endpoint_name, "--content-paths", "/*"])
