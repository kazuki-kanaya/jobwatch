package slack

import (
	"fmt"
	"strings"
	"time"

	"github.com/kanaya/jobwatch/cli/internal/notifier"
)

type formattedMessage struct {
	Color    string
	Fallback string
	Title    string
	Text     string
}

func format(n notifier.Notification) formattedMessage {
	color := "#22c55e"
	statusLabel := "✅ SUCCESS"
	if !n.Success {
		color = "#ef4444"
		statusLabel = "❌ FAILED"
	}

	command := strings.TrimSpace(strings.Join(append([]string{n.Command}, n.Args...), " "))
	title := fmt.Sprintf("jobwatch / %s", n.Project)
	lines := []string{statusLabel}
	if command != "" {
		lines = append(lines, fmt.Sprintf("*Command*  `%s`", command))
	}
	lines = append(lines, "")
	if d := formatDuration(n.StartedAt, n.FinishedAt); d != "" {
		lines = append(lines, fmt.Sprintf("• *Duration:* %s", d))
	}
	if !n.StartedAt.IsZero() {
		lines = append(lines, fmt.Sprintf("• *Start:* %s", n.StartedAt.Format("2006-01-02 15:04:05")))
	}
	if !n.FinishedAt.IsZero() {
		lines = append(lines, fmt.Sprintf("• *Finish:* %s", n.FinishedAt.Format("2006-01-02 15:04:05")))
	}
	if len(n.Tags) > 0 {
		lines = append(lines, fmt.Sprintf("• *Tags:* %s", strings.Join(n.Tags, ", ")))
	}

	if n.Err != nil {
		lines = append(lines, "", fmt.Sprintf("*Error*  %v", n.Err))
	}
	if len(n.TailLines) > 0 {
		lines = append(lines, "", "*Last logs*", fmt.Sprintf("```%s```", strings.Join(n.TailLines, "\n")))
	}

	return formattedMessage{
		Color:    color,
		Fallback: title,
		Title:    title,
		Text:     strings.Join(lines, "\n"),
	}
}

func formatDuration(startedAt, finishedAt time.Time) string {
	if startedAt.IsZero() || finishedAt.IsZero() {
		return ""
	}
	d := finishedAt.Sub(startedAt)
	if d < time.Second {
		return "<1s"
	}

	d = d.Round(time.Second)
	h := int(d / time.Hour)
	m := int((d % time.Hour) / time.Minute)
	s := int((d % time.Minute) / time.Second)
	if h > 0 {
		return fmt.Sprintf("%dh %02dm %02ds", h, m, s)
	}
	return fmt.Sprintf("%dm %02ds", m, s)
}
