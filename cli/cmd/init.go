package cmd

import (
	"fmt"

	"github.com/kazuki-kanaya/jobwatch/cli/internal/config"
	"github.com/spf13/cobra"
)

var (
	initPath  string
	initForce bool
)

var initCmd = &cobra.Command{
	Use:   "init",
	Short: "Initialize jobwatch configuration",
	Run: func(cmd *cobra.Command, args []string) {
		path := initPath
		if path == "" {
			path = config.DefaultFilename
		}
		err := config.Generate(path, config.DefaultTemplate, initForce)
		if err != nil {
			fmt.Println("Error:", err)
		} else {
			fmt.Printf("created: %s\n", path)
		}

	},
}

func init() {
	rootCmd.AddCommand(initCmd)

	initCmd.Flags().StringVarP(&initPath, "path", "p", "", "output path for config file")
	initCmd.Flags().BoolVarP(&initForce, "force", "f", false, "overwrite if file already exists")
}
