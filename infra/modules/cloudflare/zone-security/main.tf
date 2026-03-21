terraform {
  required_providers {
    cloudflare = {
      source = "cloudflare/cloudflare"
    }
  }
}

locals {
  zone_settings = {
    always_use_https         = var.always_use_https ? "on" : "off"
    automatic_https_rewrites = var.automatic_https_rewrites ? "on" : "off"
    security_level           = var.security_level
  }
}

# The Free Managed Ruleset is expected to remain enabled by default on Free plans.

resource "cloudflare_bot_management" "this" {
  zone_id    = var.zone_id
  fight_mode = var.bot_fight_mode
}

resource "cloudflare_zone_dnssec" "this" {
  zone_id = var.zone_id
  status  = var.dnssec_enabled ? "active" : "disabled"
}

resource "cloudflare_zone_setting" "this" {
  for_each = local.zone_settings

  zone_id    = var.zone_id
  setting_id = each.key
  value      = each.value
}
