package config

import (
	"os"
	"path/filepath"
	"testing"
)

func TestGenerate_CreatesFile(t *testing.T) {
	dir := t.TempDir()
	path := filepath.Join(dir, "jobwatch.yaml")

	if err := Generate(path, "foo"); err != nil {
		t.Fatalf("Generate failed: %v", err)
	}

	if _, err := os.Stat(path); err != nil {
		t.Fatalf("Generated file does not exist: %v", err)
	}
}

func TestGenerate_FailsIfExists(t *testing.T) {
	dir := t.TempDir()
	path := filepath.Join(dir, "jobwatch.yaml")

	if err := Generate(path, "foo"); err != nil {
		t.Fatalf("initial Generate failed: %v", err)
	}

	if err := Generate(path, "foo"); err == nil {
		t.Fatalf("Generate should fail if file already exists")
	}
}
