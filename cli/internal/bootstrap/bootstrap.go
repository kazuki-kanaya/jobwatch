package bootstrap

import (
	"fmt"
	"io"

	"github.com/kazuki-kanaya/obsern/cli/internal/adapter/api"
	"github.com/kazuki-kanaya/obsern/cli/internal/adapter/executor"
	"github.com/kazuki-kanaya/obsern/cli/internal/adapter/notify"
	"github.com/kazuki-kanaya/obsern/cli/internal/config"
	"github.com/kazuki-kanaya/obsern/cli/internal/run"
)

type RunDependencies struct {
	Service *run.Service
}

func BuildRunDependencies(cfg config.Config, stdout io.Writer, stderr io.Writer) (RunDependencies, error) {
	executor, err := executor.New(stdout, stderr)
	if err != nil {
		return RunDependencies{}, fmt.Errorf("create executor: %w", err)
	}
	reporter, err := buildReporter(cfg)
	if err != nil {
		return RunDependencies{}, fmt.Errorf("build reporter: %w", err)
	}

	notifier, err := buildNotifier(cfg)
	if err != nil {
		return RunDependencies{}, fmt.Errorf("build notifier: %w", err)
	}

	service, err := run.NewService(executor, reporter, notifier, NewLogger(), NewClock())
	if err != nil {
		return RunDependencies{}, fmt.Errorf("create run service: %w", err)
	}

	return RunDependencies{
		Service: service,
	}, nil
}

func buildReporter(cfg config.Config) (run.JobReporter, error) {
	if cfg.API == nil {
		return api.NewNoopReporter(), nil
	}

	client, err := api.NewClient(cfg.API.BaseURL, cfg.API.HostToken)
	if err != nil {
		return nil, fmt.Errorf("create API client: %w", err)
	}

	reporter, err := api.NewReporter(client)
	if err != nil {
		return nil, fmt.Errorf("create API reporter: %w", err)
	}

	return reporter, nil
}

func buildNotifier(cfg config.Config) (run.Notifier, error) {
	if cfg.Notify == nil {
		return notify.NewMultiNotifier(), nil
	}

	notifiers := make([]notify.Provider, 0, 2)

	if cfg.Notify.Slack != nil {
		notifier, err := notify.NewSlackNotifier(
			cfg.Notify.Slack.WebhookURL,
			cfg.Notify.TimeZone,
		)
		if err != nil {
			return nil, fmt.Errorf("create Slack notifier: %w", err)
		}
		notifiers = append(notifiers, notifier)
	}

	if cfg.Notify.Discord != nil {
		notifier, err := notify.NewDiscordNotifier(
			cfg.Notify.Discord.WebhookURL,
			cfg.Notify.TimeZone,
		)
		if err != nil {
			return nil, fmt.Errorf("create Discord notifier: %w", err)
		}
		notifiers = append(notifiers, notifier)
	}

	return notify.NewMultiNotifier(notifiers...), nil
}
