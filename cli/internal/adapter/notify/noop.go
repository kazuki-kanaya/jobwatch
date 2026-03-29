package notify

import (
	"context"

	"github.com/kazuki-kanaya/obsern/cli/internal/domain/job"
)

type NoopNotifier struct{}

func NewNoopNotifier() NoopNotifier {
	return NoopNotifier{}
}

func (NoopNotifier) Notify(context.Context, job.Job) error {
	return nil
}

var _ Provider = (*NoopNotifier)(nil)
