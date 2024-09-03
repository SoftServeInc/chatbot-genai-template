locals {
  region             = "us-east-1"
  project            = "{{ cookiecutter.project_name }}"
  tfstate_bucket     = "${local.project}-tfstate"
  tfstate_lock_table = "${local.project}-tfstate-lock"

  // Set to "" if you don't have a domain name yet or if the DNS zone is managed outside of AWS
  // It must be already existing AWS Route53 zone belonging to the same AWS account as the one you're deploying to.
  route53_zone_name = "" // "example.com"
}

remote_state {
  backend = "s3"

  generate = {
    path      = "backend.tf"
    if_exists = "overwrite"
  }

  config = {
    dynamodb_table = local.tfstate_lock_table
    bucket         = local.tfstate_bucket
    key            = "${path_relative_to_include()}/terraform.tfstate"
    region         = local.region
    encrypt        = true
  }
}

generate "provider" {
  path      = "provider.tf"
  if_exists = "overwrite_terragrunt"
  contents  = <<EOF
provider "aws" {
  region = "${local.region}"
}

provider "aws" {
  # This is the alias for the AWS provider that will be used for ACM resources because CloudFront requires ACM certificates to be in us-east-1
  region = "us-east-1"
  alias  = "acm"
}
EOF
}

generate "terraform" {
  path      = "versions.tf"
  if_exists = "overwrite_terragrunt"
  contents  = <<EOF
terraform {
  required_version = ">= 1.6.5, < 2.0.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.28"
    }
    postgresql = {
      source = "cyrilgdn/postgresql"
      version = "~> 1.21"
    }
  }
}
EOF
}

generate "data_aws_caller_identity" {
  path      = "aws_identity.tf"
  if_exists = "overwrite_terragrunt"
  contents  = <<EOF
data "aws_caller_identity" "current" {}
EOF
}

terraform {
  # Force Terraform to keep trying to acquire a lock for
  # up to 20 minutes if someone else already has the lock
  extra_arguments "retry_lock" {
    commands = get_terraform_commands_that_need_locking()

    arguments = [
      "-lock-timeout=20m"
    ]
  }
}

# terraform {
#   # Force Terraform to keep trying to acquire a lock for
#   # up to 20 minutes if someone else already has the lock
#   extra_arguments "retry_lock" {
#     commands  = get_terraform_commands_that_need_locking()
#     arguments = [
#       "-lock-timeout=20m"
#     ]
#   }
# }

inputs = {
  project           = local.project
  region            = local.region
  tfstate_bucket    = local.tfstate_bucket
  route53_zone_name = local.route53_zone_name
}
