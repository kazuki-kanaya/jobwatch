package dispatch

import (
	"context"
	"errors"
	"fmt"

	"github.com/kanaya/jobwatch/cli/internal/config"
	"github.com/kanaya/jobwatch/cli/internal/notifier"
	"github.com/kanaya/jobwatch/cli/internal/notifier/slack"
	"github.com/kanaya/jobwatch/cli/internal/runner"
)

type channel struct {
	kind     string
	notifier notifier.Notifier
	format   func(notifier.Notification) string
}

type Dispatcher struct {
	cfg      config.Config
	channels []channel
}

func New(cfg config.Config) (*Dispatcher, error) {
	d := &Dispatcher{cfg: cfg}

	for i, ch := range cfg.Notify.Channels {
		switch ch.Kind {
		case "slack":
			v, ok := ch.Settings["webhook_url"]
			if !ok {
				return nil, fmt.Errorf("notify.channels[%d].settings.webhook_url is required", i)
			}
			webhook, ok := v.(string)
			if !ok || webhook == "" {
				return nil, fmt.Errorf("notify.channels[%d].settings.webhook_url must be a non-empty string", i)
			}

			d.channels = append(d.channels, channel{
				kind:     "slack",
				notifier: slack.New(webhook),
				format:   slack.Format,
			})
		default:
			return nil, fmt.Errorf("notify.channels[%d].kind is not supported: %s", i, ch.Kind)
		}
	}

	return d, nil
}

func (d *Dispatcher) FanOut(ctx context.Context, n notifier.Notification) error {
	if n.Success && !d.cfg.Notify.OnSuccess {
		return nil
	}
	if !n.Success && !d.cfg.Notify.OnFailure {
		return nil
	}

	var errs []error
	for _, ch := range d.channels {
		msg := ch.format(n)
		if err := ch.notifier.Notify(ctx, msg); err != nil {
			errs = append(errs, fmt.Errorf("%s notify failed: %w", ch.kind, err))
		}
	}
	return errors.Join(errs...)
}

func (d *Dispatcher) BuildNotification(command string, args []string, result runner.Result) notifier.Notification {
	return notifier.Notification{
		Project:    d.cfg.Project.Name,
		Tags:       d.cfg.Project.Tags,
		Command:    command,
		Args:       args,
		Success:    result.Err == nil,
		StartedAt:  result.StartedAt,
		FinishedAt: result.FinishedAt,
	}
}
