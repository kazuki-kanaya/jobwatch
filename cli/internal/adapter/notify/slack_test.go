package notify

import (
	"context"
	"encoding/json"
	"io"
	"net/http"
	"strings"
	"testing"
	"time"

	"github.com/kazuki-kanaya/obsern/cli/internal/domain/job"
)

func TestNewSlackNotifier(t *testing.T) {
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
			webhookURL: "/hooks/slack",
			wantErr:    "webhookURL must be an absolute URL",
		},
		{
			name:       "rejects invalid time zone",
			webhookURL: "https://hooks.slack.com/services/test",
			timeZone:   "JST",
			wantErr:    "timeZone must be a valid IANA time zone",
		},
		{
			name:       "defaults to utc",
			webhookURL: "https://hooks.slack.com/services/test",
			wantZone:   "UTC",
		},
		{
			name:       "uses configured time zone",
			webhookURL: "https://hooks.slack.com/services/test",
			timeZone:   "Asia/Tokyo",
			wantZone:   "Asia/Tokyo",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			t.Parallel()

			notifier, err := NewSlackNotifier(tt.webhookURL, tt.timeZone)
			if tt.wantErr != "" {
				if err == nil {
					t.Fatalf("NewSlackNotifier() error = nil, want %q", tt.wantErr)
				}
				assertContains(t, err.Error(), tt.wantErr)
				return
			}

			if err != nil {
				t.Fatalf("NewSlackNotifier() error = %v, want nil", err)
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

func TestSlackNotifierNotify(t *testing.T) {
	t.Parallel()

	t.Run("sends expected payload", func(t *testing.T) {
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
			gotPayload     slackWebhookPayload
		)

		notifier := newSlackNotifierWithTransport(t, "Asia/Tokyo", func(req *http.Request) (*http.Response, error) {
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

			return webhookResponse(http.StatusOK, "ok"), nil
		})

		if err := notifier.Notify(context.Background(), j); err != nil {
			t.Fatalf("Notify() error = %v, want nil", err)
		}

		if gotMethod != http.MethodPost {
			t.Fatalf("method = %q, want %q", gotMethod, http.MethodPost)
		}
		if gotURL != "https://hooks.slack.com/services/test" {
			t.Fatalf("url = %q, want %q", gotURL, "https://hooks.slack.com/services/test")
		}
		if gotContentType != "application/json" {
			t.Fatalf("content-type = %q, want %q", gotContentType, "application/json")
		}
		if len(gotPayload.Attachments) != 1 {
			t.Fatalf("attachments len = %d, want 1", len(gotPayload.Attachments))
		}
		if gotPayload.Attachments[0].Color != "good" {
			t.Fatalf("color = %q, want %q", gotPayload.Attachments[0].Color, "good")
		}
		assertContains(t, gotPayload.Attachments[0].Text, "*Command*: `python train.py`")
		assertContains(t, gotPayload.Attachments[0].Text, "*Started*: 2026-03-17 10:00:00 JST")
		assertContains(t, gotPayload.Attachments[0].Text, "*Finished*: 2026-03-17 10:05:00 JST")
		assertContains(t, gotPayload.Attachments[0].Text, "*Duration*: 5m0s")
		assertContains(t, gotPayload.Attachments[0].Text, "*Tail*:\n```\ndone\n```")
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

		notifier := newSlackNotifierWithTransport(t, "", func(req *http.Request) (*http.Response, error) {
			return webhookResponse(http.StatusBadRequest, "invalid payload"), nil
		})

		err = notifier.Notify(context.Background(), j)
		if err == nil {
			t.Fatal("Notify() error = nil, want webhook error")
		}
		assertContains(t, err.Error(), "slack webhook failed with status 400: invalid payload")
	})

	t.Run("returns body free webhook error when body is empty", func(t *testing.T) {
		t.Parallel()

		startedAt := time.Date(2026, 3, 17, 1, 0, 0, 0, time.UTC)
		finishedAt := time.Date(2026, 3, 17, 1, 5, 0, 0, time.UTC)

		j, err := job.NewRunning("python train.py", nil, startedAt)
		if err != nil {
			t.Fatalf("NewRunning() error = %v", err)
		}
		if err := j.Finish(job.StatusCanceled, nil, finishedAt); err != nil {
			t.Fatalf("Finish() error = %v", err)
		}

		notifier := newSlackNotifierWithTransport(t, "", func(req *http.Request) (*http.Response, error) {
			return webhookResponse(http.StatusInternalServerError, ""), nil
		})

		err = notifier.Notify(context.Background(), j)
		if err == nil {
			t.Fatal("Notify() error = nil, want webhook error")
		}
		if err.Error() != "slack webhook failed with status 500" {
			t.Fatalf("Notify() error = %q, want %q", err.Error(), "slack webhook failed with status 500")
		}
	})

	t.Run("rejects non terminal job", func(t *testing.T) {
		t.Parallel()

		j, err := job.NewRunning("python train.py", nil, time.Date(2026, 3, 17, 1, 0, 0, 0, time.UTC))
		if err != nil {
			t.Fatalf("NewRunning() error = %v", err)
		}

		notifier := newSlackNotifierWithTransport(t, "", func(req *http.Request) (*http.Response, error) {
			t.Fatal("unexpected HTTP request")
			return nil, nil
		})

		err = notifier.Notify(context.Background(), j)
		if err == nil {
			t.Fatal("Notify() error = nil, want terminal status error")
		}
		assertContains(t, err.Error(), "job must be terminal")
	})
}

func TestNoopNotifierNotify(t *testing.T) {
	t.Parallel()

	j := job.Job{Command: "python train.py"}
	if err := (NoopNotifier{}).Notify(context.Background(), j); err != nil {
		t.Fatalf("Notify() error = %v, want nil", err)
	}
}

func newSlackNotifierWithTransport(t *testing.T, timeZone string, fn func(*http.Request) (*http.Response, error)) *SlackNotifier {
	t.Helper()

	notifier, err := NewSlackNotifier("https://hooks.slack.com/services/test", timeZone)
	if err != nil {
		t.Fatalf("NewSlackNotifier() error = %v", err)
	}

	notifier.httpClient.Transport = roundTripFunc(fn)
	return notifier
}

func webhookResponse(statusCode int, body string) *http.Response {
	return &http.Response{
		StatusCode: statusCode,
		Header:     make(http.Header),
		Body:       io.NopCloser(strings.NewReader(body)),
	}
}

type roundTripFunc func(*http.Request) (*http.Response, error)

func (fn roundTripFunc) RoundTrip(req *http.Request) (*http.Response, error) {
	return fn(req)
}
