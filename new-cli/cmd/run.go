package cmd

import (
	"fmt"

	"github.com/kazuki-kanaya/obsern/new-cli/internal/bootstrap"
	"github.com/kazuki-kanaya/obsern/new-cli/internal/config"
	"github.com/kazuki-kanaya/obsern/new-cli/internal/run"
	"github.com/spf13/cobra"
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

		cfg, err := config.Load(defaultConfigFileName)
		if err != nil {
			return fmt.Errorf("load config: %w", err)
		}

		deps, err := bootstrap.BuildRunDependencies(cfg, cmd.OutOrStdout(), cmd.ErrOrStderr())
		if err != nil {
			return fmt.Errorf("build run dependencies: %w", err)
		}

		exitCode, err := deps.Service.Execute(cmd.Context(), run.Request{
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
