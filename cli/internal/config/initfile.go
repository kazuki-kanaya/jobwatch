package config

func DefaultYAML() string {
	return `# obsern.yaml
#
# At least one of "api" or "notify" must be configured.

run:
  tags: ["default"]
  tail_lines: 80

# Uncomment to report jobs to the Obsern API.
# api:
#   host_token: ${OBSERN_HOST_TOKEN}
#   base_url: https://api.obsern.dev

# Uncomment to enable notifications.
# notify:
#   time_zone: "Asia/Tokyo"
#   slack:
#     webhook_url: ${OBSERN_SLACK_WEBHOOK_URL}
`
}
