# For complete documentation and examples on using terraform-aws-security-group module, see https://github.com/terraform-aws-modules/terraform-aws-security-group.

# Security group with ALL ports open for the internal resources.
module "sg_cluster" {
  source  = "terraform-aws-modules/security-group/aws"
  version = "~> 4.0"

  vpc_id          = module.vpc.vpc_id
  name            = "${local.vpc_name}-cluster"
  use_name_prefix = false

  egress_rules = ["all-all"]

  ingress_with_self = [
    {
      description = "All traffic from the same security group"
      from_port   = -1
      to_port     = -1
      protocol    = -1
      self        = true
    }
  ]

  ingress_with_source_security_group_id = [
    {
      description              = "All traffic from the public ALB security group"
      from_port                = -1
      to_port                  = -1
      protocol                 = -1
      source_security_group_id = module.sg_alb_public.security_group_id
    },
    {
      description              = "All traffic from the public bastion security group" # so that the SSH tunnel works through the bastion host
      from_port                = -1
      to_port                  = -1
      protocol                 = -1
      source_security_group_id = module.sg_bastion_public.security_group_id
    }
  ]

  tags = local.tags

  depends_on = [
    module.vpc
  ]
}

# Security group with PostgreSQL port open for the internal security group.
module "sg_postgres_internal" {
  source  = "terraform-aws-modules/security-group/aws"
  version = "~> 4.0"

  vpc_id          = module.vpc.vpc_id
  name            = "${local.vpc_name}-postgres-internal"
  use_name_prefix = false

  egress_rules = ["all-all"]

  ingress_with_source_security_group_id = [
    {
      description              = "PostgreSQL traffic from the cluster security group"
      from_port                = 5432
      to_port                  = 5432
      protocol                 = "tcp"
      source_security_group_id = module.sg_cluster.security_group_id
    },
    {
      description              = "PostgreSQL traffic from the public bastion security group" # so that the SSH tunnel works through the bastion host
      from_port                = 5432
      to_port                  = 5432
      protocol                 = "tcp"
      source_security_group_id = module.sg_bastion_public.security_group_id
    }
  ]

  tags = local.tags

  depends_on = [
    module.vpc
  ]
}

#/ Security group with PostgreSQL port open for the world.
module "sg_postgres_public" {
  source  = "terraform-aws-modules/security-group/aws"
  version = "~> 4.0"

  vpc_id          = module.vpc.vpc_id
  name            = "${local.vpc_name}-postgres-public"
  use_name_prefix = false

  egress_rules = ["all-all"]

  ingress_with_cidr_blocks = [
    {
      description = "PostgreSQL traffic from the world"
      protocol    = "tcp"
      from_port   = 5432
      to_port     = 5432
      cidr_blocks = "0.0.0.0/0"
    },
  ]

  tags = local.tags

  depends_on = [
    module.vpc
  ]
}

# Security group with HTTP and HTTPS ports open for the world.
module "sg_alb_public" {
  source  = "terraform-aws-modules/security-group/aws"
  version = "~> 4.0"

  vpc_id          = module.vpc.vpc_id
  name            = "${local.vpc_name}-alb-public"
  use_name_prefix = false

  egress_rules = ["all-all"]

  ingress_with_cidr_blocks = [
    {
      description = "HTTPS traffic from the world"
      from_port   = 443
      to_port     = 443
      protocol    = "tcp"
      cidr_blocks = "0.0.0.0/0"
    },
    {
      description = "HTTP traffic from the world"
      from_port   = 80
      to_port     = 80
      protocol    = "tcp"
      cidr_blocks = "0.0.0.0/0"
    },
  ]

  tags = local.tags

  depends_on = [
    module.vpc
  ]
}

# Security group with SSH and ICMP ports open for the world.
module "sg_bastion_public" {
  source  = "terraform-aws-modules/security-group/aws"
  version = "~> 4.0"

  vpc_id          = module.vpc.vpc_id
  name            = "${local.vpc_name}-bastion-public"
  use_name_prefix = false

  egress_rules = ["all-all"]

  ingress_with_cidr_blocks = flatten([
    for cidr in local.bastion_cidr_blocks : [
      {
        description = "ICMP traffic from the world"
        protocol    = "icmp"
        from_port   = -1
        to_port     = -1
        cidr_blocks = cidr
      },
      {
        description = "SSH traffic from the world"
        protocol    = "tcp"
        from_port   = 22
        to_port     = 22
        cidr_blocks = cidr
      },
    ]
  ])

  tags = local.tags

  depends_on = [
    module.vpc
  ]
}


