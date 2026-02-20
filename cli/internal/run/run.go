package run

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/kazuki-kanaya/jobwatch/cli/internal/config"
	"github.com/kazuki-kanaya/jobwatch/cli/internal/jobtracker"
	"github.com/kazuki-kanaya/jobwatch/cli/internal/notifier"
	"github.com/kazuki-kanaya/jobwatch/cli/internal/notifier/slack"
	"github.com/kazuki-kanaya/jobwatch/cli/internal/runner"
)

type Runner struct {
	cfg       config.Config
	exec      runner.Runner
	tracker   jobtracker.JobTracker
	notifiers []notifier.Notifier
}

type Report struct {
	Result              runner.Result
	TrackingStartError  error
	TrackingFinishError error
	NotifyError         error
}

func NewRunner(cfg config.Config, transport *http.Transport) (*Runner, error) {
	tr, err := setupTracker(cfg, transport)
	if err != nil {
		return nil, err
	}

	ns, err := setupNotifiers(cfg, transport)
	if err != nil {
		return nil, err
	}

	return &Runner{
		cfg:       cfg,
		exec:      runner.NewExecutor(cfg.Run.LogTail),
		tracker:   tr,
		notifiers: ns,
	}, nil
}

func (r *Runner) Execute(ctx context.Context, command string, commandArgs []string) Report {
	startedAt := time.Now()
	jobID, startErr := r.tracker.Start(ctx, jobtracker.StartRequest{
		Project:   r.cfg.Project.Name,
		Command:   command,
		Args:      commandArgs,
		Tags:      r.cfg.Project.Tags,
		StartedAt: startedAt,
	})
	if jobID != "" {
		fmt.Fprintf(os.Stderr, "[Jobwatch] 🚀 Job started: %s\n", jobID)
	}

	result := r.exec.Run(ctx, command, commandArgs)
	result.StartedAt = startedAt

	var finishErr error
	if jobID != "" {
		status, errMsg := toFinishState(ctx, result.Err)
		finishCtx, finishCancel := withFinishContext(ctx)
		defer finishCancel()

		finishErr = r.tracker.Finish(finishCtx, jobID, jobtracker.FinishRequest{
			Status:     status,
			Err:        errMsg,
			TailLines:  result.TailLines,
			FinishedAt: result.FinishedAt,
		})
	}

	notification := notifier.Notification{
		Project:    r.cfg.Project.Name,
		Tags:       r.cfg.Project.Tags,
		Command:    command,
		Args:       commandArgs,
		Success:    result.Err == nil,
		Err:        result.Err,
		TailLines:  result.TailLines,
		StartedAt:  result.StartedAt,
		FinishedAt: result.FinishedAt,
	}

	var notifyErr error
	if shouldNotify(r.cfg, notification.Success) {
		var errs []error
		for _, n := range r.notifiers {
			if err := n.Notify(ctx, notification); err != nil {
				errs = append(errs, err)
			}
		}
		if len(errs) > 0 {
			notifyErr = errors.Join(errs...)
		}
	}

	return Report{
		Result:              result,
		TrackingStartError:  startErr,
		TrackingFinishError: finishErr,
		NotifyError:         notifyErr,
	}
}

func toFinishState(ctx context.Context, runErr error) (jobtracker.JobStatus, string) {
	if runErr == nil {
		return jobtracker.JobStatusFinished, ""
	}
	if errors.Is(ctx.Err(), context.Canceled) {
		return jobtracker.JobStatusCanceled, "canceled"
	}
	return jobtracker.JobStatusFailed, runErr.Error()
}

func withFinishContext(ctx context.Context) (context.Context, context.CancelFunc) {
	if errors.Is(ctx.Err(), context.Canceled) {
		return context.WithTimeout(context.Background(), 5*time.Second)
	}
	return ctx, func() {}
}

func setupTracker(cfg config.Config, transport *http.Transport) (jobtracker.JobTracker, error) {
	if !cfg.API.Enabled {
		return jobtracker.NewNoopTracker(), nil
	}
	if cfg.API.BaseURL == "" || cfg.API.Token == "" {
		return nil, errors.New("api is enabled but base_url or token is missing")
	}
	return jobtracker.NewAPIClient(transport, cfg.API.BaseURL, cfg.API.Token), nil
}

func setupNotifiers(cfg config.Config, transport *http.Transport) ([]notifier.Notifier, error) {
	var ns []notifier.Notifier

	for i, ch := range cfg.Notify.Channels {
		switch ch.Kind {
		case "slack":
			webhookURL, ok := ch.Settings["webhook_url"].(string)
			if !ok || webhookURL == "" {
				return nil, fmt.Errorf("notify.channels[%d].settings.webhook_url must be a non-empty string", i)
			}
			ns = append(ns, slack.New(transport, webhookURL))
		default:
			return nil, fmt.Errorf("notify.channels[%d].kind is not supported: %s", i, ch.Kind)
		}
	}

	return ns, nil
}

func shouldNotify(cfg config.Config, success bool) bool {
	return (success && cfg.Notify.OnSuccess) || (!success && cfg.Notify.OnFailure)
}
