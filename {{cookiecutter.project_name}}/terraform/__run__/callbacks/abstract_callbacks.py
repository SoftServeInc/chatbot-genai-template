from abc import ABC


class Callbacks(ABC):
    @staticmethod
    def create_terraform_backend(terragunt_locals: dict[str, str]) -> None:
        pass

    @staticmethod
    def prepare_api_image_repository(common_outputs: dict[str, str]) -> str:
        return ""

    @staticmethod
    def get_api_db_password(api_outputs: dict[str, str]) -> str:
        return ""

    @staticmethod
    def upload_web_app_code(web_outputs: dict[str, str], source_dir: str) -> None:
        pass
