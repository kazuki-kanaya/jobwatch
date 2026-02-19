package cmd

import (
	"fmt"
	"net/http"
	"os"

	"github.com/kanaya/jobwatch/cli/internal/config"
	"github.com/kanaya/jobwatch/cli/internal/run"
	"github.com/spf13/cobra"
)

var configPath string

var runCmd = &cobra.Command{
	Use:   "run <command...>",
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

		runner, err := run.NewRunner(cfg, &http.Transport{})
		if err != nil {
			fmt.Fprintf(os.Stderr, "Failed to prepare run service: %v\n", err)
			os.Exit(1)
		}

		report := runner.Execute(cmd.Context(), command, commandArgs)
		if report.TrackingStartError != nil {
			fmt.Fprintf(os.Stderr, "Failed to start job tracking: %v\n", report.TrackingStartError)
		}
		if report.TrackingFinishError != nil {
			fmt.Fprintf(os.Stderr, "Failed to finish job tracking: %v\n", report.TrackingFinishError)
		}
		if report.NotifyError != nil {
			fmt.Fprintf(os.Stderr, "Notification errors: %v\n", report.NotifyError)
		}

		if report.Result.Err != nil {
			fmt.Fprintf(os.Stderr, "Command failed: %v\n", report.Result.Err)
			if len(report.Result.TailLines) > 0 {
				fmt.Fprintf(os.Stderr, "\nLast %d lines of output:\n", len(report.Result.TailLines))
				for _, line := range report.Result.TailLines {
					fmt.Fprintln(os.Stderr, line)
				}
			}
			os.Exit(1)
		}
	},
}

func init() {
	rootCmd.AddCommand(runCmd)
	runCmd.Flags().StringVarP(&configPath, "config", "c", "", "config file path")
	// Treat everything after the first positional arg as command args.
	// This allows `jobwatch run ls -la` without requiring `--`.
	runCmd.Flags().SetInterspersed(false)
}
