package cmd

import (
	"errors"
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/kanaya/jobwatch/cli/internal/config"
	"github.com/kanaya/jobwatch/cli/internal/notifier"
	"github.com/kanaya/jobwatch/cli/internal/notifier/slack"
	"github.com/kanaya/jobwatch/cli/internal/runner"
	"github.com/kanaya/jobwatch/cli/internal/tracker"
	"github.com/spf13/cobra"
)

var configPath string

var runCmd = &cobra.Command{
	Use:   "run -- <command...>",
	Short: "Run a command with jobwatch notifications",
	Args:  cobra.MinimumNArgs(1),
	Run: func(cmd *cobra.Command, args []string) {
		command := args[0]
		commandArgs := args[1:]

		path := configPath
		if path == "" {
			path = config.DefaultFilename
		}

		cfg, err := config.Load(path)
		if err != nil {
			fmt.Fprintf(os.Stderr, "Failed to load config: %v\n", err)
			os.Exit(1)
		}

		ctx := cmd.Context()
		tr := &http.Transport{}

		exec := runner.NewExecutor(cfg.Run.LogTail)

		var jobTracker tracker.JobTracker
		if cfg.API.Enabled {
			if cfg.API.BaseURL == "" || cfg.API.Token == "" {
				fmt.Fprintf(os.Stderr, "API is enabled but base_url or token is missing\n")
				os.Exit(1)
			}
			jobTracker = tracker.NewAPIClient(tr, cfg.API.BaseURL, cfg.API.Token)
		} else {
			jobTracker = tracker.NewNoopTracker()
		}

		notifiers, err := setupNotifiers(cfg, tr)
		if err != nil {
			fmt.Fprintf(os.Stderr, "Failed to setup notifiers: %v\n", err)
			os.Exit(1)
		}

		startedAt := time.Now()
		var jobID string
		if cfg.API.Enabled {
			jobID, err = jobTracker.Start(ctx, tracker.StartRequest{
				Project:   cfg.Project.Name,
				Command:   command,
				Args:      commandArgs,
				Tags:      cfg.Project.Tags,
				StartedAt: startedAt,
			})
			if err != nil {
				fmt.Fprintf(os.Stderr, "Failed to start job tracking: %v\n", err)
			}
		}

		result := exec.Run(ctx, command, commandArgs)
		result.StartedAt = startedAt

		if cfg.API.Enabled && jobID != "" {
			status := tracker.JobStatusFinished
			errMsg := ""
			if result.Err != nil {
				status = tracker.JobStatusFailed
				errMsg = result.Err.Error()
			}

			err = jobTracker.Finish(ctx, jobID, tracker.FinishRequest{
				Status:     status,
				Err:        errMsg,
				TailLines:  result.TailLines,
				FinishedAt: result.FinishedAt,
			})
			if err != nil {
				fmt.Fprintf(os.Stderr, "Failed to finish job tracking: %v\n", err)
			}
		}

		notification := notifier.Notification{
			Project:    cfg.Project.Name,
			Tags:       cfg.Project.Tags,
			Command:    command,
			Args:       commandArgs,
			Success:    result.Err == nil,
			Err:        result.Err,
			TailLines:  result.TailLines,
			StartedAt:  result.StartedAt,
			FinishedAt: result.FinishedAt,
		}

		shouldNotify := (notification.Success && cfg.Notify.OnSuccess) ||
			(!notification.Success && cfg.Notify.OnFailure)

		if shouldNotify {
			var notifyErrs []error
			for _, n := range notifiers {
				if err := n.Notify(ctx, notification); err != nil {
					notifyErrs = append(notifyErrs, err)
				}
			}
			if len(notifyErrs) > 0 {
				fmt.Fprintf(os.Stderr, "Notification errors: %v\n", errors.Join(notifyErrs...))
			}
		}

		if result.Err != nil {
			fmt.Fprintf(os.Stderr, "Command failed: %v\n", result.Err)
			if len(result.TailLines) > 0 {
				fmt.Fprintf(os.Stderr, "\nLast %d lines of output:\n", len(result.TailLines))
				for _, line := range result.TailLines {
					fmt.Fprintln(os.Stderr, line)
				}
			}
			os.Exit(1)
		}
	},
}

func setupNotifiers(cfg config.Config, tr *http.Transport) ([]notifier.Notifier, error) {
	var notifiers []notifier.Notifier

	for i, ch := range cfg.Notify.Channels {
		switch ch.Kind {
		case "slack":
			webhookURL, ok := ch.Settings["webhook_url"].(string)
			if !ok || webhookURL == "" {
				return nil, fmt.Errorf("notify.channels[%d].settings.webhook_url must be a non-empty string", i)
			}
			notifiers = append(notifiers, slack.New(tr, webhookURL))

		default:
			return nil, fmt.Errorf("notify.channels[%d].kind is not supported: %s", i, ch.Kind)
		}
	}

	return notifiers, nil
}

func init() {
	rootCmd.AddCommand(runCmd)
	runCmd.Flags().StringVarP(&configPath, "config", "c", "", "config file path")
}
