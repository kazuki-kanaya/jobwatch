package cmd

import (
	"context"
	"fmt"

	"github.com/kazuki-kanaya/obsern/new-cli/internal/bootstrap"
	"github.com/kazuki-kanaya/obsern/new-cli/internal/config"
	"github.com/kazuki-kanaya/obsern/new-cli/internal/run"
	"github.com/spf13/cobra"
)

// Package-level hooks allow cmd/run unit tests to stub config loading,
// dependency construction, and service execution without touching real I/O.
var (
	loadRunConfig     = config.Load
	buildRunDeps      = bootstrap.BuildRunDependencies
	executeRunService = func(ctx context.Context, service *run.Service, req run.Request) (int, error) {
		return service.Execute(ctx, req)
	}
)

var runCmd = &cobra.Command{
	Use:   "run [command...]",
	Short: "Run a command with Obsern",
	Long: `Run a command under Obsern observation.

Obsern tracks the job status, captures tail logs, and reports the
result to configured backends such as the API server or Slack.`,
	Args: cobra.ArbitraryArgs,
	RunE: func(cmd *cobra.Command, args []string) error {
		if len(args) == 0 {
			return fmt.Errorf("command is required")
		}

		cfg, err := loadRunConfig(defaultConfigFileName)
		if err != nil {
			return fmt.Errorf("load config: %w", err)
		}

		deps, err := buildRunDeps(cfg, cmd.OutOrStdout(), cmd.ErrOrStderr())
		if err != nil {
			return fmt.Errorf("build run dependencies: %w", err)
		}

		exitCode, err := executeRunService(cmd.Context(), deps.Service, run.Request{
			Command:   args,
			Tags:      cfg.Run.Tags,
			TailLines: cfg.Run.TailLines,
		})
		if err != nil {
			return err
		}

		if exitCode != 0 {
			return exitCodeError{code: exitCode}
		}

		return nil
	},
}

type exitCodeError struct {
	code int
}

func (e exitCodeError) Error() string {
	return fmt.Sprintf("command exited with status %d", e.code)
}

func init() {
	rootCmd.AddCommand(runCmd)
}
