output "dashboard_pages_domain_status" {
  description = "Cloudflare Pages dashboard custom domain status"
  value       = module.pages_domain_dashboard.status
}

output "site_pages_domain_status" {
  description = "Cloudflare Pages site custom domain status"
  value       = module.pages_domain_site.status
}
