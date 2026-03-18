package cmd

import (
	"context"
	"errors"
	"os"
	"os/signal"
	"syscall"

	"github.com/spf13/cobra"
)

var rootCmd = &cobra.Command{
	Use:          "obsern",
	Short:        "Track long-running jobs from the CLI",
	Long:         "Obsern wraps commands, captures tail logs, and reports results to configured backends.",
	SilenceUsage: true,
	Version:      version,
}

func Execute() {
	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	err := rootCmd.ExecuteContext(ctx)
	if err == nil {
		return
	}

	var exitErr exitCodeError
	if errors.As(err, &exitErr) {
		os.Exit(exitErr.code)
	}

	os.Exit(1)
}
