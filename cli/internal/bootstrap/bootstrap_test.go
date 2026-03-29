package bootstrap

import (
	"bytes"
	"strings"
	"testing"

	"github.com/kazuki-kanaya/obsern/cli/internal/adapter/api"
	"github.com/kazuki-kanaya/obsern/cli/internal/adapter/notify"
	"github.com/kazuki-kanaya/obsern/cli/internal/config"
)

func TestBuildReporter(t *testing.T) {
	t.Parallel()

	tests := []struct {
		name        string
		cfg         config.Config
		wantType    string
		wantErrPart string
	}{
		{
			name:     "uses noop reporter when api config is absent",
			cfg:      config.Config{},
			wantType: "api.NoopReporter",
		},
		{
			name: "uses api reporter when api config is present",
			cfg: config.Config{
				API: &config.APIConfig{
					BaseURL:   "https://api.obsern.dev",
					HostToken: "host-token",
				},
			},
			wantType: "*api.Reporter",
		},
		{
			name: "returns error for invalid api config",
			cfg: config.Config{
				API: &config.APIConfig{
					BaseURL:   "://bad-url",
					HostToken: "host-token",
				},
			},
			wantErrPart: "create API client",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			t.Parallel()

			reporter, err := buildReporter(tt.cfg)
			if tt.wantErrPart != "" {
				if err == nil {
					t.Fatalf("buildReporter() error = nil, want %q", tt.wantErrPart)
				}
				if !strings.Contains(err.Error(), tt.wantErrPart) {
					t.Fatalf("buildReporter() error = %q, want substring %q", err.Error(), tt.wantErrPart)
				}
				return
			}

			if err != nil {
				t.Fatalf("buildReporter() error = %v, want nil", err)
			}
			if got := typeName(reporter); got != tt.wantType {
				t.Fatalf("reporter type = %q, want %q", got, tt.wantType)
			}
		})
	}
}

func TestBuildNotifier(t *testing.T) {
	t.Parallel()

	tests := []struct {
		name        string
		cfg         config.Config
		wantType    string
		wantErrPart string
	}{
		{
			name:     "uses noop notifier when notify config is absent",
			cfg:      config.Config{},
			wantType: "notify.MultiNotifier",
		},
		{
			name: "uses slack notifier when slack config is present",
			cfg: config.Config{
				Notify: &config.NotifyConfig{
					TimeZone: "Asia/Tokyo",
					Slack: &config.SlackConfig{
						WebhookURL: "https://hooks.slack.com/services/test",
					},
				},
			},
			wantType: "notify.MultiNotifier",
		},
		{
			name: "uses discord notifier when discord config is present",
			cfg: config.Config{
				Notify: &config.NotifyConfig{
					TimeZone: "Asia/Tokyo",
					Discord: &config.DiscordConfig{
						WebhookURL: "https://discord.com/api/webhooks/test/token",
					},
				},
			},
			wantType: "notify.MultiNotifier",
		},
		{
			name: "uses multi notifier when both providers are present",
			cfg: config.Config{
				Notify: &config.NotifyConfig{
					TimeZone: "Asia/Tokyo",
					Slack: &config.SlackConfig{
						WebhookURL: "https://hooks.slack.com/services/test",
					},
					Discord: &config.DiscordConfig{
						WebhookURL: "https://discord.com/api/webhooks/test/token",
					},
				},
			},
			wantType: "notify.MultiNotifier",
		},
		{
			name: "returns error for invalid notify config",
			cfg: config.Config{
				Notify: &config.NotifyConfig{
					TimeZone: "Invalid/Zone",
					Slack: &config.SlackConfig{
						WebhookURL: "https://hooks.slack.com/services/test",
					},
				},
			},
			wantErrPart: "create Slack notifier",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			t.Parallel()

			notifier, err := buildNotifier(tt.cfg)
			if tt.wantErrPart != "" {
				if err == nil {
					t.Fatalf("buildNotifier() error = nil, want %q", tt.wantErrPart)
				}
				if !strings.Contains(err.Error(), tt.wantErrPart) {
					t.Fatalf("buildNotifier() error = %q, want substring %q", err.Error(), tt.wantErrPart)
				}
				return
			}

			if err != nil {
				t.Fatalf("buildNotifier() error = %v, want nil", err)
			}
			if got := typeName(notifier); got != tt.wantType {
				t.Fatalf("notifier type = %q, want %q", got, tt.wantType)
			}
		})
	}
}

func TestBuildRunDependencies(t *testing.T) {
	t.Parallel()

	cfg := config.Config{
		Run: config.RunConfig{
			Tags:      []string{"test"},
			TailLines: 10,
		},
	}

	deps, err := BuildRunDependencies(cfg, &bytes.Buffer{}, &bytes.Buffer{})
	if err != nil {
		t.Fatalf("BuildRunDependencies() error = %v, want nil", err)
	}
	if deps.Service == nil {
		t.Fatal("Service is nil")
	}
}

func typeName(value any) string {
	switch value.(type) {
	case api.NoopReporter:
		return "api.NoopReporter"
	case *api.Reporter:
		return "*api.Reporter"
	case notify.NoopNotifier:
		return "notify.NoopNotifier"
	case *notify.SlackNotifier:
		return "*notify.SlackNotifier"
	case *notify.DiscordNotifier:
		return "*notify.DiscordNotifier"
	case notify.MultiNotifier:
		return "notify.MultiNotifier"
	default:
		return ""
	}
}
