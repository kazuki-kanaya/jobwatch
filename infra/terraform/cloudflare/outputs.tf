output "pages_project_name" {
  description = "Cloudflare Pages project name"
  value       = module.pages.project_name
}

output "pages_subdomain" {
  description = "Cloudflare Pages generated subdomain"
  value       = module.pages.subdomain
}
