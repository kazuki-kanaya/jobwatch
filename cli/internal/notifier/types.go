package notifier

import (
	"context"
	"time"
)

type Notification struct {
	Project string
	Tags    []string

	Success bool

	Command   string
	Args      []string
	Err       error
	TailLines []string

	StartedAt  time.Time
	FinishedAt time.Time
}

type Notifier interface {
	Notify(ctx context.Context, msg string) error
}
