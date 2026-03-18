package notify

import (
	"context"

	"github.com/kazuki-kanaya/obsern/cli/internal/domain/job"
	"github.com/kazuki-kanaya/obsern/cli/internal/run"
)

type NoopNotifier struct{}

func NewNoopNotifier() run.Notifier {
	return NoopNotifier{}
}

func (NoopNotifier) Notify(context.Context, job.Job) error {
	return nil
}
