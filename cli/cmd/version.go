package cmd

import (
	"fmt"

	"github.com/spf13/cobra"
)

var version = "v2026.02.26"

var versionCmd = &cobra.Command{
	Use:   "version",
	Short: "Print the version number of the obsern CLI",
	Run: func(cmd *cobra.Command, args []string) {
		fmt.Printf("obsern version %s\n", version)
	},
}

func init() {
	rootCmd.Version = version
	rootCmd.SetVersionTemplate("obsern version {{.Version}}\n")
	rootCmd.AddCommand(versionCmd)
}
