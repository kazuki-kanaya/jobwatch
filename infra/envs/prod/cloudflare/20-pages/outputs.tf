output "site_pages_project_name" {
  description = "Site Pages project name"
  value       = module.pages_site.project_name
}

output "site_pages_subdomain" {
  description = "Site Pages generated subdomain"
  value       = module.pages_site.subdomain
}

output "dashboard_pages_project_name" {
  description = "Dashboard Pages project name"
  value       = module.pages_dashboard.project_name
}

output "dashboard_pages_subdomain" {
  description = "Dashboard Pages generated subdomain"
  value       = module.pages_dashboard.subdomain
}
