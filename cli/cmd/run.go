package cmd

import (
	"fmt"
	"os"

	"github.com/kanaya/jobwatch/cli/internal/config"
	"github.com/kanaya/jobwatch/cli/internal/dispatch"
	"github.com/kanaya/jobwatch/cli/internal/runner"
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
			fmt.Fprintln(os.Stderr, err)
			os.Exit(1)
		}

		dispatcher, err := dispatch.New(cfg)
		if err != nil {
			fmt.Println("Dispatcher setup failed:", err)
			os.Exit(1)
		}

		result := runner.Run(command, commandArgs, cfg.Run.LogTail)

		notification := dispatcher.BuildNotification(command, commandArgs, result)

		err = dispatcher.FanOut(cmd.Context(), notification)
		if err != nil {
			fmt.Println("Notification failed:", err)
			os.Exit(1)
		}

		if result.Err != nil {
			fmt.Printf("Command failed: %v\n", result.Err)
			fmt.Printf("Last %d lines of output:\n", cfg.Run.LogTail)
			for _, line := range result.TailLines {
				fmt.Println(line)
			}
			os.Exit(1)
		}
	},
}

func init() {
	rootCmd.AddCommand(runCmd)
	runCmd.Flags().StringVarP(&configPath, "config", "c", "", "config file path")
}
