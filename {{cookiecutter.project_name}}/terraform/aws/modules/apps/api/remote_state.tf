data "terraform_remote_state" "common" {
  backend = "s3"

  config = {
    bucket = "${var.tfstate_bucket}"
    region = "${local.region}"
    key    = "${local.env}/common/terraform.tfstate"
  }
}


