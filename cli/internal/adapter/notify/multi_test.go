package notify

import (
	"context"
	"errors"
	"testing"

	"github.com/kazuki-kanaya/obsern/cli/internal/domain/job"
)

func TestMultiNotifierNotify(t *testing.T) {
	t.Parallel()

	t.Run("notifies all providers in order", func(t *testing.T) {
		t.Parallel()

		var called []string
		notifier := MultiNotifier{
			notifiers: []Provider{
				providerFunc(func(context.Context, job.Job) error {
					called = append(called, "slack")
					return nil
				}),
				providerFunc(func(context.Context, job.Job) error {
					called = append(called, "discord")
					return nil
				}),
			},
		}

		if err := notifier.Notify(context.Background(), job.Job{}); err != nil {
			t.Fatalf("Notify() error = %v, want nil", err)
		}

		want := []string{"slack", "discord"}
		if len(called) != len(want) {
			t.Fatalf("calls len = %d, want %d", len(called), len(want))
		}
		for i := range want {
			if called[i] != want[i] {
				t.Fatalf("call[%d] = %q, want %q", i, called[i], want[i])
			}
		}
	})

	t.Run("returns wrapped provider error", func(t *testing.T) {
		t.Parallel()

		boom := errors.New("boom")
		notifier := MultiNotifier{
			notifiers: []Provider{
				providerFunc(func(context.Context, job.Job) error { return boom }),
			},
		}

		err := notifier.Notify(context.Background(), job.Job{})
		if err == nil {
			t.Fatal("Notify() error = nil, want wrapped error")
		}
		assertContains(t, err.Error(), "notify via provider[0]")
		assertContains(t, err.Error(), "notify.providerFunc")
		assertContains(t, err.Error(), "boom")
	})
}

type providerFunc func(context.Context, job.Job) error

func (fn providerFunc) Notify(ctx context.Context, j job.Job) error {
	return fn(ctx, j)
}
