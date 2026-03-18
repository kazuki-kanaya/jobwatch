package cmd

import (
	"fmt"

	"github.com/spf13/cobra"
)

// version is set at build time via ldflags.
// Development builds use "dev" by default.
var version = "dev"

var versionCmd = &cobra.Command{
	Use:   "version",
	Short: "Print the CLI version",
	Long:  "Print the version of the Obsern CLI.",
	Run: func(cmd *cobra.Command, args []string) {
		fmt.Fprintf(cmd.OutOrStdout(), "obsern version %s\n", version)
	},
}

func init() {
	rootCmd.AddCommand(versionCmd)
}
