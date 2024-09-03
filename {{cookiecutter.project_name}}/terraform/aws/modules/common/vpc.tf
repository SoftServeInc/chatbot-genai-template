# For complete documentation and examples on using terraform-aws-vpc module
# see https://github.com/terraform-aws-modules/terraform-aws-vpc
module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "~> 5.2"

  name = local.vpc_name # VPC name

  cidr                 = local.vpc_cidr
  azs                  = local.availability_zones
  enable_dns_hostnames = true # Enable DNS hostnames in the VPC, see https://docs.aws.amazon.com/vpc/latest/userguide/vpc-dns.html

  public_subnets  = local.public_subnets
  private_subnets = local.private_subnets

  public_subnet_names  = local.public_subnet_names
  private_subnet_names = local.private_subnet_names

  # Enable NAT Gateways if you have instances in your private networks that need to access the internet.
  enable_nat_gateway     = false # EnabProvisions NAT Gateways for each of your private networks, see https://docs.aws.amazon.com/vpc/latest/userguide/vpc-nat-gateway.html
  one_nat_gateway_per_az = true  # Limits NAT Gateway creation for one per availability zone.

  public_subnet_tags = {
    visibility = "public"
  }
  private_subnet_tags = {
    visibility = "private"
  }

  tags = local.tags
}



