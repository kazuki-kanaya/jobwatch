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

	"github.com/kazuki-kanaya/obsern/cli/internal/domain/job"
)

type DiscordNotifier struct {
	webhookURL string
	location   *time.Location
	httpClient *http.Client
}

type discordWebhookPayload struct {
	Embeds []discordEmbed `json:"embeds"`
}

type discordEmbed struct {
	Title       string `json:"title,omitempty"`
	Description string `json:"description,omitempty"`
	Color       int    `json:"color,omitempty"`
}

func (n *DiscordNotifier) Notify(ctx context.Context, j job.Job) error {
	text, err := buildText(j, n.location)
	if err != nil {
		return err
	}

	payload := discordWebhookPayload{
		Embeds: []discordEmbed{
			{
				Title:       discordStatusTitle(j.Status),
				Description: text,
				Color:       discordColor(j.Status),
			},
		},
	}

	body, err := json.Marshal(payload)
	if err != nil {
		return fmt.Errorf("marshal discord payload: %w", err)
	}

	req, err := http.NewRequestWithContext(ctx, http.MethodPost, n.webhookURL, bytes.NewReader(body))
	if err != nil {
		return fmt.Errorf("build discord request: %w", err)
	}
	req.Header.Set("Content-Type", "application/json")

	resp, err := n.httpClient.Do(req)
	if err != nil {
		return fmt.Errorf("send discord request: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode < http.StatusOK || resp.StatusCode >= http.StatusMultipleChoices {
		responseBody, err := io.ReadAll(io.LimitReader(resp.Body, 4096))
		if err != nil {
			return fmt.Errorf("discord webhook failed with status %d", resp.StatusCode)
		}

		message := strings.TrimSpace(string(responseBody))
		if message == "" {
			return fmt.Errorf("discord webhook failed with status %d", resp.StatusCode)
		}
		return fmt.Errorf("discord webhook failed with status %d: %s", resp.StatusCode, message)
	}

	io.Copy(io.Discard, resp.Body)
	return nil
}

func NewDiscordNotifier(webhookURL string, timeZone string) (*DiscordNotifier, error) {
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

	return &DiscordNotifier{
		webhookURL: webhookURL,
		location:   loc,
		httpClient: &http.Client{Timeout: 10 * time.Second},
	}, nil
}

func discordStatusTitle(status job.Status) string {
	switch status {
	case job.StatusFinished:
		return "✅ SUCCESS"
	case job.StatusFailed:
		return "❌ FAILED"
	case job.StatusCanceled:
		return "⚠️ CANCELED"
	default:
		return "❔ UNKNOWN"
	}
}

func discordColor(status job.Status) int {
	switch status {
	case job.StatusFinished:
		return 0x22C55E
	case job.StatusFailed:
		return 0xEF4444
	case job.StatusCanceled:
		return 0xF59E0B
	default:
		return 0x6B7280
	}
}

var _ Provider = (*DiscordNotifier)(nil)
