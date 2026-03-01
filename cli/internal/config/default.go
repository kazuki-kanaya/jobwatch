package config

const DefaultFilename = "obsern.yaml"

const DefaultTemplate = `project:
  name: my_project
  tags:
    - monitoring

api:
  enabled: true
  base_url: https://api.obsern.dev
  token: ${OBSERN_HOST_TOKEN}

run:
  log_tail: 80

notify:
  enabled: true
  on_success: true
  on_failure: true
  channels:
    - kind: slack
      settings:
        webhook_url: ${OBSERN_SLACK_WEBHOOK_URL}
`
