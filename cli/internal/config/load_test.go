package config

import (
	"path/filepath"
	"testing"
)

func TestLoad_LoadsWithSlackWebhook(t *testing.T) {
	t.Setenv("JOBWATCH_SLACK_WEBHOOK_URL", "https://example.com/webhook")

	dir := t.TempDir()
	path := filepath.Join(dir, "jobwatch.yaml")

	yamlText := `project:
  name: my_project
  tags: [monitoring]

api:
  enabled: false
  endpoint: http://localhost:8000
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
	if err := Generate(path, yamlText, false); err != nil {
		t.Fatalf("WriteFile failed: %v", err)
	}

	cfg, err := Load(path)
	if err != nil {
		t.Fatalf("Load failed: %v", err)
	}

	if cfg.Project.Name != "my_project" {
		t.Fatalf("project.name mismatch: got=%q", cfg.Project.Name)
	}

	if len(cfg.Notify.Channels) != 1 || cfg.Notify.Channels[0].Kind != "slack" {
		t.Fatalf("channels mismatch: %+v", cfg.Notify.Channels)
	}
}

func TestLoad_FailsWhenSlackWebhookEnvMissing(t *testing.T) {

	dir := t.TempDir()
	path := filepath.Join(dir, "jobwatch.yaml")

	yamlText := `project:
  name: my_project
  tags: [monitoring]

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
	if err := Generate(path, yamlText, false); err != nil {
		t.Fatalf("WriteFile failed: %v", err)
	}

	_, err := Load(path)
	if err == nil {
		t.Fatalf("Load should fail when webhook env is missing")
	}
}
