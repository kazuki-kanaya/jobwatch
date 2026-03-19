package config

import (
	"os"
	"path/filepath"
	"strings"
	"testing"
)

func TestLoad(t *testing.T) {
	t.Run("loads and normalizes config", func(t *testing.T) {
		t.Setenv("OBSERN_HOST_TOKEN", "host-token")
		t.Setenv("OBSERN_SLACK_WEBHOOK_URL", "https://hooks.slack.com/services/a/b/c")

		path := writeTempConfig(t, `
run:
  tail_lines: 0
api:
  host_token: ${OBSERN_HOST_TOKEN}
  base_url: https://api.obsern.dev
notify:
  time_zone: Asia/Tokyo
  slack:
    webhook_url: ${OBSERN_SLACK_WEBHOOK_URL}
`)

		cfg, err := Load(path)
		if err != nil {
			t.Fatalf("Load() error = %v, want nil", err)
		}

		if cfg.Run.Tags == nil {
			t.Fatal("Run.Tags is nil, want non-nil empty slice")
		}
		if len(cfg.Run.Tags) != 0 {
			t.Fatalf("Run.Tags = %#v, want empty slice", cfg.Run.Tags)
		}
		if cfg.Run.TailLines != 0 {
			t.Fatalf("Run.TailLines = %d, want 0", cfg.Run.TailLines)
		}
		if cfg.API == nil || cfg.API.HostToken != "host-token" {
			t.Fatalf("API = %#v, want expanded host token", cfg.API)
		}
		if cfg.Notify == nil || cfg.Notify.TimeZone != "Asia/Tokyo" {
			t.Fatalf("Notify = %#v, want time zone", cfg.Notify)
		}
		if cfg.Notify == nil || cfg.Notify.Slack == nil || cfg.Notify.Slack.WebhookURL != "https://hooks.slack.com/services/a/b/c" {
			t.Fatalf("Notify.Slack = %#v, want expanded webhook url", cfg.Notify)
		}
	})

	t.Run("rejects unknown fields", func(t *testing.T) {
		t.Parallel()

		path := writeTempConfig(t, `
run:
  tail_line: 80
api:
  host_token: token
  base_url: https://api.obsern.dev
`)

		_, err := Load(path)
		if err == nil {
			t.Fatal("Load() error = nil, want unknown field error")
		}
		if !strings.Contains(err.Error(), "decode config:") {
			t.Fatalf("Load() error = %q, want decode config context", err.Error())
		}
	})

	t.Run("rejects multiple yaml documents", func(t *testing.T) {
		t.Parallel()

		path := writeTempConfig(t, `
api:
  host_token: token
  base_url: https://api.obsern.dev
---
notify:
  slack:
    webhook_url: https://hooks.slack.com/services/a/b/c
`)

		_, err := Load(path)
		if err == nil {
			t.Fatal("Load() error = nil, want multiple document error")
		}
		if !strings.Contains(err.Error(), "multiple YAML documents are not supported") {
			t.Fatalf("Load() error = %q, want multiple document error", err.Error())
		}
	})

	t.Run("returns validation context", func(t *testing.T) {
		t.Parallel()

		path := writeTempConfig(t, `
run:
  tail_lines: 201
api:
  host_token: token
  base_url: https://api.obsern.dev
`)

		_, err := Load(path)
		if err == nil {
			t.Fatal("Load() error = nil, want validation error")
		}
		if !strings.Contains(err.Error(), "validate config:") {
			t.Fatalf("Load() error = %q, want validation context", err.Error())
		}
	})
}

func writeTempConfig(t *testing.T, content string) string {
	t.Helper()

	dir := t.TempDir()
	path := filepath.Join(dir, "obsern.yaml")

	if err := os.WriteFile(path, []byte(strings.TrimLeft(content, "\n")), 0o644); err != nil {
		t.Fatalf("write temp config: %v", err)
	}

	return path
}
