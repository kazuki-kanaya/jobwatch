package run

import (
	"net/http"
	"testing"

	"github.com/kazuki-kanaya/obsern/cli/internal/config"
)

func TestShouldNotify(t *testing.T) {
	cfg := config.Config{
		Notify: config.Notify{
			Enabled:   true,
			OnSuccess: true,
			OnFailure: false,
		},
	}

	if !shouldNotify(cfg, true) {
		t.Fatal("expected notify on success when notify.on_success=true")
	}
	if shouldNotify(cfg, false) {
		t.Fatal("expected no notify on failure when notify.on_failure=false")
	}
}

func TestShouldNotify_FalseWhenNotifyDisabled(t *testing.T) {
	cfg := config.Config{
		Notify: config.Notify{
			Enabled:   false,
			OnSuccess: true,
			OnFailure: true,
		},
	}

	if shouldNotify(cfg, true) {
		t.Fatal("expected no notify when notify.enabled=false")
	}
	if shouldNotify(cfg, false) {
		t.Fatal("expected no notify when notify.enabled=false")
	}
}

func TestNewRunner_RequiresAPIBaseURLAndTokenWhenEnabled(t *testing.T) {
	cfg := config.Config{
		Project: config.Project{Name: "test"},
		API: config.API{
			Enabled: true,
			BaseURL: "",
			Token:   "",
		},
	}

	_, err := NewRunner(cfg, &http.Transport{})
	if err == nil {
		t.Fatal("expected error when API is enabled without base_url/token")
	}
}

func TestNewRunner_FailsOnUnsupportedNotifier(t *testing.T) {
	cfg := config.Config{
		Project: config.Project{Name: "test"},
		Notify: config.Notify{
			Enabled: true,
			Channels: []config.Channel{
				{Kind: "discord", Settings: map[string]any{}},
			},
		},
	}

	_, err := NewRunner(cfg, &http.Transport{})
	if err == nil {
		t.Fatal("expected error for unsupported notifier kind")
	}
}

func TestNewRunner_FailsOnSlackWithoutWebhook(t *testing.T) {
	cfg := config.Config{
		Project: config.Project{Name: "test"},
		Notify: config.Notify{
			Enabled: true,
			Channels: []config.Channel{
				{Kind: "slack", Settings: map[string]any{}},
			},
		},
	}

	_, err := NewRunner(cfg, &http.Transport{})
	if err == nil {
		t.Fatal("expected error when slack webhook_url is missing")
	}
}

func TestNewRunner_DoesNotValidateChannelsWhenNotifyDisabled(t *testing.T) {
	cfg := config.Config{
		Project: config.Project{Name: "test"},
		API: config.API{
			Enabled: true,
			BaseURL: "http://localhost:8000",
			Token:   "token",
		},
		Notify: config.Notify{
			Enabled: false,
			Channels: []config.Channel{
				{Kind: "discord", Settings: map[string]any{}},
			},
		},
	}

	_, err := NewRunner(cfg, &http.Transport{})
	if err != nil {
		t.Fatalf("expected no error when notify.enabled=false: %v", err)
	}
}
