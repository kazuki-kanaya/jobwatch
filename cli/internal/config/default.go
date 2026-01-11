package config

const DefaultFilename = "jobwatch.yaml"

const DefaultTemplate = `project:
  name: my_project
  tags:
    - monitoring

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
