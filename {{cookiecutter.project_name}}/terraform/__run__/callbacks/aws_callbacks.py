from helpers import exec, exec_text, DOCKER
from .abstract_callbacks import Callbacks


class AwsCallbacks(Callbacks):
    @staticmethod
    def prepare_api_image_repository(common_outputs: dict[str, str]) -> str:
        image_repo = common_outputs["ecr_repo_api"]

        region = image_repo.split(".")[3]
        registry = image_repo.split("/")[0]

        password = exec_text(["aws", "--region", region, "ecr", "get-login-password"])

        # Login to ECR registry using the previously obtained password
        exec(
            [DOCKER, "login", "--username", "AWS", "--password", password, registry],
            redact=[5], # redact password from output (6-th item in the list)
        )

        return image_repo

    @staticmethod
    def get_api_db_password(api_outputs: dict[str, str]) -> str:
        region = api_outputs["region"]
        secret_id = api_outputs["db"]["password_secret_id"]

        return exec_text(["aws", "--region", region, "secretsmanager", "get-secret-value", "--secret-id", secret_id, "--query", "SecretString", "--output", "text"])

    @staticmethod
    def upload_web_app_code(web_outputs: dict[str, str], source_dir: str) -> None:
        region = web_outputs["region"]
        bucket_name = web_outputs["bucket_name"]
        distribution_id = web_outputs["distribution_id"]

        # Sync the contents of the `dist` directory with the S3 bucket and invalidate the CloudFront cache
        exec(["aws", "--region", region, "s3", "sync", "--delete", source_dir, f"s3://{bucket_name}"])
        exec(["aws", "--region", region, "cloudfront", "create-invalidation", "--distribution-id", distribution_id, "--paths", "/*"], silent=True)
