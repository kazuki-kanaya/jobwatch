package notify

import (
	"context"
	"fmt"

	"github.com/kazuki-kanaya/obsern/cli/internal/domain/job"
	"github.com/kazuki-kanaya/obsern/cli/internal/run"
)

type Provider interface {
	Notify(context.Context, job.Job) error
}

type MultiNotifier struct {
	notifiers []Provider
}

func NewMultiNotifier(notifiers ...Provider) run.Notifier {
	return MultiNotifier{notifiers: notifiers}
}

func (m MultiNotifier) Notify(ctx context.Context, j job.Job) error {
	for i, notifier := range m.notifiers {
		if err := notifier.Notify(ctx, j); err != nil {
			return fmt.Errorf("notify via provider[%d] (%T): %w", i, notifier, err)
		}
	}
	return nil
}

var _ run.Notifier = (*MultiNotifier)(nil)
