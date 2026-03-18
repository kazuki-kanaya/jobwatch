package notify

import (
	"strings"
	"testing"
	"time"

	"github.com/kazuki-kanaya/obsern/cli/internal/domain/job"
)

func TestBuildText(t *testing.T) {
	t.Parallel()

	t.Run("builds terminal job text", func(t *testing.T) {
		t.Parallel()

		startedAt := time.Date(2026, 3, 17, 1, 0, 0, 0, time.UTC)
		finishedAt := time.Date(2026, 3, 17, 1, 5, 0, 0, time.UTC)

		j, err := job.NewRunning("python train.py", []string{"ml", "nightly"}, startedAt)
		if err != nil {
			t.Fatalf("NewRunning() error = %v", err)
		}
		if err := j.Finish(job.StatusFailed, []string{"line 1", "line 2"}, finishedAt); err != nil {
			t.Fatalf("Finish() error = %v", err)
		}

		loc, err := time.LoadLocation("Asia/Tokyo")
		if err != nil {
			t.Fatalf("LoadLocation() error = %v", err)
		}

		text, err := buildText(j, loc)
		if err != nil {
			t.Fatalf("buildText() error = %v", err)
		}

		assertContains(t, text, "*Obsern job failed*")
		assertContains(t, text, "Command: `python train.py`")
		assertContains(t, text, "Tags: ml, nightly")
		assertContains(t, text, "Started: 2026-03-17 10:00:00 JST")
		assertContains(t, text, "Finished: 2026-03-17 10:05:00 JST")
		assertContains(t, text, "Tail:\n```\nline 1\nline 2\n```")
	})

	t.Run("rejects non terminal job", func(t *testing.T) {
		t.Parallel()

		j, err := job.NewRunning("python train.py", nil, time.Date(2026, 3, 17, 1, 0, 0, 0, time.UTC))
		if err != nil {
			t.Fatalf("NewRunning() error = %v", err)
		}

		_, err = buildText(j, time.UTC)
		if err == nil {
			t.Fatal("buildText() error = nil, want terminal status error")
		}
		assertContains(t, err.Error(), "job must be terminal")
	})

	t.Run("rejects missing finished at", func(t *testing.T) {
		t.Parallel()

		j := job.Job{
			Command:   "python train.py",
			Status:    job.StatusFinished,
			StartedAt: time.Date(2026, 3, 17, 1, 0, 0, 0, time.UTC),
		}

		_, err := buildText(j, time.UTC)
		if err == nil {
			t.Fatal("buildText() error = nil, want missing finished_at error")
		}
		assertContains(t, err.Error(), "job must include finished_at")
	})
}

func assertContains(t *testing.T, got, want string) {
	t.Helper()

	if !strings.Contains(got, want) {
		t.Fatalf("got %q, want substring %q", got, want)
	}
}
