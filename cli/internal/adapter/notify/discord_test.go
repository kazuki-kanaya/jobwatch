package notify

import (
	"context"
	"encoding/json"
	"io"
	"net/http"
	"testing"
	"time"

	"github.com/kazuki-kanaya/obsern/cli/internal/domain/job"
)

func TestNewDiscordNotifier(t *testing.T) {
	t.Parallel()

	tests := []struct {
		name       string
		webhookURL string
		timeZone   string
		wantErr    string
		wantZone   string
	}{
		{
			name:    "rejects empty webhook url",
			wantErr: "webhookURL is required",
		},
		{
			name:       "rejects invalid webhook url",
			webhookURL: "://bad-url",
			wantErr:    "webhookURL must be a valid URL",
		},
		{
			name:       "rejects relative webhook url",
			webhookURL: "/hooks/discord",
			wantErr:    "webhookURL must be an absolute URL",
		},
		{
			name:       "rejects invalid time zone",
			webhookURL: "https://discord.com/api/webhooks/test/token",
			timeZone:   "JST",
			wantErr:    "timeZone must be a valid IANA time zone",
		},
		{
			name:       "defaults to utc",
			webhookURL: "https://discord.com/api/webhooks/test/token",
			wantZone:   "UTC",
		},
		{
			name:       "uses configured time zone",
			webhookURL: "https://discord.com/api/webhooks/test/token",
			timeZone:   "Asia/Tokyo",
			wantZone:   "Asia/Tokyo",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			t.Parallel()

			notifier, err := NewDiscordNotifier(tt.webhookURL, tt.timeZone)
			if tt.wantErr != "" {
				if err == nil {
					t.Fatalf("NewDiscordNotifier() error = nil, want %q", tt.wantErr)
				}
				assertContains(t, err.Error(), tt.wantErr)
				return
			}

			if err != nil {
				t.Fatalf("NewDiscordNotifier() error = %v, want nil", err)
			}
			if notifier.location == nil {
				t.Fatal("location is nil")
			}
			if notifier.location.String() != tt.wantZone {
				t.Fatalf("location = %q, want %q", notifier.location.String(), tt.wantZone)
			}
		})
	}
}

func TestDiscordNotifierNotify(t *testing.T) {
	t.Parallel()

	t.Run("sends expected embed payload", func(t *testing.T) {
		t.Parallel()

		startedAt := time.Date(2026, 3, 17, 1, 0, 0, 0, time.UTC)
		finishedAt := time.Date(2026, 3, 17, 1, 5, 0, 0, time.UTC)

		j, err := job.NewRunning("python train.py", []string{"ml"}, startedAt)
		if err != nil {
			t.Fatalf("NewRunning() error = %v", err)
		}
		if err := j.Finish(job.StatusFinished, []string{"done"}, finishedAt); err != nil {
			t.Fatalf("Finish() error = %v", err)
		}

		var (
			gotMethod      string
			gotURL         string
			gotContentType string
			gotPayload     discordWebhookPayload
		)

		notifier := newDiscordNotifierWithTransport(t, "Asia/Tokyo", func(req *http.Request) (*http.Response, error) {
			gotMethod = req.Method
			gotURL = req.URL.String()
			gotContentType = req.Header.Get("Content-Type")

			body, err := io.ReadAll(req.Body)
			if err != nil {
				t.Fatalf("ReadAll() error = %v", err)
			}
			if err := json.Unmarshal(body, &gotPayload); err != nil {
				t.Fatalf("Unmarshal() error = %v", err)
			}

			return webhookResponse(http.StatusNoContent, ""), nil
		})

		if err := notifier.Notify(context.Background(), j); err != nil {
			t.Fatalf("Notify() error = %v, want nil", err)
		}

		if gotMethod != http.MethodPost {
			t.Fatalf("method = %q, want %q", gotMethod, http.MethodPost)
		}
		if gotURL != "https://discord.com/api/webhooks/test/token" {
			t.Fatalf("url = %q, want %q", gotURL, "https://discord.com/api/webhooks/test/token")
		}
		if gotContentType != "application/json" {
			t.Fatalf("content-type = %q, want %q", gotContentType, "application/json")
		}
		if len(gotPayload.Embeds) != 1 {
			t.Fatalf("embeds len = %d, want 1", len(gotPayload.Embeds))
		}
		if gotPayload.Embeds[0].Title != "✅ SUCCESS" {
			t.Fatalf("title = %q, want %q", gotPayload.Embeds[0].Title, "✅ SUCCESS")
		}
		if gotPayload.Embeds[0].Color != 0x22C55E {
			t.Fatalf("color = %d, want %d", gotPayload.Embeds[0].Color, 0x22C55E)
		}
		assertContains(t, gotPayload.Embeds[0].Description, "*Command*: `python train.py`")
		assertContains(t, gotPayload.Embeds[0].Description, "*Started*: 2026-03-17 10:00:00 JST")
		assertContains(t, gotPayload.Embeds[0].Description, "*Finished*: 2026-03-17 10:05:00 JST")
		assertContains(t, gotPayload.Embeds[0].Description, "*Duration*: 5m0s")
		assertContains(t, gotPayload.Embeds[0].Description, "*Tail*:\n```\ndone\n```")
	})

	t.Run("returns webhook error body", func(t *testing.T) {
		t.Parallel()

		startedAt := time.Date(2026, 3, 17, 1, 0, 0, 0, time.UTC)
		finishedAt := time.Date(2026, 3, 17, 1, 5, 0, 0, time.UTC)

		j, err := job.NewRunning("python train.py", nil, startedAt)
		if err != nil {
			t.Fatalf("NewRunning() error = %v", err)
		}
		if err := j.Finish(job.StatusFailed, []string{"boom"}, finishedAt); err != nil {
			t.Fatalf("Finish() error = %v", err)
		}

		notifier := newDiscordNotifierWithTransport(t, "", func(req *http.Request) (*http.Response, error) {
			return webhookResponse(http.StatusBadRequest, "invalid payload"), nil
		})

		err = notifier.Notify(context.Background(), j)
		if err == nil {
			t.Fatal("Notify() error = nil, want webhook error")
		}
		assertContains(t, err.Error(), "discord webhook failed with status 400: invalid payload")
	})
}

func newDiscordNotifierWithTransport(t *testing.T, timeZone string, fn func(*http.Request) (*http.Response, error)) *DiscordNotifier {
	t.Helper()

	notifier, err := NewDiscordNotifier("https://discord.com/api/webhooks/test/token", timeZone)
	if err != nil {
		t.Fatalf("NewDiscordNotifier() error = %v", err)
	}

	notifier.httpClient.Transport = roundTripFunc(fn)
	return notifier
}
