package api

import (
	"context"
	"io"
	"net/http"
	"strings"
	"testing"
	"time"

	"github.com/kazuki-kanaya/obsern/cli/internal/domain/job"
)

func TestNewReporter(t *testing.T) {
	t.Parallel()

	reporter, err := NewReporter(nil)
	if err == nil {
		t.Fatal("NewReporter() error = nil, want missing client error")
	}
	if reporter != nil {
		t.Fatalf("NewReporter() = %#v, want nil", reporter)
	}
}

func TestReporterStartRequiresRunningJob(t *testing.T) {
	t.Parallel()

	client := newClientWithTransport(t, "https://api.obsern.com", func(req *http.Request) (*http.Response, error) {
		t.Fatal("transport should not be called")
		return nil, nil
	})

	reporter, err := NewReporter(client)
	if err != nil {
		t.Fatalf("NewReporter() error = %v", err)
	}

	j, err := job.NewRunning("python train.py", nil, time.Date(2026, 3, 16, 10, 0, 0, 0, time.UTC))
	if err != nil {
		t.Fatalf("NewRunning() error = %v", err)
	}
	if err := j.Finish(job.StatusFinished, []string{"done"}, time.Date(2026, 3, 16, 10, 5, 0, 0, time.UTC)); err != nil {
		t.Fatalf("Finish() error = %v", err)
	}

	_, err = reporter.Start(context.Background(), j)
	if err == nil {
		t.Fatal("Start() error = nil, want running status error")
	}
	if !strings.Contains(err.Error(), "started job must be running") {
		t.Fatalf("Start() error = %q, want running status error", err.Error())
	}
}

func TestReporterStartMapsJobToCreateRequest(t *testing.T) {
	t.Parallel()

	var gotBody string

	client := newClientWithTransport(t, "https://api.obsern.com", func(req *http.Request) (*http.Response, error) {
		body, err := io.ReadAll(req.Body)
		if err != nil {
			t.Fatalf("read request body: %v", err)
		}
		gotBody = string(body)

		return jsonResponse(http.StatusCreated, `{"job_id":"job-123"}`), nil
	})

	reporter, err := NewReporter(client)
	if err != nil {
		t.Fatalf("NewReporter() error = %v", err)
	}

	startedAt := time.Date(2026, 3, 16, 10, 0, 0, 0, time.UTC)
	j, err := job.NewRunning("python train.py", []string{"ml", "nightly"}, startedAt)
	if err != nil {
		t.Fatalf("NewRunning() error = %v", err)
	}

	jobID, err := reporter.Start(context.Background(), j)
	if err != nil {
		t.Fatalf("Start() error = %v", err)
	}

	if jobID != "job-123" {
		t.Fatalf("jobID = %q, want %q", jobID, "job-123")
	}
	if !strings.Contains(gotBody, `"command":"python train.py"`) {
		t.Fatalf("body = %q, want command", gotBody)
	}
	if !strings.Contains(gotBody, `"started_at":"2026-03-16T10:00:00Z"`) {
		t.Fatalf("body = %q, want started_at", gotBody)
	}
}

func TestReporterFinishRequiresTerminalJob(t *testing.T) {
	t.Parallel()

	client := newClientWithTransport(t, "https://api.obsern.com", func(req *http.Request) (*http.Response, error) {
		t.Fatal("transport should not be called")
		return nil, nil
	})

	reporter, err := NewReporter(client)
	if err != nil {
		t.Fatalf("NewReporter() error = %v", err)
	}

	j, err := job.NewRunning("python train.py", nil, time.Date(2026, 3, 16, 10, 0, 0, 0, time.UTC))
	if err != nil {
		t.Fatalf("NewRunning() error = %v", err)
	}

	err = reporter.Finish(context.Background(), "job-123", j)
	if err == nil {
		t.Fatal("Finish() error = nil, want terminal status error")
	}
	if !strings.Contains(err.Error(), "finished job must be terminal") {
		t.Fatalf("Finish() error = %q, want terminal status error", err.Error())
	}
}

func TestReporterFinishMapsJobToUpdateRequest(t *testing.T) {
	t.Parallel()

	var gotBody string

	client := newClientWithTransport(t, "https://api.obsern.com", func(req *http.Request) (*http.Response, error) {
		body, err := io.ReadAll(req.Body)
		if err != nil {
			t.Fatalf("read request body: %v", err)
		}
		gotBody = string(body)

		return jsonResponse(http.StatusOK, ``), nil
	})

	reporter, err := NewReporter(client)
	if err != nil {
		t.Fatalf("NewReporter() error = %v", err)
	}

	startedAt := time.Date(2026, 3, 16, 10, 0, 0, 0, time.UTC)
	finishedAt := time.Date(2026, 3, 16, 10, 5, 0, 0, time.UTC)

	j, err := job.NewRunning("python train.py", []string{"ml"}, startedAt)
	if err != nil {
		t.Fatalf("NewRunning() error = %v", err)
	}
	if err := j.Finish(job.StatusFailed, []string{"traceback"}, finishedAt); err != nil {
		t.Fatalf("Finish() error = %v", err)
	}

	if err := reporter.Finish(context.Background(), "job-123", j); err != nil {
		t.Fatalf("Finish() error = %v", err)
	}

	if !strings.Contains(gotBody, `"status":"failed"`) {
		t.Fatalf("body = %q, want failed status", gotBody)
	}
	if !strings.Contains(gotBody, `"tail_lines":["traceback"]`) {
		t.Fatalf("body = %q, want tail_lines", gotBody)
	}
	if !strings.Contains(gotBody, `"finished_at":"2026-03-16T10:05:00Z"`) {
		t.Fatalf("body = %q, want finished_at", gotBody)
	}
}
