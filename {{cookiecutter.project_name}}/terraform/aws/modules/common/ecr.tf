resource "aws_ecr_repository" "api" {
  name                 = {% if cookiecutter.__monorepo %}"${local.cluster_name}-api"{% else %}local.cluster_name{% endif %}
  image_tag_mutability = "MUTABLE"

  // Set to true if you want to delete the repository when terraform destroy is run even if the repository contains images
  force_delete = true

  encryption_configuration {
    encryption_type = "AES256"
  }

  image_scanning_configuration {
    scan_on_push = false
  }

  tags = local.tags
}
