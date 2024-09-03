from helpers import exec, exec_text
from .abstract_callbacks import Callbacks


class GcpCallbacks(Callbacks):
    @staticmethod
    def prepare_api_image_repository(common_outputs: dict[str, str]) -> None:
        project_id = common_outputs["project_id"]
        image_repo = common_outputs["arr_docker"]
        registry = image_repo.split("/")[0]

        exec(["gcloud", "auth", "configure-docker", registry, "--quiet", "--project", project_id])

        return f"{image_repo}/{% if cookiecutter.__monorepo %}api{% else %}main{% endif %}"

    @staticmethod
    def get_api_db_password(api_outputs: dict[str, str]) -> str:
        project_id = api_outputs["project_id"]
        secret_id = api_outputs["db"]["password_secret_id"]

        return exec_text(["gcloud", "secrets", "versions", "access", "latest", "--secret", secret_id, "--quiet", "--project", project_id])

    @staticmethod
    def upload_web_app_code(web_outputs: dict[str, str], source_dir: str) -> None:
        project_id = web_outputs["project_id"]
        bucket_name = web_outputs["bucket_name"]
        load_balancer_name = web_outputs["load_balancer_name"]

        # Sync the contents of the `dist` directory with the GCS bucket and invalidate the Cloud CDN cache
        exec(["gcloud", "storage", "rsync", "--delete-unmatched-destination-objects", "--recursive", source_dir, f"gs://{bucket_name}", "--project", project_id, "--quiet"])
        exec(["gcloud", "compute", "url-maps", "invalidate-cdn-cache", load_balancer_name, "--path", "/*", "--async", "--quiet", "--project", project_id])
