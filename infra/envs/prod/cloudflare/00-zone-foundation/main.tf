module "zone_foundation" {
  source = "../../../../modules/cloudflare/zone-security"

  zone_id                  = var.cloudflare_zone_id
  always_use_https         = var.always_use_https
  automatic_https_rewrites = var.automatic_https_rewrites
  bot_fight_mode           = var.bot_fight_mode
  dnssec_enabled           = var.dnssec_enabled
  security_level           = var.security_level
}
