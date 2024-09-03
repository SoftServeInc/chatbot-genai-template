resource "google_project_service" "vpcaccess" {
  service = "vpcaccess.googleapis.com"

  # services that are enabled and which depend on this service should also be disabled when this service is destroyed
  disable_dependent_services = true

  # do not disable the API when this resource is destroyed
  disable_on_destroy = false
}

resource "google_project_service" "servicenetworking" {
  service = "servicenetworking.googleapis.com"

  # services that are enabled and which depend on this service should also be disabled when this service is destroyed
  disable_dependent_services = true

  # do not disable the API when this resource is destroyed
  disable_on_destroy = false
}

resource "google_compute_network" "this" {
  name = "${local.resource_basename}-vpc"
  auto_create_subnetworks = false

  depends_on = [
    google_project_service.vpcaccess,
    google_project_service.servicenetworking,
  ]
}

resource "google_compute_subnetwork" "this" {
  name          = "${local.resource_basename}-subnet"
  region        = local.region
  network       = google_compute_network.this.id
  ip_cidr_range = "10.0.0.0/24"
}

resource "google_vpc_access_connector" "this" {
  name          = "${local.resource_basename}-connector"
  region        = local.region
  network       = google_compute_network.this.self_link
  ip_cidr_range = "10.255.0.0/28"
}

# https://cloud.google.com/vpc/docs/configure-private-services-access#creating-connection
# Create a private services connection between your VPC and Google's managed services
resource "google_service_networking_connection" "private_vpc_connection" {
  service                 = "servicenetworking.googleapis.com"
  network                 = google_compute_network.this.id
  reserved_peering_ranges = [
    google_compute_global_address.private_ip_range.name
  ]

  depends_on = [
    google_compute_subnetwork.this,
  ]
}

# Reserve an IP address range for the private services connection
resource "google_compute_global_address" "private_ip_range" {
  name          = "${local.resource_basename}-private-ip-range"
  purpose       = "VPC_PEERING"
  address_type  = "INTERNAL"
  prefix_length = 16
  network       = google_compute_network.this.id
}
