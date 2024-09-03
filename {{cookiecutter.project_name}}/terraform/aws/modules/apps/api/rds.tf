

resource "aws_db_subnet_group" "database" {
  name       = "${local.resource_basename}-${local.app}"
  subnet_ids = local.db_is_public ? local.public_subnets : local.private_subnets

  tags = local.tags
}

# TODO: instead of defining a single database instance, we should define a cluster here, allowing for horizontal scaling via adding read replicas
resource "aws_db_instance" "database" {
  identifier              = "${local.resource_basename}-${local.app}-db"
  instance_class          = local.db_instance_class
  port                    = local.db_port
  db_name                 = local.db_name
  username                = local.db_username
  password                = data.aws_secretsmanager_secret_version.db_password.secret_string
  engine                  = "postgres"
  engine_version          = local.db_version
  allocated_storage       = "20"
  storage_encrypted       = false
  vpc_security_group_ids  = [local.db_is_public ? local.sg_id_postgres_public : local.sg_id_postgres_internal]
  db_subnet_group_name    = aws_db_subnet_group.database.name
  multi_az                = false
  storage_type            = "gp2"
  publicly_accessible     = local.db_is_public
  backup_retention_period = 7
  skip_final_snapshot     = true

  tags = local.tags
}

provider "postgresql" {
  host             = aws_db_instance.database.address
  username         = aws_db_instance.database.username
  password         = data.aws_secretsmanager_secret_version.db_password.secret_string
  expected_version = local.db_version
  connect_timeout  = 15
}

resource "postgresql_extension" "vector" {
  count    = local.db_enable_pgvector ? 1 : 0
  database = local.db_name
  name     = "vector"
  schema   = "public"
}
