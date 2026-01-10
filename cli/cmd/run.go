package cmd

import (
	"fmt"
	"os"

	"github.com/kanaya/jobwatch/cli/internal/runner"
	"github.com/spf13/cobra"
)

var runCmd = &cobra.Command{
	Use:   "run -- <command...>",
	Short: "Run a command with jobwatch notifications",
	Args:  cobra.MinimumNArgs(1),
	Run: func(cmd *cobra.Command, args []string) {
		command := args[0]
		commandArgs := args[1:]
		tailN := 10

		result := runner.Run(command, commandArgs, tailN)

		if result.Err != nil {
			fmt.Printf("Command failed: %v\n", result.Err)
			fmt.Printf("Last %d lines of output:\n", tailN)
			for _, line := range result.TailLines {
				fmt.Println(line)
			}
			os.Exit(1)
		}
	},
}

func init() {
	rootCmd.AddCommand(runCmd)
}
