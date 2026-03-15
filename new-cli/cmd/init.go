package cmd

import (
	"errors"
	"fmt"
	"os"
	"path/filepath"

	"github.com/kazuki-kanaya/obsern/new-cli/internal/config"
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

		if _, err := os.Stat(path); err == nil {
			return fmt.Errorf("config file already exists: %s", path)
		} else if !errors.Is(err, os.ErrNotExist) {
			return fmt.Errorf("stat config file: %w", err)
		}

		if err := os.WriteFile(path, []byte(config.DefaultYAML()), 0o644); err != nil {
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
