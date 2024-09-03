from .abstract_callbacks import Callbacks
from .{{ cookiecutter.terraform_cloud_provider }}_callbacks import {{ cookiecutter.terraform_cloud_provider|capitalize }}Callbacks

callbacks: Callbacks = {{ cookiecutter.terraform_cloud_provider|capitalize }}Callbacks()
