package runapp

import (
	"net/http"
	"testing"

	"github.com/kanaya/jobwatch/cli/internal/config"
)

func TestShouldNotify(t *testing.T) {
	cfg := config.Config{
		Notify: config.Notify{
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

func TestNew_RequiresAPIBaseURLAndTokenWhenEnabled(t *testing.T) {
	cfg := config.Config{
		Project: config.Project{Name: "test"},
		API: config.API{
			Enabled: true,
			BaseURL: "",
			Token:   "",
		},
	}

	_, err := New(cfg, &http.Transport{})
	if err == nil {
		t.Fatal("expected error when API is enabled without base_url/token")
	}
}

func TestNew_FailsOnUnsupportedNotifier(t *testing.T) {
	cfg := config.Config{
		Project: config.Project{Name: "test"},
		Notify: config.Notify{
			Channels: []config.Channel{
				{Kind: "discord", Settings: map[string]any{}},
			},
		},
	}

	_, err := New(cfg, &http.Transport{})
	if err == nil {
		t.Fatal("expected error for unsupported notifier kind")
	}
}

func TestNew_FailsOnSlackWithoutWebhook(t *testing.T) {
	cfg := config.Config{
		Project: config.Project{Name: "test"},
		Notify: config.Notify{
			Channels: []config.Channel{
				{Kind: "slack", Settings: map[string]any{}},
			},
		},
	}

	_, err := New(cfg, &http.Transport{})
	if err == nil {
		t.Fatal("expected error when slack webhook_url is missing")
	}
}
