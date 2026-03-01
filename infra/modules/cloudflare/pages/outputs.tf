output "project_name" {
  description = "Pages project name"
  value       = cloudflare_pages_project.this.name
}

output "subdomain" {
  description = "Pages generated subdomain"
  value       = cloudflare_pages_project.this.subdomain
}
