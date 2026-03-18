package cmd

import (
	"errors"
	"fmt"
	"os"
	"path/filepath"

	"github.com/kazuki-kanaya/obsern/cli/internal/config"
	"github.com/spf13/cobra"
)

const defaultConfigFileName = "obsern.yaml"

var initCmd = &cobra.Command{
	Use:   "init",
	Short: "Create a default obsern.yaml config file",
	Long: `Create a default obsern.yaml config file in the current directory.
Existing files are not overwritten.`,
	RunE: func(cmd *cobra.Command, args []string) error {
		path := filepath.Join(".", defaultConfigFileName)

		file, err := os.OpenFile(path, os.O_CREATE|os.O_EXCL|os.O_WRONLY, 0o644)
		if err != nil {
			if errors.Is(err, os.ErrExist) {
				return fmt.Errorf("config file already exists: %s", path)
			}

			return fmt.Errorf("create config file: %w", err)
		}
		defer file.Close()

		if _, err := file.Write([]byte(config.DefaultYAML())); err != nil {
			return fmt.Errorf("write config file: %w", err)
		}

		cmd.Printf("✓ Created %s\n", path)
		cmd.Printf("→ Next: edit %s and configure api or notify\n", path)

		return nil
	},
}

func init() {
	rootCmd.AddCommand(initCmd)
}
