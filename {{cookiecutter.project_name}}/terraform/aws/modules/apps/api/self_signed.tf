resource "tls_private_key" "self_signed" {
  count       = local.enable_https_self_signed ? 1 : 0
  algorithm   = "ECDSA"
  ecdsa_curve = "P256"
}

resource "tls_self_signed_cert" "self_signed" {
  count           = local.enable_https_self_signed ? 1 : 0
  private_key_pem = tls_private_key.self_signed[0].private_key_pem

  validity_period_hours = 85440 # 10 years

  allowed_uses = ["key_encipherment", "digital_signature", "server_auth"]
  dns_names    = [aws_alb.this.dns_name]

  subject {
    common_name  = aws_alb.this.dns_name
    organization = "ACME"
  }
}

resource "aws_acm_certificate" "self_signed" {
  count             = local.enable_https_self_signed ? 1 : 0
  private_key       = tls_private_key.self_signed[0].private_key_pem
  certificate_body  = tls_self_signed_cert.self_signed[0].cert_pem
  certificate_chain = tls_self_signed_cert.self_signed[0].cert_pem

  tags = local.tags
}
