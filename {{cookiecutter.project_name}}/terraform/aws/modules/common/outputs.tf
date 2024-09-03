output "vpc_id" {
  value       = module.vpc.vpc_id
  description = "VPC information"
}

output "vpc_name" {
  value       = local.vpc_name
  description = "VPC information"
}

output "public_subnets" {
  value       = module.vpc.public_subnets
  description = "Public subnets IDs"
}

output "private_subnets" {
  value       = module.vpc.private_subnets
  description = "Private subnets IDs"
}

output "ecr_repo_api" {
  value       = aws_ecr_repository.api.repository_url
  description = "ECR API repository URL"
}

output "ecs_cluster_id" {
  value       = aws_ecs_cluster.apps.id
  description = "ECS cluster"
}

output "ecs_cluster_name" {
  value       = local.cluster_name
  description = "ECS cluster"
}

output "sg_id_cluster" {
  value       = module.sg_cluster.security_group_id
  description = "Security group ID with ALL ports open for the internal resources"
}

output "sg_id_alb_public" {
  value       = module.sg_alb_public.security_group_id
  description = "Security group ID with HTTP and HTTPS ports open for the world"
}

output "sg_id_bastion_public" {
  value       = module.sg_bastion_public.security_group_id
  description = "Security group ID with SSH port open for the world"
}

output "sg_id_postgres_public" {
  value       = module.sg_postgres_public.security_group_id
  description = "Security group ID with Postgres port open for the world"
}

output "sg_id_postgres_internal" {
  value       = module.sg_postgres_internal.security_group_id
  description = "Security group ID with Postgres port open for the internal resources"
}

output "acm_certificate_arn" {
  value       = local.acm_domain_name != "" ? aws_acm_certificate.domain[0].arn : ""
  description = "ACM certificate ARN"
}

output "acm_domain_name" {
  value       = local.acm_domain_name
  description = "ACM certificate domain name"
}
