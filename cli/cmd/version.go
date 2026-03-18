package cmd

import (
	"fmt"

	"github.com/spf13/cobra"
)

var version = "v1.0.0"

var versionCmd = &cobra.Command{
	Use:   "version",
	Short: "Print the CLI version",
	Long:  "Print the version of the Obsern CLI.",
	Run: func(cmd *cobra.Command, args []string) {
		fmt.Fprintf(cmd.OutOrStdout(), "obsern version %s\n", version)
	},
}

func init() {
	rootCmd.Version = version
	rootCmd.AddCommand(versionCmd)
}
