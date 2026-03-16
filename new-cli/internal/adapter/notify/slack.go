package notify

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strings"
	"time"

	"github.com/kazuki-kanaya/obsern/new-cli/internal/domain/job"
)

type SlackNotifier struct {
	webhookURL string
	location   *time.Location
	httpClient *http.Client
}

type slackWebhookPayload struct {
	Attachments []slackAttachment `json:"attachments"`
}

type slackAttachment struct {
	Color string `json:"color"`
	Text  string `json:"text"`
}

func slackColor(status job.Status) string {
	switch status {
	case job.StatusFinished:
		return "good"
	case job.StatusFailed:
		return "danger"
	case job.StatusCanceled:
		return "warning"
	default:
		return "#808080"
	}
}

func (n *SlackNotifier) Notify(ctx context.Context, j job.Job) error {
	text, err := buildText(j, n.location)
	if err != nil {
		return err
	}

	payload := slackWebhookPayload{
		Attachments: []slackAttachment{
			{
				Color: slackColor(j.Status),
				Text:  text,
			},
		},
	}

	body, err := json.Marshal(payload)
	if err != nil {
		return fmt.Errorf("marshal slack payload: %w", err)
	}

	req, err := http.NewRequestWithContext(ctx, http.MethodPost, n.webhookURL, bytes.NewReader(body))
	if err != nil {
		return fmt.Errorf("build slack request: %w", err)
	}
	req.Header.Set("Content-Type", "application/json")

	resp, err := n.httpClient.Do(req)
	if err != nil {
		return fmt.Errorf("send slack request: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode < http.StatusOK || resp.StatusCode >= http.StatusMultipleChoices {
		responseBody, err := io.ReadAll(io.LimitReader(resp.Body, 4096))
		if err != nil {
			return fmt.Errorf("slack webhook failed with status %d", resp.StatusCode)
		}

		message := strings.TrimSpace(string(responseBody))
		if message == "" {
			return fmt.Errorf("slack webhook failed with status %d", resp.StatusCode)
		}
		return fmt.Errorf("slack webhook failed with status %d: %s", resp.StatusCode, message)
	}

	// Drain the response body so the underlying HTTP connection can be reused.
	io.Copy(io.Discard, resp.Body)
	return nil
}

func NewSlackNotifier(webhookURL string, timeZone string) (*SlackNotifier, error) {
	if strings.TrimSpace(webhookURL) == "" {
		return nil, fmt.Errorf("webhookURL is required")
	}
	parsed, err := url.ParseRequestURI(webhookURL)
	if err != nil {
		return nil, fmt.Errorf("webhookURL must be a valid URL: %w", err)
	}
	if parsed.Scheme == "" || parsed.Host == "" {
		return nil, fmt.Errorf("webhookURL must be an absolute URL")
	}

	loc := time.UTC
	if strings.TrimSpace(timeZone) != "" {
		loaded, err := time.LoadLocation(timeZone)
		if err != nil {
			return nil, fmt.Errorf("timeZone must be a valid IANA time zone, got %q: %w", timeZone, err)
		}
		loc = loaded
	}

	return &SlackNotifier{
		webhookURL: webhookURL,
		location:   loc,
		httpClient: &http.Client{Timeout: 10 * time.Second},
	}, nil
}
