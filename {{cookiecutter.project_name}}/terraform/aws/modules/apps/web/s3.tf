resource "aws_s3_bucket" "this" {
  bucket = local.bucket_name

  tags = local.tags
}

resource "aws_s3_bucket_public_access_block" "this" {
  bucket = aws_s3_bucket.this.id

  block_public_acls   = true
  block_public_policy = true
}

resource "aws_s3_bucket_versioning" "this" {
  bucket = aws_s3_bucket.this.id

  versioning_configuration {
    status = "Disabled"
  }
}

resource "aws_s3_bucket_website_configuration" "this" {
  bucket = aws_s3_bucket.this.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "404.html"
  }
}

resource "aws_s3_bucket_policy" "this" {
  bucket = aws_s3_bucket.this.id
  policy = data.aws_iam_policy_document.this.json
}

data "aws_iam_policy_document" "this" {
  statement {
    sid = "1"

    effect    = "Allow"
    actions   = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.this.arn}/*"]

    principals {
      type = "AWS"

      identifiers = [
        aws_cloudfront_origin_access_identity.this.iam_arn,
      ]
    }
  }
}
