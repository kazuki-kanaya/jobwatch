output "record_ids" {
  description = "Managed Cloudflare DNS record IDs"
  value       = { for k, v in cloudflare_dns_record.this : k => v.id }
}
