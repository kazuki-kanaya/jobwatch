package notify

import (
	"fmt"
	"strings"
	"time"

	"github.com/kazuki-kanaya/obsern/new-cli/internal/domain/job"
)

func buildText(j job.Job, loc *time.Location) (string, error) {
	if !j.Status.IsTerminal() {
		return "", fmt.Errorf("job must be terminal: %q", j.Status)
	}
	if j.FinishedAt == nil {
		return "", fmt.Errorf("job must include finished_at")
	}
	if loc == nil {
		loc = time.UTC
	}

	var b strings.Builder

	fmt.Fprintf(&b, "*Obsern job %s*\n", j.Status)
	fmt.Fprintf(&b, "Command: `%s`\n", j.Command)
	if len(j.Tags) > 0 {
		fmt.Fprintf(&b, "Tags: %s\n", formatTags(j.Tags))
	}
	fmt.Fprintf(&b, "Started: %s\n", formatTime(j.StartedAt, loc))
	fmt.Fprintf(&b, "Finished: %s\n", formatTime(*j.FinishedAt, loc))

	if len(j.TailLines) > 0 {
		b.WriteString("\nTail:\n```\n")
		b.WriteString(strings.Join(j.TailLines, "\n"))
		b.WriteString("\n```")
	}

	return strings.TrimRight(b.String(), "\n"), nil
}

func formatTime(value time.Time, loc *time.Location) string {
	return value.In(loc).Format("2006-01-02 15:04:05 MST")
}

func formatTags(tags []string) string {
	return strings.Join(tags, ", ")
}
