package cmd

import (
	"context"
	"errors"
	"io"
	"strings"
	"testing"

	"github.com/kazuki-kanaya/obsern/new-cli/internal/bootstrap"
	"github.com/kazuki-kanaya/obsern/new-cli/internal/config"
	"github.com/kazuki-kanaya/obsern/new-cli/internal/run"
	"github.com/spf13/cobra"
)

func TestRunCmdRunE(t *testing.T) {
	defaultLoadRunConfig := loadRunConfig
	defaultBuildRunDeps := buildRunDeps
	defaultExecuteRunService := executeRunService
	t.Cleanup(func() {
		loadRunConfig = defaultLoadRunConfig
		buildRunDeps = defaultBuildRunDeps
		executeRunService = defaultExecuteRunService
	})

	t.Run("requires command arguments", func(t *testing.T) {
		err := runCmd.RunE(newTestCommand(), nil)
		if err == nil {
			t.Fatal("RunE() error = nil, want command required")
		}
		if err.Error() != "command is required" {
			t.Fatalf("RunE() error = %q, want %q", err.Error(), "command is required")
		}
	})

	t.Run("wraps config load errors", func(t *testing.T) {
		loadRunConfig = func(path string) (config.Config, error) {
			return config.Config{}, errors.New("boom")
		}

		err := runCmd.RunE(newTestCommand(), []string{"echo", "hello"})
		if err == nil {
			t.Fatal("RunE() error = nil, want wrapped load error")
		}
		if !strings.Contains(err.Error(), "load config: boom") {
			t.Fatalf("RunE() error = %q, want wrapped load error", err.Error())
		}
	})

	t.Run("wraps dependency build errors", func(t *testing.T) {
		loadRunConfig = func(path string) (config.Config, error) {
			return config.Config{}, nil
		}
		buildRunDeps = func(cfg config.Config, stdout io.Writer, stderr io.Writer) (bootstrap.RunDependencies, error) {
			return bootstrap.RunDependencies{}, errors.New("broken deps")
		}

		err := runCmd.RunE(newTestCommand(), []string{"echo", "hello"})
		if err == nil {
			t.Fatal("RunE() error = nil, want wrapped build error")
		}
		if !strings.Contains(err.Error(), "build run dependencies: broken deps") {
			t.Fatalf("RunE() error = %q, want wrapped build error", err.Error())
		}
	})

	t.Run("passes request to service execution", func(t *testing.T) {
		cfg := config.Config{
			Run: config.RunConfig{
				Tags:      []string{"ml", "nightly"},
				TailLines: 42,
			},
		}
		var (
			gotCtx context.Context
			gotReq run.Request
		)

		loadRunConfig = func(path string) (config.Config, error) {
			if path != defaultConfigFileName {
				t.Fatalf("load path = %q, want %q", path, defaultConfigFileName)
			}
			return cfg, nil
		}
		buildRunDeps = func(cfg config.Config, stdout io.Writer, stderr io.Writer) (bootstrap.RunDependencies, error) {
			return bootstrap.RunDependencies{}, nil
		}
		executeRunService = func(ctx context.Context, service *run.Service, req run.Request) (int, error) {
			gotCtx = ctx
			gotReq = req
			return 0, nil
		}

		cmd := newTestCommand()
		ctx := context.WithValue(context.Background(), "key", "value")
		cmd.SetContext(ctx)

		err := runCmd.RunE(cmd, []string{"python", "train.py", "--epochs", "3"})
		if err != nil {
			t.Fatalf("RunE() error = %v, want nil", err)
		}
		if gotCtx != ctx {
			t.Fatal("service context does not match command context")
		}
		wantReq := run.Request{
			Command:   []string{"python", "train.py", "--epochs", "3"},
			Tags:      []string{"ml", "nightly"},
			TailLines: 42,
		}
		if !equalRequest(gotReq, wantReq) {
			t.Fatalf("request = %#v, want %#v", gotReq, wantReq)
		}
	})

	t.Run("returns execution errors as is", func(t *testing.T) {
		loadRunConfig = func(path string) (config.Config, error) {
			return config.Config{}, nil
		}
		buildRunDeps = func(cfg config.Config, stdout io.Writer, stderr io.Writer) (bootstrap.RunDependencies, error) {
			return bootstrap.RunDependencies{}, nil
		}
		executeRunService = func(ctx context.Context, service *run.Service, req run.Request) (int, error) {
			return 1, errors.New("execute failed")
		}

		err := runCmd.RunE(newTestCommand(), []string{"echo", "hello"})
		if err == nil {
			t.Fatal("RunE() error = nil, want execute error")
		}
		if err.Error() != "execute failed" {
			t.Fatalf("RunE() error = %q, want %q", err.Error(), "execute failed")
		}
	})

	t.Run("converts non zero exit to exitCodeError", func(t *testing.T) {
		loadRunConfig = func(path string) (config.Config, error) {
			return config.Config{}, nil
		}
		buildRunDeps = func(cfg config.Config, stdout io.Writer, stderr io.Writer) (bootstrap.RunDependencies, error) {
			return bootstrap.RunDependencies{}, nil
		}
		executeRunService = func(ctx context.Context, service *run.Service, req run.Request) (int, error) {
			return 130, nil
		}

		err := runCmd.RunE(newTestCommand(), []string{"echo", "hello"})
		if err == nil {
			t.Fatal("RunE() error = nil, want exitCodeError")
		}

		var exitErr exitCodeError
		if !errors.As(err, &exitErr) {
			t.Fatalf("RunE() error type = %T, want exitCodeError", err)
		}
		if exitErr.code != 130 {
			t.Fatalf("exit code = %d, want 130", exitErr.code)
		}
	})
}

func newTestCommand() *cobra.Command {
	cmd := &cobra.Command{}
	cmd.SetOut(io.Discard)
	cmd.SetErr(io.Discard)
	cmd.SetContext(context.Background())
	return cmd
}

func equalRequest(got, want run.Request) bool {
	if got.TailLines != want.TailLines {
		return false
	}
	if strings.Join(got.Command, "\x00") != strings.Join(want.Command, "\x00") {
		return false
	}
	return strings.Join(got.Tags, "\x00") == strings.Join(want.Tags, "\x00")
}
