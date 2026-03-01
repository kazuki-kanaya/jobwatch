package config

import "testing"

func TestValidate_FailsWhenAPIAndNotifyAreBothDisabled(t *testing.T) {
	cfg := Config{
		Project: Project{Name: "test"},
		API: API{
			Enabled: false,
		},
		Run: Run{
			LogTail: 80,
		},
		Notify: Notify{
			Enabled: false,
		},
	}

	if err := cfg.Validate(); err == nil {
		t.Fatal("expected validation error when api.enabled and notify.enabled are both false")
	}
}

func TestValidate_SkipsChannelValidationWhenNotifyDisabled(t *testing.T) {
	cfg := Config{
		Project: Project{Name: "test"},
		API: API{
			Enabled: true,
			BaseURL: "http://localhost:8000",
			Token:   "token",
		},
		Run: Run{
			LogTail: 80,
		},
		Notify: Notify{
			Enabled: false,
			Channels: []Channel{
				{
					Kind:     "slack",
					Settings: map[string]any{},
				},
			},
		},
	}

	if err := cfg.Validate(); err != nil {
		t.Fatalf("validate should succeed when notify.enabled=false: %v", err)
	}
}
