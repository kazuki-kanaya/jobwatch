output "status" {
  description = "Pages custom domain status"
  value       = cloudflare_pages_domain.this.status
}
