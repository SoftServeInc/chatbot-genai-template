locals {
  region     = var.region
  account_id = data.aws_caller_identity.current.account_id

  env     = var.env
  project = var.project

  resource_basename = "${local.project}-${local.env}"

  cluster_name = local.resource_basename
  vpc_name     = local.resource_basename
  vpc_cidr     = "10.0.0.0/16"

  availability_zones = ["${local.region}a", "${local.region}b"]

  public_subnets  = ["10.0.0.0/24", "10.0.2.0/24"]
  private_subnets = ["10.0.1.0/24", "10.0.3.0/24"]

  public_subnet_names  = ["${local.vpc_name}-pub-0", "${local.vpc_name}-pub-0"]
  private_subnet_names = ["${local.vpc_name}-prv-0", "${local.vpc_name}-prv-1"]

  bastion_instance_type = var.bastion_instance_type
  bastion_cidr_blocks   = var.bastion_cidr_blocks

  route53_zone_name = var.route53_zone_name
  route53_zone_id   = var.route53_zone_name != "" ? data.aws_route53_zone.primary[0].zone_id : ""
  acm_domain_name   = var.route53_zone_name != "" ? var.acm_domain_name : ""

  tags = {
    environment      = local.env
    project          = local.project
    infrastructure   = "terraform"
    terraform-module = "common"
  }
}
