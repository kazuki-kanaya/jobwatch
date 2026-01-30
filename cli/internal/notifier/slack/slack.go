package slack

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"

	"github.com/kanaya/jobwatch/cli/internal/notifier"
)

type SlackNotifier struct {
	WebhookURL string
	Client     *http.Client
}

func New(tr *http.Transport, webhookURL string) *SlackNotifier {
	return &SlackNotifier{
		WebhookURL: webhookURL,
		Client:     &http.Client{Transport: tr, Timeout: 5 * time.Second},
	}
}

func (s *SlackNotifier) Notify(ctx context.Context, n notifier.Notification) error {
	msg := format(n)
	payload := map[string]any{
		"text": msg,
	}
	body, err := json.Marshal(payload)
	if err != nil {
		return err
	}

	req, err := http.NewRequestWithContext(ctx, "POST", s.WebhookURL, bytes.NewReader(body))
	if err != nil {
		return err
	}
	req.Header.Set("Content-Type", "application/json")

	resp, err := s.Client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		b, _ := io.ReadAll(io.LimitReader(resp.Body, 2048))
		return fmt.Errorf("slack webhook failed: %s: %s", resp.Status, string(b))
	}
	return nil
}
