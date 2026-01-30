package config

const DefaultFilename = "jobwatch.yaml"

const DefaultTemplate = `project:
  name: my_project
  tags:
    - monitoring

api:
  enabled: false
  base_url: http://localhost:8000
  token: ${JOBWATCH_HOST_TOKEN}

run:
  log_tail: 80

notify:
  on_success: true
  on_failure: true
  channels:
    - kind: slack
      settings:
        webhook_url: ${JOBWATCH_SLACK_WEBHOOK_URL}
`
