data "terraform_remote_state" "common" {
  backend = "gcs"

  config = {
    bucket = "${var.tfstate_bucket}"
    prefix = "${local.env}/common"
  }
}
