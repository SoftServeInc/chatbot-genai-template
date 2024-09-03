terraform {
  required_providers {
    google = {
      source = "hashicorp/google"
    }
    random = {
      source  = "hashicorp/random"
    }
    postgresql = {
      source = "cyrilgdn/postgresql"
    }
  }
}
