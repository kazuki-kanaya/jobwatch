package cmd

import (
	"fmt"

	"github.com/spf13/cobra"
)

var version = "2026.1.11"

var versionCmd = &cobra.Command{
	Use:   "version",
	Short: "Print the version number of the obsern CLI",
	Run: func(cmd *cobra.Command, args []string) {
		fmt.Printf("obsern version %s\n", version)
	},
}

func init() {
	rootCmd.AddCommand(versionCmd)
}
