package config

import (
	"errors"
	"fmt"
	"os"
	"path/filepath"
)

func Generate(path string, template string, force bool) error {
	_, err := os.Stat(path)
	if err == nil {
		if !force {
			return fmt.Errorf("%s already exists (use --force to overwrite)", path)
		}
	} else if !errors.Is(err, os.ErrNotExist) {
		return err
	}

	dir := filepath.Dir(path)
	if dir != "." {
		if err := os.MkdirAll(dir, 0755); err != nil {
			return fmt.Errorf("failed to create directories for %s: %w", path, err)
		}
	}

	return os.WriteFile(
		path,
		[]byte(template),
		0644,
	)
}
