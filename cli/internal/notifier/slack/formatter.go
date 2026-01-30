package slack

import (
	"fmt"
	"strings"
	"time"

	"github.com/kanaya/jobwatch/cli/internal/notifier"
)

func format(n notifier.Notification) string {
	// ===== Status =====
	icon := "✅"
	status := "SUCCESS"
	if !n.Success {
		icon = "❌"
		status = "FAILED"
	}

	// ===== Command =====
	cmd := strings.TrimSpace(
		strings.Join(append([]string{n.Command}, n.Args...), " "),
	)

	lines := []string{
		"━━━━━━━━━━━━━━━━━━━━",
		fmt.Sprintf("🚀 *%s* — %s *%s*", n.Project, icon, status),
		"━━━━━━━━━━━━━━━━━━━━",
	}

	// ===== Command block =====
	if cmd != "" {
		lines = append(lines,
			"🧾 *Command*",
			fmt.Sprintf("`%s`", cmd),
		)
	}

	// ===== Timing =====
	if !n.StartedAt.IsZero() || !n.FinishedAt.IsZero() {
		lines = append(lines, "", "⏱ *Timing*")

		if !n.StartedAt.IsZero() {
			lines = append(lines,
				fmt.Sprintf("Start   : %s", n.StartedAt.Format("2006-01-02 15:04:05")),
			)
		}
		if !n.FinishedAt.IsZero() {
			lines = append(lines,
				fmt.Sprintf("Finish  : %s", n.FinishedAt.Format("2006-01-02 15:04:05")),
			)
		}
		if !n.StartedAt.IsZero() && !n.FinishedAt.IsZero() {
			d := n.FinishedAt.Sub(n.StartedAt)

			var dur string
			if d < time.Second {
				dur = "<1s"
			} else {
				d = d.Round(time.Second)
				h := int(d / time.Hour)
				m := int((d % time.Hour) / time.Minute)
				s := int((d % time.Minute) / time.Second)
				dur = fmt.Sprintf("%dh %02dm %02ds", h, m, s)
			}

			lines = append(lines, fmt.Sprintf("Duration  : %s", dur))
		}
	}

	// ===== Tags =====
	if len(n.Tags) > 0 {
		lines = append(lines,
			"",
			"🏷 *Tags*",
			strings.Join(n.Tags, ", "),
		)
	}

	// ===== Error =====
	if n.Err != nil {
		lines = append(lines,
			"",
			"🔥 *Error*",
			fmt.Sprintf("```%v```", n.Err),
		)
	}

	// ===== Tail logs =====
	if len(n.TailLines) > 0 {
		lines = append(lines,
			"",
			"📄 *Last logs*",
			fmt.Sprintf("```%s```", strings.Join(n.TailLines, "\n")),
		)
	}

	return strings.Join(lines, "\n")
}
