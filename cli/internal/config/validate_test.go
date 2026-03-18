package config

import (
	"strings"
	"testing"
)

func TestValidate(t *testing.T) {
	t.Parallel()

	tests := []struct {
		name    string
		cfg     Config
		wantErr string
	}{
		{
			name: "api only is valid",
			cfg: Config{
				Run: RunConfig{Tags: []string{}, TailLines: 80},
				API: &APIConfig{
					HostToken: "token",
					BaseURL:   "https://api.obsern.com",
				},
			},
		},
		{
			name: "notify only is valid",
			cfg: Config{
				Run: RunConfig{Tags: []string{}, TailLines: 80},
				Notify: &NotifyConfig{
					TimeZone: "Asia/Tokyo",
					Slack: &SlackConfig{
						WebhookURL: "https://hooks.slack.com/services/a/b/c",
					},
				},
			},
		},
		{
			name: "missing api and notify",
			cfg: Config{
				Run: RunConfig{Tags: []string{}, TailLines: 80},
			},
			wantErr: "at least one of api or notify must be configured",
		},
		{
			name: "tail lines below minimum",
			cfg: Config{
				Run: RunConfig{Tags: []string{}, TailLines: -1},
				API: &APIConfig{
					HostToken: "token",
					BaseURL:   "https://api.obsern.com",
				},
			},
			wantErr: "run.tail_lines must be between 0 and 200",
		},
		{
			name: "tail lines above maximum",
			cfg: Config{
				Run: RunConfig{Tags: []string{}, TailLines: 201},
				API: &APIConfig{
					HostToken: "token",
					BaseURL:   "https://api.obsern.com",
				},
			},
			wantErr: "run.tail_lines must be between 0 and 200",
		},
		{
			name: "missing api host token",
			cfg: Config{
				Run: RunConfig{Tags: []string{}, TailLines: 80},
				API: &APIConfig{
					BaseURL: "https://api.obsern.com",
				},
			},
			wantErr: "api.host_token is required",
		},
		{
			name: "relative api base url",
			cfg: Config{
				Run: RunConfig{Tags: []string{}, TailLines: 80},
				API: &APIConfig{
					HostToken: "token",
					BaseURL:   "/api",
				},
			},
			wantErr: "api.base_url must be an absolute URL",
		},
		{
			name: "missing slack webhook",
			cfg: Config{
				Run: RunConfig{Tags: []string{}, TailLines: 80},
				Notify: &NotifyConfig{
					Slack: &SlackConfig{},
				},
			},
			wantErr: "notify.slack.webhook_url is required",
		},
		{
			name: "invalid notify time zone",
			cfg: Config{
				Run: RunConfig{Tags: []string{}, TailLines: 80},
				Notify: &NotifyConfig{
					TimeZone: "JST-INVALID",
					Slack: &SlackConfig{
						WebhookURL: "https://hooks.slack.com/services/a/b/c",
					},
				},
			},
			wantErr: `notify.time_zone must be a valid IANA time zone, got "JST-INVALID"`,
		},
		{
			name: "relative slack webhook url",
			cfg: Config{
				Run: RunConfig{Tags: []string{}, TailLines: 80},
				Notify: &NotifyConfig{
					Slack: &SlackConfig{
						WebhookURL: "/hooks/slack",
					},
				},
			},
			wantErr: "notify.slack.webhook_url must be an absolute URL",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			t.Parallel()

			err := Validate(tt.cfg)
			if tt.wantErr == "" && err != nil {
				t.Fatalf("Validate() error = %v, want nil", err)
			}
			if tt.wantErr == "" {
				return
			}
			if err == nil {
				t.Fatalf("Validate() error = nil, want %q", tt.wantErr)
			}
			if !strings.Contains(err.Error(), tt.wantErr) {
				t.Fatalf("Validate() error = %q, want substring %q", err.Error(), tt.wantErr)
			}
		})
	}
}
