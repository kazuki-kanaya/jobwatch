package runapp

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"time"

	"github.com/kanaya/jobwatch/cli/internal/config"
	"github.com/kanaya/jobwatch/cli/internal/jobtracker"
	"github.com/kanaya/jobwatch/cli/internal/notifier"
	"github.com/kanaya/jobwatch/cli/internal/notifier/slack"
	"github.com/kanaya/jobwatch/cli/internal/runner"
)

type Service struct {
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

func New(cfg config.Config, transport *http.Transport) (*Service, error) {
	tr, err := setupTracker(cfg, transport)
	if err != nil {
		return nil, err
	}

	ns, err := setupNotifiers(cfg, transport)
	if err != nil {
		return nil, err
	}

	return &Service{
		cfg:       cfg,
		exec:      runner.NewExecutor(cfg.Run.LogTail),
		tracker:   tr,
		notifiers: ns,
	}, nil
}

func (s *Service) Execute(ctx context.Context, command string, commandArgs []string) Report {
	startedAt := time.Now()
	jobID, startErr := s.tracker.Start(ctx, jobtracker.StartRequest{
		Project:   s.cfg.Project.Name,
		Command:   command,
		Args:      commandArgs,
		Tags:      s.cfg.Project.Tags,
		StartedAt: startedAt,
	})

	result := s.exec.Run(ctx, command, commandArgs)
	result.StartedAt = startedAt

	var finishErr error
	if jobID != "" {
		status := jobtracker.JobStatusFinished
		errMsg := ""
		if result.Err != nil {
			status = jobtracker.JobStatusFailed
			errMsg = result.Err.Error()
		}

		finishErr = s.tracker.Finish(ctx, jobID, jobtracker.FinishRequest{
			Status:     status,
			Err:        errMsg,
			TailLines:  result.TailLines,
			FinishedAt: result.FinishedAt,
		})
	}

	notification := notifier.Notification{
		Project:    s.cfg.Project.Name,
		Tags:       s.cfg.Project.Tags,
		Command:    command,
		Args:       commandArgs,
		Success:    result.Err == nil,
		Err:        result.Err,
		TailLines:  result.TailLines,
		StartedAt:  result.StartedAt,
		FinishedAt: result.FinishedAt,
	}

	var notifyErr error
	if shouldNotify(s.cfg, notification.Success) {
		var errs []error
		for _, n := range s.notifiers {
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
