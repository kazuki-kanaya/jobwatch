package executor

import (
	"bytes"
	"context"
	"reflect"
	"testing"
	"time"

	"github.com/kazuki-kanaya/obsern/new-cli/internal/domain/job"
	"github.com/kazuki-kanaya/obsern/new-cli/internal/run"
)

func TestNewRejectsNilWriters(t *testing.T) {
	t.Parallel()

	if _, err := New(nil, &bytes.Buffer{}); err == nil {
		t.Fatal("expected error for nil stdout")
	}

	if _, err := New(&bytes.Buffer{}, nil); err == nil {
		t.Fatal("expected error for nil stderr")
	}
}

func TestExecuteFinishedCommand(t *testing.T) {
	t.Parallel()

	stdout := &bytes.Buffer{}
	stderr := &bytes.Buffer{}
	executor := mustNewExecutor(t, stdout, stderr)

	result, err := executor.Execute(context.Background(), run.Request{
		Command:   []string{"sh", "-c", "printf 'hello\\nworld'"},
		TailLines: 10,
	})
	if err != nil {
		t.Fatalf("Execute: %v", err)
	}

	if result.Status != job.StatusFinished {
		t.Fatalf("unexpected status: got %q, want %q", result.Status, job.StatusFinished)
	}
	if result.ExitCode != job.SuccessExitCode {
		t.Fatalf("unexpected exit code: got %d, want %d", result.ExitCode, job.SuccessExitCode)
	}

	wantTail := []string{"hello", "world"}
	if !reflect.DeepEqual(result.TailLines, wantTail) {
		t.Fatalf("unexpected tail lines: got %v, want %v", result.TailLines, wantTail)
	}

	if got := stdout.String(); got != "hello\nworld" {
		t.Fatalf("unexpected stdout: got %q", got)
	}
	if got := stderr.String(); got != "" {
		t.Fatalf("unexpected stderr: got %q", got)
	}
}

func TestExecuteFailedCommand(t *testing.T) {
	t.Parallel()

	stdout := &bytes.Buffer{}
	stderr := &bytes.Buffer{}
	executor := mustNewExecutor(t, stdout, stderr)

	result, err := executor.Execute(context.Background(), run.Request{
		Command:   []string{"sh", "-c", "printf 'before\\nboom\\n'; exit 7"},
		TailLines: 10,
	})
	if err != nil {
		t.Fatalf("Execute: %v", err)
	}

	if result.Status != job.StatusFailed {
		t.Fatalf("unexpected status: got %q, want %q", result.Status, job.StatusFailed)
	}
	if result.ExitCode != 7 {
		t.Fatalf("unexpected exit code: got %d, want 7", result.ExitCode)
	}

	wantTail := []string{"before", "boom"}
	if !reflect.DeepEqual(result.TailLines, wantTail) {
		t.Fatalf("unexpected tail lines: got %v, want %v", result.TailLines, wantTail)
	}
}

func TestExecuteCanceledCommand(t *testing.T) {
	t.Parallel()

	stdout := &bytes.Buffer{}
	stderr := &bytes.Buffer{}
	executor := mustNewExecutor(t, stdout, stderr)

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	go func() {
		time.Sleep(100 * time.Millisecond)
		cancel()
	}()

	result, err := executor.Execute(ctx, run.Request{
		Command:   []string{"sh", "-c", "printf 'start\\n'; sleep 5"},
		TailLines: 10,
	})
	if err != nil {
		t.Fatalf("Execute: %v", err)
	}

	if result.Status != job.StatusCanceled {
		t.Fatalf("unexpected status: got %q, want %q", result.Status, job.StatusCanceled)
	}
	if result.ExitCode != job.CanceledExitCode {
		t.Fatalf("unexpected exit code: got %d, want %d", result.ExitCode, job.CanceledExitCode)
	}

	wantTail := []string{"start"}
	if !reflect.DeepEqual(result.TailLines, wantTail) {
		t.Fatalf("unexpected tail lines: got %v, want %v", result.TailLines, wantTail)
	}
}

func mustNewExecutor(t *testing.T, stdout, stderr *bytes.Buffer) *Executor {
	t.Helper()

	executor, err := New(stdout, stderr)
	if err != nil {
		t.Fatalf("New: %v", err)
	}

	return executor
}
