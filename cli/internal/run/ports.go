package run

import (
	"context"
	"time"

	"github.com/kazuki-kanaya/obsern/cli/internal/domain/execution"
	"github.com/kazuki-kanaya/obsern/cli/internal/domain/job"
)

type Executor interface {
	// Non-zero exit codes are reported in Execution, not as an error.
	// Errors are reserved for process startup or observation failures.
	Execute(ctx context.Context, req Request) (execution.Execution, error)
}

type JobReporter interface {
	// Start creates a remote job and returns its job ID.
	// It may return an empty job ID to indicate a no-op reporter.
	Start(ctx context.Context, job job.Job) (string, error)

	// Finish updates a previously created remote job.
	// It is called only when Start returns a non-empty job ID.
	Finish(ctx context.Context, jobID string, job job.Job) error
}

type Notifier interface {
	Notify(ctx context.Context, job job.Job) error
}

type Logger interface {
	Warnf(format string, args ...any)
}

type Clock interface {
	// Now() returns the current time in UTC.
	Now() time.Time
}
