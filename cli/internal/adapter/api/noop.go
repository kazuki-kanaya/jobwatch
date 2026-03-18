package api

import (
	"context"

	"github.com/kazuki-kanaya/obsern/cli/internal/domain/job"
	"github.com/kazuki-kanaya/obsern/cli/internal/run"
)

type NoopReporter struct{}

func NewNoopReporter() run.JobReporter {
	return NoopReporter{}
}

func (NoopReporter) Start(context.Context, job.Job) (string, error) {
	return "", nil
}

func (NoopReporter) Finish(context.Context, string, job.Job) error {
	return nil
}
